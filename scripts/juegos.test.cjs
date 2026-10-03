const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync(path.join(__dirname, '../src/components/juegos/logica.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const exportsObject = {};
vm.runInNewContext(compiled, { exports: exportsObject, Math });
const { mezclar, normalizarRespuesta, letraAhorcado, evaluarAhorcado } = exportsObject;

test('mezclar conserva todas las parejas y no modifica el arreglo original', () => {
  const pares = Object.freeze([
    Object.freeze({ id: 0, izquierda: 'A', derecha: '1' }),
    Object.freeze({ id: 1, izquierda: 'A', derecha: '2' }),
    Object.freeze({ id: 2, izquierda: 'B', derecha: '3' }),
  ]);
  for (let i = 0; i < 30; i++) {
    const resultado = mezclar(pares);
    assert.notEqual(resultado, pares);
    assert.equal(resultado.length, pares.length);
    assert.equal(new Set(resultado.map((par) => par.id)).size, pares.length);
    for (const par of resultado) assert.equal(par, pares[par.id]);
  }
  assert.equal(mezclar([]).length, 0);
});

test('normaliza mayúsculas, espacios exteriores y Unicode sin quitar tildes', () => {
  assert.equal(normalizarRespuesta('  CÉLULA  '), 'célula');
  assert.equal(normalizarRespuesta('ce\u0301lula'), 'célula');
  assert.notEqual(normalizarRespuesta('célula'), normalizarRespuesta('celula'));
});

test('ahorcado termina al sexto error, no al quinto', () => {
  assert.equal(evaluarAhorcado('celula', ['B', 'D', 'F', 'G', 'H']).terminado, false);
  const perdido = evaluarAhorcado('celula', ['B', 'D', 'F', 'G', 'H', 'J']);
  assert.equal(perdido.errores, 6);
  assert.equal(perdido.terminado, true);
  assert.equal(perdido.acierto, false);
});

test('ahorcado admite tildes, letras repetidas en la palabra y signos visibles', () => {
  const ganado = evaluarAhorcado('¡Célula!', ['C', 'E', 'L', 'U', 'A']);
  assert.equal(ganado.acierto, true);
  assert.equal(ganado.errores, 0);
  assert.equal(letraAhorcado('pingüino, caña'), 'PINGUINO, CAÑA');
  assert.equal(evaluarAhorcado('caña', ['C', 'A', 'N']).acierto, false);
  assert.equal(evaluarAhorcado('caña', ['C', 'A', 'Ñ']).acierto, true);
});
