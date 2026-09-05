---
description: 'Eine Seitenabschnitts-Fläche mit optionaler barrierefreier Überschrift und Unterzeile über einem Slot-Inhalt.'
---

# Section

Seitenabschnitts-Fläche mit optionaler Überschrift und Unterzeile über einem Slot-Inhalt.

> **Nimm sie, wenn** du einen wichtigen Bereich einer Seite mit einer barrierefreien Überschrift der Ebene 2 und wahlweise einer Unterzeile über dem Inhalt benennen willst. `<r-section>` liefert die Kopfzeile und die Inhaltsfläche.

## Schnellstart

### Grundlegende Verwendung

<Demo align="stretch">
  <r-section heading="Abschnittsüberschrift" subtitle="Eine kurze Zeile, die diesen Abschnitt beschreibt.">
    <p style="margin: 0;">Der Inhalt kommt in den Standard-Slot.</p>
  </r-section>
</Demo>

```html
<r-section heading="Abschnittsüberschrift" subtitle="Eine kurze Zeile, die diesen Abschnitt beschreibt.">
  <p>Der Inhalt kommt in den Standard-Slot.</p>
</r-section>
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ      | Standard | Beschreibung                                             |
| ----------- | -------- | -------- | -------------------------------------------------------- |
| `heading`   | `string` | `''`     | Abschnittsüberschrift, als ARIA-Überschrift der Ebene 2  |
| `subtitle`  | `string` | `''`     | Begleitende Zeile unter der Überschrift                  |
| `sheet`     | `string` | `''`     | CSS, das in das Shadow DOM des Abschnitts injiziert wird |

Die Kopfzeile (Überschrift + Unterzeile) wird vollständig ausgeblendet, wenn `heading` und `subtitle` beide leer sind.

### Überschrift `heading`

Die Abschnittsüberschrift, gerendert als ARIA-Überschrift der Ebene 2 (`role="heading"`, `aria-level="2"`). Leer bedeutet ausgeblendet.

<Demo align="stretch">
  <r-section heading="Nur eine Überschrift">
    <p style="margin: 0;">Inhalt.</p>
  </r-section>
</Demo>

```html
<r-section heading="Nur eine Überschrift">
  <p>Inhalt.</p>
</r-section>
```

### Unterzeile `subtitle`

Eine begleitende Zeile unter der Überschrift. Leer bedeutet ausgeblendet.

<Demo align="stretch">
  <r-section heading="Überschrift" subtitle="Begleitender Unterzeilentext.">
    <p style="margin: 0;">Inhalt.</p>
  </r-section>
</Demo>

```html
<r-section heading="Überschrift" subtitle="Begleitender Unterzeilentext.">
  <p>Inhalt.</p>
</r-section>
```

### Shadow-CSS `sheet`

CSS, das in das Shadow DOM des Abschnitts injiziert wird — dieselbe `sheet`-Konvention wie bei jeder anderen ranui-Komponente.

<Demo align="stretch">
  <r-section heading="Abschnitt mit Theme" subtitle="Überschrift über sheet umgefärbt." sheet=".ran-section-heading { color: #006bff; }">
    <p style="margin: 0;">Inhalt.</p>
  </r-section>
</Demo>

```html
<r-section heading="Abschnitt mit Theme" sheet=".ran-section-heading { color: #006bff; }">
  <p>Inhalt.</p>
</r-section>
```

## Slots

| Slot         | Beschreibung                           |
| ------------ | -------------------------------------- |
| _(Standard)_ | Inhalt, gerendert unter der Kopfzeile. |

## CSS-Parts

| Part       | Beschreibung                                |
| ---------- | ------------------------------------------- |
| `header`   | Die Kopfzeile um Überschrift und Unterzeile |
| `heading`  | Das ARIA-Überschriftenelement der Ebene 2   |
| `subtitle` | Die begleitende Unterzeile                  |
| `body`     | Der Inhaltswrapper um den Standard-Slot     |

Bereitgestellte CSS-Variablen: `--ran-section-border-color`, `--ran-section-radius`, `--ran-section-background`, `--ran-section-shadow`, `--ran-section-padding`, `--ran-section-heading-color`, `--ran-section-heading-font-size`, `--ran-section-heading-font-weight`, `--ran-section-subtitle-color`.

```css
r-section {
  --ran-section-background: var(--surface-1);
  --ran-section-padding: 32px;
  --ran-section-heading-color: var(--text-strong);
}
r-section::part(subtitle) {
  max-width: 48ch;
}
```

## Bewährte Praxis

- **Abschnittstitel**: Setze `heading`, um jeden wichtigen Bereich einer Seite zu benennen.
- **Kontext**: Nimm `subtitle` für eine kurze begleitende Zeile; lässt du beide weg, entsteht eine schlichte Fläche ohne Kopfzeile.
- **Barrierefreiheit**: Die Überschrift wird als ARIA-Überschrift der Ebene 2 ausgezeichnet und ist damit Teil der Dokumentgliederung — halte sie aussagekräftig.
- **Theming**: Bevorzuge für wiederverwendbares Styling die CSS-Variablen `--ran-section-*` oder `::part()`-Selektoren gegenüber dem Attribut `sheet`.
