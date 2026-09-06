# Virtuelles DOM (vnode)

Ein leichtgewichtiges virtuelles DOM nach Art von Snabbdom. Es bildet deine Oberfläche als schlichte JavaScript-Objekte ab (die `VNode`s), vergleicht einen alten Baum mit einem neuen und trägt nur die Unterschiede ins echte DOM ein.

- `init()` baut den Abgleicher und gibt eine `patch`-Funktion zurück. Die mitgelieferten Module (class / props / attrs / style / events) tragen sich von selbst ein.
- `patch(oldVnode, newVnode)` hängt einen Baum ein (wenn `oldVnode` ein echtes DOM-Element ist) oder vergleicht zwei vnode-Bäume und bessert das DOM an Ort und Stelle nach.
- `h(sel, dataOrChildren?, children?)` ist der Hyperscript-Helfer, der `VNode`s baut.

## Import

```js
import { init, h, classModule, propsModule, styleModule, eventListenersModule } from 'ranuts/vnode';
```

> Hinweis: In dieser Umsetzung nimmt `init()` **keine Argumente**: Der Satz an Modulen liegt fest und wird intern eingetragen, die einzelnen `*Module`-Exporte müssen `init` also nicht übergeben werden. Exportiert sind sie zum Nachschlagen und Nachsehen.

## Beispiel

### Schnellstart

```js
import { init, h } from 'ranuts/vnode';

// init() gibt eine `patch`-Funktion zurück.
// Die mitgelieferten Module (class, props, attrs, style, events) tragen sich von selbst ein.
const patch = init();

const container = document.getElementById('app');

// Einen vnode-Baum bauen
let vnode = h('div#app.container', { style: { color: 'red' } }, [
  h('h1', 'Hello vnode'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Click me'),
]);

// Erstes Zeichnen: als alten vnode ein echtes DOM-Element übergeben, dann wird darin eingehängt
patch(container, vnode);

// Später: den aktualisierten Baum bauen und den vorigen vnode darauf patchen.
// Ins DOM gelangen nur die Unterschiede (Text, Stil, Listener).
const newVnode = h('div#app.container', { style: { color: 'green' } }, [
  h('h1', 'Hello again'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Updated'),
]);

patch(vnode, newVnode);
vnode = newVnode; // den neuesten Baum für das nächste patch behalten
```

### Knoten mit `h` bauen

```js
// nur das Tag
h('div');

// Tag + data
h('div', { class: { active: true } });

// Tag + ein einzelnes Textkind
h('span', 'hello');

// Tag + Array von Kindern
h('ul', [h('li', 'one'), h('li', 'two')]);

// Tag + data + Kinder
h('a', { attrs: { href: '/home' } }, 'Home');

// Selektoren im CSS-Stil legen id und Klassen fest
h('div#main.card.large', 'content'); // <div id="main" class="card large">content</div>

// Der SVG-Namensraum wird von selbst gesetzt, wenn der Selektor mit "svg" beginnt
h('svg', { attrs: { width: 100, height: 100 } }, [h('circle', { attrs: { cx: 50, cy: 50, r: 40 } })]);
```

## API

### `init()`

Erzeugt den Abgleicher und gibt eine `patch`-Funktion zurück. Die mitgelieferten Module werden intern eingetragen; Argumente nimmt es keine.

#### Rückgabe

| Wert    | Beschreibung                                                  | Typ                                                   |
| ------- | ------------------------------------------------------------- | ----------------------------------------------------- |
| `patch` | Hängt vnode-Bäume ins echte DOM ein oder gleicht sie damit ab | `(oldVnode: VNode \| Element, vnode: VNode) => VNode` |

### `patch(oldVnode, vnode)`

Kommt von `init()`. Übergib beim ersten Aufruf als `oldVnode` ein echtes DOM-`Element`, dann wird der Baum darin eingehängt. Bei späteren Aufrufen übergib den vorigen `VNode`, um an Ort und Stelle abzugleichen und nachzubessern. Zurück kommt der neue `VNode`, den du als „alten“ Wert für den nächsten Aufruf behältst.

