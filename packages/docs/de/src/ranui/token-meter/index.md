---
description: 'Der TokenMeter von ranui (<r-token-meter>) zeigt, wie viel des Kontextfensters eine Konversation belegt — bevor der Anbieter die nächste Anfrage ablehnt.'
---

# TokenMeter

Wie viel des Kontextfensters eine Konversation belegt.

> **Nimm ihn, wenn** du eine Chat-Oberfläche gegen ein Modell mit Kontextgrenze baust. Ein Client,
> der das nicht zeigt, läuft anfangs gut und scheitert dann: Jede Runde schickt die gesamte
> Historie erneut, die Anfrage wächst nur noch, und irgendwann lehnt der Anbieter sie wegen
> Überschreitung ab. Diese Komponente zeigt dieses Wachstum, bevor die Anfrage abgelehnt wird.

## Schnellstart

### Grundlegende Verwendung

<Demo column>
  <r-token-meter limit="65536" used="12800"></r-token-meter>
  <r-token-meter limit="65536" used="54000"></r-token-meter>
  <r-token-meter limit="65536" used="69000"></r-token-meter>
</Demo>

```html
<r-token-meter limit="65536" used="12800"></r-token-meter>
```

```js
const meter = document.createElement('r-token-meter');
meter.limit = 65536;
meter.used = 41200; // der Kontext, den die nächste Anfrage trägt
meter.spent = 128431; // über die Konversation abgerechnete Tokens, optional
composer.append(meter);
```

Der Balken füllt sich bis `used / limit` und steigt über drei Stufen: **ok**, **warn** (ab 80 % des
Limits) und **over**. `level` wird am Host gespiegelt, die Seite kann also auf dieselbe Eskalation
reagieren, die der Balken zeigt:

```css
r-token-meter[level='warn'] ~ .composer-hint {
  display: block;
}
```

### `used` und `spent` sind verschiedene Zahlen

- **`used`**: Was die _nächste Anfrage_ trägt — die Historie, nicht die ganze Konversation. Auf
  diese Zahl bezieht sich das Limit, und sie zeichnet der Balken.
- **`spent`**: Was über die Konversation hinweg bereits abgerechnet wurde. Sie wächst nur und ist
  vom Fenster nicht begrenzt.

Ein gekürztes Protokoll senkt `used` und lässt `spent` unberührt. Nur eine der beiden Zahlen zu
zeigen beantwortet nur eine der zwei Fragen, die ein Nutzer hat („Passt die nächste Nachricht noch?“
und „Was hat mich das gekostet?“).

### Ohne Limit

Ist `limit` nicht gesetzt oder null, verschwindet der Balken und nur die Zahlen bleiben — praktisch,
solange die Fenstergröße unbekannt ist.

<Demo>
  <r-token-meter used="41200" spent="128431"></r-token-meter>
</Demo>

### Neu beschriften

<Demo>
  <r-token-meter label="Kontext" limit="65536" used="41200"></r-token-meter>
</Demo>

```html
<r-token-meter label="Kontext" limit="65536" used="41200"></r-token-meter>
<!-- label="" lässt nur die Zahlen stehen -->
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Attribut | Typ                        | Standard    | Beschreibung                                                                     |
| ----------- | -------- | -------------------------- | ----------- | -------------------------------------------------------------------------------- |
| `limit`     | `limit`  | `number`                   | `0`         | Größe des Kontextfensters in Tokens. Null oder fehlend blendet den Balken aus.   |
| `used`      | `used`   | `number`                   | `0`         | Tokens, die die nächste Anfrage trägt.                                           |
| `spent`     | `spent`  | `number`                   | `0`         | Bisher über die Konversation abgerechnete Tokens.                                |
| `label`     | `label`  | `string`                   | `'Context'` | Präfix der Anzeige; `''` lässt nur die Zahlen stehen.                            |
| `level`     | `level`  | `'ok' \| 'warn' \| 'over'` | abgeleitet  | Wie voll das Fenster ist. **Vom Element gesetzt**: Schreiben wird überschrieben. |
| `sheet`     | `sheet`  | `string`                   | `''`        | CSS, das in den Shadow Root injiziert wird.                                      |

Die Zahlen sind fürs schnelle Lesen formatiert: unter tausend exakt (`847` ist kurz genug, um genau
gelesen zu werden), darüber abgekürzt (`41.2k`, `128k`); die dritte Stelle von `128.431` ändert
nichts daran, was ein Leser damit tut.

### Parts

| Part    | Element                     |
| ------- | --------------------------- |
| `meter` | Das gesamte Element         |
| `track` | Der Hintergrund des Balkens |
| `fill`  | Der gefüllte Teil           |
| `text`  | Beschriftung und Zahlen     |

## Barrierefreiheit

Das Element trägt immer ein `title`, das die Zahlen nennt — **Farbe ist damit nie der einzige
Träger** der Warnung: Dass der Balken bernsteinfarben wird, ist ein zweites Signal, nicht das
einzige. Behalte das bei, wenn du die Stufen umgestaltest.

## Styling

`<r-token-meter>` stellt **9 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens,
die es aus dem Theme liest. Setze eine dort, wo sie vererbt wird: `:root`, ein Wrapper oder das
Element selbst:

```css
r-token-meter {
  --ran-token-meter-fill-background: var(--ran-color-bg-subtle);
}
```

Parts: `fill` · `meter` · `text` · `track`

Die vollständige Liste steht in den [Style-Tokens](/de/src/ranui/style-tokens#token-meter); welches Token du wählst, klärt das [Designsystem](/de/src/ranui/design-system/).

## Bewährte Praxis

- **Aktualisiere `used` an derselben Stelle, an der du die Anfrage baust**, nicht in einem
  Render-Durchlauf: Die Zahl, der Menschen vertrauen, ist die, die die nächste Anfrage wirklich sendet.
- **Eskaliere um den Meter herum, nicht in ihm.** Bei `level="over"` ist die nützliche Oberfläche ein
  Vorschlag (zusammenfassen, einen neuen Thread beginnen) — und der gehört der Anwendung.
- **Animiere die Füllung nicht bei einem Themewechsel**: siehe die
  [Designrichtlinien](/de/src/ranui/design-guides/#motion).
