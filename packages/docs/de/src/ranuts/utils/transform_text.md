# transformText

Wandelt einen `ArrayBuffer` in Text um: erkennt die Kodierung und dekodiert.

## API

### transformText

#### Rückgabe

| Argument                     | Beschreibung                      | Typ                          |
| ---------------------------- | --------------------------------- | ---------------------------- |
| `TransformText \| undefined` | Das Ergebnisobjekt oder undefined | `TransformText \| undefined` |

#### TransformText

| Eigenschaft | Beschreibung           | Typ      |
| ----------- | ---------------------- | -------- |
| `encoding`  | Die erkannte Kodierung | `string` |
| `content`   | Der dekodierte Text    | `string` |

#### Parameter

| Parameter | Beschreibung          | Typ                     | Standard     |
| --------- | --------------------- | ----------------------- | ------------ |
| `content` | Umzuwandelnder Inhalt | `string \| ArrayBuffer` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { transformText } from 'ranuts';

const arrayBuffer = new TextEncoder().encode('Hello World').buffer;
const result = transformText(arrayBuffer);
if (result) {
  console.log('Kodierung:', result.encoding);
  console.log('Inhalt:', result.content); // 'Hello World'
}
```

### Eine Datei verarbeiten

```js
import { transformText } from 'ranuts';

async function readTextFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = transformText(arrayBuffer);
  if (result) {
    return result.content;
  }
  return null;
}
```

### Kodierung automatisch erkennen

```js
import { transformText } from 'ranuts';

// Erkennt die Kodierung und dekodiert
const result = transformText(arrayBuffer);
if (result) {
  console.log(`Mit der Kodierung ${result.encoding} dekodiert`);
  console.log(result.content);
}
```

## Hinweise

1. **Erkennt selbst**: nutzt `jschardet`, um die Kodierung zu bestimmen.
2. **Nur `ArrayBuffer`**: bisher wird nur `ArrayBuffer` unterstützt; bei einer Zeichenkette kommt eine Warnung.
3. **Wann etwas zurückkommt**: nur, wenn die Kodierung erkannt wurde und das Dekodieren gelingt, sonst `undefined`.
4. **Einsatz**: üblich beim Lesen von Dateien, beim Dekodieren von Text und beim Umwandeln von Kodierungen.
