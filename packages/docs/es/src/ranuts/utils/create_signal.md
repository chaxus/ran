# createSignal

Una señal mínima: `[leer, escribir]`, con difusión opcional por el bus compartido [`subscribers`](./sync_hook), para que módulos sin relación entre sí puedan reaccionar a un cambio.

## API

### createSignal(value, options?)

#### Parámetros

| Parámetro            | Descripción                                            | Tipo                                         | Por defecto |
| -------------------- | ------------------------------------------------------ | -------------------------------------------- | ----------- |
| `value`              | Valor inicial                                          | `T`                                          | Obligatorio |
| `options.subscriber` | Nombre del evento; al cambiar, avisa por `subscribers` | `string`                                     | `undefined` |
| `options.equals`     | Cómo se decide si «ha cambiado»                        | `boolean \| ((prev: T, next: T) => boolean)` | `true`      |

Qué significa `equals`:

| Valor            | Comportamiento                                                              |
| ---------------- | --------------------------------------------------------------------------- |
| omitido o `true` | `Object.is`: igualdad de referencia o de valor (lo habitual en las señales) |
| `false`          | Cada escritura cuenta como cambio y avisa                                   |
| una función      | Devolver `true` significa «son iguales, no avises»                          |

#### Devuelve

`[getter, setter]`.

## Ejemplo

```js
import { createSignal, isEqual, subscribers } from 'ranuts';

const [count, setCount] = createSignal(0, { subscriber: 'count-changed' });
subscribers.tap('count-changed', () => render(count()));

setCount(1); // avisa
setCount(1); // mismo valor: no avisa

// Pide la comparación profunda solo cuando de verdad haga falta
const [tree, setTree] = createSignal(initial, { equals: isEqual });
```

## Notas

1. **Por defecto, igualdad de referencia.** Un objeto recién construido pero idéntico por dentro _sí_ es un cambio. Así se comportan las señales de siempre, y así la escritura se mantiene en O(1).
2. **La comparación profunda hay que pedirla** con `{ equals: isEqual }`, de modo que su coste se vea en el punto de llamada.
3. **`subscriber` es opcional.** Sin él, la señal es puro estado local.

::: warning Cambiado en la 0.3
Dos correcciones que cambian el comportamiento:

- `{ equals: true }` significaba «siempre iguales», lo que congelaba la señal y hacía que **nunca se actualizara**. Ahora significa «usa la comparación por defecto», igual que `undefined`.
- Cada escritura ejecutaba `cloneDeep` e `isEqual` por encima de `equals`. Eso ponía una copia proporcional al tamaño de los datos en el camino caliente de la escritura, y esa comprobación profunda de más anulaba a `equals`, así que `{ equals: false }` («avisa siempre») no hacía nada con valores idénticos por dentro. Se han quitado las dos.
  :::
