# getExtensions

Liefert das Array der Dateiendungen, die zu einem MIME-Typ gehören.

## API

### getExtensions

#### Rückgabe

| Argument | Beschreibung | Typ |
| -------- | ---------------------------------- | ---------- |
| `Array` | Array der Dateiendungen (ohne Punkt) | `string[]` |

#### Parameter

| Parameter | Beschreibung | Typ | Standard |
| ---------- | ----------- | -------- | -------- |
| `mimeType` | MIME-Typ | `string` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { getExtensions } from 'ranuts';

const exts = getExtensions('image/jpeg');
console.log(exts); // ['jpeg', 'jpg', 'jpe']
```

### Alle Endungen abrufen

```js
import { getExtensions } from 'ranuts';

const jsExts = getExtensions('application/javascript');
console.log(jsExts); // ['js', 'jsx', 'ts', 'tsx']
```

### Dateityp prüfen

```js
import { getExtensions } from 'ranuts';

function isValidImageFile(filename, mimeType) {
  const exts = getExtensions(mimeType);
  const fileExt = filename.split('.').pop();
  return exts.includes(fileExt);
}

console.log(isValidImageFile('photo.jpg', 'image/jpeg')); // true
```

## Hinweise

1. **Form der Rückgabe**: Die Endungen enthalten keinen Punkt (`.`), also `'jpg'` und nicht `'.jpg'`.
2. **Mehrere Endungen**: Ein MIME-Typ kann zu mehreren Endungen gehören; alle passenden kommen zurück.
3. **Leeres Array**: Gibt es den MIME-Typ nicht, kommt ein leeres Array zurück.
4. **Einsatz**: üblich beim Prüfen von Dateitypen, beim Kontrollieren von Uploads und Ähnlichem.
