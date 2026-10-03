import { useSyncExternalStore } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/colors';
import type { ApiResponse } from '@/models/responses/ApiResponse';

const pendientes: ApiResponse[] = [];
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
const getSnapshot = () => pendientes[0] ?? null;
const getServerSnapshot = () => null;
const notify = () => listeners.forEach((listener) => listener());

/** Muestra las respuestas consecutivas en orden. */
export function callAlert(resp: ApiResponse) {
  pendientes.push({ ...resp });
  notify();
}

function cerrar() {
  pendientes.shift();
  notify();
}

/** Se monta una sola vez en el layout principal. */
export function CallAlertHost() {
  const respuesta = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const correcto = respuesta?.oboolean ?? false;
  const acento = correcto ? colors.quaternary : '#FF8A8A';

  return (
    <Modal transparent visible={respuesta !== null} animationType="fade" onRequestClose={cerrar}>
      <View style={styles.fondo}>
        <View style={styles.tarjeta} accessibilityViewIsModal onAccessibilityEscape={cerrar}>
          <ScrollView contentContainerStyle={styles.contenido} bounces={false}>
            <View style={[styles.icono, { backgroundColor: correcto ? '#123F38' : '#442A35' }]}>
              <Text accessible={false} style={[styles.simbolo, { color: acento }]}>{correcto ? '✓' : '!'}</Text>
            </View>
            <Text accessibilityRole="header" style={styles.titulo}>
              {correcto ? '¡Todo listo!' : 'Algo salió mal'}
            </Text>
            <Text style={styles.mensaje}>{respuesta?.omessage}</Text>
          </ScrollView>
          <Pressable accessibilityRole="button" onPress={cerrar}
            style={({ pressed }) => [styles.boton, { backgroundColor: acento }, pressed && styles.presionado]}>
            <Text style={styles.textoBoton}>Entendido</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(0, 10, 28, 0.72)' },
  tarjeta: { width: '100%', maxWidth: 380, maxHeight: '85%', padding: 24, borderRadius: 28, backgroundColor: '#102640', borderWidth: 1, borderColor: '#29415B' },
  contenido: { alignItems: 'center', paddingBottom: 24 },
  icono: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  simbolo: { fontSize: 38, fontWeight: '700' },
  titulo: { color: colors.textWhite, fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  mensaje: { color: '#CBD5E1', fontSize: 16, lineHeight: 24, textAlign: 'center' },
  boton: { minHeight: 50, borderRadius: 16, paddingVertical: 14, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center' },
  presionado: { opacity: 0.8 },
  textoBoton: { color: '#081C30', fontSize: 16, fontWeight: '700' },
});
