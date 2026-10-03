import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { jRelacionParesResDTO } from '@/models/JRelacionParesResDTO';
import { MarcoJuego, Opcion, styles, usePartida } from './compartido';
import type { JuegoProps } from './compartido';
import { mezclar } from './logica';

const coloresPares = ['#FF9F43', '#54D9ED', '#C9A0FF', '#FF83B5', '#8CDE75', '#FFE079'];

export function RelacionPares(props: JuegoProps<jRelacionParesResDTO>) {
  return <Partida key={props.actividad.id} {...props} />;
}

function Partida(props: JuegoProps<jRelacionParesResDTO>) {
  const { actividad } = props;
  const partida = usePartida(props, `Las parejas correctas son:\n${actividad.parametros.pares
    .map((par) => `${par.izquierda} → ${par.derecha}`).join('\n')}`);
  const [columnas] = useState(() => {
    const pares = actividad.parametros.pares.map((par, id) => ({ ...par, id }));
    return { izquierda: mezclar(pares), derecha: mezclar(pares) };
  });
  const [izquierda, setIzquierda] = useState<number | null>(null);
  const [derecha, setDerecha] = useState<number | null>(null);
  const [relaciones, setRelaciones] = useState<{ izquierda: number; derecha: number }[]>([]);
  const [verificado, setVerificado] = useState(false);
  const verificacionRegistrada = useRef(false);
  const completas = actividad.parametros.pares.length > 0 && relaciones.length === actividad.parametros.pares.length;

  function colorRelacion(lado: 'izquierda' | 'derecha', id: number) {
    const relacion = relaciones.find((par) => par[lado] === id);
    if (!relacion) return undefined;
    const posicion = columnas.izquierda.findIndex((par) => par.id === relacion.izquierda);
    return coloresPares[posicion] ?? `hsl(${(posicion * 137.5) % 360}, 75%, 70%)`;
  }

  function seleccionar(lado: 'izquierda' | 'derecha', id: number) {
    if (partida.terminado || verificado || relaciones.some((par) => par[lado] === id)) return;
    partida.setMensaje('');
    const a = lado === 'izquierda' ? id : izquierda;
    const b = lado === 'derecha' ? id : derecha;
    setIzquierda(a);
    setDerecha(b);
    if (a === null || b === null) return;
    setRelaciones((actuales) => {
      if (actuales.some((par) => par.izquierda === a || par.derecha === b)) return actuales;
      return [...actuales, { izquierda: a, derecha: b }];
    });
    setIzquierda(null);
    setDerecha(null);
  }

  function verificar() {
    if (!completas || verificacionRegistrada.current || !partida.registrarIntento()) return;
    verificacionRegistrada.current = true;
    setVerificado(true);
    const correctas = relaciones.every((par) => par.izquierda === par.derecha);
    if (correctas) {
      partida.setMensaje('¡Relacionaste todas las parejas!');
      partida.finalizar(true);
    } else {
      partida.setMensaje('Hay relaciones incorrectas. Pulsa «Reiniciar relaciones» para intentarlo de nuevo.');
    }
  }

  function reiniciar() {
    if (partida.terminado) return;
    setRelaciones([]);
    setVerificado(false);
    verificacionRegistrada.current = false;
    setIzquierda(null);
    setDerecha(null);
    partida.setMensaje('');
  }

  return (
    <MarcoJuego titulo="Relaciona los pares" enunciado={actividad.enunciado}
      mensaje={actividad.parametros.pares.length ? partida.mensaje : 'Esta actividad no tiene parejas configuradas.'}>
      <Text style={styles.texto}>Elige un elemento de cada columna. Cada pareja queda bloqueada y comparte color. Completa todas y verifica; para cambiarlas, reinicia las relaciones. Parejas: {relaciones.length}/{actividad.parametros.pares.length}</Text>
      <View style={styles.fila}>
        {(['izquierda', 'derecha'] as const).map((lado) => (
          <View key={lado} style={styles.columna}>
            {columnas[lado].map((par) => {
              const relacion = relaciones.find((item) => item[lado] === par.id);
              const otroLado = lado === 'izquierda' ? 'derecha' : 'izquierda';
              const pareja = relacion && columnas[otroLado].find((item) => item.id === relacion[otroLado]);
              return (
              <Opcion key={par.id} texto={par[lado]} onPress={() => seleccionar(lado, par.id)}
                colorRelacion={colorRelacion(lado, par.id)}
                accessibilityLabel={pareja ? `${par[lado]}, relacionado con ${pareja[otroLado]}` : `${par[lado]}, sin relación`}
                disabled={partida.terminado || verificado || !!relacion}
                seleccionada={(lado === 'izquierda' ? izquierda : derecha) === par.id} />
              );
            })}
          </View>
        ))}
      </View>
      {!partida.terminado && (
        <>
          <Opcion texto="Verificar" onPress={verificar} disabled={!completas || verificado} />
          <Pressable accessibilityRole="button" accessibilityLabel="Reiniciar relaciones"
            onPress={reiniciar} style={({ pressed }) => ({ alignSelf: 'center', padding: 12, opacity: pressed ? 0.5 : 0.75 })}>
            <Text style={styles.texto}>↻ Reiniciar relaciones</Text>
          </Pressable>
        </>
      )}
    </MarcoJuego>
  );
}
