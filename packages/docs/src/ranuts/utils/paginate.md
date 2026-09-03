# paginateText

Cut plain text into pages that fit a fixed box: a reader, a teleprompter, a printable preview.

Pure arithmetic: it takes the box and the type metrics as numbers and never touches the DOM.
Measure the container once on the main thread, then paginate in a Worker, on the server, or in
a test.

## API

### paginateText(text, box, metrics, options?)

| Parameter        | Description                                                 | Type              |
| ---------------- | ----------------------------------------------------------- | ----------------- |
| `text`           | Source text; `\r\n` / `\r` are normalized to `\n`           | `string`          |
| `box`            | `{ width, height }` in px                                   | `TextBox`         |
| `metrics`        | `{ charWidth, lineHeight, narrowRatio? }` in px             | `TextGridMetrics` |
| `options.minBox` | Below this, treat the box as not laid out yet. Default `30` | `number`          |

`narrowRatio` is the advance of an ASCII character as a fraction of `charWidth`; default
`0.5625` (9/16).

Returns `{ pages, total, charsPerLine, linesPerPage, charsPerPage }`, each page being
`{ text, start, end, index }` with offsets into the normalized source.

## Example

```js
import { paginateText } from 'ranuts';

const { width, height } = container.getBoundingClientRect();
const result = paginateText(book, { width, height }, { charWidth: 18.4, lineHeight: 40 });

render(result.pages[0].text);
console.log(`${result.pages.length} pages, ${result.charsPerLine} chars per line`);
```

## Notes

1. **It assumes a monospaced grid**: every character advances one cell (CJK, full-width) or
   `narrowRatio` of one (ASCII). Exactly true for a monospaced font, close enough for
   CJK-dominant body text, but **not** a substitute for real shaping on proportional Latin.
2. **ASCII words are kept whole.** A page never ends mid-word unless the word is longer than a
   line, in which case it has to be broken.
3. **Offsets are contiguous**: `pages[i].start === pages[i - 1].end`, and joining every
   `page.text` reproduces the normalized source exactly. That is what lets you store an
   annotation as a global offset and keep it valid across re-pagination. See
   [segmentByRanges](./segment).
4. **A box smaller than `minBox` returns no pages.** Paginating during first paint, when the
   container still measures 0, would otherwise spin.

::: tip A word longer than a page
A URL, a base64 blob or a long run of hyphens all count as word characters. When such a run
spans more than a whole page there is no "next page" to defer it to, so it is hard-broken.
Deferring it instead would rewind the cursor to where the page began. The page comes out
empty and the loop never advances: a hang, not just a bad layout.
:::