#### Parameter

| Parameter  | Beschreibung                                                 | Typ                |
| ---------- | ------------------------------------------------------------ | ------------------ |
| `oldVnode` | Der vorige vnode, oder beim ersten Einhängen ein DOM-Element | `VNode \| Element` |
| `vnode`    | Der neue vnode-Baum, der gezeichnet werden soll              | `VNode`            |

### `h(sel, dataOrChildren?, children?)`

Hyperscript-Helfer, der einen `VNode` baut. Er ist überladen:

| Signatur                 | Beschreibung                                                              |
| ------------------------ | ------------------------------------------------------------------------- |
| `h(sel)`                 | Element allein aus einem Selektor                                         |
| `h(sel, data)`           | Element mit `VNodeData` (`data` darf `null` sein)                         |
| `h(sel, children)`       | Element mit Kindern: ein Text oder eine Zahl, ein `VNode`, oder ein Array |
| `h(sel, data, children)` | Element mit Daten und Kindern                                             |

#### Parameter

| Parameter  | Beschreibung                                                                                                                            | Typ                 |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `sel`      | Selektor im CSS-Stil: `tag`, `tag#id`, `tag.class`, auch kombiniert (`div#id.a.b`). Bei `svg…` kommt der SVG-Namensraum von selbst dazu | `string`            |
| `data`     | Daten des Knotens: class / props / attrs / style / Listener / key / hook. Darf `null` sein                                              | `VNodeData \| null` |
| `children` | Ein Text oder eine Zahl (wird zum Textknoten), ein einzelner `VNode`, oder ein Array davon                                              | `VNodeChildren`     |

#### Felder von `VNodeData`

| Feld    | Beschreibung                                                                                       | Typ                                           | Angewendet von               |
| ------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------- |
| `props` | DOM-Eigenschaften, gesetzt über `elm[key] = value`                                                 | `Record<string, any>`                         | `propsModule`                |
| `attrs` | HTML-Attribute, gesetzt über `setAttribute` (`true` und `false` schalten das Attribut ein und aus) | `Record<string, string \| number \| boolean>` | `attributesModule`           |
| `class` | Bedingte Klassen: eine Zuordnung `name → boolean`                                                  | `Record<string, boolean>`                     | `classModule`                |
| `style` | Inline-Stile: eine Zuordnung `name → value` (Schlüssel mit `--var` werden zu CSS-Variablen)        | `Record<string, any>`                         | `styleModule`                |
| `on`    | Ereignis-Listener: `event → handler` (oder ein Array von Handlern)                                 | `Record<string, Function \| Function[]>`      | `eventListenersModule`       |
| `key`   | Beständiges Kennzeichen, mit dem der Abgleich Kinder zuordnet und umsortiert                       | `string \| number`                            | (Kern des Abgleichs)         |
| `ns`    | URI des Namensraums (bei SVG-Teilbäumen von selbst gesetzt)                                        | `string`                                      | (Kern des Abgleichs)         |
| `hook`  | Lebenszyklus-Hooks je vnode (`Hooks`)                                                              | `Hooks`                                       | (nur als Typ: siehe Hinweis) |

> Hinweis: `hook` und der Typ `Hooks` gehören zur öffentlichen Typfläche. Diese abgespeckte Umsetzung steuert das DOM jedoch über den Lebenszyklus der **Module** (`create` / `update` / `destroy`); die `data.hook`-Rückrufe je vnode ruft die derzeitige `patch`-Schleife nicht auf.

### Module

Jedes Modul kümmert sich um ein Stück von `VNodeData`. `init()` trägt sie alle ein; einzeln exportiert sind sie außerdem.

