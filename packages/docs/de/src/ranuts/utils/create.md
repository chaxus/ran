# create

Hilfsfunktion zum Erzeugen von DOM-Elementen, sowohl HTML als auch SVG.

## API

### create

#### Rückgabe

| Argument      | Beschreibung             | Typ           |
| ------------- | ------------------------ | ------------- |
| `HTMLElement` | Das erzeugte DOM-Element | `HTMLElement` |

#### Parameter

| Parameter | Beschreibung                     | Typ                      | Standard     |
| --------- | -------------------------------- | ------------------------ | ------------ |
| `tagName` | Name des Tags                    | `string`                 | Erforderlich |
| `options` | Optionen zum Erzeugen (optional) | `ElementCreationOptions` | Optional     |

## Beispiel

### Grundlegende Verwendung

```js
import { create } from 'ranuts';

const div = create('div');
div.textContent = 'Hello World';
document.body.appendChild(div);
```

### Ein SVG-Element erzeugen

```js
import { create } from 'ranuts';

const svg = create('svg');
svg.setAttribute('width', '100');
svg.setAttribute('height', '100');

const circle = create('circle');
circle.setAttribute('cx', '50');
circle.setAttribute('cy', '50');
circle.setAttribute('r', '40');
svg.appendChild(circle);
```

### Die Optionen zum Erzeugen nutzen

```js
import { create } from 'ranuts';

// Ein eigenes Element erzeugen
const customElement = create('my-custom-element', { is: 'my-element' });
```

## Hinweise

1. **Erkennt selbst**: SVG-Tags werden von allein erkannt und mit dem richtigen Namensraum erzeugt.
2. **HTML-Elemente**: gewöhnliche HTML-Elemente entstehen über `document.createElement`.
3. **SVG-Elemente**: SVG-Elemente entstehen über `document.createElementNS`.
4. **Einsatz**: üblich, wo SVG-Elemente erzeugt werden müssen, weil es den Weg dahin verkürzt.
