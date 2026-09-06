# truncate

Acorta una cadena hasta un largo máximo y marca el corte con puntos suspensivos. Trata bien Unicode y sabe que _qué extremo_ conservas cambia el sentido del recorte.

## Uso

```ts
import { truncate } from 'ranuts/utils';

truncate('the quick brown fox', 12); // 'the quick b…'

truncate('/Users/me/code/app/src/index.ts', { length: 20, position: 'start' });
// '…de/app/src/index.ts'

truncate('0xabcdef0123456789', { length: 11, position: 'middle' });
// '0xabc…56789'
```

## API

### `truncate(value, options)`

#### Parámetros

| Parámetro | Descripción                                         | Tipo                        | Por defecto |
| --------- | --------------------------------------------------- | --------------------------- | ----------- |
| `value`   | La cadena que se acorta                             | `string`                    | Obligatorio |
| `options` | Un número a secas es la forma corta de `{ length }` | `TruncateOptions \| number` | Obligatorio |

#### `TruncateOptions`

| Campo      | Descripción                                              | Tipo                           | Por defecto |
| ---------- | -------------------------------------------------------- | ------------------------------ | ----------- |
| `length`   | Largo máximo del resultado, puntos suspensivos incluidos | `number`                       | —           |
| `position` | Qué extremo sobrevive; véase más abajo                   | `'end' \| 'start' \| 'middle'` | `'end'`     |
| `ellipsis` | La marca que se pone en el corte                         | `string`                       | `'…'`       |

`position` decide qué extremo sobrevive, y esa elección lleva información de verdad:

- `'end'` (por defecto) conserva el principio: lo adecuado para prosa y títulos.
- `'start'` conserva la **cola**, que es lo que pide una ruta de archivo: `/Users/alguien/trabajo/…` es la parte que quien lee ya conoce; `…/src/utils/str.ts` es la que necesita.
- `'middle'` conserva ambos extremos, para identificadores cuyo principio _y_ final significan algo, como un hash o un número de cuenta.

#### Devuelve

`string`: nunca más largo que `length`. Si `length` es menor que los propios puntos suspensivos, lo que se recorta son ellos, en vez de desbordarse.

## Notas

1. **Corta por punto de código Unicode, no por unidad UTF-16.** Un `value.slice(i)` ingenuo puede caer dentro de un par suplente: cualquier carácter fuera del plano multilingüe básico (emoji, algunos caracteres de extensión CJK) ocupa dos unidades UTF-16, y deja junto a los puntos suspensivos un suplente suelto que se pinta como caracteres corruptos. `truncate` recorre por punto de código, así que nunca parte un carácter de varias unidades.
2. Un `value` más corto que `length` se devuelve tal cual, sin añadir puntos suspensivos.
3. Pasa tu propio `ellipsis` (`'...'` o `'[cut]'`, por ejemplo) si el carácter `'…'` no existe en la tipografía con la que pintas.
