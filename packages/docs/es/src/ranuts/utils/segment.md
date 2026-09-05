# buildOffsets / indexForOffset / segmentByRanges

Las cuentas de coordenadas para cuando «el contenido está partido en trozos pero las anotaciones se guardan contra el texto entero». Guarda un resaltado como un **desplazamiento global** en lugar de «trozo N, carácter M» y sobrevivirá a que se vuelva a trocear: cambia el tamaño de letra, el ancho de página o el tamaño de los fragmentos, y la anotación seguirá señalando las mismas palabras.

## API

### buildOffsets(lengths)

Sumas acumuladas: `offsets[i]` es la longitud total de todo lo que precede al trozo `i`.

```js
buildOffsets([3, 5, 2]); // [0, 3, 8]
```

### indexForOffset(offsets, offset)

Busca por bisección en qué trozo cae un desplazamiento global. Los desplazamientos fuera de rango se ajustan a `[0, offsets.length - 1]`, y un array vacío devuelve `0`. El resultado siempre se puede usar como índice sin riesgo.

### segmentByRanges(text, chunkStart, ranges)

Parte un trozo en segmentos normales y coincidentes, para pintarlo por partes (resaltados, aciertos de búsqueda, coloreado de diferencias).

| Parámetro    | Descripción                                       | Tipo                        |
| ------------ | ------------------------------------------------- | --------------------------- |
| `text`       | El texto de este trozo                            | `string`                    |
| `chunkStart` | El desplazamiento global donde empieza este trozo | `number`                    |
| `ranges`     | `{ start, end, value }[]` en coordenadas globales | `readonly OffsetRange<T>[]` |

Devuelve `{ text, start, end, value }[]`, donde `value` es `null` para el texto que no cubre ningún rango. Unir los segmentos siempre reconstruye `text`, y siempre hay al menos un segmento.

## Ejemplo

```js
import { buildOffsets, indexForOffset, segmentByRanges } from 'ranuts';

const offsets = buildOffsets(pages.map((p) => p.text.length));

// ¿En qué página empieza esta nota?
const pageIndex = indexForOffset(offsets, note.start);

// Pintar una página con sus resaltados
const segments = segmentByRanges(
  pages[i].text,
  offsets[i],
  notes.map((n) => ({
    start: n.start,
    end: n.end,
    value: n,
  })),
);
segments.forEach((s) => container.append(s.value ? mark(s.text, s.value) : text(s.text)));
```

## Notas

1. **Los rangos son semiabiertos**: `[start, end)`.
2. **Los solapes se resuelven, no se fusionan.** Los rangos se consumen en orden; uno posterior solo se queda con la parte que aún no está cubierta, y el que quede del todo dentro de otro anterior se descarta. Los puntos de corte crecen estrictamente, así que ningún segmento sale vacío por accidente ni duplicado.
3. **Los rangos fuera del trozo se ignoran** y los que se solapan en parte se recortan, de modo que puedes pasar la lista entera de anotaciones a cada trozo.
