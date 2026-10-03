import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import * as services from '@/Services/progressServices';

export default function HomePage() {
  const { data: datosPagina, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ['puntuacionGeneral'],
    queryFn: services.obtenerDatosGenerales,
  });

  return (
    <SafeAreaView style={styles.pagina} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <View style={styles.marca}>
          <Ionicons name="flash" size={22} color={colors.quinary} accessible={false} />
          <Text style={styles.marcaTexto}>ZEUS</Text>
        </View>
        <View style={styles.saludo}>
          <Text style={styles.etiqueta}>TU ESPACIO DE APRENDIZAJE</Text>
          <Text accessibilityRole="header" style={styles.titulo}>
            {datosPagina?.nombre ? `¡Hola, ${datosPagina.nombre}!` : '¡Bienvenido!'}
          </Text>
          <Text style={styles.descripcion}>Un nuevo paso, algo nuevo por aprender.</Text>
        </View>

        <View style={styles.seccion}>
          <Text accessibilityRole="header" style={styles.subtitulo}>Tu progreso</Text>
          {isPending ? (
            <View style={styles.estado}>
              <ActivityIndicator color={colors.tertiary} />
              <Text style={styles.descripcion}>Cargando tu progreso...</Text>
            </View>
          ) : isError ? (
            <View style={styles.estado}>
              <Ionicons name="cloud-offline-outline" size={30} color={colors.senary} accessible={false} />
              <Text style={styles.descripcion}>No se pudo cargar tu progreso.</Text>
              <Pressable accessibilityRole="button" disabled={isFetching} onPress={() => { void refetch(); }}
                style={({ pressed }) => [styles.reintentar, pressed && styles.presionado]}>
                <Text style={styles.reintentarTexto}>{isFetching ? 'Reintentando...' : 'Volver a intentar'}</Text>
              </Pressable>
            </View>
          ) : datosPagina ? (
            <>
              <View style={styles.puntaje}>
                <View style={styles.iconoPuntaje}>
                  <Ionicons name="trophy-outline" size={26} color={colors.senary} accessible={false} />
                </View>
                <View style={styles.dato}>
                  <Text style={styles.etiqueta}>PUNTUACIÓN TOTAL</Text>
                  <Text style={styles.numeroGrande}>{datosPagina.puntuacion}</Text>
                </View>
              </View>
              <View style={styles.rachas}>
                <View style={styles.tarjeta}>
                  <Ionicons name="flash-outline" size={20} color={colors.tertiary} accessible={false} />
                  <Text style={styles.numero}>{datosPagina.racha}</Text>
                  <Text style={styles.descripcion}>Racha</Text>
                </View>
                <View style={styles.tarjeta}>
                  <Ionicons name="flame-outline" size={20} color={colors.senary} accessible={false} />
                  <Text style={styles.numero}>{datosPagina.racha_diaria}</Text>
                  <Text style={styles.descripcion}>Racha diaria</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.descripcion}>Aún no hay datos de progreso disponibles.</Text>
          )}
        </View>

        <View style={styles.leccion}>
          <View style={styles.distintivo}>
            <Ionicons name="book-outline" size={18} color={colors.tertiary} accessible={false} />
            <Text style={styles.distintivoTexto}>SIGUE APRENDIENDO</Text>
          </View>
          <Text accessibilityRole="header" style={styles.subtitulo}>Tu próximo reto empieza aquí</Text>
          <Text style={styles.descripcion}>Pon a prueba lo que sabes con una nueva lección.</Text>
          <Pressable accessibilityRole="button"
            onPress={() => router.push({ pathname: '/leccion', params: { sesion: String(Date.now()) } })}
            style={({ pressed }) => [styles.iniciar, pressed && styles.presionado]}>
            <Text style={styles.iniciarTexto}>Iniciar lección</Text>
            <Ionicons name="arrow-forward" size={22} color={colors.primary} accessible={false} />
          </Pressable>
        </View>
        <Text style={styles.pie}>Aprende a tu ritmo. Sigue avanzando.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: colors.background },
  contenido: { flexGrow: 1, width: '100%', maxWidth: 720, alignSelf: 'center', padding: 16, gap: 16 },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  marcaTexto: { color: colors.textWhite, fontSize: 18, fontWeight: '800', letterSpacing: 3 },
  saludo: { gap: 6 },
  etiqueta: { color: colors.tertiary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 },
  titulo: { color: colors.textWhite, fontSize: 28, fontWeight: '800' },
  descripcion: { color: colors.textWhite, fontSize: 15, lineHeight: 23 },
  seccion: { gap: 10 },
  subtitulo: { color: colors.textWhite, fontSize: 21, fontWeight: '700' },
  puntaje: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14, borderRadius: 18, backgroundColor: colors.primary, borderWidth: 1, borderColor: colors.secondary },
  iconoPuntaje: { padding: 10, borderRadius: 14, backgroundColor: colors.secondary },
  dato: { flex: 1, gap: 4 },
  numeroGrande: { color: colors.senary, fontSize: 28, fontWeight: '800' },
  rachas: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tarjeta: { flexGrow: 1, flexBasis: 120, gap: 4, padding: 12, borderRadius: 16, backgroundColor: colors.primary },
  numero: { color: colors.textWhite, fontSize: 24, fontWeight: '800' },
  leccion: { padding: 16, gap: 10, borderRadius: 20, borderWidth: 1, borderColor: colors.quaternary, backgroundColor: colors.primary },
  distintivo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  distintivoTexto: { color: colors.tertiary, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  iniciar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 56, padding: 16, borderRadius: 16, backgroundColor: colors.quinary, marginTop: 6 },
  iniciarTexto: { color: colors.primary, fontSize: 17, fontWeight: '800', flexShrink: 1 },
  presionado: { opacity: 0.8 },
  estado: { alignItems: 'center', gap: 16, padding: 24, borderRadius: 24, backgroundColor: colors.primary },
  reintentar: { minHeight: 48, padding: 14, borderRadius: 12, backgroundColor: colors.tertiary },
  reintentarTexto: { color: colors.primary, fontWeight: '700' },
  pie: { color: colors.textWhite, fontSize: 13, textAlign: 'center', lineHeight: 20 },
});
