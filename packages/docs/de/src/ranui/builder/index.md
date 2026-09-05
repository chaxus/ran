---
description: 'ranui/builder ist ein Framework-freier, verketteter DOM-Builder mit feingranularer Reaktivität im Stil von SwiftUI und Solid: einmal bauen, danach nur den Knoten aktualisieren, an dem ein Signal hängt.'
---

# Builder

`ranui/builder` baut das DOM deklarativ auf — feingranular reaktiv und ohne virtuelles DOM. Die Komponenten selbst sind damit geschrieben; es erscheint als eigener Einstiegspunkt, damit eine Anwendung es auch für ihr eigenes Layout und ihren Klebecode nutzen kann.

> **Einsetzen, wenn** du reaktive Ansichten ohne Framework willst (eine Seite, eine Route, ein Widget) oder wenn du ein Custom Element schreibst und denselben Baustil möchtest, den ranui intern verwendet.

> **Das Prinzip: einmal bauen, an Ort und Stelle aktualisieren.** Eine Ansichtsfunktion läuft **einmal**. Eine Zustandsänderung aktualisiert genau den Knoten, an dem dieses Signal hängt; ein Baum wird nicht neu gezeichnet. Wähle die Primitive, die zur Form passt: Wert → eine Getter-Bindung; Bedingung → `Show` / `Switch`; Liste → `For` / `Index`.

```js
import {
  View,
  Div,
  Span,
  ButtonBuilder, // Element-Fabriken
  signal,
  computed,
  createEffect,
  batch,
  untrack, // Reaktivität
  createRoot,
  onCleanup,
  getOwner,
  runWithOwner, // Besitz
  EventManager, // an den Lebenszyklus gebundene Ereignisse
} from 'ranui/builder';
```

Der Builder registriert **kein** einziges Custom Element. Um `<r-button>` und Verwandte zu nutzen, importiere zusätzlich den Einstiegspunkt der Komponente: `import 'ranui/button'`.

## Elemente

Die Fabriken geben einen verkettbaren `ElementBuilder` zurück; `build()` liefert den DOM-Knoten.

```js
const header = Div()
  .class('panel-header')
  .attr('part', 'header')
  .role('heading')
  .children(Span().class('title').text('Deploys'), Slot().attr('name', 'extra'))
  .build();
```

`Div()`, `Span()`, `ButtonBuilder()`, `InputBuilder()`, `Label()`, `Ul()`, `Li()`, `Section()`, `Article()`, `Nav()`, `Header()`, `Footer()`, `Main()`, `Style()`, `Slot()`, dazu `View('any-tag')` für alles andere, auch für Custom Elements.

### Verkettbare API

| Gruppe               | Methoden                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| Identität und Klasse | `id(v)`, `class(v)`, `addClass(...v)`, `removeClass(...v)`                                                    |
| Attribute            | `attr(name, v)`, `attrs({…})`, `boolAttr(name, on, enabledValue?)`, `part(v)`, `data(key, v)`                 |
| Stil                 | `style(prop, v)` / `style({…})`, `cssVar(name, v)`                                                            |
| Barrierefreiheit     | `aria(key, v)`, `role(v)`, `tabIndex(n)`, `label(v)`, `labelledBy(id)`, `describedBy(id)`, `ariaHidden(b?)`   |
| Inhalt               | `text(v)`, `children(…nodes)`, `replaceChildren(…nodes)`                                                      |
| Refs und Shadow      | `ref(holder)`, `shadow(opts?)` → `ShadowBuilder`                                                              |
| Ereignisse           | `on(type, handler, options?)`, `listen(manager, type, handler)`, `delegate(manager, selector, type, handler)` |
| Abschluss            | `build()`, `serialize()` (HTML-Zeichenkette fürs SSR)                                                         |

`children()` nimmt Elemente, Zeichenketten, andere Builder, Arrays, `null` / `undefined` (werden übersprungen) und Getter (lebende Bereiche, siehe unten).

### Refs

`createRef<T>()` zusammen mit `.ref(holder)` fängt das gebaute Element ein. Typisierst du die Ref mit der Elementklasse einer Komponente, bekommst du deren imperative Methoden ohne Umtypung:

