# imageRequest

Misst die Netzwerklatenz (Ping) über eine Bildanfrage.

## API

### imageRequest

#### Rückgabe

| Argument          | Beschreibung                                                        | Typ       |
| ----------------- | ------------------------------------------------------------------- | --------- |
| `Promise<number>` | Promise, das mit der Dauer der Anfrage (Millisekunden) erfüllt wird | `Promise` |

#### Parameter

| Parameter | Beschreibung                                              | Typ      | Standard |
| --------- | --------------------------------------------------------- | -------- | -------- |
| `url`     | Bild-URL (optional, standardmäßig das Favicon von GitHub) | `string` | Optional |

## Beispiel

### Grundlegende Verwendung

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest();
console.log('Netzwerklatenz:', latency, 'ms');
```

### Eine eigene Test-URL angeben

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest('https://example.com/test-image.jpg');
console.log('Latenz:', latency, 'ms');
```

### Netzwerktest

```js
import { imageRequest } from 'ranuts';

async function testNetwork() {
  try {
    const latency = await imageRequest();
    if (latency < 100) {
      console.log('Gutes Netz');
    } else if (latency < 300) {
      console.log('Mittelmäßiges Netz');
    } else {
      console.log('Langsames Netz');
    }
  } catch (error) {
    console.error('Test fehlgeschlagen:', error);
  }
}
```

## Hinweise

1. **Standard-URL**: Ohne eigene URL wird das Favicon von GitHub genutzt (rund 2,2 KB).
2. **Messverfahren**: Gemessen wird die Ladezeit des Bildes, vom Start der Anfrage bis zum Ende des Ladevorgangs.
3. **Fehler**: Lädt das Bild nicht, wird das Promise abgelehnt.
4. **Einsatz**: üblich, um die Netzqualität einzuschätzen, und in der Leistungsüberwachung.
