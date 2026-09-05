# getStatus / status

Eine Nachschlagetabelle, die HTTP-Statuscodes und ihre Meldungen zusammenbringt, dazu der Helfer `getStatus`, der in beide Richtungen funktioniert: dieselben Daten, die Nodes eigenes `http.STATUS_CODES` liefert, nur eben auch für den Browser verpackt.

## Verwendung

```ts
import { getStatus, status } from 'ranuts/utils';

getStatus(404); // 'Not Found'
getStatus('404'); // 'Not Found' — Zahlen als Zeichenkette werden zuerst als Code gelesen
getStatus('not found'); // 404 — sonst wird nach der Meldung gesucht, ohne auf Groß-/Kleinschreibung zu achten

status.redirect[302]; // true
status.empty[204]; // true
status.retry[503]; // true
```

## API

### `getStatus(code)`

#### Parameter

| Parameter | Beschreibung                                                       | Typ                | Standard     |
| --------- | ------------------------------------------------------------------ | ------------------ | ------------ |
| `code`    | Ein Statuscode, eine Zahl als Zeichenkette oder eine Statusmeldung | `number \| string` | Erforderlich |

#### Rückgabe

`number | string`. Übergib eine `number` und du bekommst die **Meldung**; übergib einen `string` und du bekommst den **Code** (eine Zahl als Zeichenkette wie `'404'` wird zuerst als Code gelesen und nur dann als Meldung gesucht, wenn es kein bekannter Code ist). Passt die Eingabe zu keinem von beiden, wird geworfen.

### `status`

| Feld       | Beschreibung                                                              | Typ                    |
| ---------- | ------------------------------------------------------------------------- | ---------------------- |
| `message`  | Code → Meldung                                                            | `Map<number, string>`  |
| `code`     | Kleingeschriebene Meldung → Code                                          | `Map<string, number>`  |
| `codes`    | Alle bekannten Codes                                                      | `number[]`             |
| `redirect` | Codes, die weiterleiten (`300`, `301`, `302`, `303`, `305`, `307`, `308`) | `Record<number, true>` |
| `empty`    | Codes ohne Rumpf (`204`, `205`, `304`)                                    | `Record<number, true>` |
| `retry`    | Codes, bei denen sich ein neuer Versuch lohnt (`502`, `503`, `504`)       | `Record<number, true>` |

## Hinweise

1. **Bei unbekanntem Code oder unbekannter Meldung wirft `getStatus`**: `TypeError`, wenn das Argument weder `number` noch `string` ist, sonst `Error`. Pack es in `try`/`catch` (oder prüfe vorher `status.codes.includes(n)`), wenn die Eingabe nicht garantiert gültig ist, etwa ein Statuscode von der Leitung.
2. **`status.redirect`, `empty` und `retry` sind gewöhnliche Objekte, keine `Set`s**: prüfe die Zugehörigkeit mit `status.retry[code]`, nicht mit `.has()`.
3. Läuft im Browser wie in Node (`ranuts/utils`), sodass auf dem Client dieselbe Zuordnung von Code und Meldung zur Verfügung steht, die ein serverseitiger `ranuts/node`-Handler benutzen würde.
