# queryFlag / isInIframe

Liest ein boolesches Flag aus der URL und sagt dir, ob die Seite eingebettet ist: die beiden Prüfungen hinter `?embed`, `?readonly` und `?debug`.

## API

| Funktion               | Beschreibung                                                              |
| ---------------------- | ------------------------------------------------------------------------- |
| `queryFlag(key, url?)` | Ob sich ein Abfrageparameter als wahr liest                               |
| `isInIframe()`         | Ob diese Seite in einem iframe läuft; beim serverseitigen Rendern `false` |

### `queryFlag`

| Parameter | Beschreibung                       | Typ      | Standard         |
| --------- | ---------------------------------- | -------- | ---------------- |
| `key`     | Name des Parameters                | `string` | Erforderlich     |
| `url`     | Vollständige URL oder Query-String | `string` | Der aktuelle Ort |

Wahr bei `?k`, `?k=`, `?k=1` und `?k=true` (Groß- und Kleinschreibung egal). Falsch bei allem anderen, auch bei einem fehlenden Parameter und bei einem ausdrücklichen `?k=false`.

## Beispiel

### Ein Flag lesen

```js
import { queryFlag } from 'ranuts';

queryFlag('embed', '?embed'); // true  ← die übliche Schreibweise
queryFlag('embed', '?embed=1'); // true
queryFlag('embed', '?embed=true'); // true
queryFlag('embed', '?embed=false'); // false
queryFlag('embed', '?lang=en'); // false
```

### Den eingebetteten Modus erkennen

```js
import { queryFlag, isInIframe } from 'ranuts';

// Eingebettet, wenn die Seite in einem Rahmen steckt oder der Gastgeber es ausdrücklich verlangt hat.
const embedded = isInIframe() || queryFlag('embed') || queryFlag('embedded');

if (embedded) {
  document.body.classList.add('embed-mode');
}
```

### In fremden Seiten nicht messen

```js
import { isInIframe } from 'ranuts';

// Hier zu messen würde uns die Besucher der gastgebenden Seite zuschreiben.
if (!isInIframe()) initAnalytics();
```

### Vorschau nur zum Lesen

```js
import { queryFlag } from 'ranuts';

openDocument(file, { readonly: queryFlag('readonly') });
```

## Hinweise

1. **Üblich ist das Flag ohne Wert.** `?embed` trägt keinen Wert, also ist `getQuery(url).embed` gleich `''` (falsy), und eine bloße Wahrheitsprüfung übergeht stillschweigend genau die häufigste Form. Dafür gibt es `queryFlag`.

2. **`?k=false` ist falsch.** Eine ausdrückliche Verneinung wird beachtet, statt sie als „steht da, also an“ zu lesen.

3. **`isInIframe` ist abgesichert.** `window.parent` zu lesen kann in manchen Engines über Ursprungsgrenzen hinweg werfen; ein unlesbares Elternfenster gilt als eingebettet, denn genau das bedeutet es.

4. **Beide sind serverseitig sicher.** Ohne `window` ist `isInIframe` gleich `false`, und `queryFlag` ist `false`, solange keine `url` übergeben wird — mit einer URL funktionieren also beide auch in Build-Skripten.
