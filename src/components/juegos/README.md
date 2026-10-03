# Juegos

Cada componente recibe `actividad` (su DTO) y `onComplete(resultado)`.
La función se llama una sola vez al terminar y recibe una copia del DTO;
el objeto original no se modifica. No se conectan a la API ni navegan.

La página puede pasar `controlRef` (un `useRef<ControlJuego | null>(null)`).
Al llamar `controlRef.current?.omitir()`, el juego finaliza con `resultado: false`
y devuelve las métricas mediante `onComplete`, sin sumar un intento por omitir.
También muestra la solución y bloquea la interacción. La página conserva la
actividad visible hasta pulsar «Siguiente» (o «Ver resumen» en la última).

```tsx
import { Ahorcado } from '@/components/juegos/Ahorcado';

<Ahorcado actividad={actividad} onComplete={(resultado) => guardarResultado(resultado)} />
```

- `Ahorcado`: termina al acertar o cometer seis errores. Una letra repetida
  no cuenta. Las vocales acentuadas se pueden adivinar con su vocal base;
  Ñ es distinta de N. Espacios y signos aparecen desde el principio.
- `SeleccionMultiple`: termina con la primera elección, acertada o no.
- `CompletaFrase`: permite reintentos hasta acertar. Ignora mayúsculas y
  espacios exteriores, pero conserva tildes. Una respuesta vacía no cuenta.
- `RelacionPares`: permite reintentos hasta resolver todas las parejas.
  Cada pareja conserva un identificador interno aunque sus columnas se mezclen.
  Se forman todas las relaciones antes de verificar; cada verificaci?n cuenta
  como un intento. Reiniciar relaciones no borra intentos ni reinicia el tiempo.

`intentos` suma letras nuevas incorrectas en ahorcado, elecciones en selección
múltiple, respuestas no vacías en completar frase o verificaciones completas
en pares, sobre el valor inicial recibido. Acertar letras no suma intentos.
`tiempo` suma milisegundos transcurridos desde el montaje
(incluye tiempo con la app en segundo plano). `resultado` indica si se resolvió
correctamente. `puntaje` se conserva hasta definir la fórmula de evaluación.

Los valores iniciales de `tiempo` también deben estar en milisegundos.
El resumen convierte el total a minutos y segundos solo para mostrarlo;
el DTO y el registro en consola conservan los milisegundos.

Cambiar `actividad.id` inicia una partida nueva y mezcla de nuevo las opciones.
Para repetir la misma actividad desde cero, la página debe cambiar el `key`
del componente. Mantener el mismo ID y actualizar las métricas no reinicia la partida.
La página debe dar a estos componentes un contenedor con altura disponible
(por ejemplo, `flex: 1`); cada juego incluye desplazamiento vertical.

Verificación de la lógica compartida: `node --test scripts/juegos.test.cjs`.
