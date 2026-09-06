# TOTP

Ein Generator für zeitbasierte Einmalpasswörter nach dem Standard RFC 6238. Er erzeugt wechselnde Bestätigungscodes, wie sie bei der Zwei-Faktor-Authentifizierung (2FA) üblich sind.

## API

### TOTP.generate

Erzeugt ein zeitbasiertes Einmalpasswort.

#### Rückgabe

| Argument  | Beschreibung                                 | Typ                                |
| --------- | -------------------------------------------- | ---------------------------------- |
| `Object`  | Ein Objekt mit dem OTP und seiner Gültigkeit | `{ otp: string, expires: number }` |
| `otp`     | Das erzeugte Einmalpasswort als Zeichenkette | `string`                           |
| `expires` | Zeitstempel (in ms), zu dem das OTP verfällt | `number`                           |

#### Parameter

| Parameter | Beschreibung                                           | Typ       | Standard     |
| --------- | ------------------------------------------------------ | --------- | ------------ |
| `key`     | Der geheime Schlüssel als Base32-kodierte Zeichenkette | `string`  | Erforderlich |
| `options` | Optionale Einstellungen                                | `Options` | Siehe unten  |

#### Optionen

| Parameter   | Beschreibung                                      | Typ                                                                                                                   | Standard     |
| ----------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| `digits`    | Anzahl der Stellen des OTP                        | `number`                                                                                                              | `6`          |
| `algorithm` | Hash-Verfahren                                    | `'SHA-1' \| 'SHA-224' \| 'SHA-256' \| 'SHA-384' \| 'SHA-512' \| 'SHA3-224' \| 'SHA3-256' \| 'SHA3-384' \| 'SHA3-512'` | `'SHA-1'`    |
| `period`    | Länge des Zeitfensters (Sekunden)                 | `number`                                                                                                              | `30`         |
| `timestamp` | Zeitstempel (in ms), aus dem das OTP erzeugt wird | `number`                                                                                                              | `Date.now()` |

## Beispiel

### Grundlegende Verwendung

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP'; // Base32-kodierter geheimer Schlüssel
const result = TOTP.generate(secret);

console.log(result.otp); // etwa: '341128'
console.log(result.expires); // etwa: 1465324730000 (Zeitstempel)
```

### Die Stellenzahl ändern

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { digits: 8 });

console.log(result.otp); // etwa: '43341128' (8 Stellen)
```

### Das Zeitfenster ändern

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { period: 60 }); // Fenster von 60 Sekunden

console.log(result.otp);
console.log(result.expires);
```

### Ein anderes Hash-Verfahren wählen

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { algorithm: 'SHA-512' });

console.log(result.otp);
```

### Ein OTP zu einem bestimmten Zeitpunkt erzeugen

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const timestamp = 1465324707000; // Zeitstempel des 08.06.2016
const result = TOTP.generate(secret, { timestamp });

console.log(result.otp); // OTP, erzeugt aus dem angegebenen Zeitstempel
```

### Mehrere Optionen zusammen

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, {
  digits: 8,
  algorithm: 'SHA-256',
  period: 60,
});

console.log(result.otp);
console.log(result.expires);
```

## Hinweise

1. **Format des Schlüssels**: Der Schlüssel muss eine Base32-kodierte Zeichenkette sein. Enthält er unzulässige Zeichen, wird der Fehler `'Invalid base32 character in key'` geworfen.

2. **Gleichlaufende Uhren**: TOTP hängt daran, dass die Uhren gleich gehen. Vergewissere dich, dass die Zeit auf Client und Server übereinstimmt, sonst kann die Prüfung fehlschlagen.

3. **Gültigkeit**: `expires` liefert den Zeitstempel, zu dem das aktuelle Zeitfenster endet. Beim Prüfen lässt man üblicherweise ein Fenster Spielraum (etwa ±1 Periode).

4. **Sicherheit**: Schlüssel gehören sicher verwahrt und nicht fest in den Code geschrieben. Nimm dafür Umgebungsvariablen oder eine sichere Schlüsselverwaltung.
