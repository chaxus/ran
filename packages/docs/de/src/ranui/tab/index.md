---
description: 'Die ranui-Tabs (<r-tabs>), ein natives Web Component für jedes Framework, ordnen Inhalte in umschaltbare Bereiche.'
---

# Tab

Reiter-Container, der zwischen Bereichen umschaltet. Setze `<r-tabs>` als Container ein, mit einem oder mehreren `<r-tab>`-Bereichen darin.

> **Einsetzen, wenn** du einen Reiter-Container brauchst, der zwischen Bereichen umschaltet. Baue `<r-tabs>` mit `<r-tab>`-Kindern, von denen jedes ein `label` für die Kopfzeile und den Inhalt des Bereichs mitbringt.

## Schnellstart

### Grundlegende Verwendung

<Demo column>
  <r-tabs>
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs>
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

Jedes `<r-tab>` wird zu einem Bereich; sein `label` erscheint als Schaltfläche in der Kopfzeile, und der eingeschobene Inhalt ist der Rumpf des Bereichs. Wer eine Kopfzeile wählt, lässt den zugehörigen Bereich hereingleiten.

## API-Referenz

### Eigenschaften von `r-tabs`

Der Container. Er hält die Kopfzeile, die Markierung des aktiven Reiters und den Inhaltsbereich.

| Eigenschaft | Typ       | Standard              | Beschreibung                                                                                     |
| ----------- | --------- | --------------------- | ------------------------------------------------------------------------------------------------ |
| `active`    | `string`  | erster aktiver Reiter | Der `r-key` des gerade aktiven Reiters                                                           |
| `type`      | `string`  | `'flat'`              | Stil der Kopfzeile: `flat`, `line`                                                               |
| `align`     | `string`  | `'start'`             | Ausrichtung der Kopfzeile: `start`, `center`, `end`                                              |
| `effect`    | `boolean` | `false`               | Schaltet die Welle auf den Kopfzeilen-Schaltflächen ein und blendet die gleitende Markierung aus |
| `sheet`     | `string`  | `''`                  | CSS-Text, der in das Shadow DOM eingefügt wird                                                   |

> Der Setter von `active` nimmt einen Schlüssel als Zeichenkette; `null` zuzuweisen entfernt das Attribut. Ohne gesetztes `active` wird beim Einhängen der erste nicht deaktivierte Reiter gewählt.

### Eigenschaften von `r-tab`

Ein einzelner Bereich. Seine Attribute liest das übergeordnete `<r-tabs>`, um die passende Schaltfläche in der Kopfzeile zu bauen.

| Eigenschaft | Typ       | Standard | Beschreibung                                                                     |
| ----------- | --------- | -------- | -------------------------------------------------------------------------------- |
| `label`     | `string`  | `''`     | Text in der Kopfzeile des Reiters                                                |
| `r-key`     | `string`  | Index    | Eindeutige Kennung innerhalb eines `<r-tabs>`; wird mit `active` verglichen      |
| `icon`      | `string`  | —        | Name eines `r-icon`, das vor der Beschriftung erscheint                          |
| `iconSize`  | `string`  | —        | Größe des Symbols in der Kopfzeile                                               |
| `disabled`  | `boolean` | `false`  | Macht den Reiter unwählbar                                                       |
| `effect`    | `boolean` | —        | Welleneffekt in der Kopfzeile (setzt normalerweise das `effect` des Elternteils) |
| `sheet`     | `string`  | `''`     | CSS-Text, der in das Shadow DOM eingefügt wird                                   |

> Getter und Setter der Eigenschaft `key` lesen und schreiben das Attribut `r-key` (der schlichte Name `key` wird vermieden, weil er ein reserviertes Feld ist). Setze `label` und `r-key`, bevor das Element verbunden wird: Änderungen an diesen beiden Attributen werden nach dem Bau der Kopfzeilen nicht erneut verarbeitet.

### Stil der Kopfzeile `type`

`flat` (Standard) zeigt eine gleitende Unterstreichung als Markierung; `line` zeichnet Reiter mit Rahmen.

<Demo column>
  <r-tabs type="flat">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs type="flat">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>

<r-tabs type="line">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### Ausrichtung der Kopfzeile `align`

Richtet die Kopfzeile aus. Standard ist `start`.

<Demo column>
  <r-tabs type="line" align="start">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="center">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="end">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs type="line" align="start"> ... </r-tabs>
