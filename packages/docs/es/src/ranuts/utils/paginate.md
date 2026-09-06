# paginateText

Corta texto plano en páginas que quepan en una caja fija: un lector, un teleprónter, una vista previa para imprimir.

Aritmética pura: recibe la caja y las medidas tipográficas como números y nunca toca el DOM. Mide el contenedor una vez en el hilo principal y luego pagina en un Worker, en el servidor o dentro de una prueba.

## API

### paginateText(text, box, metrics, options?)

| Parámetro        | Descripción                                                                  | Tipo              |
| ---------------- | ---------------------------------------------------------------------------- | ----------------- |
| `text`           | Texto de origen; `\r\n` y `\r` se normalizan a `\n`                          | `string`          |
| `box`            | `{ width, height }` en px                                                    | `TextBox`         |
| `metrics`        | `{ charWidth, lineHeight, narrowRatio? }` en px                              | `TextGridMetrics` |
| `options.minBox` | Por debajo de esto, se da la caja por no maquetada todavía. Por defecto `30` | `number`          |

`narrowRatio` es el avance de un carácter ASCII como fracción de `charWidth`; por defecto `0.5625` (9/16).

Devuelve `{ pages, total, charsPerLine, linesPerPage, charsPerPage }`, y cada página es `{ text, start, end, index }` con los desplazamientos referidos al texto ya normalizado.

## Ejemplo

```js
import { paginateText } from 'ranuts';

const { width, height } = container.getBoundingClientRect();
const result = paginateText(book, { width, height }, { charWidth: 18.4, lineHeight: 40 });

render(result.pages[0].text);
console.log(`${result.pages.length} páginas, ${result.charsPerLine} caracteres por línea`);
```

## Notas

1. **Da por supuesta una rejilla monoespaciada**: cada carácter avanza una celda (CJK, ancho completo) o `narrowRatio` de una (ASCII). Es exacto con una tipografía monoespaciada y bastante bueno para un cuerpo de texto mayoritariamente CJK, pero **no** sustituye al moldeado real de un latín proporcional.
2. **Las palabras ASCII no se parten.** Una página nunca termina a mitad de palabra, salvo que la palabra sea más larga que una línea, en cuyo caso hay que romperla.
3. **Los desplazamientos son contiguos**: `pages[i].start === pages[i - 1].end`, y unir todos los `page.text` reconstruye exactamente el texto normalizado. Eso es lo que te permite guardar una anotación como desplazamiento global y que siga siendo válida tras repaginar. Véase [segmentByRanges](./segment).
4. **Una caja más pequeña que `minBox` no devuelve páginas.** Si no, paginar durante el primer pintado, cuando el contenedor aún mide 0, se quedaría dando vueltas.

::: tip Una palabra más larga que una página
Una URL, un blob en base64 o una ristra larga de guiones cuentan todos como caracteres de palabra. Cuando una ristra así ocupa más de una página entera no hay «página siguiente» a la que aplazarla, así que se rompe por lo sano. Aplazarla, en cambio, devolvería el cursor a donde empezó la página. La página sale vacía y el bucle no avanza nunca: un cuelgue, no solo una maquetación fea.
:::
