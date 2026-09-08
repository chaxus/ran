---
description: 'Ein kompaktes Farbfeld, das ein Panel mit Sättigungs-/Helligkeits-, Farbton- und Alpha-Reglern sowie einer HEX-/RGB-Eingabe öffnet.'
---

# Color Picker

Ein kompaktes Farbfeld, das ein Popover mit einer Sättigungs-/Helligkeitspalette, einem Farbtonregler, einem Alpha-Regler und einer HEX-/RGB-Werteingabe öffnet. Sein `value` nimmt gängige CSS-Farbzeichenketten an und gibt sie auch so zurück.

> **Nimm ihn, wenn** Nutzer eine Farbe über ein Panel mit Sättigung, Farbton und Alpha sowie eine HEX-/RGB-Eingabe wählen sollen: `<r-colorpicker>` nimmt gängige CSS-Farbzeichenketten an, gibt sie zurück und meldet bei `change` jedes Format.

## Schnellstart

### Grundlegende Verwendung

<ran-demo align="start">
  <r-colorpicker value="#006bff"></r-colorpicker>
  <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
</ran-demo>

```html
<r-colorpicker value="#006bff"></r-colorpicker> <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
```

Klicke auf das Farbfeld (oder fokussiere es und drücke Enter/Leertaste), um das Panel zu öffnen. Farbton- und Alpha-Regler lassen sich per Tastatur bedienen: Pfeiltasten schrittweise um 1, Umschalt+Pfeil um 10, Pos1/Ende springen an die Enden.

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ       | Standard | Beschreibung                                                                                      |
| ----------- | --------- | -------- | ------------------------------------------------------------------------------------------------- |
| `value`     | `string`  | `''`     | Die aktuelle Farbe als CSS-Farbzeichenkette (HEX, `rgb(...)`, `rgba(...)`)                        |
| `disabled`  | `boolean` | `false`  | Gesetzt lässt sich das Feld nicht öffnen, es fällt aus der Tabreihenfolge und ist `aria-disabled` |
| `sheet`     | `string`  | `''`     | CSS, das in das Shadow DOM der Komponente injiziert wird                                          |

### Wert `value`

Die aktuelle Farbe als CSS-Farbzeichenkette. Auf dem Weg hinein werden HEX (`#1677FF`, `#fff`), `rgb(...)` und `rgba(...)` akzeptiert. Auf dem Weg hinaus ist der kanonische Wert eine sechsstellige HEX-Zeichenkette, wenn die Farbe vollständig deckend ist, und eine `rgba(...)`-Zeichenkette, sobald Alpha unter 1 liegt.

<ran-demo align="start">
  <r-colorpicker value="#00c853"></r-colorpicker>
  <r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
</ran-demo>

```html
<r-colorpicker value="#00c853"></r-colorpicker>
<r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
<r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.value = '#00c853';
console.log(picker.value); // liest die aktuelle Farbe zurück
toolbar.append(picker);
```

### Deaktiviert `disabled`

Setze das Attribut `disabled`, um den Picker untätig zu machen: Das Feld öffnet das Panel nicht mehr (weder per Maus noch per Tastatur), fällt aus der Tabreihenfolge, und der Host wird mit `aria-disabled="true"` ausgezeichnet. Nimmst du das Attribut weg, ist die Bedienung wieder normal.

<ran-demo align="start">
  <r-colorpicker value="#006bff" disabled></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)" disabled></r-colorpicker>
</ran-demo>

```html
<r-colorpicker value="#006bff" disabled></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.disabled = true; // Bedienung sperren
picker.disabled = false; // wieder freigeben
toolbar.append(picker);
```

### Externe Styles `sheet`

CSS, das in das Shadow DOM der Komponente injiziert wird — dieselbe `sheet`-Konvention wie bei jeder anderen ranui-Komponente.

```html
<r-colorpicker value="#006bff" sheet=".ran-colorpicker { border-radius: 6px; }"></r-colorpicker>
```

## Events

### `change`

Wird bei jeder Farbänderung ausgelöst: beim Ziehen in der Palette, beim Bewegen eines Reglers, beim Bearbeiten der Werteingabe oder beim Setzen des Attributs `value`. Es **bubbelt** und ist **composed** (überschreitet Shadow-Grenzen). `event.detail` trägt die Farbe in jedem Format:

| Feld    | Typ      | Beispiel                                  |
| ------- | -------- | ----------------------------------------- |
| `value` | `string` | `"#1677ff"` / `"rgba(22, 119, 255, 0.5)"` |
| `hex`   | `string` | `"#1677ff"`                               |
| `rgb`   | `string` | `"rgb(22, 119, 255)"`                     |
| `rgba`  | `string` | `"rgba(22, 119, 255, 0.5)"`               |
| `alpha` | `number` | `0.5`                                     |

```html
<r-colorpicker value="#1677ff"></r-colorpicker>

<script>
  const picker = document.createElement('r-colorpicker');
  picker.addEventListener('change', (e) => {
    console.log(e.detail.hex, e.detail.alpha);
  });
  toolbar.append(picker);
</script>
```

## CSS-Parts

Das auslösende Farbfeld stellt zwei Parts bereit, um es von außerhalb des Shadow DOM zu gestalten:

| Part     | Beschreibung                                                     |
| -------- | ---------------------------------------------------------------- |
| `block`  | Der Container des Farbfelds (Auslösekasten mit Schachbrettgrund) |
| `swatch` | Die innere Füllung, die die aktuelle Farbe zeigt                 |

```css
r-colorpicker::part(block) {
  box-shadow: 0 0 0 1px var(--line);
}
```

Das Popover-Panel wird in `document.body` portaliert; seine Styles tragen deshalb einen Namensraum (`.ran-color-picker-*`) und reisen mit dem Panel, statt am Host zu hängen.

### CSS-Variablen

Das auslösende Farbfeld liest diese Tokens:

| Variable                                | Zweck                          |
| --------------------------------------- | ------------------------------ |
| `--ran-colorpicker-background`          | Hintergrund des Farbfelds      |
| `--ran-colorpicker-border`              | Rahmen des Farbfelds           |
| `--ran-colorpicker-hover-border-color`  | Rahmenfarbe beim Überfahren    |
| `--ran-colorpicker-border-radius`       | Eckenradius des Farbfelds      |
| `--ran-colorpicker-block-border-radius` | Eckenradius des inneren Blocks |
| `--ran-colorpicker-transition`          | Übergang beim Überfahren       |

```css
r-colorpicker {
  --ran-colorpicker-border-radius: 6px;
}
```

## Bewährte Praxis

- **Eingabeformate**: Gib `value` jede beliebige CSS-Farbzeichenkette: HEX, `rgb(...)` oder `rgba(...)`; der Picker normalisiert intern.
- **Ergebnis lesen**: Höre auf `change` und lies aus `event.detail` genau das Format, das du brauchst (`hex`, `rgb`, `rgba`, `alpha`).
- **Alpha**: Nimm eine `rgba(...)`-Eingabe oder den Alpha-Regler, wenn du Transparenz brauchst; sobald Alpha unter 1 fällt, wird der zurückgelesene `value` zu einer `rgba(...)`-Zeichenkette.
- **Tastatur**: Farbfeld und beide Regler sind fokussierbar und per Tastatur bedienbar; eine Maus ist nicht nötig.
- **Import**: Lade über `import 'ranui'` (registriert jede Komponente) oder eigenständig über `import 'ranui/colorpicker'`.
