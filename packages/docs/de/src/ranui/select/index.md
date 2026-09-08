---
description: 'Das ranui-Select (<r-select>) ist eine Auswahlliste zum Wählen eines Werts aus Optionen, mit optionaler Suche und Teilnahme an nativen Formularen.'
---

# Select

Aufklappende Auswahl für genau einen Wert aus einer Liste von Optionen, mit optionaler Suche und Teilnahme an Formularen.

> **Einsetzen, wenn** du eine Auswahlliste für einen einzelnen Wert brauchst, aufgebaut aus `<r-option>`-Kindern, mit optionaler Suche und Teilnahme an nativen Formularen. `<r-select>` kümmert sich ums Öffnen, Filtern und die Übergabe an `FormData`.

## Schnellstart

### Grundlegende Verwendung

Die Optionen kommen als `<r-option>`-Kinder in den Slot. Das Attribut `value` einer Option ist ihr Wert, ihr Textinhalt die angezeigte Beschriftung.

<ran-demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## API-Referenz

### Eigenschaften

| Eigenschaft           | Typ       | Standard   | Beschreibung                                                                                                                                                                |
| --------------------- | --------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`               | `string`  | `''`       | Feste Beschriftung über dem Feld (dasselbe Muster wie `label` bei `r-input`), damit ein beschriftetes Select und ein beschriftetes Input im Formular auf einer Linie liegen |
| `value`               | `string`  | `''`       | Gewählter Wert. Ihn zu setzen aktualisiert die Beschriftung im geschlossenen Zustand; solange `disabled` gilt, wird er ignoriert                                            |
| `defaultValue`        | `string`  | `''`       | Anfangs gewählter Wert, abgeglichen mit dem `value` der Optionen                                                                                                            |
| `disabled`            | `boolean` | `false`    | Ob das Select deaktiviert ist                                                                                                                                               |
| `type`                | `string`  | `''`       | `text` zeichnet einen randlosen, durchsichtigen Auslöser ohne Pfeil; sonst mit Rahmen                                                                                       |
| `open`                | `boolean` | `false`    | Ob die Liste sichtbar ist. Das _ist_ der Zustand: setze ihn, um die Fläche zu öffnen oder zu schließen                                                                      |
| `placement`           | `string`  | `'bottom'` | Auf welcher Seite die Liste aufgeht, mit optionaler Ausrichtung: `bottom`, `bottom-end`, `top-center`, …                                                                    |
| `showSearch`          | `boolean` | `false`    | Zeigt ein eingebautes Suchfeld, das die Optionen nach ihrer Beschriftung filtert                                                                                            |
| `getPopupContainerId` | `string`  | `''`       | `id` des Elements, in das die Liste eingehängt wird (Standard: `document.body`)                                                                                             |
| `dropdownclass`       | `string`  | `''`       | Eigene Klasse für die aufklappende Fläche                                                                                                                                   |
| `trigger`             | `string`  | `'click'`  | Wie die Liste aufgeht: `click`, `hover` oder `click,hover` (auf Mobilgeräten wird `hover` ignoriert)                                                                        |
| `required`            | `boolean` | `false`    | Ob für das Absenden des Formulars eine Auswahl nötig ist                                                                                                                    |
| `sheet`               | `string`  | `''`       | CSS, das in das Shadow DOM eingefügt wird                                                                                                                                   |

> **Hinweis:** `defaultValue` und `showSearch` sind reaktiv: Sie nach dem Verbinden des Elements zu ändern wird (zusammen mit `value`, `disabled` und `sheet`) in `attributeChangedCallback` erneut verarbeitet. Ein neues `defaultValue` wendet die passende Auswahl erneut an; `showSearch` umzuschalten hängt das eingebaute Suchfeld ein oder aus.

### Eigenschaften der Optionen

Die Optionen kommen als `<r-option>`-Kindelemente.

| Eigenschaft | Typ       | Standard | Beschreibung                                                                             |
| ----------- | --------- | -------- | ---------------------------------------------------------------------------------------- |
| `value`     | `string`  | `''`     | Wert der Option; wird beim Auswählen als Wert des Selects gemeldet                       |
| `disabled`  | `boolean` | `false`  | Macht die Option unwählbar; das Select überspringt sie bei Klick wie bei Tastaturauswahl |
| `sheet`     | `string`  | `''`     | CSS, das in das Shadow DOM der Option eingefügt wird                                     |

Doppelte Beschriftungen oder Werte lösen ein `console.warn` aus.

### Beschriftung `label`

Eine feste Beschriftung über dem Feld: immer sichtbar, überlagert nie den Inhalt daneben. Sie nutzt dieselben Tokens und dasselbe Layout wie `label` bei `r-input`, sodass ein beschriftetes Select und ein beschriftetes Input nebeneinander im Formular bündig sitzen (gleiche Höhe, gleiche Oberkante).

<ran-demo>
  <r-select label="Land" style="width: 180px" defaultValue="185">
    <r-option value="185">Vereinigte Staaten</r-option>
    <r-option value="186">Kanada</r-option>
    <r-option value="187">Mexiko</r-option>
  </r-select>
</ran-demo>

```html
<r-select label="Land" defaultValue="185">
  <r-option value="185">Vereinigte Staaten</r-option>
  <r-option value="186">Kanada</r-option>
  <r-option value="187">Mexiko</r-option>
