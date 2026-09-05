---
description: 'Der Button von ranui (<r-button>) ist eine frameworkunabhängige Web Component für sofortige Aktionen — mit mehreren Typen, Größen sowie Lade- und Deaktiviert-Zustand.'
---

# Button

Button-Komponente für sofortige Aktionen, mit mehreren Stilen und Zuständen.

> **Nimm ihn, wenn** du ein klickbares Aktionselement brauchst, das die Stile primary, contrast, warning und text sowie Deaktivierung und Icons schon mitbringt: greife zu `<r-button>`, statt einen nackten `<button>` zu gestalten.

## Schnellstart

### Grundlegende Verwendung

<Demo>
  <r-button>Button</r-button>
</Demo>

```html
<r-button>Button</r-button>
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ       | Standard    | Beschreibung                                                    |
| ----------- | --------- | ----------- | --------------------------------------------------------------- |
| `type`      | `string`  | `'default'` | Button-Typ: `default`, `primary`, `contrast`, `warning`, `text` |
| `disabled`  | `boolean` | `false`     | Ob der Button deaktiviert ist                                   |
| `icon`      | `string`  | `''`        | Name des Button-Icons                                           |
| `effect`    | `boolean` | `true`      | Ob beim Klick der Wellen-Effekt gezeigt wird                    |

### Button-Typen `type`

<Demo>
  <r-button type="primary">Primary Button</r-button>
  <r-button type="warning">Warning Button</r-button>
  <r-button type="text">Text Button</r-button>
  <r-button>Default Button</r-button>
</Demo>

```html
<r-button type="primary">Primary Button</r-button>
<r-button type="warning">Warning Button</r-button>
<r-button type="text">Text Button</r-button>
<r-button>Default Button</r-button>
```

`primary` ist die monochrome Aktion (aus der Designsprache Geist): Schwarz auf Weiß im hellen, Weiß auf Schwarz im dunklen Modus. Blau trägt hier keine Markenbedeutung; es bleibt Links und dem Fokusring vorbehalten. Es stützt sich auf die Tokens `--ran-color-primary*` (`--ran-color-primary`, `-hover`, `-active` sowie `--ran-color-primary-text` für die invertierte Schriftfarbe); siehe [Theme & Tokens](/de/src/ranui/theme/).

### Deaktiviert `disabled`

<Demo>
  <r-button type="primary" disabled>Primary Button</r-button>
  <r-button type="warning" disabled>Warning Button</r-button>
  <r-button type="text" disabled>Text Button</r-button>
  <r-button disabled>Default Button</r-button>
</Demo>

```html
<r-button type="primary" disabled>Primary Button</r-button>
<r-button type="warning" disabled>Warning Button</r-button>
<r-button type="text" disabled>Text Button</r-button>
<r-button disabled>Default Button</r-button>
```

### Button mit Icon `icon`

> 💡 **Tipp**: Für eine präzise Icon-Positionierung nimm die Icon-Komponente direkt.

<Demo>
  <r-button type="default" icon="user">Default Button</r-button>
  <r-button type="primary" icon="home">Primary Button</r-button>
</Demo>

```html
<r-button type="default" icon="user">Default Button</r-button>
<r-button type="primary" icon="home">Primary Button</r-button>
```

### Effekt steuern `effect`

Die Klick-Welle ist standardmäßig an. Setze `effect="false"` für einen schlichten Button ohne sie. Die beiden Buttons unten unterscheiden sich nur in diesem Attribut — klicke beide und vergleiche. Die Welle ist ein Effekt für Zeigegeräte und wird erst ab einer Viewport-Breite von 1024px gezeichnet.

<Demo>
  <r-button type="primary" icon="home">Mit Welle (Standard)</r-button>
  <r-button type="primary" icon="home" effect="false">Ohne Welle</r-button>
</Demo>

```html
<r-button type="primary" icon="home">Mit Welle (Standard)</r-button>
<r-button type="primary" icon="home" effect="false">Ohne Welle</r-button>
```

Nur der wörtliche Wert `false` schaltet die Welle ab; `effect="true"` und jeder andere Wert lassen sie an. Aus dem Skript heraus setze die Eigenschaft als Boolean: `button.effect = false`.

## Events

```html
<r-button onclick="handleClick()">Click Me</r-button>

<script>
  function handleClick() {
    console.log('Button clicked');
  }
</script>
```

## Styling

`<r-button>` stellt **43 eigene CSS-Custom-Properties** bereit: `--ran-btn-background`, `--ran-btn-color`, `--ran-btn-border-color`, deren `hover`- und `active`-Varianten, die drei der `warning`-Variante sowie die semantischen Tokens, die er aus dem Theme liest.

```css
/* ein Button oder alle Buttons unterhalb eines Bereichs */
r-button {
  --ran-btn-background: var(--ran-color-bg-subtle);
  --ran-btn-hover-background: var(--ran-color-bg-hover);
  --ran-btn-border-radius: var(--ran-radius-full);
}
```

Ist die Änderung nicht buttonspezifisch, greife stattdessen zu einem **semantischen** Token: `--ran-color-primary` zu überschreiben ändert die primäre Aktion überall, nicht nur hier.

Parts: `button` · `content`

```css
r-button::part(content) {
  letter-spacing: 0.02em;
}
```

Die vollständige Liste steht in den [Style-Tokens](/de/src/ranui/style-tokens#button); welches Token du wählst, klärt das [Designsystem](/de/src/ranui/design-system/).

## Bewährte Praxis

- **Primäre Aktionen**: `type="primary"` (monochrom: Schwarz auf Weiß / Weiß auf Schwarz)
- **Gefährliche Aktionen**: `type="warning"`
- **Sekundäre Aktionen**: `type="text"`
- **Deaktiviert**: `disabled`, wenn die Aktion nicht verfügbar ist
- **Icons**: passende Icons ergänzen, um die Bedienung zu erleichtern
