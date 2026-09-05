---
description: 'Das ranui-Input (<r-input>) ist das grundlegende Formularfeld für Tastatureingaben — mit Typen, Größen und Validierung, als natives Web Component für jedes Framework.'
---

# Input

Eingabekomponente zum Erfassen von Inhalt über die Tastatur: das grundlegendste Formularelement.

> **Einsetzen, wenn** du ein Textfeld mit fester Beschriftung darüber, führendem Symbol, Validierungsstatus samt Meldung und Teilnahme an nativen Formularen brauchst: `<r-input>` deckt Text-, Passwort- und Zahleneingabe ab.

## Schnellstart

### Grundlegende Verwendung

<Demo column>
  <r-input placeholder="Text eingeben"></r-input>
</Demo>

```html
<r-input placeholder="Text eingeben"></r-input>
```

## API-Referenz

### Eigenschaften

| Eigenschaft   | Typ       | Standard | Beschreibung                                                                      |
| ------------- | --------- | -------- | --------------------------------------------------------------------------------- |
| `label`       | `string`  | `''`     | Feste Beschriftung, gezeichnet über dem Feld                                      |
| `placeholder` | `string`  | `''`     | Platzhaltertext, an das native `<input>` weitergereicht                           |
| `value`       | `string`  | `''`     | Wert des Feldes; als Attribut gespiegelt und an das Formular weitergegeben        |
| `disabled`    | `boolean` | `false`  | Ob das Feld deaktiviert ist                                                       |
| `type`        | `string`  | `''`     | Nativer Eingabetyp für das innere Bedienelement (`text`, `password`, `number`, …) |
| `icon`        | `string`  | `''`     | Name des führenden Symbols im Feld (als `r-icon` gezeichnet)                      |
| `name`        | `string`  | `''`     | Feldname für die Teilnahme an einem Formular                                      |
| `status`      | `string`  | `''`     | Validierungsstatus: `error`, `warning`                                            |
| `message`     | `string`  | `''`     | Hilfs- bzw. Validierungstext unter dem Feld                                       |
| `min`         | `string`  | `''`     | Kleinster Wert; bei `type="number"` an das innere `<input>` weitergereicht        |
| `max`         | `string`  | `''`     | Größter Wert; bei `type="number"` an das innere `<input>` weitergereicht          |
| `step`        | `string`  | `''`     | Schrittweite; bei `type="number"` an das innere `<input>` weitergereicht          |
| `required`    | `boolean` | `false`  | An das innere `<input>` weitergereicht, damit die native Prüfung greift           |
| `sheet`       | `string`  | `''`     | CSS, das in den Shadow Root eingefügt wird                                        |

### Beschriftung `label`

