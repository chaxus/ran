# convertImageToBase64

Wandelt eine Bilddatei in eine Base64-kodierte Zeichenkette um.

## API

### convertImageToBase64

#### Rückgabe

| Argument | Beschreibung | Typ |
| ------------------------------------- | -------------------------------------- | --------- |
| `Promise<convertImageToBase64Return>` | Promise, das mit dem Ergebnisobjekt erfüllt wird | `Promise` |

#### convertImageToBase64Return

| Eigenschaft | Beschreibung | Typ |
| --------- | ------------------ | ------------------------------- |
| `success` | Ob es geklappt hat | `boolean` |
| `data` | Die Base64-Daten | `string \| ArrayBuffer \| null` |
| `message` | Fehlermeldung | `string` |

#### Parameter

| Parameter | Beschreibung | Typ | Standard |
| --------- | ----------------- | ------ | -------- |
| `file` | Das Bilddatei-Objekt | `File` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { convertImageToBase64 } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await convertImageToBase64(file);
      if (result.success) {
        console.log('Base64:', result.data);
        // Taugt unverändert für das src einer img
        document.getElementById('preview').src = result.data;
      }
    } catch (error) {
      console.error('Umwandlung fehlgeschlagen:', error);
    }
  }
});
```

### Vor dem Hochladen ansehen

```js
import { convertImageToBase64 } from 'ranuts';

async function previewImage(file) {
  const result = await convertImageToBase64(file);
  if (result.success) {
    return result.data; // data:image/jpeg;base64,...
  }
  throw new Error('Die Umwandlung des Bildes ist fehlgeschlagen');
}
```

### Fehlerbehandlung

```js
import { convertImageToBase64 } from 'ranuts';

try {
  const result = await convertImageToBase64(file);
  if (!result.success) {
    console.error('Fehler:', result.message);
  }
} catch (error) {
  console.error('Ausnahme:', error);
}
```

## Hinweise

1. **Asynchron**: Zurück kommt ein Promise, also mit `await` oder `.then()` behandeln.

2. **Dateitypen**: alle Bildformate, die der Browser kennt (JPEG, PNG, GIF, WebP und weitere).

3. **Form der Daten**: Das zurückgegebene `data` ist eine vollständige Data-URL (`data:image/jpeg;base64,...`) und passt unverändert ins `src`-Attribut eines `img`-Tags.

4. **Fehler**: Scheitert die Umwandlung, wird das Promise abgelehnt; fang das ab.

5. **Einsatz**: üblich für Bildvorschauen, für die Bearbeitung vor dem Hochladen und fürs lokale Speichern.