</r-select>
```

### Anfangswert `defaultValue`

<ran-demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Deaktivierter Zustand `disabled`

<ran-demo>
  <r-select style="width: 120px; height: 40px" disabled defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Textvariante `type`

<ran-demo>
  <r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Aufklapprichtung `placement`

`placement` ist ein Wunsch, keine Zusage: Steht der Auslöser nahe am Rand des Viewports und fehlt auf der gewünschten Seite der Platz, klappt die Liste selbsttätig auf die andere Seite und verschiebt sich waagerecht, um sichtbar zu bleiben. Das gilt nur für das voreingestellte Einhängen auf `body`-Ebene; mit gesetztem `getPopupContainerId` wählst du ein `placement`, das in den Container passt.

Eine Seite kann einen Ausrichtungszusatz tragen: `bottom-end`, `top-center` und so weiter — dieselbe Grammatik, die auch `r-popover` nimmt. Eine Seite allein bedeutet `-start` und bringt die vordere Kante der Fläche mit der des Auslösers auf eine Linie.

Der Zusatz ändert nur dann etwas, wenn die Fläche anders breit ist als ihr Auslöser, denn standardmäßig folgt sie dessen Breite. Verbreiterst du sie (`r-dropdown::part(dropdown)`, erreichbar über `dropdownclass`, weil die Fläche nach `<body>` portalt wird statt im Shadow Root des Selects zu leben), rechnet die Ausrichtung gegen das, was tatsächlich gezeichnet wird:

```html
<style>
  r-dropdown.wide::part(dropdown) {
    min-width: 220px;
  }
</style>

<!-- rechte Kante der Fläche auf der rechten Kante des Auslösers -->
<r-select placement="bottom-end" dropdownclass="wide" style="width: 80px">
  <r-option value="a">Eine ziemlich lange Optionsbeschriftung</r-option>
</r-select>
```

Beachte: Der Versatz am Rand sticht die Ausrichtung. Ein Auslöser nahe genug am Rand des Viewports bekommt seine Fläche zurück ins Bild geschoben, welche Ausrichtung auch verlangt war.

<ran-demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Offener Zustand `open`

`open` ist der Zustand der Liste und wird als Attribut gespiegelt, so wie bei `<details open>` und `<dialog open>`. Nirgends wird er aus dem `display` der Fläche abgeleitet (das dem Zustand um die Dauer der Ausblendanimation hinterherhinkt), also können Attribut, `aria-expanded` und das Bild auf dem Schirm sich nicht widersprechen.

Damit ist er ein unterstützter Weg, die Komponente zu steuern — und etwas, das du gestalten und in Tests prüfen kannst:

```html
<r-select id="picker" open>
  <r-option value="185">Mike</r-option>
</r-select>

<script>
  const picker = document.getElementById('picker');
  picker.open = true; // oder picker.show()
  picker.open = false; // oder picker.hide()
  picker.toggle();
</script>

<style>
  /* der Auslöser, solange seine Fläche offen ist */
  r-select[open]::part(selection) {
    border-color: var(--ran-color-primary);
  }
</style>
```

`show()`, `hide()` und `toggle()` sind dünne Hüllen darum, für die Fälle, in denen sich eine Methode besser liest als eine Zuweisung.

### Suchfunktion `showSearch`

<ran-demo>
  <r-select style="width: 120px; height: 40px" showSearch="true">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<r-select style="width: 120px; height: 40px" showSearch="true">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Auslöseart `trigger`

<ran-demo>
  <r-select style="width: 120px; height: 40px" trigger="click,hover">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</ran-demo>

```html
<!-- Öffnen per Klick (Standard) -->
<r-select trigger="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- Öffnen beim Überfahren (auf Mobilgeräten ignoriert) -->
<r-select trigger="hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- Klick und Überfahren zugleich -->
<r-select trigger="click,hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Einhängen in einen Container `getPopupContainerId`

Standardmäßig wird die Liste nach `document.body` portalt. Übergib die `id` eines anderen Elements, um sie dort einzuhängen.

```html
<r-select getPopupContainerId="my-container">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Eigene Klasse für die Liste `dropdownclass`

```html
<r-select dropdownclass="custom-dropdown">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## Ereignisse

### `change`

