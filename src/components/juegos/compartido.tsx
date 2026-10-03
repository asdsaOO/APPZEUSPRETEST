import { useImperativeHandle, useRef, useState } from 'react';
import type { PropsWithChildren, Ref } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors } from '@/constants/colors';
import type { ActividadResDTO } from '@/models/ActividadResDTO';

export type ControlJuego = { omitir: () => void };

export type JuegoProps<T extends ActividadResDTO> = {
  actividad: T;
  onComplete: (resultado: T) => void;
  controlRef?: Ref<ControlJuego>;
};

export function usePartida<T extends ActividadResDTO>(
  { actividad, onComplete, controlRef }: JuegoProps<T>,
  solucion: string,
) {
  const [inicio] = useState(() => Date.now());
  const intentos = useRef(0);
  const finalizado = useRef(false);
  const [terminado, setTerminado] = useState(false);
  const [mensaje, setMensaje] = useState('');

  function registrarIntento() {
    if (finalizado.current) return false;
    intentos.current += 1;
    return true;
  }

  function finalizar(resultado: boolean) {
    if (finalizado.current) return;
    finalizado.current = true;
    setTerminado(true);
    onComplete({
      ...actividad,
      intentos: actividad.intentos + intentos.current,
      tiempo: actividad.tiempo + Math.max(0, Date.now() - inicio),
      resultado,
    });
  }

  useImperativeHandle(controlRef, () => ({
    omitir: () => {
      if (finalizado.current) return;
      setMensaje(`Actividad omitida. ${solucion}`);
      finalizar(false);
    },
  }));

  return { terminado, mensaje, setMensaje, registrarIntento, finalizar };
}

export function MarcoJuego({ titulo, enunciado, mensaje, children }: PropsWithChildren<{
  titulo: string;
  enunciado: string;
  mensaje: string;
}>) {
  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.contenido} keyboardShouldPersistTaps="handled">
      <Text accessibilityRole="header" style={styles.titulo}>{titulo}</Text>
      <Text style={styles.enunciado}>{enunciado}</Text>
      {children}
      <Text accessibilityLiveRegion="polite" style={styles.mensaje}>{mensaje}</Text>
    </ScrollView>
  );
}

export function Opcion({ texto, onPress, disabled = false, seleccionada = false, correcta = false, colorRelacion, accessibilityLabel }: {
  texto: string;
  onPress: () => void;
  disabled?: boolean;
  seleccionada?: boolean;
  correcta?: boolean;
  colorRelacion?: string;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected: seleccionada }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.opcion,
        colorRelacion && { borderColor: colorRelacion, borderLeftColor: colorRelacion, borderLeftWidth: 8 },
        seleccionada && styles.seleccionada,
        correcta && styles.correcta, disabled && !correcta && styles.deshabilitada,
        pressed && styles.pulsada]}
    >
      <Text style={styles.texto}>{correcta ? '✓ ' : ''}{texto}</Text>
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colors.background },
  contenido: { padding: 20, gap: 16, width: '100%', maxWidth: 720, alignSelf: 'center' },
  titulo: { color: colors.quinary, fontSize: 24, fontWeight: '700' },
  enunciado: { color: colors.textWhite, fontSize: 20, lineHeight: 28 },
  texto: { color: colors.textWhite, fontSize: 17, textAlign: 'center' },
  mensaje: { color: colors.senary, fontSize: 18, lineHeight: 26, minHeight: 28 },
  opcion: { backgroundColor: colors.primary, borderWidth: 2, borderColor: colors.secondary,
    borderRadius: 12, padding: 14, minHeight: 48, justifyContent: 'center' },
  seleccionada: { borderColor: colors.senary },
  correcta: { borderColor: colors.quinary, backgroundColor: colors.secondary },
  deshabilitada: { opacity: 0.55 },
  pulsada: { opacity: 0.8 },
  columna: { flex: 1, gap: 12 },
  fila: { flexDirection: 'row', gap: 12 },
});
