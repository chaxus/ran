# buildOffsets / indexForOffset / segmentByRanges

Coordinate maths for "content split into chunks, annotations stored against the joined text".
Store a highlight as a **global offset** rather than "chunk N, character M" and it survives
re-chunking: change the font size, the page width or the shard size, and the annotation still
points at the same words.

## API

### buildOffsets(lengths)

Prefix sums: `offsets[i]` is the total length of everything before chunk `i`.

```js
buildOffsets([3, 5, 2]); // [0, 3, 8]
```

### indexForOffset(offsets, offset)

Binary search for the chunk a global offset falls in. Out-of-range offsets are clamped to
`[0, offsets.length - 1]`, and an empty array returns `0`. The result is always safe to index with.

### segmentByRanges(text, chunkStart, ranges)

Split one chunk into plain and matched segments for piecewise rendering (highlights, search
hits, diff colouring).

| Parameter    | Description                                     | Type                        |
| ------------ | ----------------------------------------------- | --------------------------- |
| `text`       | This chunk's text                               | `string`                    |
| `chunkStart` | This chunk's global start offset                | `number`                    |
| `ranges`     | `{ start, end, value }[]` in global coordinates | `readonly OffsetRange<T>[]` |

Returns `{ text, start, end, value }[]`, where `value` is `null` for uncovered text. Joining
the segments always reproduces `text`, and there is always at least one segment.

## Example

```js
import { buildOffsets, indexForOffset, segmentByRanges } from 'ranuts';

const offsets = buildOffsets(pages.map((p) => p.text.length));

// Which page does this note start on?
const pageIndex = indexForOffset(offsets, note.start);

// Render one page with its highlights
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

## Notes

1. **Ranges are half-open** `[start, end)`.
2. **Overlaps are resolved, not merged.** Ranges are consumed in order; a later range only
   takes the part that is not already covered, and one fully swallowed by an earlier range is
   dropped. Cut points stay strictly increasing, so no segment is empty-by-accident or duplicated.
3. **Ranges outside the chunk are ignored**, and partially overlapping ones are clipped, so you
   can pass the whole annotation list to every chunk.