Wird ausgelöst, wenn eine Option gewählt wurde. `event.detail` ist `{ value, label }`, wobei `value` der Wert der gewählten Option ist und `label` ihr sichtbarer Text. Die anfängliche Auswahl über `defaultValue` löst kein `change` aus.

```html
<r-select id="picker">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('picker').addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.label); // z. B. "186" "Tom"
  });
</script>
```

### `search`

Wird nur bei aktivem `showSearch` ausgelöst, während im Suchfeld getippt wird (gedrosselt). `event.detail` ist `{ value }`, der aktuelle Suchtext. Die Komponente filtert die sichtbaren Optionen intern zusätzlich nach ihrer Beschriftung.

```html
<r-select showSearch="true" id="searchable">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('searchable').addEventListener('search', (e) => {
    console.log(e.detail.value);
  });
</script>
```

### `show` / `after-show` / `hide` / `after-hide`

Werden rund um die Übergänge der Fläche ausgelöst. `show` und `hide` kündigen die Absicht an, sobald der Übergang beginnt; `after-show` und `after-hide` feuern, wenn die Fläche wirklich angekommen und jede Animation fertig ist. Auf dieses Paar hörst du, wenn etwas erst passieren darf, nachdem die Fläche tatsächlich verschwunden ist.

Sie tragen kein `detail`.

```html
<script>
  const picker = document.getElementById('picker');
  picker.addEventListener('show', () => console.log('öffnet'));
  picker.addEventListener('after-hide', () => console.log('geschlossen, und fertig animiert'));
</script>
```

Gewartet wird auf die Animation des Stylesheets selbst, nicht auf eine ins Skript kopierte Dauer. Unter `prefers-reduced-motion` (wo es für die Fläche nichts abzuspielen gibt) folgt `after-hide` deshalb unmittelbar auf `hide` statt nach einer festen Verzögerung.

## Formularanbindung {#form-association}

`r-select` ist ein formularassoziiertes Custom Element (`static formAssociated = true`). Es gibt den gewählten `value` über `ElementInternals` weiter, sodass `new FormData(form)` ihn unter dem `name` des Selects erfasst, wenn es ein echter Nachfahre eines nativen `<form>` ist. Der Formularwert wird beim Verbinden aus einer etwaigen Anfangsauswahl gesetzt und bleibt bei jeder Änderung synchron.

**Zurücksetzen**: Ein natives `form.reset()` stellt die Auswahl aus `defaultValue` wieder her, sofern eine gesetzt ist, und löscht die Auswahl sonst vollständig — über `formResetCallback()`.

**Validierung**: `required` macht eine leere Auswahl über `ElementInternals.setValidity()` ungültig, sichtbar für `form.checkValidity()` / `form.reportValidity()`; ein `disabled`-Select blockiert die Validierung nie. `checkValidity()`, `reportValidity()`, `validity` und `validationMessage` liegen am Element bereit, genau wie bei einem nativen Feld.

```html
<form>
  <r-select name="country" required>
    <r-option value="us">Vereinigte Staaten</r-option>
    <r-option value="ca">Kanada</r-option>
  </r-select>
  <button type="submit">Absenden</button>
</form>
```

## Slots

| Slot       | Beschreibung                                                           |
| ---------- | ---------------------------------------------------------------------- |
| (Standard) | Nimmt die `<r-option>`-Elemente auf, die die wählbaren Optionen bilden |

## CSS-Parts

| Part             | Beschreibung                                                    |
| ---------------- | --------------------------------------------------------------- |
| `select`         | Äußere Hülle des Selects                                        |
| `selection`      | Der Kasten des Auslösers (Rahmen, Hintergrund, Layout)          |
| `icon`           | Der Pfeil der Auswahlliste                                      |
| `selection-item` | Element, das die Beschriftung der gewählten Option zeigt        |
| `search`         | Das eingebaute Suchfeld (sichtbar mit `showSearch`)             |
| `label`          | Die feste Beschriftung über dem Feld (wenn `label` gesetzt ist) |

## Bewährte Vorgehensweisen

- **Viele Optionen**: Aktiviere `showSearch`, damit sich nach Beschriftung filtern lässt.
- **Auslöseart**: Richte `trigger` nach den Erwartungen der Nutzenden; auf Mobilgeräten wird `hover` ignoriert, also lass `click` verfügbar.
- **Einhängepunkt**: In scrollenden oder überlaufbeschnittenen Layouts steuerst du mit `getPopupContainerId`, wo die Liste eingehängt wird.
- **Eigenes Aussehen**: Nimm `dropdownclass` oder die bereitgestellten `::part()`-Namen, um Auslöser und Liste umzugestalten.
- **Formulare**: Gib dem Select ein `name`, damit sein Wert innerhalb eines nativen `<form>` von `FormData` erfasst wird.
