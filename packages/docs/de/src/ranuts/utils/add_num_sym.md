# addNumSym

Setzt einer Zahl ihr Vorzeichen (+ oder -) voran.

## API

### addNumSym

#### Rückgabe

| Argument | Beschreibung                              | Typ      |
| -------- | ----------------------------------------- | -------- |
| `string` | Die Zahl als Zeichenkette, mit Vorzeichen | `string` |

#### Parameter

| Parameter | Beschreibung                                   | Typ                | Standard     |
| --------- | ---------------------------------------------- | ------------------ | ------------ |
| `value`   | Zu verarbeitende Zahl oder Zeichenkette        | `string \| number` | Erforderlich |
| `flag`    | Vorzeichen-Flag (optional, um es zu erzwingen) | `string \| number` | Optional     |

## Beispiel

### Grundlegende Verwendung

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100)); // '+100'
console.log(addNumSym(-50)); // '-50'
console.log(addNumSym(0)); // '0'
```

### Eingabe als Zeichenkette

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('100')); // '+100'
console.log(addNumSym('-50')); // '-50' (hat schon ein Vorzeichen, bleibt unverändert)
```

### Das Vorzeichen erzwingen

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100, 1)); // '+100' (flag > 0)
console.log(addNumSym(100, -1)); // '100' (flag <= 0, kein + gesetzt)
console.log(addNumSym(100, 0)); // '100'
```

### Wenn schon ein Vorzeichen da ist

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('+100')); // '+100' (hat schon ein Vorzeichen, bleibt unverändert)
console.log(addNumSym('-50')); // '-50' (hat schon ein Vorzeichen, bleibt unverändert)
```

## Hinweise

1. **Regeln fürs Vorzeichen**:
   - Positive Zahlen bekommen ein `+`
   - Negative behalten ihr `-`
   - Die Null bekommt keines

2. **Schon vorhandenes Vorzeichen**: Beginnt die Zeichenkette bereits mit `+` oder `-`, kommt kein zweites dazu.

3. **Erzwingen**: Über das Argument `flag` steuerst du, ob ein `+` gesetzt wird (bei `flag > 0`).

4. **Einsatz**: üblich bei Gewinnen und Verlusten, Veränderungen und überall dort, wo das Vorzeichen sichtbar sein muss.
