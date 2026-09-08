---
description: 'Eine tief liegende Primitive für schwebende Panels, die Positionierung und Stapelkontext bereitstellt und auf der r-popover und r-select aufbauen.'
---

# Dropdown

Eine tief liegende Primitive für schwebende Panels: eine abgerundete, angehobene Fläche mit optionalem Richtungspfeil. Sie trägt den Overlay-Stapelkontext und ist der Baustein, den `r-popover` und `r-select` positionieren und nach `<body>` portalieren.

> **Nimm sie, wenn** du ein tief liegendes schwebendes Panel brauchst, um Overlays wie Popovers oder Auswahlmenüs zu bauen: `<r-dropdown>` bringt Stapelkontext und Pfeil mit, du musst die Positionierung also nicht selbst schreiben.

## Schnellstart

### Grundlegende Verwendung

<ran-demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">Inhalt des schwebenden Panels</div>
  </r-dropdown>
</ran-demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">Inhalt des schwebenden Panels</div>
</r-dropdown>
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ      | Standard | Beschreibung                                                                     |
| ----------- | -------- | -------- | -------------------------------------------------------------------------------- |
| `arrow`     | `string` | `''`     | Seite des Pfeils: `top`, `bottom`, `left`, `right`. Weglassen = kein Pfeil.      |
| `transit`   | `string` | `''`     | Animationsklasse, die am Panel gespiegelt wird, solange das Attribut gesetzt ist |
| `sheet`     | `string` | `''`     | CSS, das in das Shadow DOM der Komponente injiziert wird                         |

### Pfeilrichtung `arrow`

Zeichnet einen zeigenden Pfeil an einer Seite des Panels. Lass das Attribut weg, wenn du keinen Pfeil willst.

<ran-demo column>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="top"</div>
  </r-dropdown>
  <r-dropdown arrow="bottom" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="bottom"</div>
  </r-dropdown>
  <r-dropdown arrow="left" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="left"</div>
  </r-dropdown>
  <r-dropdown arrow="right" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="right"</div>
  </r-dropdown>
</ran-demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">arrow="top"</div>
</r-dropdown>
<r-dropdown arrow="bottom">
  <div style="padding: 12px;">arrow="bottom"</div>
</r-dropdown>
<r-dropdown arrow="left">
  <div style="padding: 12px;">arrow="left"</div>
</r-dropdown>
<r-dropdown arrow="right">
  <div style="padding: 12px;">arrow="right"</div>
</r-dropdown>
```

### Eingangsanimation `transit`

Ein CSS-Klassenname, der am Panel gespiegelt wird, um eine Ein- oder Ausblendanimation abzuspielen. Die Komponente bringt diese mit: `ran-dropdown-down-in` / `-down-out` / `-up-in` / `-up-out` / `-left-in` / `-left-out` / `-right-in` / `-right-out`.

Die Klasse lebt genau so lange wie das Attribut: Wer es setzt, entscheidet, wann die Animation vorbei ist, und das Attribut zu entfernen entfernt die Klasse. (Früher lief sie nach etwa 300 ms von selbst ab — eine Dauer, die neben der im Stylesheet noch einmal im JS stand. Dieser Timer entfernte, was `transit` im Moment des Auslösens sagte, und nicht die Klasse, die er selbst hinzugefügt hatte; die Richtung innerhalb dieses Fensters umzukehren ließ die erste Klasse also dauerhaft am Panel, mit `-in` und `-out` gleichzeitig.)

`getAnimationTarget()` liefert das Element, auf dem die Animation tatsächlich läuft. Es liegt im Shadow Root, `getAnimations()` am Host meldet also nichts, und `{ subtree: true }` überschreitet die Grenze nicht. Code, der auf das Ende der Panel-Transition wartet, sollte `getAnimationTarget()` aufrufen, statt im Shadow-Baum nach einem Klassennamen zu greifen.

<ran-demo>
  <r-dropdown transit="ran-dropdown-down-in" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">Blendet beim Verbinden ein</div>
  </r-dropdown>
</ran-demo>

```html
<r-dropdown transit="ran-dropdown-down-in">
  <div style="padding: 12px;">Blendet beim Verbinden ein</div>
