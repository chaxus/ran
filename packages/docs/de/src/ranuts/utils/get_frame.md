# getFrame

Berechnet die Bildrate je Millisekunde; für Bilder pro Sekunde mit 1000 multiplizieren.

## API

### getFrame

#### Rückgabe

| Argument          | Beschreibung                                                 | Typ       |
| ----------------- | ------------------------------------------------------------ | --------- |
| `Promise<number>` | Promise, das mit der Bildrate (je Millisekunde) erfüllt wird | `Promise` |

#### Parameter

| Parameter | Beschreibung               | Typ      | Standard |
| --------- | -------------------------- | -------- | -------- |
| `n`       | Zahl der gemessenen Bilder | `number` | `10`     |

## Beispiel

### Grundlegende Verwendung

```js
import { getFrame } from 'ranuts';

const fps = await getFrame();
console.log('Bilder je ms:', fps);
console.log('Bilder je Sekunde:', fps * 1000);
```

### Die Zahl der Messungen ändern

```js
import { getFrame } from 'ranuts';

// 20 Bilder messen und den Mittelwert bilden
const fps = await getFrame(20);
console.log('FPS:', fps * 1000);
```

### Leistungsmessung

```js
import { getFrame } from 'ranuts';

async function monitorPerformance() {
  const fps = await getFrame(30);
  const fpsPerSecond = fps * 1000;

  if (fpsPerSecond < 30) {
    console.warn('Niedrige Bildrate:', fpsPerSecond);
  } else {
    console.log('Bildrate in Ordnung:', fpsPerSecond);
  }
}
```

### Die Leistung einer Animation prüfen

```js
import { getFrame } from 'ranuts';

async function checkAnimationPerformance() {
  const fps = await getFrame(60);
  const fpsPerSecond = fps * 1000;
  console.log(`Bildrate der Animation: ${fpsPerSecond.toFixed(2)} FPS`);
}
```

## Hinweise

1. **Einheit**: Zurück kommen Bilder je Millisekunde; mal 1000 ergibt Bilder pro Sekunde (FPS).
2. **Messverfahren**: misst über `requestAnimationFrame` und mittelt den Abstand mehrerer Bilder.
3. **Asynchron**: Zurück kommt ein Promise, also mit `await` oder `.then()` behandeln.
4. **Einsatz**: üblich für die Leistungsüberwachung, zum Prüfen von Animationen und zum Messen der Bildrate in Spielen.
