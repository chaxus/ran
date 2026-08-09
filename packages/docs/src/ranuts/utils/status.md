# getStatus / status

An HTTP status code ↔ message lookup table, plus a two-way `getStatus` helper — the same
data Node's own `http.STATUS_CODES` provides, packaged for use in the browser too.

## Usage

```ts
import { getStatus, status } from 'ranuts/utils';

getStatus(404); // 'Not Found'
getStatus('404'); // 'Not Found' — numeric strings are parsed first
getStatus('not found'); // 404 — falls back to a message lookup, case-insensitive

status.redirect[302]; // true
status.empty[204]; // true
status.retry[503]; // true
```

## API

### `getStatus(code)`

#### Parameters

| Parameter | Description                                             | Type               | Default  |
| --------- | ---------------------------------------------------------- | -------------------- | -------- |
| `code`    | A status code, a numeric string, or a status message       | `number \| string`  | Required |

#### Return

`number | string` — pass a `number` and get the **message** back; pass a `string` and get
the **code** back (a numeric string like `'404'` is parsed as a code first, and only falls
back to a message lookup if it isn't a known code). Throws if the input matches neither.

### `status`

| Field      | Description                                                        | Type                     |
| ---------- | --------------------------------------------------------------------- | -------------------------- |
| `message`  | Code → message                                                       | `Map<number, string>`    |
| `code`     | Lower-cased message → code                                           | `Map<string, number>`    |
| `codes`    | Every known code                                                      | `number[]`                |
| `redirect` | Codes that redirect (`300`, `301`, `302`, `303`, `305`, `307`, `308`) | `Record<number, true>`   |
| `empty`    | Codes with no body (`204`, `205`, `304`)                              | `Record<number, true>`   |
| `retry`    | Codes worth retrying (`502`, `503`, `504`)                            | `Record<number, true>`   |

## Notes

1. **`getStatus` throws on an unknown code or message** — `TypeError` for a non-`number`/
   `string` argument, `Error` otherwise. Wrap it in `try`/`catch` (or check `status.codes.includes(n)`
   first) when the input isn't guaranteed valid, e.g. a status code read off the wire.
2. **`status.redirect` / `empty` / `retry` are plain objects, not `Set`s** — check membership
   with `status.retry[code]`, not `.has()`.
3. Runs in both browser and Node (`ranuts/utils`), so it's usable on the client for the same
   code↔message mapping a server-side `ranuts/node` handler would use.
