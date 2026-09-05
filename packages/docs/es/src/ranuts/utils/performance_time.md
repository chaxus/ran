# performanceTime

Obtiene una marca de tiempo de alta precisión, tanto en el navegador como en Node.js.

## API

### performanceTime

#### Devuelve

| Argumento | Descripción | Tipo |
| -------- | --------------------------------------- | -------- |
| `number` | Marca de tiempo de alta precisión (milisegundos) | `number` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// Ejecuta algunas operaciones
const end = performanceTime();
console.log(`Duración: ${end - start} ms`);
```

### Medir el rendimiento

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// Ejecuta operaciones costosas
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}
const end = performanceTime();
console.log(`Duración de la operación: ${end - start} ms`);
```

### Tiempo de ejecución de una función

```js
import { performanceTime } from 'ranuts';

function expensiveFunction() {
  // Cálculo complejo
  return Math.random() * 1000;
}

const start = performanceTime();
const result = expensiveFunction();
const end = performanceTime();
console.log(`Resultado: ${result}, duración: ${end - start} ms`);
```

## Notas

1. **Entornos admitidos**:
   - Navegador: usa `performance.now()`
   - Node.js: usa `process.hrtime()`
   - Otros: recurre a `Date.now()`

2. **Precisión**: `performance.now()` y `process.hrtime()` llegan al microsegundo, más finos que `Date.now()`.

3. **Tiempo relativo**: la marca devuelta es relativa; sirve para medir diferencias, no como tiempo absoluto.

4. **Unidad**: el valor devuelto está en milisegundos.
