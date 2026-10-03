/** Fisher-Yates: devuelve una copia y conserva los identificadores de los elementos. */
export function mezclar<T>(elementos: readonly T[]): T[] {
  const copia = [...elementos];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function normalizarRespuesta(texto: string): string {
  return texto.normalize('NFC').trim().toLocaleLowerCase('es');
}

/** Permite adivinar vocales con tilde desde el teclado, conservando la Ñ. */
export function letraAhorcado(texto: string): string {
  return texto.normalize('NFC').toLocaleUpperCase('es')
    .replace(/[ÁÀÄÂ]/g, 'A').replace(/[ÉÈËÊ]/g, 'E')
    .replace(/[ÍÌÏÎ]/g, 'I').replace(/[ÓÒÖÔ]/g, 'O')
    .replace(/[ÚÙÜÛ]/g, 'U');
}

export const ALFABETO = Array.from('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ');

export function evaluarAhorcado(respuesta: string, letras: readonly string[]) {
  const objetivo = Array.from(letraAhorcado(respuesta));
  const errores = letras.filter((letra) => !objetivo.includes(letra)).length;
  const acierto = objetivo.every((letra) => !ALFABETO.includes(letra) || letras.includes(letra));
  return { errores, acierto, terminado: acierto || errores >= 6 };
}
