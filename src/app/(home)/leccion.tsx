import { Button } from '@/components/Button';
import * as callAlert from '@/components/helpers/CalllAlert';
import { Ahorcado } from '@/components/juegos/Ahorcado';
import { CompletaFrase } from '@/components/juegos/CompletaFrase';
import { RelacionPares } from '@/components/juegos/RelacionPares';
import { SeleccionMultiple } from '@/components/juegos/SeleccionMultiple';
import type { ControlJuego } from '@/components/juegos/compartido';
import { colors } from '@/constants/colors';
import type { LeccionResDTO } from '@/models/LeccionResDTO';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as service from '@/Services/leccionServices';
//para consultas
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type Actividad = LeccionResDTO['actividades'][number];

export default function LeccionPage() {
  const { sesion } = useLocalSearchParams<{ sesion?: string }>();
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ['leccion', sesion ?? 'inicial'],
    queryFn: service.obtenerLeccionesAleatorias,
    // Una partida conserva sus actividades hasta finalizar.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
 

  if (isPending) {
    return (
      <View style={[styles.pagina, styles.resumen]}>
        <Text style={styles.texto}>Cargando lección...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.pagina, styles.resumen]}>
        <Text style={styles.texto}>No se pudo cargar la lección.</Text>
        <Button title="Reintentar" onPress={() => { void refetch(); }} />
        <Button title="Volver al inicio" onPress={() => router.replace('/home')} />
      </View>
    );
  }

  if (!data || data.actividades.length === 0) {
    return (
      <View style={[styles.pagina, styles.resumen]}>
        <Text style={styles.texto}>No hay actividades disponibles.</Text>
        <Button title="Volver al inicio" onPress={() => router.replace('/home')} />
      </View>
    );
  }

  return <Leccion key={sesion ?? 'inicial'} inicial={data} />;
}

