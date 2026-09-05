# createDocumentFragment

Erzeugt ein `DocumentFragment` und hängt mehrere Kindelemente hinein.

## API

### createDocumentFragment

#### Rückgabe

| Argument                        | Beschreibung                  | Typ                             |
| ------------------------------- | ----------------------------- | ------------------------------- |
| `DocumentFragment \| undefined` | Das `DocumentFragment`-Objekt | `DocumentFragment \| undefined` |

#### Parameter

| Parameter | Beschreibung                     | Typ         | Standard     |
| --------- | -------------------------------- | ----------- | ------------ |
| `list`    | Array der einzufügenden Elemente | `Element[]` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { createDocumentFragment } from 'ranuts';

const div1 = document.createElement('div');
const div2 = document.createElement('div');
const fragment = createDocumentFragment([div1, div2]);

// Auf einen Schlag ins DOM hängen
document.body.appendChild(fragment);
```

### Elemente gebündelt einfügen

```js
import { createDocumentFragment } from 'ranuts';

const elements = Array.from({ length: 100 }, () => {
  const div = document.createElement('div');
  div.textContent = 'Eintrag';
  return div;
});

const fragment = createDocumentFragment(elements);
document.getElementById('container').appendChild(fragment);
```

### Sicherheit auf dem Server

```js
import { createDocumentFragment } from 'ranuts';

// In einer Server-Umgebung kommt undefined zurück
const fragment = createDocumentFragment([element]);
console.log(fragment); // undefined (Server-Umgebung)
```

## Hinweise

1. **Schneller**: Mit einem `DocumentFragment` spart man sich viele einzelne DOM-Eingriffe.
2. **Auch auf dem Server sicher**: In Server-Umgebungen (kein `document`-Objekt) kommt `undefined` zurück, ein Fehler wird nicht geworfen.
3. **Nur einmal**: Hängt man das Fragment ins DOM, wandern seine Kinder zum Zielelement, das Fragment selbst bleibt nicht bestehen.
4. **Einsatz**: üblich, um Elemente gebündelt einzufügen, Reflow und Neuzeichnen zu verringern und Zeit zu sparen.
