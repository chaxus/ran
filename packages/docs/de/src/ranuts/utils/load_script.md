# loadScript

Fügt ein einzelnes `<script>` zur Laufzeit ein, ohne denselben Inhalt zweimal zu laden.

Der Unterschied zu [`scriptOnLoad`](/de/src/ranuts/utils/script_on_load): Jenes lädt **einen Stapel** URLs auf einmal (und schickt `.css` über ein `<link>`-Tag), während dieses **ein einzelnes** Skript behandelt, einen Inline-Rumpf annimmt und dafür sorgt, dass dasselbe Skript nur ein einziges Mal ausgewertet wird — ein zweimal eingefügtes Fremd-SDK bedeutet meist, dass auch seine Initialisierung zweimal gelaufen ist.

Der Schlüssel dafür ist der md5 von `type + content`, sodass eine URL und ein gleichnamiges Inline-Skript nicht verwechselt werden können.

## Verwendung

```ts
import { loadScript } from 'ranuts/utils';

// Externes Skript
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });

// Inline-Skript
await loadScript({ type: 'content', content: 'window.__ready = true;' });

// Der zweite Aufruf tut nichts — bereits ausgewertet
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });
```

## API

### loadScript

#### Parameter

| Parameter | Beschreibung                                                   | Typ                  | Standard     |
| --------- | -------------------------------------------------------------- | -------------------- | ------------ |
| `type`    | `'url'` lädt über `src`; `'content'` bettet den Skripttext ein | `'url' \| 'content'` | Erforderlich |
| `content` | Die URL bei `type: 'url'`, der Skriptrumpf bei `'content'`     | `string`             | Erforderlich |

#### Rückgabe

| Argument  | Beschreibung                                             | Typ                             |
| --------- | -------------------------------------------------------- | ------------------------------- |
| `promise` | Wird mit `{ success: true }` erfüllt, sobald ausgewertet | `Promise<{ success: boolean }>` |

Wird mit `{ success: false, error }` abgelehnt, wenn ein externes Skript nicht lädt.

## Hinweise

Ein **Inline**-Skript wird in dem Moment, in dem es eingehängt wird, synchron ausgewertet und feuert danach nie ein `load`-Ereignis. Nur auf `onload` zu warten ließe das Promise in einem echten Browser für immer hängen; bei `type: 'content'` wird deshalb erfüllt, sobald `append` zurückkehrt. (jsdom feuert für Inline-Skripte _sehr wohl_ ein load-Ereignis, weshalb ein Unit-Test den Unterschied nicht bemerken würde.)