function Leccion({ inicial }: { inicial: LeccionResDTO }) {
  const queryClient = useQueryClient();
  const envioEnCurso = useRef(false);
  const guardarLeccionMutate = useMutation({
    mutationFn: service.guardarLeccionRealizada,
    retry: false,
    onSuccess: (response) => {
      const respuesta = response?.[0];
      if (!respuesta || typeof respuesta.oboolean !== 'boolean') {
        envioEnCurso.current = false;
        callAlert.callAlert({ oboolean: false, omessage: 'El servidor no confirmó el guardado. Revisa si se registró antes de reintentar.' });
        return;
      }
      callAlert.callAlert(respuesta);
      if (respuesta.oboolean) {
        void queryClient.removeQueries();
        router.replace('/home');
      } else {
        envioEnCurso.current = false;
      }
    },
    onError: () => {
      envioEnCurso.current = false;
      callAlert.callAlert({ oboolean: false, omessage: 'No se pudo confirmar el guardado. Conservamos tus resultados aquí para que puedas reintentar.' });
    },
  });
  const [leccion, setLeccion] = useState(inicial);
  const [indice, setIndice] = useState(0);
  const [respondida, setRespondida] = useState(false);
  const control = useRef<ControlJuego | null>(null);
  const puedeAvanzar = useRef(false);
  const total = leccion.actividades.length;
  const actividad = leccion.actividades[indice];

  useEffect(() => {
    if (total > 0 && indice >= total) {
      console.log('Lección resultante:', JSON.stringify(leccion, null, 2));
    }
  }, [indice, total, leccion]);

  function guardarResultado(resultado: Actividad) {
    
    //ponderacion de puntuacion
    const calcularPuntajeTiempo = (tiempo: number) => {
      const segundos = tiempo / 1000;
      if (segundos <= 8) {
        return 10;
      }
      const puntaje = 10 - (segundos - 8) * 0.5;
      return Math.max(5, puntaje);
    }

    setLeccion((actual) => {
      const rachaActividad = resultado.resultado ? (actual.rachaActividad ?? 0) + 1 : 0;
      // Conserva en la actividad la racha después de responder.
      const evaluada: Actividad = {
        ...resultado,
        puntaje: resultado.resultado ? calcularPuntajeTiempo(resultado.tiempo) : 0,
        rachaActividad,
      };

      return {
        ...actual,
        puntuacion: actual.puntuacion + evaluada.puntaje,
        rachaActividad,
        actividades: actual.actividades.map((item, posicion) => posicion === indice ? evaluada : item),
      };
    });
    puedeAvanzar.current = true;
    setRespondida(true);
  }

  function siguiente() {
    if (!puedeAvanzar.current) return;
    puedeAvanzar.current = false;
    Keyboard.dismiss();
    setRespondida(false);
    setIndice((actual) => actual + 1);
  }

  function omitir() {
    if (respondida || !control.current) return;
    Keyboard.dismiss();
    control.current.omitir();
  }
  function guardarLeccion(leccion: LeccionResDTO) {
    if (envioEnCurso.current || indice < total) return;
    envioEnCurso.current = true;
    guardarLeccionMutate.mutate(leccion);
  }

  if (indice >= total) {
    const aciertos = leccion.actividades.filter((item) => item.resultado).length;
    const porcentajeAciertos = total > 0 ? (aciertos / total) * 100 : 0;
    const colorProgreso = porcentajeAciertos > 80
      ? colors.quinary
      : porcentajeAciertos >= 50 ? colors.senary : colors.error;
    const tiempoMs = leccion.actividades.reduce((suma, item) => suma + item.tiempo, 0);
    const segundos = Math.floor(tiempoMs / 1000);
    const intentos = leccion.actividades.reduce((suma, item) => suma + item.intentos, 0);
    return (
      <SafeAreaView style={styles.pagina} edges={['bottom', 'left', 'right']}>
        <ScrollView contentContainerStyle={styles.resumen}>
          <Text accessibilityRole="header" style={styles.titulo}>¡Lección completada!</Text>
          <Text style={styles.texto}>Puntaje total: {leccion.puntuacion.toFixed(2)} puntos</Text>
          <View style={styles.progreso}>
            <Text style={styles.texto}>
              Aciertos: {aciertos} de {total} ({Number(porcentajeAciertos.toFixed(1))} %)
            </Text>
            <View
              accessible
              accessibilityRole="progressbar"
              accessibilityLabel="Actividades respondidas correctamente"
              accessibilityValue={{ min: 0, max: total, now: aciertos, text: `${aciertos} de ${total} actividades` }}
              style={styles.barraProgreso}
            >
              <View style={[styles.rellenoProgreso, { width: `${porcentajeAciertos}%`, backgroundColor: colorProgreso }]} />
            </View>
          </View>
          <Text style={styles.texto}>Sin acertar u omitidas: {total - aciertos}</Text>
          <Text style={styles.texto}>Tiempo: {Math.floor(segundos / 60)} min {segundos % 60} s</Text>
          <Text style={styles.texto}>Intentos: {intentos}</Text>
          <Text style={styles.aviso}>Al volver al inicio se guardarán los resultados de esta lección.</Text>
          <Button
            title={guardarLeccionMutate.isPending ? 'Guardando...' : 'Volver al inicio'}
            disabled={guardarLeccionMutate.isPending}
            onPress={() => guardarLeccion(leccion)}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const props = { onComplete: guardarResultado, controlRef: control };
  let juego;
  if (actividad.idTipo === 1 && 'opcion1' in actividad.parametros) {
    juego = <SeleccionMultiple actividad={{ ...actividad, parametros: actividad.parametros }} {...props} />;
  } else if (actividad.idTipo === 2 && 'respuesta' in actividad.parametros) {
    juego = <Ahorcado actividad={{ ...actividad, parametros: actividad.parametros }} {...props} />;
  } else if (actividad.idTipo === 3 && 'respuesta' in actividad.parametros) {
    juego = <CompletaFrase actividad={{ ...actividad, parametros: actividad.parametros }} {...props} />;
  } else if (actividad.idTipo === 4 && 'pares' in actividad.parametros) {
    juego = <RelacionPares actividad={{ ...actividad, parametros: actividad.parametros }} {...props} />;
  } else {
    juego = <Text style={styles.texto}>No se reconoce el tipo de esta actividad.</Text>;
  }

  return (
    <SafeAreaView style={styles.pagina} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={styles.pagina} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.cabecera}>
          <Text style={styles.aviso}>Lección</Text>
          <Text accessibilityLiveRegion="polite" style={styles.texto}>Actividad {indice + 1} de {total}</Text>
          <View style={styles.indicadores} accessibilityLiveRegion="polite">
            <View style={styles.indicador}>
              <Text style={styles.aviso}>Puntaje</Text>
              <Text style={styles.valorIndicador}>{leccion.puntuacion.toFixed(2)} pts</Text>
            </View>
            <View style={styles.indicador}>
              <Text style={styles.aviso}>Aciertos seguidos</Text>
              <Text style={styles.valorIndicador}>{leccion.rachaActividad ?? 0}</Text>
            </View>
          </View>
        </View>
        <View key={indice} style={styles.juego}>{juego}</View>
        <View style={styles.acciones}>
          {respondida ? (
            <Button title={indice === total - 1 ? 'Ver resumen' : 'Siguiente'} onPress={siguiente} />
          ) : (
            <Button title="Omitir" onPress={omitir} />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: colors.background },
  juego: { flex: 1 },
  cabecera: { paddingHorizontal: 20, paddingTop: 12, gap: 6 },
  indicadores: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  indicador: { flexGrow: 1, flexBasis: 120, backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, gap: 4 },
  valorIndicador: { color: colors.quinary, fontSize: 20, fontWeight: '700' },
  acciones: { padding: 16 },
  resumen: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 20 },
  progreso: { gap: 10 },
  barraProgreso: { height: 16, borderRadius: 8, overflow: 'hidden', backgroundColor: colors.primary },
  rellenoProgreso: { height: '100%', borderRadius: 8 },
  titulo: { color: colors.quinary, fontSize: 28, fontWeight: '700', textAlign: 'center' },
  texto: { color: colors.textWhite, fontSize: 18 },
  aviso: { color: colors.senary, fontSize: 14 },
});
