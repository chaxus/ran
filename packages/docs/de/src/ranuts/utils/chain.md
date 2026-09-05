# Chain

Eine Klasse, mit der sich das DOM in verketteten Aufrufen bearbeiten lässt: Elemente erzeugen, Attribute setzen, Ereignisse abonnieren und mehr.

## API

### Chain

#### Konstruktor

```typescript
new Chain(tagName: string, options?: ElementCreationOptions)
```

#### Wichtigste Methoden

| Methode            | Beschreibung                       | Rückgabewert |
| ------------------ | ---------------------------------- | ------------ |
| `setAttribute`     | Setzt ein Attribut am Element      | `Chain`      |
| `removeAttribute`  | Entfernt ein Attribut vom Element  | `Chain`      |
| `append`           | Hängt ein Kindelement an           | `Chain`      |
| `remove`           | Entfernt ein Kindelement           | `Chain`      |
| `setTextContent`   | Setzt den Textinhalt               | `Chain`      |
| `setStyle`         | Setzt einen Stil                   | `Chain`      |
| `addChild`         | Hängt ein Kind an (auch ein Array) | `Chain`      |
| `listen`           | Meldet einen Ereignis-Listener an  | `Chain`      |
| `clearListener`    | Meldet einen Ereignis-Listener ab  | `Chain`      |
| `clearAllListener` | Meldet alle Ereignis-Listener ab   | `Chain`      |

#### Eigenschaften

| Eigenschaft | Beschreibung    | Typ           |
| ----------- | --------------- | ------------- |
| `element`   | Das DOM-Element | `HTMLElement` |

## Beispiel

### Grundlegende Verwendung

```js
import { Chain } from 'ranuts';

const div = new Chain('div')
  .setAttribute('id', 'myDiv')
  .setAttribute('class', 'container')
  .setTextContent('Hello World')
  .setStyle('color', 'red');

document.body.appendChild(div.element);
```

### Verkettung

```js
import { Chain } from 'ranuts';

const button = new Chain('button')
  .setAttribute('type', 'button')
  .setTextContent('Klick mich')
  .setStyle('padding', '10px')
  .setStyle('background', 'blue')
  .listen('click', () => {
    console.log('Schaltfläche geklickt');
  });

document.body.appendChild(button.element);
```

### Kindelemente anhängen

```js
import { Chain } from 'ranuts';

const container = new Chain('div')
  .addChild(new Chain('h1').setTextContent('Überschrift'))
  .addChild(new Chain('p').setTextContent('Inhalt'));

document.body.appendChild(container.element);
```

### Mehrere Kinder auf einmal anhängen

```js
import { Chain } from 'ranuts';

const list = new Chain('ul').addChild([
  new Chain('li').setTextContent('Eintrag 1'),
  new Chain('li').setTextContent('Eintrag 2'),
  new Chain('li').setTextContent('Eintrag 3'),
]);

document.body.appendChild(list.element);
```

### SVG-Elemente

```js
import { Chain } from 'ranuts';

const svg = new Chain('svg').setAttribute('width', '100').setAttribute('height', '100');

const circle = new Chain('circle').setAttribute('cx', '50').setAttribute('cy', '50').setAttribute('r', '40');

svg.addChild(circle);
```

## Hinweise

1. **Verkettung**: Alle Methoden geben die `Chain`-Instanz zurück, lassen sich also aneinanderhängen.
2. **SVG**: erkennt SVG-Tags von allein und erzeugt sie mit dem richtigen Namensraum.
3. **Ereignisse**: hält intern eine Zuordnung der Listener, was das Verwalten und Abmelden erleichtert.
4. **Einsatz**: üblich, um DOM-Strukturen zur Laufzeit aufzubauen und Oberflächen-Bausteine zusammenzusetzen.
