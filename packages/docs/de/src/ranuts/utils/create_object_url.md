# createObjectURL

Erzeugt eine Objekt-URL aus einem Blob, einem ArrayBuffer oder einer Response.

## API

### createObjectURL

#### Rückgabe

| Argument          | Beschreibung                                 | Typ       |
| ----------------- | -------------------------------------------- | --------- |
| `Promise<string>` | Promise, das mit der Objekt-URL erfüllt wird | `Promise` |

#### Parameter

| Parameter | Beschreibung    | Typ                                         | Standard     |
| --------- | --------------- | ------------------------------------------- | ------------ |
| `src`     | Die Datenquelle | `Blob \| ArrayBuffer \| Response \| string` | Erforderlich |

## Beispiel

### Grundlegende Verwendung (Blob)

```js
import { createObjectURL } from 'ranuts';

const blob = new Blob(['Hello World'], { type: 'text/plain' });
const url = await createObjectURL(blob);
console.log(url); // 'blob:http://example.com/...'
```

### Aus einem ArrayBuffer erzeugen

```js
import { createObjectURL } from 'ranuts';

const buffer = new ArrayBuffer(8);
const url = await createObjectURL(buffer);
console.log(url); // 'blob:http://example.com/...'
```

### Aus einer Response erzeugen

```js
import { createObjectURL } from 'ranuts';

const response = await fetch('https://example.com/image.jpg');
const url = await createObjectURL(response);
console.log(url); // 'blob:http://example.com/...'
```

### Wenn eine Zeichenkette übergeben wird

```js
import { createObjectURL } from 'ranuts';

// Kommt eine Zeichenkette herein, wird sie unverändert zurückgegeben
const url = await createObjectURL('https://example.com/image.jpg');
console.log(url); // 'https://example.com/image.jpg'
```

### Vorschau eines Bildes

```js
import { createObjectURL } from 'ranuts';

async function previewImage(file) {
  const url = await createObjectURL(file);
  document.getElementById('preview').src = url;
}
```

## Hinweise

1. **Asynchron**: Zurück kommt ein Promise, also mit `await` oder `.then()` behandeln.
2. **Zulässige Typen**: Blob, ArrayBuffer, Response und Zeichenkette.
3. **Speicher**: Die erzeugten URLs musst du selbst mit `URL.revokeObjectURL()` wieder freigeben.
4. **Einsatz**: üblich für Dateivorschauen, für kurzlebige URLs und beim Bearbeiten von Bildern.

## requestUrlToBuffer

Holt den Inhalt einer URL als rohe Bytes über `XMLHttpRequest`. Diese Bytes wandern meist in das obige `createObjectURL` — nämlich dann, wenn du sie prüfen oder umformen musst (eine Magic Number kontrollieren, Audio dekodieren), bevor daraus eine anzeigbare URL wird.

```js
import { requestUrlToBuffer, createObjectURL } from 'ranuts/utils';

const result = await requestUrlToBuffer('/assets/clip.webm', {});
if (result.success) {
  const url = await createObjectURL(new Blob([result.data]));
  video.src = url;
}
```

#### Parameter

| Parameter | Beschreibung                                                                        | Typ                                      | Standard     |
| --------- | ----------------------------------------------------------------------------------- | ---------------------------------------- | ------------ |
| `src`     | Die abzurufende URL                                                                 | `string`                                 | Erforderlich |
| `options` | `method` (standardmäßig `'GET'`) und `responseType` (standardmäßig `'arraybuffer'`) | `Partial<RequestUrlToArraybufferOption>` | Erforderlich |

#### Rückgabe

Ein `Promise`, das bei HTTP 200 mit `{ success: true, data, message: '' }` erfüllt wird und sonst mit `{ success: false, data: status, message }` **abgelehnt** wird. Eine gescheiterte Anfrage ist eine Ablehnung, kein erfülltes `success: false`; ein blankes `.then()` ohne `.catch()` lässt sie also als unbehandelte Ablehnung auftauchen.

::: tip Für neuen Code lieber `fetch`
Dies stammt aus der Zeit, bevor `fetch` überall verfügbar war, und benutzt darunter `XMLHttpRequest`. Brauchst du nicht ausdrücklich XHR (Fortschrittsereignisse beim Hochladen, `abort()`), erledigt `fetch(url).then(r =>
r.arrayBuffer())` dieselbe Arbeit mit der Ablehnungsform, die Promises von Haus aus haben.
:::