</r-dropdown>
```

### Externe Styles `sheet`

CSS, das in das Shadow DOM des Panels injiziert wird — dieselbe `sheet`-Konvention wie bei jeder anderen ranui-Komponente.

```html
<r-dropdown arrow="top" sheet=".ranui-dropdown { border: 1px solid #999; }">
  <div style="padding: 12px;">Eigens gestaltetes Panel</div>
</r-dropdown>
```

## Events

`r-dropdown` ist eine passive Fläche und löst keine eigenen Events aus. Positioniert, gezeigt und versteckt wird es von dem, der es verwendet (etwa `r-popover` oder `r-select`).

## Slots

| Slot       | Beschreibung                                 |
| ---------- | -------------------------------------------- |
| (Standard) | Der Inhalt des Panels, unverändert gerendert |

## CSS-Parts

| Part       | Beschreibung                                                |
| ---------- | ----------------------------------------------------------- |
| `dropdown` | Die Panelfläche, zum Gestalten von außerhalb des Shadow DOM |

```css
r-dropdown {
  --ran-dropdown-background: var(--ran-color-bg-muted);
  --ran-dropdown-border-radius: 8px;
}
r-dropdown::part(dropdown) {
  border: 1px solid var(--ran-color-border);
}
```

Jede sichtbare Eigenschaft lässt sich über `--ran-dropdown-*`-Tokens überschreiben, etwa `--ran-dropdown-background`, `--ran-dropdown-border-radius`, `--ran-dropdown-box-shadow`, `--ran-dropdown-padding`, `--ran-dropdown-arrow-width` und `--ran-dropdown-host-z-index`. Der Pfeil ist ein Inline-SVG, das über seine eigene `viewBox` skaliert — `--ran-dropdown-arrow-width`/`-height` ändern also die Größe des Dreiecks selbst, nicht die eines leeren Kastens darum herum:

<ran-demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px; --ran-dropdown-arrow-width: 28px; --ran-dropdown-arrow-height: 28px;">
    <div style="padding: 12px;">--ran-dropdown-arrow-width: 28px</div>
  </r-dropdown>
</ran-demo>

```css
r-dropdown {
  --ran-dropdown-arrow-width: 28px;
  --ran-dropdown-arrow-height: 28px;
}
```

## Bewährte Praxis

- **Tief liegende Primitive**: Nimm `r-dropdown` nur dann direkt, wenn du ein eigenes schwebendes Panel brauchst; für übliche Fälle sind `r-popover` oder `r-select` die bessere Wahl.
- **Dem Host Maße geben**: Das Panel übernimmt standardmäßig `width` und `height: 100%` des Hosts — gib dem Host also eine ausdrückliche Größe und Position und portaliere ihn dann.
- **Stapelung**: Der Host trägt `--ran-z-dropdown` (`1100`) und liegt damit über Dialogen; überschreibe es bei Bedarf mit `--ran-dropdown-host-z-index`.
- **Der Pfeil zentriert sich standardmäßig auf sich selbst**: `r-dropdown` verfolgt kein externes „Auslöser“-Element — es hat nur die Maße seines eigenen Panels. Ohne einen positionierenden Verwender zentriert sich `arrow="top"`/`"bottom"` auf der Breite des Panels selbst; genau das ist der richtige Standard, wenn man `r-dropdown` blank verwendet (wie in den Demos oben). `r-popover` sitzt eigens deshalb auf `r-dropdown`, um Auslöser-Verfolgung zu ergänzen: Es misst das echte Auslöser-Element und gibt über `--ran-dropdown-arrow-anchor-offset` einen Pixelversatz zurück, sodass der Pfeil auf die Mitte des Auslösers zeigt, auch wenn das Panel breiter ist und an einer Kante statt mittig ausgerichtet wird. Wer auf `r-dropdown` ein eigenes Panel mit Auslöser-Verfolgung baut, kann diese Variable direkt setzen, statt die Positionierungslogik von `r-popover` nachzubauen.
- **Import**: Lade über `import 'ranui'` (registriert jede Komponente) oder eigenständig über `import 'ranui/dropdown'`.
