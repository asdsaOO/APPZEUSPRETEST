import Ionicons from '@expo/vector-icons/Ionicons';
import { Drawer, DrawerContentScrollView, DrawerItemList } from 'expo-router/drawer';
import type { DrawerContentComponentProps } from 'expo-router/drawer';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors } from '@/constants/colors';

function MenuLateral(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.contenido}>
      <View style={styles.cabecera}>
        <View style={styles.marca}>
          <View style={styles.logo}>
            <Ionicons name="flash" size={26} color={colors.primary} accessible={false} />
          </View>
          <Text style={styles.nombre}>ZEUS</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="Cerrar menú"
            onPress={() => props.navigation.closeDrawer()}
            style={({ pressed }) => [styles.cerrar, pressed && styles.presionado]}>
            <Ionicons name="close" size={24} color={colors.textWhite} accessible={false} />
          </Pressable>
        </View>
        <Text style={styles.descripcion}>Tu próximo logro empieza aquí.</Text>
      </View>
      <Text style={styles.etiqueta}>EXPLORA</Text>
      <DrawerItemList {...props} />
      <View style={styles.pie}>
        <View style={styles.consejo}>
          <Ionicons name="sparkles-outline" size={22} color={colors.senary} accessible={false} />
          <View style={styles.textosConsejo}>
            <Text style={styles.tituloConsejo}>Un paso cada día</Text>
            <Text style={styles.descripcion}>Aprende a tu ritmo y sigue avanzando.</Text>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
}

export default function HomeLayout() {
  const { width } = useWindowDimensions();
  return (
    <Drawer
      drawerContent={(props) => <MenuLateral {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          width: Math.min(300, width * 0.88),
          backgroundColor: colors.primary,
          borderTopRightRadius: 28,
          borderBottomRightRadius: 28,
          overflow: 'hidden',
        },
        drawerActiveTintColor: colors.primary,
        drawerActiveBackgroundColor: colors.quinary,
        drawerInactiveTintColor: colors.textWhite,
        drawerLabelStyle: { fontSize: 16, fontWeight: '700' },
        drawerItemStyle: { borderRadius: 16, marginHorizontal: 12, marginVertical: 5 },
        headerStyle: { backgroundColor: colors.primary },
        headerShadowVisible: false,
        headerTintColor: colors.textWhite,
        headerTitleStyle: { fontSize: 18, fontWeight: '700' },
      }}
    >
      <Drawer.Screen name="leccion" options={{ title: 'Lección', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="home" options={{
        title: 'Inicio',
        drawerIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} color={color} size={size} />,
      }} />
      <Drawer.Screen name="perfil" options={{
        title: 'Perfil',
        drawerIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={size} />,
      }} />
      <Drawer.Screen name="pruebas" options={{
        title: 'Pruebas',
        drawerIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'extension-puzzle' : 'extension-puzzle-outline'} color={color} size={size} />,
      }} />
      <Drawer.Screen name="ranking" options={{
        title: 'Mi ranking',
        drawerIcon: ({ color, size, focused }) => <Ionicons name={focused ? 'trophy' : 'trophy-outline'} color={color} size={size} />,
      }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  contenido: { flexGrow: 1, paddingBottom: 20 },
  cabecera: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24, gap: 16, borderBottomWidth: 1, borderBottomColor: colors.secondary, marginBottom: 24 },
  marca: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.quinary, alignItems: 'center', justifyContent: 'center' },
  nombre: { color: colors.textWhite, fontSize: 24, fontWeight: '800', letterSpacing: 2, flex: 1, flexShrink: 1 },
  cerrar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 14, backgroundColor: colors.secondary },
  presionado: { opacity: 0.7 },
  descripcion: { color: colors.textWhite, fontSize: 13, lineHeight: 20 },
  etiqueta: { color: colors.tertiary, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginHorizontal: 24, marginBottom: 10 },
  pie: { flexGrow: 1, justifyContent: 'flex-end', paddingTop: 32, paddingHorizontal: 12 },
  consejo: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 18, backgroundColor: colors.secondary },
  textosConsejo: { flex: 1, gap: 6 },
  tituloConsejo: { color: colors.senary, fontSize: 14, fontWeight: '700' },
});
