# zip

Read and patch ZIP archives with no dependencies, using the platform's own DEFLATE.

ZIP is the container behind OOXML (`.docx` / `.xlsx` / `.pptx`), EPUB, ODF and browser
extensions. "Pull one file out of this archive" and "rewrite one file inside this archive"
come up constantly, and a full ZIP library is a large dependency for that. Everything those
two tasks need is the central directory plus DEFLATE, and DEFLATE now ships in every
browser as `DecompressionStream`.

## API

| Function                           | Description                                                        |
| ---------------------------------- | ------------------------------------------------------------------ |
| `readZipEntries(bytes)`            | Parse the central directory into `ZipEntry[]`; `[]` when not a ZIP |
| `readZipEntry(bytes, nameOrEntry)` | Decompress one entry; `null` when missing or unsupported           |
| `zipHasEntry(bytes, name)`         | Whether an entry with that exact name exists                       |
| `rewriteZip(bytes, options)`       | Rebuild the archive with entries replaced and/or new ones appended |
| `createZip(files)`                 | Build an archive from scratch, every entry STORED                  |
| `crc32(data)`                      | IEEE CRC32, the checksum ZIP stores per entry                      |
| `inflateRaw(data)`                 | Decompress raw DEFLATE bytes (no zlib/gzip wrapper)                |

### `rewriteZip` options

| Option      | Description                                                                    | Default    |
| ----------- | ------------------------------------------------------------------------------ | ---------- |
| `filter`    | Which entries to decompress and pass to `transform`                            | every file |
| `transform` | `(data, entry) => Uint8Array \| string \| null`; `null` leaves the entry alone | —          |
| `inject`    | Brand-new entries to append: `{ name, data }[]`                                | —          |

### `ZipEntry`

| Field                                       | Description                                       |
| ------------------------------------------- | ------------------------------------------------- |
| `name`                                      | Path inside the archive, e.g. `word/document.xml` |
| `compression`                               | `ZIP_STORED` (0) or `ZIP_DEFLATE` (8)             |
| `crc`, `compressedSize`, `uncompressedSize` | As recorded in the central directory              |
| `modTime`, `modDate`                        | MS-DOS packed timestamp, preserved on rewrite     |
| `directory`                                 | Whether the name ends in `/`                      |
| `dataStart`                                 | Offset of the compressed bytes in the source      |

## Example

### Read one file out of a `.docx`

```js
import { readZipEntry } from 'ranuts';

const bytes = new Uint8Array(await file.arrayBuffer());
const xml = await readZipEntry(bytes, 'word/document.xml');
if (xml) {
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(xml), 'text/xml');
}
```

### List what is inside

```js
import { readZipEntries } from 'ranuts';

for (const entry of readZipEntries(bytes)) {
  if (entry.directory) continue;
  console.log(entry.name, entry.uncompressedSize);
}
```

### Patch every XML part and add a file

```js
import { rewriteZip } from 'ranuts';

const patched = await rewriteZip(bytes, {
  filter: (entry) => entry.name.endsWith('.xml'),
  transform: (data) => new TextDecoder().decode(data).replace(/&amp;#10;/g, '&#10;'),
  inject: [{ name: 'meta.json', data: JSON.stringify({ patched: true }) }],
});
```

### Extract embedded media as object URLs

```js
import { readZipEntries, readZipEntry, getMime } from 'ranuts';

const media = {};
for (const entry of readZipEntries(bytes)) {
  if (!entry.name.startsWith('word/media/')) continue;
  const data = await readZipEntry(bytes, entry);
  if (!data) continue;
  const ext = entry.name.split('.').pop();
  media[entry.name] = URL.createObjectURL(new Blob([data], { type: getMime(`.${ext}`) }));
}
```

### Build a container

```js
import { createZip } from 'ranuts';

const zip = createZip([
  { name: 'mimetype', data: 'application/epub+zip' },
  { name: 'META-INF/container.xml', data: containerXml },
]);
```

## Notes

1. **Reads STORED and DEFLATE.** Other compression methods appear in `readZipEntries` but
   `readZipEntry` returns `null` for them rather than guessing.

2. **Rewrites are uncompressed.** Replaced and injected entries are written STORED, so the
   output is larger than the input. Untouched entries keep their original compressed bytes
   copied verbatim. That is the right trade for patch-and-hand-off, the wrong one for
   archiving.

3. **`rewriteZip` returns the original array when nothing changed** — including when a
   transform returns identical bytes. The no-op path costs nothing and the result can be
   compared with `===`.

4. **Sizes come from the central directory, never from local headers.** Archives written by
   a streaming writer set general-purpose bit 3 and leave zeros in the local header, filling
   the real values into a data descriptor _after_ the compressed bytes. Trusting local
   headers is the most common way a hand-rolled ZIP reader breaks on real files; `rewriteZip`
   also writes fresh local headers and clears that flag, so its output is readable by strict
   parsers.

5. **A failing transform keeps the entry.** If `transform` throws, or the entry uses an
   unsupported method, the original content is copied through — a rewrite must never lose
   data it failed to understand.

6. **No ZIP64, no encryption, no multi-disk.** Archives over 4 GiB or with more than 65535
   entries are out of scope. `readZipEntries` returns `[]` for anything it cannot parse
   rather than throwing, because the usual caller is inspecting a user-supplied file.

7. **`inflateRaw` needs `DecompressionStream`**: available in all current browsers and in
   Node 18+. It throws where the API is missing.
