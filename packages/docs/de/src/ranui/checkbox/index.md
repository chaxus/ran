---
description: 'Die Checkbox von ranui (<r-checkbox>) schaltet eine einzelne Ja/Nein-Entscheidung um — mit optionaler Beschriftung und nativer Formularunterstützung.'
---

# Checkbox

Checkbox-Komponente für eine einzelne Ja/Nein-Entscheidung, mit optionaler Beschriftung und nativer Formularunterstützung.

> **Nimm sie, wenn** du einen einzelnen Ja/Nein-Schalter mit Beschriftung brauchst, der an nativen Formularen teilnimmt: `<r-checkbox>` meldet seinen Zustand an `FormData` und ist per Tastatur bedienbar.

## Schnellstart

### Grundlegende Verwendung

<Demo>
  <r-checkbox>Angemeldet bleiben</r-checkbox>
</Demo>

```html
<r-checkbox>Angemeldet bleiben</r-checkbox>
```

Der Inhalt des Standard-Slots wird zur Beschriftung der Checkbox.

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ       | Standard  | Beschreibung                                                          |
| ----------- | --------- | --------- | --------------------------------------------------------------------- |
| `checked`   | `boolean` | `false`   | Ob die Checkbox angehakt ist                                          |
| `value`     | `string`  | `'false'` | Formularwert; spiegelt den Zustand als `'true'` / `'false'`           |
| `disabled`  | `boolean` | `false`   | Ob die Checkbox deaktiviert ist                                       |
| `required`  | `boolean` | `false`   | Ob sie angehakt sein muss, damit das Formular abgeschickt werden kann |
| `sheet`     | `string`  | `''`      | CSS, das für eigenes Styling ins Shadow DOM injiziert wird            |

> Die Attribute `checked` und `value` bleiben synchron: Setzt du eines, aktualisiert sich das andere. Angehakt ist `value` `'true'`, sonst `'false'`.

### Zustand `checked`

<Demo>
  <r-checkbox checked="true">Angehakt</r-checkbox>
  <r-checkbox checked="false">Nicht angehakt</r-checkbox>
</Demo>

```html
<r-checkbox checked="true">Angehakt</r-checkbox> <r-checkbox checked="false">Nicht angehakt</r-checkbox>
```

### Wert `value`

<Demo>
  <r-checkbox value="true">Wert true</r-checkbox>
  <r-checkbox value="false">Wert false</r-checkbox>
</Demo>

```html
<r-checkbox value="true">Wert true</r-checkbox> <r-checkbox value="false">Wert false</r-checkbox>
```

### Deaktiviert `disabled`

<Demo>
  <r-checkbox checked="true" disabled>Angehakt</r-checkbox>
  <r-checkbox checked="false" disabled>Nicht angehakt</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" disabled>Angehakt</r-checkbox>
<r-checkbox checked="false" disabled>Nicht angehakt</r-checkbox>
```

### Eigenes Styling `sheet`

Das Attribut `sheet` injiziert CSS ins Shadow DOM und lässt dich interne Teile über ihre Klassennamen ansprechen.

<Demo>
  <r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">Beschriftung mit Theme</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">Beschriftung mit Theme</r-checkbox>
```

## Events

### `change`

Wird ausgelöst, wenn die Checkbox umgeschaltet wird (per Klick oder mit Leertaste/Enter). Das Event ist ein `CustomEvent`, dessen `detail` den neuen Zustand trägt:

```ts
detail: {
  checked: boolean; // der Zustand der Checkbox nach dem Umschalten
}
```

Eine deaktivierte Checkbox löst kein `change` aus.

<Demo>
  <r-checkbox onchange="message.info(this)">Schalt mich um</r-checkbox>
</Demo>

```html
<r-checkbox onchange="handleChange(event)">Schalt mich um</r-checkbox>

<script>
  function handleChange(event) {
    console.log('checked:', event.detail.checked);
  }
</script>
```

## Slots

| Slot       | Beschreibung                                   |
| ---------- | ---------------------------------------------- |
| (Standard) | Die Beschriftung, gerendert neben dem Kästchen |

## Formularanbindung {#form-association}

`r-checkbox` ist ein formularassoziiertes Custom Element (`formAssociated = true`). Es reicht seinen Zustand über `ElementInternals.setFormValue` weiter, nimmt also an nativen Formularen teil und wird von `new FormData(form)` erfasst, wenn es ein echter Nachfahre eines nativen `<form>` ist. Der nativen Checkbox-Semantik folgend steuert es seinen `value` nur bei, wenn es angehakt ist.

Der Host selbst trägt die zugängliche Checkbox-Semantik: `role="checkbox"`, `aria-checked`, `aria-disabled` und Tastaturbedienung (Umschalten mit Leertaste oder Enter).

**Zurücksetzen**: Ein natives `form.reset()` stellt über `formResetCallback()` den Zustand wieder her, den das Kästchen beim ersten Verbinden hatte.

**Validierung**: `required` macht ein nicht angehaktes Kästchen über `ElementInternals.setValidity()` ungültig — sichtbar für `form.checkValidity()`/`form.reportValidity()`; ein `disabled`-Kästchen blockiert die Validierung nie. `checkValidity()`, `reportValidity()`, `validity` und `validationMessage` stehen am Element bereit, wie bei einem nativen Feld.

```html
<form>
  <r-checkbox name="terms" required>Ich stimme den Bedingungen zu</r-checkbox>
  <button type="submit">Absenden</button>
</form>
```

## CSS-Parts

Gestalte die interne Struktur über den `::part()`-Selektor:

| Part       | Element                                                 |
| ---------- | ------------------------------------------------------- |
| `wrapper`  | Der äußere Flex-Container mit Kästchen und Beschriftung |
| `checkbox` | Der Container des Kästchens                             |
| `input`    | Das visuell verborgene `<input type="checkbox">`        |
| `inner`    | Das gezeichnete Kästchen (Rahmen, Füllung, Häkchen)     |
| `label`    | Die Beschriftung um den Standard-Slot                   |

```css
r-checkbox::part(inner) {
  border-radius: 50%;
}
r-checkbox::part(label) {
  font-weight: 600;
}
```

## Styling

`<r-checkbox>` stellt **32 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens, die
es aus dem Theme liest. Setze eine dort, wo sie vererbt wird — `:root`, ein Wrapper oder das Element
selbst:

```css
r-checkbox {
  --ran-checkbox-color: var(--ran-color-text-secondary);
}
```

Parts: `checkbox` · `inner` · `input` · `label` · `wrapper`

Die vollständige Liste steht in den [Style-Tokens](/de/src/ranui/style-tokens#checkbox); welches Token du wählst, klärt das [Designsystem](/de/src/ranui/design-system/).

## Bewährte Praxis

- **Beschrifte deine Checkboxen**: Gib Text in den Slot, damit das Bedienelement einen zugänglichen Namen hat.
- **`checked` vs. `value`**: Nimm `checked` für den booleschen Zustand; lies `value` (`'true'` / `'false'`), wenn du Formulardaten einsammelst.
- **Deaktiviert**: Nimm `disabled`, wenn die Wahl nicht verfügbar ist.
- **Auf `change` hören**: Lies `event.detail.checked`, statt das DOM erneut abzufragen.
- **Formulare**: Setze `r-checkbox` einfach in ein `<form>`; der Wert wird automatisch erfasst, wenn es angehakt ist. Zum Helfer `serializeForm()`, der ein Absenden in ein schlichtes Objekt verwandelt, siehe [Forms](/de/src/ranui/form/).
