---
description: 'Rendert LaTeX-Formeln mit Temml als natives MathML — ohne Canvas, ohne SVG und ohne KaTeX-Runtime.'
---

# Math

Rendert hochwertige LaTeX-Formeln in HTML-Seiten mit Temml, direkt zu nativem MathML kompiliert.

> **Nimm es, wenn** du eine LaTeX-Formel als abgesetzte Formel in einer HTML-Seite rendern willst. `<r-math>` setzt den Ausdruck aus dem Attribut `latex` mit [Temml](https://temml.org/), das LaTeX zu MathML kompiliert und den Umbruch dem Browser überlässt (kein Canvas, kein SVG, keine KaTeX-Runtime).

## Schnellstart

### Grundlegende Verwendung

<Demo>
  <r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
</Demo>

```html
<r-math latex="\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1 \quad (a > b > 0)"></r-math>
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ       | Standard  | Beschreibung                                                                                          |
| ----------- | --------- | --------- | ----------------------------------------------------------------------------------------------------- |
| `latex`     | `string`  | `''`      | Die zu rendernde LaTeX-Formel. Sie kommt über dieses Attribut, nicht über Slot-Text.                  |
| `display`   | `string`  | `'block'` | `block` (abgesetzte Formel) oder `inline` (Formel im Fließtext).                                      |
| `font`      | `string`  | `''`      | Auf `system` gesetzt, überspringt es die mitgelieferte Latin Modern Math und nimmt die Systemschrift. |
| `macros`    | `string`  | `''`      | Ein JSON-Objekt mit Temml-Makros. Ungültiges JSON wird stillschweigend ignoriert.                     |
| `wrap`      | `string`  | `''`      | Weicher Zeilenumbruch von Temml: `none`, `tex` oder `=`.                                              |
| `copy`      | `boolean` | `false`   | Zeigt eine Kopierschaltfläche. `copy` allein kopiert den LaTeX-Quelltext, `copy="mathml"` das MathML. |
| `download`  | `boolean` | `false`   | Zeigt Schaltfläche bzw. Menü zum Herunterladen des Quelltexts (`.tex`) und/oder MathML (`.mml`).      |
| `sheet`     | `string`  | `''`      | CSS, das in das Shadow DOM der Komponente injiziert wird.                                             |

> 💡 **Hinweis**: Der Getter der Eigenschaft `latex` dekodiert seinen Wert mit `decodeURIComponent`, URI-kodierte Formeln werden also vor dem Rendern dekodiert. Die Formel als Slot-Text zu übergeben hat keine Wirkung; gerendert wird nur das Attribut `latex`.

### Formel `latex`

<Demo>
  <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
</Demo>

```html
<r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}"></r-math>
```

### Externe Styles `sheet`

<Demo>
  <r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
</Demo>

```html
<r-math latex="e^{i\pi} + 1 = 0" sheet=".ran-math { justify-content: flex-start; }"></r-math>
```

## Events

| Event      | detail                             | Wird ausgelöst, wenn                                               |
| ---------- | ---------------------------------- | ------------------------------------------------------------------ |
| `render`   | `{ ok: true }`                     | die Formel erfolgreich gerendert wurde.                            |
| `error`    | `{ message: string }`              | Temml die Formel nicht parsen konnte (z. B. ungültiges LaTeX).     |
| `copied`   | `{ kind: 'source' \| 'mathml' }`   | die Kopierschaltfläche Quelltext oder MathML kopiert hat.          |
| `download` | `{ format: 'source' \| 'mathml' }` | die Download-Schaltfläche eine `.tex`- oder `.mml`-Datei sicherte. |

## Styling

`<r-math>` stellt **16 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens, die es aus dem Theme liest. Setze eine dort, wo sie vererbt wird — `:root`, ein Wrapper oder das Element selbst:

```css
r-math {
  --ran-math-error-background: var(--ran-color-bg-subtle);
}
```

Parts: `button` · `error` · `math` · `menu` · `render` · `toolbar`

Die vollständige Liste steht in den [Style-Tokens](/de/src/ranui/style-tokens#math); welches Token du nimmst, klärt das [Designsystem](/de/src/ranui/design-system/).

## Bewährte Praxis

- **Formeln über `latex` übergeben**: Setze die Formel auf das Attribut `latex`; Slot-Text wird nicht gerendert.
- **Backslashes in JavaScript maskieren**: Weist du `latex` aus einem JS-String zu, denk daran, dass `\` maskiert werden muss (z. B. `'\\frac{1}{2}'`).
- **Parse-Fehler behandeln**: Höre auf `error` (oder prüfe die gerenderte `::part(error)`-Box), statt anzunehmen, jede Formel sei gültiges LaTeX.
- **Eigenes Layout über `sheet`**: Nutze das Attribut `sheet`, um das interne Layout von `.ran-math` bei Bedarf zu überschreiben.
