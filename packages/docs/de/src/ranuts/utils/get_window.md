# getWindow

Liefert die Größe des sichtbaren Fensters, browserübergreifend.

## API

### getWindow

#### Rückgabe

| Argument      | Beschreibung                    | Typ           |
| ------------- | ------------------------------- | ------------- |
| `ClientRatio` | Das Objekt mit der Fenstergröße | `ClientRatio` |

#### ClientRatio

| Eigenschaft | Beschreibung                | Typ      |
| ----------- | --------------------------- | -------- |
| `width`     | Breite des Fensters (Pixel) | `number` |
| `height`    | Höhe des Fensters (Pixel)   | `number` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { getWindow } from 'ranuts';

const windowSize = getWindow();
console.log('Fensterbreite:', windowSize.width);
console.log('Fensterhöhe:', windowSize.height);
```

### Anpassungsfähiges Layout

```js
import { getWindow } from 'ranuts';

function handleResize() {
  const { width, height } = getWindow();
  if (width < 768) {
    // Layout für Mobilgeräte
  } else {
    // Layout für den Desktop
  }
}

window.addEventListener('resize', handleResize);
```

### Sicherheit auf dem Server

```js
import { getWindow } from 'ranuts';

// Wirft in einer Server-Umgebung keinen Fehler, sondern liefert { width: 0, height: 0 }
const size = getWindow();
console.log(size); // { width: 0, height: 0 }
```

### Das Seitenverhältnis berechnen

```js
import { getWindow } from 'ranuts';

const { width, height } = getWindow();
const aspectRatio = width / height;
console.log('Seitenverhältnis:', aspectRatio);
```

## Hinweise

1. **Browser-Kompatibilität**: nutzt `window.innerWidth` und `window.innerHeight`, die jeder moderne Browser kennt.

2. **Auch auf dem Server sicher**: In Server-Umgebungen (kein `window`-Objekt) kommt `{ width: 0, height: 0 }` zurück, ein Fehler wird nicht geworfen.

3. **Momentaufnahme**: Zurück kommt die Größe zum Zeitpunkt des Aufrufs; ändert sich das Fenster, ruf erneut auf.

4. **Einsatz**: üblich für responsive Layouts, Media Queries und die Beobachtung der Fenstergröße.