```ts
import { Popover } from 'ranui';
import { View, createRef } from 'ranui/builder';

const ref = createRef<Popover>();
View<Popover>('r-popover').attr('trigger', 'click').ref(ref).children(/* … */).build();
ref.current?.closePopover();
```

## Reaktivität

```js
const [count, setCount] = signal(0);
count(); // lesen — wird in Effekten und Memos verfolgt
setCount(1); // schreiben; setCount((n) => n + 1) geht auch
// ein Schreiben mit unverändertem Wert tut nichts (Object.is; ersetzbar über signal(v, { equals }))

const double = computed(() => count() * 2); // faul und gemerkt

const dispose = createEffect(() => {
  console.log(count()); // läuft jetzt, und bei jeder Änderung einer Abhängigkeit
  return () => {
    /* optionales Aufräumen, vor dem nächsten Lauf und beim Verwerfen */
  };
});

batch(() => {
  setCount(1);
  setName('x');
}); // ein einziges Ausspielen, Effekte ohne Dopplung
untrack(() => count()); // lesen, ohne zu abonnieren
```

- **`computed` ist faul**: Ein Memo, das niemand liest, rechnet nie neu, und es meldet sich nur wieder, wenn sich sein _Wert_ ändert — Effekte hinter einem stabilen Memo laufen also nicht erneut.
- **Effekte verfolgen von selbst**: Abonniert bleiben nur die Signale, die im letzten Lauf gelesen wurden; eine Bedingung lässt also nie ein veraltetes Abonnement zurück.
- **Ein zyklischer Effekt wirft**, statt sich zu drehen: Ein Effekt, der ein Signal schreibt, das er liest, ist ein Fehler — die Laufzeit wirft, statt ihn ewig laufen zu lassen.

### Reaktive Bindungen

`text`, `attr`, `class`, `boolAttr`, `style`, `part`, `data`, `aria`, `role` und `label` nehmen alle einen **Getter**, sodass sich die Bindung ohne ausdrücklichen Effekt selbst aktualisiert:

```js
const [active, setActive] = signal(true);

Div()
  .class(() => (active() ? 'row active' : 'row'))
  .boolAttr('disabled', () => !active())
  .build();
```

Reaktiv sind nur die Einzelwert-Formen: `style(prop, getter)` ist es; die Map-Formen `style({…})` und `attrs({…})` greifen einmalig.

### Bedingungen und Listen

| Form                                              | Nimm                                 | Verhalten                                                                   |
| ------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| Ein Zweig                                         | `Show({ when, children, fallback })` | Baut nur neu, wenn die _Wahrheit_ von `when` kippt.                         |
| Mehrere Zweige                                    | `Switch` + `Match`                   | Baut nur neu, wenn der gewählte Zweig wechselt.                             |
| Eine Liste mit stabilen IDs                       | `For({ each, key, render })`         | Ordnet Einträge über `key` zu und **verwendet ihre Knoten wieder**.         |
| Eine Liste, in der die Position die Identität ist | `Index({ each, render })`            | Verwendet den Knoten je Position wieder; der Eintrag selbst ist ein Signal. |
| Inhalt, der die Form komplett wechselt            | ein roher Getter als Kind            | Grob: reißt den ganzen Bereich bei jedem Lesen ab und baut ihn neu.         |

```js
Ul().children(
  For({
    each: () => rows(), // reaktives Quell-Array
    key: (row) => row.id, // stabil und eindeutig
    render: (row, index) => Li().text(() => `${index()}. ${row.title}`),
  }),
);
```

Vier Regeln entscheiden, ob `For` tatsächlich etwas wiederverwendet:

- **Der `key` muss eindeutig sein.** Ein doppelter wird ignoriert (nur der erste Eintrag erscheint) und in der Entwicklung gemeldet. Nimm nicht den Array-Index als Schlüssel: Das macht die Wiederverwendung beim Umsortieren zunichte.
- **Aktualisiere mit einem neuen Array.** `each` liest ein Signal — dasselbe Array an Ort und Stelle zu verändern und erneut zu setzen wird per Gleichheitsprüfung übersprungen, und die Liste aktualisiert sich nie.
- **`render` läuft einmal je Eintrag**, nicht bei jeder Listenänderung. Steuere Aktualisierungen einzelner Zeilen über Signale; `index` ist ein Getter und bleibt daher nach einem Umsortieren korrekt.
- **Einen Eintrag zu entfernen verwirft den Bereich dieser Zeile**: Ihre Effekte und Aufräumfunktionen gehen mit.

