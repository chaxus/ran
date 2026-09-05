---
description: 'Formulare mit ranui bauen: r-input, r-checkbox und r-select funktionieren direkt in einem nativen <form>, ganz ohne Wrapper-Komponente.'
---

# Forms

ranui liefert keine Komponente, die `<form>` umschließt. `r-input`, `r-checkbox` und `r-select` sind selbst [Form-Associated Custom Elements](https://developer.mozilla.org/de/docs/Web/API/Web_components/Using_form-associated_custom_elements) (jedes ruft `attachInternals()` auf und reicht seinen Wert über `ElementInternals.setFormValue()` weiter), funktionieren also bereits in einem schlichten nativen `<form>`: `new FormData(form)` sammelt sie ein, `form.reset()` stellt ihren Zustand vor der Eingabe wieder her, und ein `required`-Feld verhindert das Absenden und zeigt die native Validierung des Browsers, verankert am Feld. Nichts davon braucht ranui-spezifisches Markup.

> **Nimm es, wenn** du ein Formular aus `r-input`/`r-checkbox`/`r-select` zusammensetzt: Nimm einfach ein echtes `<form>` und greife zu `serializeForm()` (unten), wenn du die abgeschickten Werte als schlichtes Objekt willst, statt die `FormData`-Iteration selbst zu schreiben.

## Schnellstart

Alle drei Feldtypen, abgeschickt mit einem gewöhnlichen `<form>`. Ändere ein Feld und schicke ab, um das Ergebnis unten zu sehen. Diese Demo baut das Objekt mit dem browsereigenen `FormData`/`Object.fromEntries` (kein Import nötig); `serializeForm()`, gleich darunter, macht dasselbe und noch etwas, das `Object.fromEntries` nicht kann: Ein mehrfach vorkommender Feldname kommt als Array zurück, statt still nur den letzten Wert zu behalten.

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.info(JSON.stringify(Object.fromEntries(new FormData(this))))">
    <r-input name="username" label="Benutzername" placeholder="Benutzername eingeben"></r-input>
    <r-select name="role" label="Rolle" style="width: 100%" defaultValue="member">
      <r-option value="member">Mitglied</r-option>
      <r-option value="admin">Administrator</r-option>
    </r-select>
    <r-checkbox name="subscribe">Newsletter abonnieren</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Absenden</button></r-button>
  </form>
</Demo>

> Wie der Abschnitt [Layout](#layout) weiter unten erklärt: Felder bringen kein eigenes Layout
> auf Formularebene mit, deshalb setzt jedes Beispiel auf dieser Seite (auch dieses) eigenes
> CSS auf dem `<form>` (`display: flex; flex-direction: column; gap: …`). Lässt man es weg,
> stapeln sich die Felder im normalen Fluss ohne Abstand — das wirkt kaputt oder überlappend
> statt wie ein Formular.

```html
<form id="signup" style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="Benutzername" placeholder="Benutzername eingeben"></r-input>
  <r-select name="role" label="Rolle" defaultValue="member">
    <r-option value="member">Mitglied</r-option>
    <r-option value="admin">Administrator</r-option>
  </r-select>
  <r-checkbox name="subscribe">Newsletter abonnieren</r-checkbox>
  <button type="submit">Absenden</button>
</form>

<script type="module">
  import { serializeForm } from 'ranui';

  document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault(); // ein echtes <form> würde sonst die Seite navigieren
    console.log(serializeForm(event.target)); // { username: '...', role: 'member', subscribe: 'true' }
  });
</script>
```

## `serializeForm(form)`

Sammelt die benannten Felder eines `<form>` über `FormData` in ein schlichtes Objekt: genau der Standardcode, den sonst jeder selbst schreibt, um ein Absenden in etwas zu verwandeln, das sich `JSON.stringify`-en oder als Fetch-Body senden lässt. Eine gewöhnliche Funktion ohne Bindung an ranui-Felder; sie arbeitet mit jedem echten `<form>`.

```ts
function serializeForm(form: HTMLFormElement): Record<string, unknown>;
```

Ein Feld mit mehreren Werten unter demselben `name` (etwa mehrere Checkboxen mit gleichem Namen) kommt als Array zurück; alles andere als Einzelwert.

```ts
import { serializeForm } from 'ranui';

const data = serializeForm(document.querySelector('form'));
// { username: 'alice', tags: ['a', 'b'] }
fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) });
```

## Layout {#layout}

Felder bringen kein Formular-Layout mit: Gestalte dein eigenes `<form>` mit gewöhnlichem CSS:

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px;">
    <r-input name="first" label="Vorname"></r-input>
    <r-input name="last" label="Nachname"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Weiter</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="first" label="Vorname"></r-input>
  <r-input name="last" label="Nachname"></r-input>
  <button type="submit">Weiter</button>
</form>
```

## Validierung und Zurücksetzen

`r-input`, `r-checkbox` und `r-select` unterstützen alle `required` (blockiert das Absenden und löst die native Validierungsblase des Browsers aus, genau wie ein natives Feld) sowie `checkValidity()`, `reportValidity()`, `validity` und `validationMessage`. Ein natives `form.reset()` (oder ein `<button type="reset">`) stellt über `formResetCallback()` jedes Feld auf seinen Zustand vor der Eingabe zurück. Einzelheiten stehen in der Dokumentation des jeweiligen Feldes ([Input](/de/src/ranui/input/#form-association), [Checkbox](/de/src/ranui/checkbox/#form-association), [Select](/de/src/ranui/select/#form-association)).

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.success('Valid — submitted')">
    <r-input name="username" label="Benutzername" required></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Absenden</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="Benutzername" required></r-input>
  <button type="submit">Absenden</button>
</form>
```

## Warum es keinen `<r-form>`-Wrapper gibt

Ein schlichtes natives `<form>` reicht bereits: Die Feldkomponenten von ranui funktionieren direkt darin, ohne Wrapper. `serializeForm()` schließt die eine echte Lücke — ein Absenden in ein schlichtes Objekt zu verwandeln.
