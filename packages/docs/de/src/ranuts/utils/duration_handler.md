# durationHandler

Erzeugt eine verzögerte Funktion, die die angegebene Funktion nach einer bestimmten Zeit ausführt.

## API

### durationHandler

#### Rückgabe

| Argument   | Beschreibung                                                | Typ                                |
| ---------- | ----------------------------------------------------------- | ---------------------------------- |
| `Function` | Gibt eine Funktion zurück, die die Verzögerungszeit annimmt | `(duration: number) => Promise<U>` |

#### Parameter

| Parameter   | Beschreibung                        | Typ        | Standard     |
| ----------- | ----------------------------------- | ---------- | ------------ |
| `handler`   | Auszuführende Funktion              | `Function` | Erforderlich |
| `...params` | Argumente, die ihr übergeben werden | `T[]`      | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { durationHandler } from 'ranuts';

const delayedFn = durationHandler((name) => {
  console.log('Hallo', name);
  return 'done';
}, 'World');

// Läuft nach einer Sekunde
const result = await delayedFn(1000);
console.log(result); // 'done'
```

### Eine API-Anfrage verzögern

```js
import { durationHandler } from 'ranuts';

const delayedRequest = durationHandler(async (url) => {
  const response = await fetch(url);
  return response.json();
}, 'https://api.example.com/data');

// Die Anfrage geht nach zwei Sekunden raus
const data = await delayedRequest(2000);
console.log(data);
```

### Zusammen mit networkSpeed

```js
import { durationHandler, imageRequest } from 'ranuts';

// Eine verzögerte Bildanfrage erzeugen
const delayedImageRequest = durationHandler(imageRequest, 'https://example.com/test.jpg');

// Läuft nach drei Sekunden
const latency = await delayedImageRequest(3000);
console.log('Latenz:', latency, 'ms');
```

## Hinweise

1. **Curried**: Zurück kommt eine Funktion, die die Verzögerungszeit annimmt — passend zu einem funktionalen Stil.
2. **Mit async**: nimmt auch asynchrone Funktionen und wartet, bis sie fertig sind.
3. **Fehler**: Schlägt die Funktion fehl, wird das Promise abgelehnt.
4. **Einsatz**: üblich für verzögerte Ausführung, geplante Aufgaben und Netzwerktests.
