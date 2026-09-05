# removeClassToElement

Entfernt einen CSS-Klassennamen von einem DOM-Element.

## API

### removeClassToElement

#### Rückgabe

Kein Rückgabewert (`void`)

#### Parameter

| Parameter     | Beschreibung                | Typ       | Standard     |
| ------------- | --------------------------- | --------- | ------------ |
| `element`     | DOM-Element                 | `Element` | Erforderlich |
| `removeClass` | Zu entfernender Klassenname | `string`  | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { removeClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
removeClassToElement(element, 'active');
// die Klasse 'active' ist von element verschwunden
```

### Bedingtes Entfernen

```js
import { removeClassToElement } from 'ranuts';

const element = document.querySelector('.button');
if (shouldRemove) {
  removeClassToElement(element, 'highlighted');
}
```

### Sicherheit auf dem Server

```js
import { removeClassToElement } from 'ranuts';

// Wirft in einer Server-Umgebung keinen Fehler, sondern tut still nichts
removeClassToElement(element, 'class-name'); // Auf dem Server: keine Wirkung
```

## Hinweise

1. **Prüfung auf Vorhandensein**: Entfernt die Klasse nur, wenn das Element sie hat.
2. **Sicherheit auf dem Server**: In Server-Umgebungen (kein `document`-Objekt) passiert still nichts, ohne Fehler.
3. **Nutzt classList**: Verwendet das moderne `classList.remove()`, sicherer als direkt an `className` zu hantieren.
