# networkSpeed

Misst Ping und Schwankung des aktuellen Netzes über mehrere Anfragen.

## API

### networkSpeed

#### Rückgabe

| Argument              | Beschreibung                                      | Typ       |
| --------------------- | ------------------------------------------------- | --------- |
| `Promise<ReturnType>` | Promise, das mit den Messergebnissen erfüllt wird | `Promise` |

#### ReturnType

| Eigenschaft | Beschreibung                          | Typ      |
| ----------- | ------------------------------------- | -------- |
| `ping`      | Mittlerer Ping (Millisekunden)        | `number` |
| `jitter`    | Schwankung des Netzes (Millisekunden) | `number` |

#### Parameter

| Parameter | Beschreibung  | Typ       | Standard     |
| --------- | ------------- | --------- | ------------ |
| `options` | Einstellungen | `Options` | Erforderlich |

#### Optionen

| Parameter  | Beschreibung                          | Typ      | Standard     |
| ---------- | ------------------------------------- | -------- | ------------ |
| `url`      | URL des Bildes, mit dem gemessen wird | `string` | Erforderlich |
| `duration` | Abstand zwischen den Anfragen (ms)    | `number` | `3000`       |
| `count`    | Zahl der Messungen                    | `number` | `5`          |

## Beispiel

### Grundlegende Verwendung

```js
import { networkSpeed } from 'ranuts';

const result = await networkSpeed({
  url: 'https://example.com/test.jpg',
  count: 5,
  duration: 3000,
});

console.log('Mittlere Latenz:', result.ping, 'ms');
console.log('Schwankung des Netzes:', result.jitter, 'ms');
```

### Die Netzqualität einschätzen

```js
import { networkSpeed } from 'ranuts';

async function assessNetwork() {
  const { ping, jitter } = await networkSpeed({ count: 10, url: 'https://example.com/test.jpg' });

  if (ping < 50 && jitter < 20) {
    console.log('Ausgezeichnete Netzqualität');
  } else if (ping < 100 && jitter < 50) {
    console.log('Gute Netzqualität');
  } else {
    console.log('Mittelmäßige Netzqualität');
  }
}
```

### Die Messwerte anpassen

```js
import { networkSpeed } from 'ranuts';

// Zehn Messungen im Abstand von je zwei Sekunden
const result = await networkSpeed({
  url: 'https://example.com/ping.jpg',
  count: 10,
  duration: 2000,
});
```

## Hinweise

1. **Schwankung**: beschreibt, wie unruhig das Netz ist — der Abstand zwischen größtem und kleinstem Wert mehrerer Messungen; je kleiner, desto stabiler das Netz.
2. **Messverfahren**: schickt mehrere Bildanfragen und errechnet daraus die mittlere Latenz und die Schwankung.
3. **Voreinstellung**: fünf Messungen im Abstand von je drei Sekunden.
4. **Einsatz**: üblich, um die Netzqualität einzuschätzen, zur Leistungsüberwachung und zum Feinschliff der Nutzung.
