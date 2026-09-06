# isImageSize

Prüft, ob die Maße einer Bilddatei den geforderten entsprechen.

## API

### isImageSize

#### Rückgabe

| Argument           | Beschreibung                                        | Typ       |
| ------------------ | --------------------------------------------------- | --------- |
| `Promise<boolean>` | Promise, das damit erfüllt wird, ob die Maße passen | `Promise` |

#### Parameter

| Parameter | Beschreibung                | Typ      | Standard     |
| --------- | --------------------------- | -------- | ------------ |
| `file`    | Das Bilddatei-Objekt        | `File`   | Erforderlich |
| `width`   | Erwartete Breite (optional) | `number` | Optional     |
| `height`  | Erwartete Höhe (optional)   | `number` | Optional     |

## Beispiel

### Grundlegende Verwendung

```js
import { isImageSize } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      // Prüfen, ob die Breite 800 beträgt
      const isValid = await isImageSize(file, 800);
      if (isValid) {
        console.log('Die Bildbreite passt');
      } else {
        console.log('Die Bildbreite passt nicht');
      }
    } catch (error) {
      console.error('Die Prüfung ist fehlgeschlagen:', error);
    }
  }
});
```

### Breite und Höhe prüfen

```js
import { isImageSize } from 'ranuts';

async function validateImage(file) {
  // Prüfen, ob es 800x600 ist
  const isValid = await isImageSize(file, 800, 600);
  return isValid;
}
```

### Nur die Höhe prüfen

```js
import { isImageSize } from 'ranuts';

const isValid = await isImageSize(file, undefined, 600);
// Prüft nur, ob die Höhe 600 beträgt
```

### Vor dem Hochladen prüfen

```js
import { isImageSize } from 'ranuts';

async function handleFileUpload(file) {
  const isValid = await isImageSize(file, 1920, 1080);
  if (!isValid) {
    alert('Das Bild muss 1920x1080 messen');
    return;
  }
  // Mit dem Hochladen weitermachen
}
```

## Verhalten

1. **Gibst du `width` und `height` an, müssen beide stimmen.** Gibst du keines von beiden an, wird nur geprüft, ob sich die Datei überhaupt als Bild dekodieren lässt.
2. **Scheitert das Dekodieren, wird abgelehnt** (beschädigte Datei, kein Bild), statt das Promise hängen zu lassen.
3. **Die Objekt-URL wird immer freigegeben**, bei Erfolg wie bei Misserfolg — viele Dateien zu prüfen hinterlässt also keine Blob-URLs, die bis zum Verlassen der Seite liegen bleiben.
4. **Nur im Browser**: Beim serverseitigen Rendern wird mit einem deutlichen Fehler abgelehnt.

::: warning In 0.3 behoben
Früher überschrieb die zweite Bedingung die erste, sodass `width` stillschweigend übergangen wurde, wenn man `width` und `height` zugleich übergab; es gab kein `onerror`, weshalb eine beschädigte Datei das Promise für immer hängen ließ; und die Absicherung fürs serverseitige Rendern rief `reject` auf, ohne zurückzukehren, fasste danach `window` an und warf einen `ReferenceError`.
:::

## Hinweise

1. **Asynchron**: Zurück kommt ein Promise, also mit `await` oder `.then()` behandeln.

2. **Zu den Argumenten**:
   - Nur `width` übergeben: es wird nur die Breite geprüft
   - Nur `height` übergeben: es wird nur die Höhe geprüft
   - Beide übergeben: beide müssen stimmen

3. **Server-Umgebung**: In Server-Umgebungen (kein `window`-Objekt) wird abgelehnt.

4. **Aufräumen**: Die erzeugte Objekt-URL räumt die Funktion intern selbst weg; von Hand ist nichts zu tun.

5. **Einsatz**: üblich, um Maße vor dem Hochladen zu prüfen, die Größe eines Profilbilds zu kontrollieren und Ähnliches.
