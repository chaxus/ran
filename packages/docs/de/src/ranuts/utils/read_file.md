# readFileAs*

Hüllen mit Promises um den `FileReader`.

| Funktion                          | Löst auf zu   | Wofür                                                       |
| --------------------------------- | ------------- | ----------------------------------------------------------- |
| `readFileAsArrayBuffer(blob)`     | `ArrayBuffer` | Binärverarbeitung                                           |
| `readFileAsUint8Array(blob)`      | `Uint8Array`  | Für `checkEncoding` / `arrayBufferToString`                 |
| `readFileAsText(blob, encoding?)` | `string`      | Textdateien; ist die Kodierung unbekannt, erst erschnüffeln |
| `readFileAsDataURL(blob)`         | `string`      | Bildvorschauen                                              |

## Beispiel

```js
import { readFileAsUint8Array, arrayBufferToString } from 'ranuts';

input.addEventListener('change', async (e) => {
  const bytes = await readFileAsUint8Array(e.target.files[0]);
  const text = arrayBufferToString(bytes); // die Kodierung wird erschnüffelt, GBK/Big5 inklusive
});
```

## Hinweise

1. **Alle drei Ausgänge sind verdrahtet**: `onload`, `onerror` und `onabort`. `onabort` zu vergessen ist der klassische Weg, ein Promise für immer offen zu lassen, wenn jemand den Dateidialog abbricht.
2. **Lehnt mit einem klaren Fehler ab**, wo es keinen `FileReader` gibt (Node, manche Worker-Kontexte).
3. **Rufe nie `new TextDecoder().decode()` auf eine Datei unbekannter Herkunft auf**: Das setzt UTF-8 voraus und macht aus GBK/Big5 Zeichensalat. Nimm `arrayBufferToString`, das vorher erschnüffelt.