Zieh `Show` / `For` einem rohen Getter-Kind vor: Der Getter baut seinen ganzen Bereich bei jeder gelesenen Änderung neu, auch bei einer, die am Ergebnis nichts ändert — Fokus, Scrollposition, Eingabewerte und Übergänge darin gehen dabei verloren.

## Besitz

Jeder Effekt, jedes Memo und jede reaktive Bindung gehört dem Bereich, der sie erzeugt hat. Den Bereich zu verwerfen verwirft alles darunter.

```js
import { createRoot, onCleanup } from 'ranui/builder';

const dispose = createRoot((dispose) => {
  const el = Div().text(message).build(); // diese Bindung gehört der Wurzel
  onCleanup(() => console.log('torn down'));
  mount(el);
  return dispose;
});

dispose(); // entfernt den Effekt der Bindung und führt die Aufräumfunktionen aus
```

**Baue reaktive Oberflächen innerhalb eines `createRoot`.** Eine Bindung ohne Besitzer funktioniert zwar, wird aber nie von selbst verworfen.

### Abbau je Seite

Gib jeder Seite oder Route eine eigene Wurzel und verwirf sie bei der Navigation: Jeder Effekt, jede Bindung, jeder Timer und jeder Listener dieser Seite verschwindet mit einem Aufruf:

```js
let disposePage = null;

function showPage(render, host) {
  disposePage?.();
  disposePage = createRoot((dispose) => {
    render(host);
    return dispose;
  });
}
```

[`<r-route>`](/de/src/ranui/route/) hat das eingebaut: Mit `src` wird das Seitenmodul beim Treffer importiert, sein Default-Export läuft in einem `createRoot`, und diese Wurzel wird beim Verlassen verworfen. `getOwner()` / `runWithOwner()` erlauben es einem Router, einen Bereich über ein `await` hinweg mitzunehmen.

::: warning Innerhalb eines Web Components keine Getter-Bindungen verwenden
Der `constructor` und der `connectedCallback` einer Komponente sind **keine** reaktiven Bereiche. Eine dort erzeugte Getter-Bindung oder ein `createEffect` ist verwaist und wird nie verworfen; sie feuert weiter auf einem abgetrennten Knoten, und überlebt das Signal das Element, hält es das Element im Speicher fest. Baue mit einfachen Werten und steuere Aktualisierungen über ausdrückliche `createEffect`s, deren Verwerf-Funktionen du sammelst und im `disconnectedCallback` aufrufst — beim erneuten Verbinden setzt du sie wieder auf. Siehe die [Coding-Leitlinien](/de/src/ranui/coding-guides/).
:::

## Listener innerhalb eines Custom Elements

`EventManager` stützt sich auf einen `AbortController`, ein Aufruf entfernt also sämtliche Listener:

```js
const events = new EventManager();

connectedCallback() {
  events
    .on(this.input, 'input', this.onInput)
    .delegate(this, '[data-action]', 'click', (event, el) => this.run(el.dataset.action));
}

disconnectedCallback() {
  events.abort(); // entfernt sie alle und setzt sich für das nächste Verbinden zurück
}
```

## Serverseitiges Rendern

Builder funktionieren unter [SSR](/de/src/ranui/ssr/): `build()` gibt einen nachgebildeten Knoten zurück, `serialize()` liefert HTML. Reaktive Bindungen, `For` und `Show` zeichnen auf dem Server **einmal**, als statische Momentaufnahme; abgeglichen wird erst, wenn der Code im Browser läuft.

## Vollständige Referenz

Diese Seite ist der Ausschnitt für die tägliche Arbeit. Die vollständige Referenz (jede Fabrik, jeder Operator, die Regeln für den SVG-Namensraum und die Einzelheiten zu `Switch` / `Match`) steht in der [BUILDER.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md) im Repository, die auch dem npm-Paket beiliegt.
