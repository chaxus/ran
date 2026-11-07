---
description: 'Ein Select für Farbthemes (system / light / dark), angebunden an die Theme-API von ranui.'
---

# ThemeSwitch

Ein kompaktes **Select** für Farbthemes (**system / light / dark**), angebunden an die
[Theme-API](/de/ranui/theme/) von ranui. Eine Auswahl ruft `setTheme()` auf, speichert unter
`ran-theme` und hält alle Instanzen synchron. Stil / Liquid Glass ist eine eigene Achse: nutze
`<r-surface-switch>`.

> **Wann nutzen**: wenn du ein fertiges Farbtheme-Steuerelement brauchst.

## Schnellstart

### Grundlegende Verwendung

<ran-demo>
  <r-theme-switch></r-theme-switch>
</ran-demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui';
import 'ranui/theme-switch';
```

Rufe `initTheme()` einmal beim Laden der Seite auf.

```js
import { initTheme } from 'ranui';
initTheme();
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ                             | Standard   | Beschreibung                                              |
| ----------- | ------------------------------- | ---------- | --------------------------------------------------------- |
| `value`     | `'system' \| 'light' \| 'dark'` | `'system'` | Aktuelles Theme aus `getTheme()`. Setzen wendet an und speichert. |
| `sheet`     | `string`                        | `''`       | CSS für das Shadow DOM.                                   |

### Lokalisierungsattribute

| Attribut       | Standard   | Beschreibung                |
| -------------- | ---------- | --------------------------- |
| `label`        | `'Theme'`  | `aria-label` des Selects.   |
| `label-system` | `'System'` | Text der system-Option.     |
| `label-light`  | `'Light'`  | Text der light-Option.      |
| `label-dark`   | `'Dark'`   | Text der dark-Option.       |

## Ereignisse

| Ereignis | Detail                                     | Beschreibung                                      |
| -------- | ------------------------------------------ | ------------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | Bei Themenwahl. Bubbelt und durchquert Shadow DOM. |

## CSS-Parts

| Part                        | Beschreibung          |
| --------------------------- | --------------------- |
| `select`                    | Das innere `r-select`.|
| `option`                    | Jedes `r-option`.     |
| `system` / `light` / `dark` | Die einzelnen Optionen.|

```css
r-theme-switch {
  --ran-theme-switch-width: 9rem;
}
```
