# md5

MD5-Hashfunktion: wandelt eine Zeichenkette in ihren MD5-Hashwert um (eine hexadezimale Zeichenkette).

## API

### md5

#### Rückgabe

| Argument | Beschreibung                                 | Typ      |
| -------- | -------------------------------------------- | -------- |
| `string` | Der MD5-Hashwert (hexadezimale Zeichenkette) | `string` |

#### Parameter

| Parameter | Beschreibung             | Typ      | Standard     |
| --------- | ------------------------ | -------- | ------------ |
| `str`     | Zu hashende Zeichenkette | `string` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { md5 } from 'ranuts';

const hash = md5('hello world');
console.log(hash); // '5eb63bbbe01eeed093cb22bb8f5acdc3'
```

### Ein Passwort hashen

```js
import { md5 } from 'ranuts';

const password = 'myPassword123';
const hashedPassword = md5(password);
console.log(hashedPassword);
```

### Den Inhalt einer Datei hashen

```js
import { md5 } from 'ranuts';

const fileContent = 'hier der Inhalt der Datei';
const fileHash = md5(fileContent);
console.log('Hash der Datei:', fileHash);
```

### Wenn keine Zeichenkette übergeben wird

```js
import { md5 } from 'ranuts';

// Ist die Eingabe keine Zeichenkette, kommt eine zufällige Zeichenkette zurück
const result = md5(123);
console.log(result); // Zufällige Zeichenkette
```

## Hinweise

1. **Sicherheit**: MD5 gilt als unsicher und gehört weder an Passwörter noch an sonst etwas Heikles. Nimm besser ein solideres Verfahren wie SHA-256.
2. **Eingabetyp**: Ist die Eingabe keine Zeichenkette, kommt eine zufällige Zeichenkette zurück.
3. **Ausgabeformat**: eine hexadezimale Zeichenkette aus 32 Zeichen, in Kleinbuchstaben.
4. **Geschwindigkeit**: Bei großen Datenmengen kann die Berechnung dauern; rechne sie deshalb besser asynchron.