Eine feste Beschriftung über dem Feld: immer sichtbar, überlagert nie den Inhalt daneben und verschiebt beim Fokussieren nichts (oben ausgerichtete Beschriftungen lassen Formulare außerdem schneller ausfüllen als eingebettete oder schwebende; siehe [Luke Wroblewskis Eyetracking-Untersuchung](https://www.lukew.com/ff/entry.asp?504=)).

<Demo column>
  <r-input label="Benutzername"></r-input>
</Demo>

```html
<r-input label="Benutzername"></r-input>
```

### Platzhalter `placeholder`

Verhält sich wie das native Attribut `placeholder`.

<Demo column>
  <r-input placeholder="Benutzernamen eingeben"></r-input>
</Demo>

```html
<r-input placeholder="Benutzernamen eingeben"></r-input>
```

### Wert `value`

<Demo column>
  <r-input value="1234"></r-input>
</Demo>

```html
<r-input value="1234"></r-input>
```

### Deaktivierter Zustand `disabled`

<Demo column>
  <r-input label="Benutzername" disabled></r-input>
</Demo>

```html
<r-input label="Benutzername" disabled></r-input>
```

### Symbol `icon`

<Demo column>
  <r-input icon="user"></r-input>
</Demo>

```html
<r-input icon="user"></r-input>
```

### Eingabetypen `type`

<Demo column>
  <r-input icon="lock" type="password" placeholder="Passwort"></r-input>
  <r-input type="number" placeholder="Zahl"></r-input>
</Demo>

```html
<r-input icon="lock" type="password" placeholder="Passwort"></r-input>
<r-input type="number" placeholder="Zahl"></r-input>
```

### Status `status`

Setze `status` immer zusammen mit einer `message`, damit der Zustand über Text und nicht allein über Farbe ankommt.

<Demo column>
  <r-input status="error" label="Benutzername" message="Dieses Feld ist erforderlich"></r-input>
  <r-input status="warning" label="Benutzername" message="Prüfe diesen Wert"></r-input>
</Demo>

```html
<r-input status="error" label="Benutzername" message="Dieses Feld ist erforderlich"></r-input>
<r-input status="warning" label="Benutzername" message="Prüfe diesen Wert"></r-input>
```

### Hilfstext `message`

Zeichnet Hilfs- bzw. Validierungstext unter dem Feld.

<Demo column>
  <r-input label="E-Mail" message="Wir geben deine E-Mail-Adresse niemals weiter"></r-input>
</Demo>

```html
<r-input label="E-Mail" message="Wir geben deine E-Mail-Adresse niemals weiter"></r-input>
```

### Feldname im Formular `name`

```html
<r-input name="username" label="Benutzername"></r-input>
```

## Ereignisse

Beide Ereignisse werden als `CustomEvent` ausgelöst und tragen den aktuellen Wert in `detail`.

| Ereignis | Wann es ausgelöst wird                                           | `detail`            |
| -------- | ---------------------------------------------------------------- | ------------------- |
| `input`  | Bei jedem Tastendruck (spiegelt das native `input`)              | `{ value: string }` |
| `change` | Beim Bestätigen bzw. Fokusverlust (spiegelt das native `change`) | `{ value: string }` |

### Eingabeereignis `input`

<Demo column>
  <r-input oninput="console.log(event.detail.value)" label="Benutzername"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'Benutzername');
input.addEventListener('input', (event) => {
  console.log('Tippt:', event.detail.value);
});
```

### Änderungsereignis `change`

<Demo column>
  <r-input onchange="console.log(event.detail.value)" label="Benutzername"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'Benutzername');
input.addEventListener('change', (event) => {
  console.log('Wert geändert:', event.detail.value);
});
```

## Formularanbindung {#form-association}

`r-input` ist ein formularassoziiertes Custom Element (`static formAssociated = true`). Es hängt `ElementInternals` an und gibt seinen Wert über `setFormValue` weiter, sodass `new FormData(form)` das Feld erfasst, wenn es ein echter Nachfahre eines nativen `<form>` ist; setze `name`, um dem Wert einen Schlüssel zu geben. Siehe [Formulare](/de/src/ranui/form/) für den Helfer `serializeForm()`, der ein Absenden in ein einfaches Objekt verwandelt.

```html
<form>
  <r-input name="username" label="Benutzername"></r-input>
</form>
```

**Zurücksetzen**: Ein natives `form.reset()` (oder ein `<button type="reset">`) stellt den Wert wieder her, den das Feld beim ersten Verbinden hatte — umgesetzt über `formResetCallback()`, einen der Lebenszyklus-Hooks, die der Browser bei einem formularassoziierten Custom Element von selbst aufruft.

**Validierung**: `required` macht ein leeres Feld über `ElementInternals.setValidity()` ungültig; `form.checkValidity()` / `form.reportValidity()` sehen das, und beim Absenden erscheint die native Validierungsblase des Browsers am Feld. `disabled`-Felder blockieren die Validierung nie, genau wie ein natives `<input>`. `r-input` stellt außerdem die üblichen Methoden und Eigenschaften eines nativen Feldes bereit: `checkValidity()`, `reportValidity()`, `validity`, `validationMessage`.

```html
<form>
  <r-input name="username" label="Benutzername" required></r-input>
  <button type="submit">Absenden</button>
</form>
```

## CSS-Parts

Über `::part()` für die Gestaltung von außen bereitgestellt.

| Part      | Element                                                         |
| --------- | --------------------------------------------------------------- |
| `input`   | Die Hülle des Feldes                                            |
| `content` | Das innere native `<input>`-Bedienelement                       |
| `label`   | Die feste Beschriftung über dem Feld (wenn `label` gesetzt ist) |
| `message` | Der Hilfs- bzw. Validierungstext (wenn `message` gesetzt ist)   |

```css
r-input::part(content) {
  font-size: 16px;
}
```

## Styling

`<r-input>` stellt **61 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens, die es aus dem Theme liest. Setze eines überall dort, wo es vererbt wird: `:root`, ein umgebendes Element oder das Element selbst:

```css
r-input {
  --ran-input-color: var(--ran-color-text-secondary);
}
```

Parts: `content` · `input` · `label` · `message`

Die vollständige Liste steht bei den [Style-Tokens](/de/src/ranui/style-tokens#input); welches Token wofür gedacht ist, klärt das [Designsystem](/de/src/ranui/design-system/).

## Bewährte Vorgehensweisen

- **Beschriftungen**: Gib ein aussagekräftiges `label`, damit das Feld einen zugänglichen Namen hat.
- **Platzhalter**: Nimm `placeholder` als Eingabehinweis, nicht als Ersatz für eine Beschriftung.
- **Status und Meldung**: Setze `status` gemeinsam mit `message`, damit der Zustand nicht allein über Farbe signalisiert wird.
- **Symbole**: Ein passendes `icon` macht das Feld schneller wiedererkennbar.
- **Typen**: Wähle den zum Inhalt passenden `type` (`text`, `password`, `number`, …).
- **Formulare**: Setze `name`, wenn du den Wert innerhalb eines Formulars einsammelst.
