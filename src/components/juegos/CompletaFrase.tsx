import { useState } from 'react';
import { Keyboard } from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import type { JCompletaFraseResDTO } from '@/models/JcompletaFraseResDTO';
import { MarcoJuego, usePartida } from './compartido';
import type { JuegoProps } from './compartido';
import { normalizarRespuesta } from './logica';

export function CompletaFrase(props: JuegoProps<JCompletaFraseResDTO>) {
  return <Partida key={props.actividad.id} {...props} />;
}

function Partida(props: JuegoProps<JCompletaFraseResDTO>) {
  const { actividad } = props;
  const partida = usePartida(props, `La respuesta correcta es: ${actividad.parametros.respuesta}`);
  const [respuesta, setRespuesta] = useState('');
  const valida = !!actividad.parametros.respuesta.trim();

  function comprobar() {
    if (!valida || partida.terminado) return;
    if (!respuesta.trim()) {
      partida.setMensaje('Escribe una respuesta antes de comprobar.');
      return;
    }
    if (!partida.registrarIntento()) return;
    if (normalizarRespuesta(respuesta) === normalizarRespuesta(actividad.parametros.respuesta)) {
      Keyboard.dismiss();
      partida.setMensaje('¡Respuesta correcta!');
      partida.finalizar(true);
    } else {
      partida.setMensaje('Todavía no es correcto. Inténtalo de nuevo.');
    }
  }

  return (
    <MarcoJuego titulo="Completa la frase" enunciado={actividad.enunciado}
      mensaje={valida ? partida.mensaje : 'Esta actividad no tiene una respuesta configurada.'}>
      <Input accessibilityLabel="Tu respuesta" placeholder="Escribe la palabra o frase que falta"
        value={respuesta} onChangeText={setRespuesta} editable={!partida.terminado && valida}
        autoCorrect={false} autoCapitalize="none" returnKeyType="done" onSubmitEditing={comprobar} />
      {!partida.terminado && valida && <Button title="Comprobar" onPress={comprobar} />}
    </MarcoJuego>
  );
}
