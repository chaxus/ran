# EventManager / createDoubleTapDetector

Eine an den Lebenszyklus gebundene Registrierung von Event-Listenern auf Basis von `AbortController`, dazu ein kleiner Doppeltipp-Erkenner für Touch-Gesten, dem die Zeigerart gleichgültig ist.

Das Problem, das hier gelöst wird, ist das _Wieder-Abmelden_ von Listenern. `removeEventListener` greift nur, wenn du ihm **exakt dieselbe** Funktionsreferenz und dieselben Optionen übergibst, mit denen du registriert hast. Verpackst du den Handler beim Anmelden in eine Pfeilfunktion, bekommst du ihn nie wieder los. Komponenten, die immer wieder ein- und ausgehängt werden, verlieren dann pro Runde einen Listener. `AbortController` macht aus alldem ein einziges `abort()`.

## Verwendung

### In einer Web Component

```ts
import { EventManager } from 'ranuts/utils';

class MyElement extends HTMLElement {
  private _events = new EventManager();

  connectedCallback() {
    this._events.on(this._input, 'input', this.handleInput).on(this, 'click', this.handleClick, { capture: true });
  }

  disconnectedCallback() {
    this._events.abort(); // meldet alle Listener ab und macht sich für das nächste Einhängen bereit
  }
}
```

### In gewöhnlichem Seitencode

```ts
function initSection(container: HTMLElement) {
  const scope = new EventManager();

  scope.on(input, 'input', handleSearch).delegate(container, '[data-action]', 'click', (ev, target) => {
    handleAction(target.getAttribute('data-action'));
  });

  return () => scope.abort(); // aufrufen, wenn der Abschnitt abgebaut wird
}
```

## API

### on

Meldet einen Listener an, der an diesen Manager gebunden ist. Verkettbar.

#### Parameter

| Parameter | Beschreibung                                      | Typ                                      | Standard     |
| --------- | ------------------------------------------------- | ---------------------------------------- | ------------ |
| `target`  | Das Ziel des Events                               | `EventTarget`                            | Erforderlich |
| `type`    | Name des Events                                   | `string`                                 | Erforderlich |
| `handler` | Die Handler-Funktion                              | `EventListener`                          | Erforderlich |
| `options` | Die Optionen von `addEventListener` ohne `signal` | `Omit<AddEventListenerOptions,'signal'>` | `-`          |

#### Rückgabe

| Argument | Beschreibung                      | Typ            |
| -------- | --------------------------------- | -------------- |
| `this`   | Der Manager selbst, zum Verketten | `EventManager` |

### delegate

Event-Delegation: hängt **einen einzigen** Listener an `parent` und ruft `handler` nur dann, wenn das Event von einem Nachfahren stammt, auf den `selector` passt. Verkettbar.

Der Handler bekommt das ursprüngliche Event und das getroffene Element.

```ts
scope.delegate(list, '.item', 'click', (ev, item) => {
  console.log(item.getAttribute('data-id'));
});
```

#### Parameter

| Parameter  | Beschreibung                                      | Typ                                      | Standard     |
| ---------- | ------------------------------------------------- | ---------------------------------------- | ------------ |
| `parent`   | Das Element, an dem dieser eine Listener hängt    | `HTMLElement`                            | Erforderlich |
| `selector` | Der Selektor, auf den ein Nachfahre passen muss   | `string`                                 | Erforderlich |
| `type`     | Name des Events                                   | `string`                                 | Erforderlich |
| `handler`  | `(event, matchedElement) => void`                 | `Function`                               | Erforderlich |
| `options`  | Die Optionen von `addEventListener` ohne `signal` | `Omit<AddEventListenerOptions,'signal'>` | `-`          |

#### Rückgabe

| Argument | Beschreibung                      | Typ            |
| -------- | --------------------------------- | -------------- |
| `this`   | Der Manager selbst, zum Verketten | `EventManager` |

### abort

Meldet alle registrierten Listener ab und legt den internen `AbortController` neu an. Mehrfaches Aufrufen ist unbedenklich; spätere `on()`- und `delegate()`-Aufrufe beginnen in einem sauberen Geltungsbereich.

#### Rückgabe

Kein Rückgabewert (`void`)

### signal

Das zugrunde liegende `AbortSignal`, falls du es selbst an `addEventListener` weiterreichen möchtest.

| Argument | Beschreibung                   | Typ           |
| -------- | ------------------------------ | ------------- |
| `signal` | Das Abbruchsignal des Managers | `AbortSignal` |

## createDoubleTapDetector

Doppeltipp-Erkennung allein aus rohen `(x, y, Zeit)`-Werten. Die Zeigerart ist ihr gleichgültig, also arbeitet sie gleich, ob du sie aus Pointer-, Touch- oder Mouse-Events fütterst. Gedacht ist sie für Touch-Gesten – doppelt tippen zum Spulen, zum Zoomen, zum Liken –, wo die Logik aus Zeitfenster und Abstandsschwelle an jeder Stelle neu hergeleitet wird und dabei leicht unauffällig danebengeht: nur eine Achse verglichen, oder nach einem Treffer das Zurücksetzen vergessen, sodass drei schnelle Tipper als zwei überlappende Doppeltipps zählen.

```ts
import { createDoubleTapDetector } from 'ranuts/utils';

const detector = createDoubleTapDetector();
el.addEventListener('pointerup', (e) => {
  if (detector.check(e.clientX, e.clientY)) seek();
});
```

### `createDoubleTapDetector(options?)`

#### Parameter (`DoubleTapDetectorOptions`)

| Option          | Beschreibung                                                                | Typ      | Standard |
| --------------- | --------------------------------------------------------------------------- | -------- | -------- |
| `windowMs`      | Größter erlaubter Abstand zwischen den beiden Tippern, in ms                | `number` | `300`    |
| `maxDistancePx` | Größte erlaubte Entfernung in der Fläche zwischen den beiden Tippern, in px | `number` | `60`     |

#### `DoubleTapDetector`

| Element | Beschreibung                                                                                                                                                                                                                                                        | Typ                                               |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `check` | Vermerkt einen Tipp bei `(x, y)` und meldet, ob er zusammen mit dem unmittelbar davor einen Doppeltipp ergibt. Wird einer erkannt, beginnt die Erfassung von vorn, sodass ein dritter schneller Tipp ein neues Paar eröffnet, statt zum selben Doppeltipp zu zählen | `(x: number, y: number, now?: number) => boolean` |
| `reset` | Vergisst den zuletzt vermerkten Tipp; aufrufen, sobald eine andere Geste als ein Tipp beginnt (etwa ein Ziehen)                                                                                                                                                     | `() => void`                                      |