| Export                 | Zuständig für | Beschreibung                                                                   |
| ---------------------- | ------------- | ------------------------------------------------------------------------------ |
| `classModule`          | `data.class`  | Setzt und entfernt Klassen anhand einer Zuordnung `name → boolean`             |
| `propsModule`          | `data.props`  | Weist DOM-Eigenschaften unmittelbar zu (`elm[key] = value`)                    |
| `attributesModule`     | `data.attrs`  | Setzt und entfernt HTML-Attribute über `setAttribute` (auch xml und xlink)     |
| `styleModule`          | `data.style`  | Setzt Inline-Stile und benutzerdefinierte CSS-Eigenschaften                    |
| `eventListenersModule` | `data.on`     | Hängt Ereignis-Listener an und wieder ab                                       |
| `modules`              | —             | Das voreingestellte Registerobjekt, das jeden Modulnamen seinem Modul zuordnet |

### Exporte tieferer Ebene

| Export       | Typ                                         | Beschreibung                                                                                                                               |
| ------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `vnode`      | `(sel, data, children, text, elm) => VNode` | Hardwarenahe `VNode`-Fabrik, die `h` intern benutzt. Nimm im Anwendungscode lieber `h`.                                                    |
| `addNS`      | `(data, children, sel) => void`             | Legt den SVG-Namensraum rekursiv über einen Teilbaum. Bei `svg…`-Selektoren ruft `h` sie von selbst auf.                                   |
| `htmlDomApi` | `DOMAPI`                                    | Der voreingestellte Browser-DOM-Adapter, den `patch` intern benutzt (Knoten erzeugen, einfügen, entfernen, Text usw.).                     |
| `is`         | `{ array, isStr, primitive, isVnode }`      | Kleine Typprüfer, die überall im Inneren von vnode benutzt werden.                                                                         |
| `Chain`      | `class Chain`                               | Ein verkettbarer, imperativer DOM-Baumeister (`setAttribute`, `append`, `setTextContent`, …). Mit dem vnode-Abgleich hat er nichts zu tun. |
| `create`     | `(tagName, options?) => Chain`              | Bequemlichkeitsfabrik, die eine neue `Chain` liefert.                                                                                      |

### Typen

| Typ                 | Form und Bedeutung                                                                            |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `VNode`             | `{ sel, data, children, elm, text, key, listener? }`: ein virtueller Knoten                   |
| `VNodeData`         | `{ props?, attrs?, class?, style?, on?, key?, ns?, hook? }`: siehe die Felder oben            |
| `VNodes`            | `VNode[]`                                                                                     |
| `VNodeChildElement` | `VNode \| string \| number`                                                                   |
| `VNodeChildren`     | `VNodeChildElement \| VNodeChildElement[]`                                                    |
| `ArrayOrElement<T>` | `T \| T[]`                                                                                    |
| `Key`               | `string \| number`                                                                            |
| `Hooks`             | `{ pre?, init?, create?, insert?, prepatch?, update?, postpatch?, destroy?, remove?, post? }` |
| `DOMAPI`            | Schnittstelle, die die DOM-Operationen beschreibt, die `patch` benutzt (siehe `htmlDomApi`)   |
| `Fragment`          | Erweiterung von `DocumentFragment` für den Umgang mit Fragmenten                              |
| `Modules`           | `Record<string, Record<string, ModuleHook>>`: die Form des Modulregisters                     |
| `ModuleHook`        | Ein einzelner Lebenszyklus-Rückruf eines Moduls                                               |

## Hinweise

1. **Nur für den Browser.** `ranuts/vnode` fasst `document` und die DOM-APIs an; importiere es in Browser-Code, nicht in Node.
2. **Behalte den letzten vnode.** `patch` gibt den neuen `VNode` zurück. Heb ihn auf und übergib ihn bei der nächsten Aktualisierung als `oldVnode`, damit gegen den aktuellen Baum verglichen wird.
3. **In einem `VNode` schließen sich `text` und `children` aus**: Ein Knoten ist entweder ein Textknoten oder ein Element mit Kindern.
4. **Nimm `key` für Listen.** Gib Geschwistern beim Zeichnen veränderlicher Listen beständige `key`-Werte, damit der Abgleich Knoten zuordnen und umsortieren kann, statt sie neu zu erzeugen.