<r-tabs type="line" align="center"> ... </r-tabs>
<r-tabs type="line" align="end"> ... </r-tabs>
```

### Aktiver Reiter: `active` und `r-key`

- `r-key` ist ein Attribut von `<r-tab>` und gibt jedem Bereich innerhalb desselben `<r-tabs>` eine stabile Identität. Fehlt es, gilt der Index des Bereichs.
- `active` ist ein Attribut von `<r-tabs>` und wählt den anfangs aktiven Reiter: Gezeigt wird der Bereich, dessen `r-key` gleich `active` ist.

Ohne ausdrückliche Schlüssel passt `active` auf den nullbasierten Index:

<Demo column>
  <r-tabs active="1">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="1">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

Mit ausdrücklichen `r-key`-Werten (Bereiche ohne Schlüssel fallen auf ihren Index zurück):

<Demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a">11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a">11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

> Jeder `r-key` innerhalb eines `<r-tabs>` muss eindeutig sein: Doppelte oder fehlende Schlüssel an einzelnen Bereichen werfen beim Bau der Kopfzeilen einen Fehler.

### Deaktivierter Bereich `disabled`

Ein deaktiviertes `<r-tab>` lässt sich nicht wählen und wird auch bei der Wahl des voreingestellten aktiven Reiters übersprungen.

<Demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

### Symbol in der Kopfzeile: `icon` und `iconSize`

`<r-tab>` nimmt ein Attribut `icon` (den Namen eines `r-icon`), das vor der Beschriftung gezeichnet wird; `iconSize` legt seine Größe fest.

<Demo column>
  <r-tabs>
    <r-tab label="tab1" icon="edit">11111</r-tab>
    <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs>
  <r-tab label="tab1" icon="edit">11111</r-tab>
  <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### Welleneffekt `effect`

Setze `effect` auf `<r-tabs>`, damit die Schaltflächen der Kopfzeile beim Klicken eine Welle zeigen. Solange `effect` aktiv ist, bleibt die gleitende Unterstreichung verborgen.

<Demo column>
  <r-tabs effect="true">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs effect="true">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

## Slots

| Element  | Slot       | Beschreibung                                                |
| -------- | ---------- | ----------------------------------------------------------- |
| `r-tabs` | (Standard) | Nimmt die `<r-tab>`-Bereiche auf                            |
| `r-tab`  | (Standard) | Der Inhalt des Bereichs, sichtbar wenn der Reiter aktiv ist |

## CSS-Parts

`r-tabs` stellt bereit:

| Part           | Beschreibung                                |
| -------------- | ------------------------------------------- |
| `tabs`         | Äußere Hülle                                |
| `header`       | Hülle der Kopfzeile                         |
| `nav`          | Die Tablist mit den Einträgen der Kopfzeile |
| `indicator`    | Die gleitende Unterstreichung               |
| `content`      | Sichtfenster für den Bereichsinhalt         |
| `content-wrap` | Die gleitende Spur, die alle Bereiche trägt |

`r-tab` stellt bereit:

| Part      | Beschreibung                  |
| --------- | ----------------------------- |
| `content` | Der Inhalts-Slot des Bereichs |

## Ereignisse

### `change`

`<r-tabs>` sendet ein `change`-`CustomEvent`, wenn sich ein beobachtetes Attribut ändert — am häufigsten beim Wechsel des aktiven Reiters. `event.detail.active` ist der aktuelle aktive Schlüssel (der `r-key` des gewählten `<r-tab>`, oder dessen Index, wenn kein `r-key` gesetzt ist).

```js
const tabs = document.createElement('r-tabs');
tabs.addEventListener('change', (e) => {
  console.log('aktiver Reiter:', e.detail.active);
});
tabbar.append(tabs);
```

`<r-tab>` sendet keine eigenen Ereignisse.

## Styling

`<r-tabs>` stellt **10 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens, die es aus dem Theme liest. Setze eines überall dort, wo es vererbt wird: `:root`, ein umgebendes Element oder das Element selbst:

```css
r-tabs {
  --ran-tab-content-background: var(--ran-color-bg-subtle);
}
```

Parts: `content` · `content-wrap` · `header` · `indicator` · `nav` · `tabs`

Die vollständige Liste steht bei den [Style-Tokens](/de/src/ranui/style-tokens#tab); welches Token das richtige ist, klärt das [Designsystem](/de/src/ranui/design-system/).

## Bewährte Vorgehensweisen

- **Stabile Identität**: Gib jedem `<r-tab>` einen eindeutigen `r-key` und steuere die Auswahl über `active` an `<r-tabs>`, statt dich auf Positionsindizes zu verlassen.
- **Wahl des Stils**: Nimm `type="line"` für eine gerahmte Reiterleiste im Dokumentstil und `type="flat"` (Standard) für die schlichte gleitende Unterstreichung.
- **Ausrichtung**: Mit `align="center"` oder `align="end"` verschiebst du die Kopfzeile in breiten Containern.
- **Deaktivierte Bereiche**: Markiere nicht verfügbare Bereiche mit `disabled`; sie werden sowohl bei Klicks als auch bei der Vorauswahl übersprungen.
- **Tastaturbedienung**: Die Kopfzeile ist eine WAI-ARIA-Tablist: Pfeiltasten wechseln zwischen den Reitern (auch `Pos1`/`Ende`), und nur der aktive Reiter liegt in der Tab-Reihenfolge.
