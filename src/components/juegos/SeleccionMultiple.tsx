import { useState } from 'react';
import type { JSeleccionMultipleResDTO } from '@/models/JSeleccionMultipleResDTO';
import { MarcoJuego, Opcion, usePartida } from './compartido';
import type { JuegoProps } from './compartido';
import { mezclar, normalizarRespuesta } from './logica';

export function SeleccionMultiple(props: JuegoProps<JSeleccionMultipleResDTO>) {
  return <Partida key={props.actividad.id} {...props} />;
}

function Partida(props: JuegoProps<JSeleccionMultipleResDTO>) {
  const { actividad } = props;
  const partida = usePartida(props, `La respuesta correcta es: ${actividad.parametros.respuesta}`);
  const [opciones] = useState(() => mezclar([
    { id: 1, texto: actividad.parametros.opcion1 },
    { id: 2, texto: actividad.parametros.opcion2 },
    { id: 3, texto: actividad.parametros.opcion3 },
  ]));
  const [elegida, setElegida] = useState<number | null>(null);
  const esCorrecta = (texto: string) => normalizarRespuesta(texto) === normalizarRespuesta(actividad.parametros.respuesta);
  const valida = opciones.some((opcion) => esCorrecta(opcion.texto)) && !!actividad.parametros.respuesta.trim();

  function elegir(id: number, texto: string) {
    if (!partida.registrarIntento()) return;
    setElegida(id);
    const acierto = esCorrecta(texto);
    partida.setMensaje(acierto ? '¡Respuesta correcta!' : `La respuesta correcta es: ${actividad.parametros.respuesta}`);
    partida.finalizar(acierto);
  }

  return (
    <MarcoJuego titulo="Selección múltiple" enunciado={actividad.enunciado}
      mensaje={valida ? partida.mensaje : 'Esta actividad no tiene una respuesta válida entre las opciones.'}>
      {opciones.map((opcion) => (
        <Opcion key={opcion.id} texto={opcion.texto} onPress={() => elegir(opcion.id, opcion.texto)}
          disabled={partida.terminado || !valida} seleccionada={elegida === opcion.id}
          correcta={partida.terminado && esCorrecta(opcion.texto)} />
      ))}
    </MarcoJuego>
  );
}
