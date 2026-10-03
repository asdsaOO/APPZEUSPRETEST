import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import type { JAhorcadoResDTO } from '@/models/JAhorcadoResDTO';
import { MarcoJuego, Opcion, styles, usePartida } from './compartido';
import type { JuegoProps } from './compartido';
import { ALFABETO, evaluarAhorcado, letraAhorcado } from './logica';

export function Ahorcado(props: JuegoProps<JAhorcadoResDTO>) {
  return <Partida key={props.actividad.id} {...props} />;
}

function Partida(props: JuegoProps<JAhorcadoResDTO>) {
  const { actividad } = props;
  const partida = usePartida(props, `La respuesta correcta es: ${actividad.parametros.respuesta}`);
  const [letras, setLetras] = useState<string[]>([]);
  const estado = evaluarAhorcado(actividad.parametros.respuesta, letras);
  const valida = Array.from(letraAhorcado(actividad.parametros.respuesta)).some((letra) => ALFABETO.includes(letra));
  const palabra = Array.from(actividad.parametros.respuesta.normalize('NFC')).map((letra) => {
    const normalizada = letraAhorcado(letra);
    return partida.terminado || !ALFABETO.includes(normalizada) || letras.includes(normalizada) ? letra : '_';
  }).join(' ');

  function elegir(letra: string) {
    if (partida.terminado || letras.includes(letra) || !valida) return;
    const correcta = letraAhorcado(actividad.parametros.respuesta).includes(letra);
    if (!correcta && !partida.registrarIntento()) return;
    const nuevas = [...letras, letra];
    setLetras(nuevas);
    const siguiente = evaluarAhorcado(actividad.parametros.respuesta, nuevas);
    if (siguiente.terminado) {
      partida.setMensaje(siguiente.acierto ? '¡Adivinaste la palabra!' : `Se acabaron las oportunidades. Respuesta: ${actividad.parametros.respuesta}`);
      partida.finalizar(siguiente.acierto);
    } else {
      partida.setMensaje(correcta ? '¡Letra correcta!' : 'Esa letra no está en la palabra.');
    }
  }

  return (
    <MarcoJuego titulo="Ahorcado" enunciado={actividad.enunciado}
      mensaje={valida ? partida.mensaje : 'Esta actividad necesita una respuesta con letras.'}>
      <View accessible accessibilityLabel={`${estado.errores} errores de 6`} style={dibujo.marco}>
        <View style={dibujo.base} /><View style={dibujo.poste} /><View style={dibujo.viga} /><View style={dibujo.cuerda} />
        {estado.errores >= 1 && <View style={dibujo.cabeza} />}
        {estado.errores >= 2 && <View style={dibujo.cuerpo} />}
        {estado.errores >= 3 && <View style={[dibujo.extremidad, dibujo.brazoIzquierdo]} />}
        {estado.errores >= 4 && <View style={[dibujo.extremidad, dibujo.brazoDerecho]} />}
        {estado.errores >= 5 && <View style={[dibujo.extremidad, dibujo.piernaIzquierda]} />}
        {estado.errores >= 6 && <View style={[dibujo.extremidad, dibujo.piernaDerecha]} />}
      </View>
      <Text style={styles.texto}>Oportunidades restantes: {6 - estado.errores}</Text>
      <Text style={dibujo.palabra}>{palabra}</Text>
      <View style={dibujo.teclado}>
        {ALFABETO.map((letra) => (
          <Opcion key={letra} texto={letra} onPress={() => elegir(letra)}
            disabled={!valida || partida.terminado || letras.includes(letra)}
            correcta={letras.includes(letra) && letraAhorcado(actividad.parametros.respuesta).includes(letra)} />
        ))}
      </View>
    </MarcoJuego>
  );
}

const dibujo = StyleSheet.create({
  palabra: { color: colors.textWhite, fontSize: 28, textAlign: 'center', fontWeight: '700' },
  teclado: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  marco: { width: 180, height: 190, alignSelf: 'center' },
  base: { position: 'absolute', left: 10, bottom: 0, width: 160, height: 4, backgroundColor: colors.textWhite },
  poste: { position: 'absolute', left: 30, top: 0, width: 4, height: 190, backgroundColor: colors.textWhite },
  viga: { position: 'absolute', left: 30, top: 0, width: 94, height: 4, backgroundColor: colors.textWhite },
  cuerda: { position: 'absolute', left: 120, top: 0, width: 4, height: 25, backgroundColor: colors.textWhite },
  cabeza: { position: 'absolute', left: 104, top: 25, width: 36, height: 36, borderRadius: 18, borderWidth: 3, borderColor: colors.senary },
  cuerpo: { position: 'absolute', left: 120, top: 61, width: 4, height: 55, backgroundColor: colors.senary },
  extremidad: { position: 'absolute', width: 4, height: 40, backgroundColor: colors.senary },
  brazoIzquierdo: { left: 106, top: 64, transform: [{ rotate: '45deg' }] },
  brazoDerecho: { left: 134, top: 64, transform: [{ rotate: '-45deg' }] },
  piernaIzquierda: { left: 106, top: 110, transform: [{ rotate: '45deg' }] },
  piernaDerecha: { left: 134, top: 110, transform: [{ rotate: '-45deg' }] },
});
