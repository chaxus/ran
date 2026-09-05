# addClassToElement

Fügt einem DOM-Element einen CSS-Klassennamen hinzu.

## API

### addClassToElement

#### Rückgabe

Kein Rückgabewert (`void`)

#### Parameter

| Parameter  | Beschreibung                | Typ       | Standard     |
| ---------- | --------------------------- | --------- | ------------ |
| `element`  | DOM-Element                 | `Element` | Erforderlich |
| `addClass` | Hinzuzufügender Klassenname | `string`  | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { addClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
addClassToElement(element, 'active');
// element trägt jetzt die Klasse 'active'
```

### Doppeltes Hinzufügen vermeiden

```js
import { addClassToElement } from 'ranuts';

const element = document.querySelector('.button');
addClassToElement(element, 'highlighted');
addClassToElement(element, 'highlighted'); // Wird nicht doppelt hinzugefügt
```

### Sicherheit auf dem Server

```js
import { addClassToElement } from 'ranuts';

// Wirft in einer Server-Umgebung keinen Fehler, sondern tut still nichts
addClassToElement(element, 'class-name'); // Auf dem Server: keine Wirkung
```

## Hinweise

1. **Prüfung auf Dopplung**: Hat das Element die Klasse schon, wird sie nicht erneut hinzugefügt.
2. **Sicherheit auf dem Server**: In Server-Umgebungen (kein `document`-Objekt) passiert still nichts, ohne Fehler.
3. **Nutzt classList**: Verwendet das moderne `classList.add()`, sicherer als direkt an `className` zu hantieren.
