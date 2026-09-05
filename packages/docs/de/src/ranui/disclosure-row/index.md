---
description: 'Die ranui-DisclosureRow (<r-disclosure-row>) ist eine einzeilige „Titel · Zusammenfassung“-Zeile, die sich zu einem Rumpf aufklappt — mit einem Schimmer, solange die Arbeit dahinter läuft.'
---

# DisclosureRow

Der einzeilige Rahmen `[Anfang] Titel · Zusammenfassung`, der sich aufklappt und einen Rumpf zeigt. Es ist die Zeile, die sich `<r-reasoning>` und `<r-tool-card>` teilen, damit ein Protokoll mit beidem eine einzige Sprache fürs Auf- und Zuklappen hat statt zweier.

> **Einsetzen, wenn** du eine knappe Zeile hast, die für etwas Größeres steht (einen Werkzeugaufruf, eine Gedankenkette, eine Protokollgruppe), und die Einzelheiten es wert sind, bis zur Nachfrage verborgen zu bleiben.

## Schnellstart

### Grundlegende Verwendung

<Demo column>
  <r-disclosure-row heading="Datei lesen" summary="packages/ranui/index.ts" expandable>
    <div style="padding:8px 0">Der Rumpf erscheint, wenn die Zeile offen ist.</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="Datei lesen" summary="packages/ranui/index.ts" expandable>
  <div>Der Rumpf erscheint, wenn die Zeile offen ist.</div>
</r-disclosure-row>
```

Das **heading ist die linke Hälfte mit fester Breite**, die **summary die rechte Hälfte, die abgeschnitten wird** — eine Spalte von Zeilen richtet sich also am selben Rückgrat aus, wie lang die einzelne Zusammenfassung auch sei. Eine leere Zusammenfassung nimmt das Trennzeichen mit.

### Während die Arbeit läuft

`busy` zieht einen Schimmer über die Zeile. Ein Ladekreisel zeigt nur an, dass irgendwo etwas passiert; ein Streifen über der Zeile sagt, welche Zeile noch arbeitet.

<Demo column>
  <r-disclosure-row heading="Tests laufen lassen" summary="2351 bestanden" busy expandable></r-disclosure-row>
  <r-disclosure-row heading="Tests laufen lassen" summary="2351 bestanden" expandable></r-disclosure-row>
</Demo>

### Mit einem vorangestellten Indikator

Der Slot `leading` und das Winkelzeichen teilen sich eine Rasterzelle, das Tauschen kostet also kein Layout, und die Überschrift rutscht nie unter dem Zeiger weg.

Steht in `leading` nichts, bleibt das Winkelzeichen sichtbar, denn es ist das einzige Merkmal, das der lesenden Person sagt, dass die Zeile aufgeht. Mit vorangestelltem Inhalt erscheint das Winkelzeichen beim Überfahren, bei Fokus oder solange die Zeile offen ist — die übrige Zeit steht dort der Zustandsindikator.

<Demo column>
  <r-disclosure-row heading="Bauen" summary="nach 4,2 s fehlgeschlagen" tone="error" expandable>
    <r-state-dot slot="leading" state="error"></r-state-dot>
    <div style="padding:8px 0">Das Bündel überschreitet die Größengrenze.</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="Bauen" summary="nach 4,2 s fehlgeschlagen" tone="error" expandable>
  <r-state-dot slot="leading" state="error"></r-state-dot>
  <div>Das Bündel überschreitet die Größengrenze.</div>
</r-disclosure-row>
```

## API-Referenz

### Eigenschaften

| Eigenschaft  | Attribut     | Typ       | Standard | Beschreibung                                                            |
| ------------ | ------------ | --------- | -------- | ----------------------------------------------------------------------- |
| `heading`    | `heading`    | `string`  | `''`     | Die linke Hälfte der Zeile, mit fester Breite.                          |
| `summary`    | `summary`    | `string`  | `''`     | Die rechte, abgeschnittene Hälfte. Leer nimmt sie das Trennzeichen mit. |
| `open`       | `open`       | `boolean` | `false`  | Ob der Rumpf gezeigt wird. Wird gespiegelt, `:has([open])` greift also. |
| `expandable` | `expandable` | `boolean` | `false`  | Ob die Zeile einen Rumpf hat, der das Öffnen lohnt.                     |
| `busy`       | `busy`       | `boolean` | `false`  | Ob die Arbeit, für die diese Zeile steht, noch läuft.                   |
| `tone`       | `tone`       | `string`  | `''`     | `error` färbt die Zusammenfassung; alles andere ist der übliche Ton.    |
| `name`       | `name`       | `string`  | `''`     | Gruppiert Zeilen, sodass das Öffnen einer die übrigen schließt.         |
| `sheet`      | `sheet`      | `string`  | `''`     | CSS, das in den Shadow Root eingefügt wird.                             |

::: warning Das Attribut heißt `heading`, nicht `title`
`title` ist ein natives Attribut von `HTMLElement`, das der Browser als Tooltip zeichnet. Eine Komponente, die es für eine Überschrift benutzte, ließe an jeder Instanz einen Tooltip sprießen, der den Text vom Bildschirm wiederholt — und nichts schaltet das wieder ab, wenn es einmal gesetzt ist. `<r-card>` und `<r-modal>` tragen aus demselben Grund dieselbe Umbenennung.
:::

### Ereignisse

| Ereignis                 | Detail              | Auslösung                     | Beschreibung                                |
| ------------------------ | ------------------- | ----------------------------- | ------------------------------------------- |
| `disclosurebeforetoggle` | `{ open: boolean }` | bubbles, composed, abbrechbar | Die Zeile wird gleich auf- oder zugeklappt. |
| `disclosuretoggle`       | `{ open: boolean }` | bubbles, composed             | Die Zeile wurde auf- oder zugeklappt.       |

::: warning Das Ereignis heißt `disclosuretoggle`, nicht `toggle`
`toggle` ist, was `<details>` auslöst, und dessen `ToggleEvent` trägt `oldState` / `newState` statt eines `detail`; ein Listener, der gegen den Plattformnamen typisiert ist, findet darin nichts. Lies den Zustand am Element: `row.open`.
:::

```js
row.addEventListener('disclosuretoggle', () => {
  console.log(row.open ? 'opened' : 'closed');
});
```

`disclosurebeforetoggle` feuert zuerst und lässt sich ablehnen — das macht „hol den Rumpf beim ersten Öffnen“ und „weigere dich zuzuklappen, solange eine Änderung ungesichert ist“ überhaupt erst ausdrückbar. Die Plattform hat kein Gegenstück: `<details>` löst nur das nachträgliche `toggle` aus, und die Bitte um ein abbrechbares `beforetoggle` ist bis heute offen.

```js
row.addEventListener('disclosurebeforetoggle', async (event) => {
  if (!event.detail.open || row.dataset.loaded) return;
  event.preventDefault(); // halte sie zu, bis der Rumpf da ist
  row.append(await fetchBody());
  row.dataset.loaded = 'true';
  row.open = true;
});
```

Nur ein Druck löst es aus. Ein `row.open = true` aus dem Code ist die Anwendung, die es sich selbst anders überlegt — da bleibt niemand zu fragen.

### Immer nur eine Zeile

`name` gruppiert Zeilen so, wie `name` `<details>` gruppiert: Eine zu öffnen schließt die anderen. Die Gruppe ist das ganze Dokument, und die Zeilen müssen keine Geschwister sein.

```html
<r-disclosure-row name="run" heading="Install" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Build" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Test" expandable>…</r-disclosure-row>
```

### Barrierefreiheit

Eine Zeile ist nur dann ein Bedienelement, wenn sie etwas zu öffnen hat. Mit `expandable` trägt sie `role="button"`, einen Tabstopp, `aria-expanded` und ein `aria-controls`, das auf den Rumpf zeigt; ohne trägt sie nichts davon, denn eine Textzeile als Schaltfläche anzusagen lädt zu einem Druck ein, der nichts bewirkt. `busy` setzt `aria-busy`, sodass der Streifen nicht das einzige Signal dafür ist, dass die Arbeit noch läuft.

Ein zugeklappter Rumpf wird beschnitten statt entfernt, damit er animieren kann. Er wird außerdem `inert`, und sein Inhalt wird per `content-visibility: hidden` übersprungen — das hält ihn im geschlossenen Zustand aus der Tab-Reihenfolge und vom Zeichenpfad fern.

Die Zeile ist 24px hoch, genau das Minimum aus WCAG 2.5.8, und Zeilen stapeln sich ohne Abstand. Bei einem groben Zeiger geht die Standardhöhe auf 32px, denn die Trefffläche lässt sich nicht über die Zeile hinaus vergrößern, ohne die Zeile darüber zu überlappen — das tauschte ein kleines Ziel gegen ein falsches. Setzt du `--ran-disclosure-row-height`, ist die Höhe für jede Eingabeart fixiert.

### Slots

| Slot      | Inhalt                                                                            |
| --------- | --------------------------------------------------------------------------------- |
| `default` | Der Rumpf, sichtbar solange `open`.                                               |
| `leading` | Ein Indikator vor der Überschrift, typischerweise `<r-state-dot>`.                |
| `heading` | Markup für die linke Hälfte, ersetzt den einfachen Text des Attributs `heading`.  |
| `summary` | Markup für die rechte Hälfte, ersetzt den einfachen Text des Attributs `summary`. |

`heading` und `summary` nehmen als Attribute einfache Zeichenketten — das reicht der Zeile eines Werkzeugaufrufs meist. Muss die Hälfte Markup tragen (Code, ein Link, eine Abkürzung), leg es stattdessen in den Slot. Der Attributtext ist der Rückfall des Slots, der Slot-Inhalt ersetzt ihn also schlicht:

```html
<r-disclosure-row expandable>
  <code slot="heading">fetch()</code>
  <a slot="summary" href="https://example.com">https://example.com</a>
  <pre>…</pre>
</r-disclosure-row>
```

Slot-Inhalt zählt als eine Hälfte der Zeile, das Trennzeichen erscheint und verschwindet also genauso wie bei den Attributen.

### Parts

`row` · `leading` · `title` · `separator` · `summary` · `disclosure` · `body`

## Styling

`<r-disclosure-row>` stellt **15 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens, die es aus dem Theme liest. Setze eines überall dort, wo es vererbt wird: `:root`, ein umgebendes Element oder das Element selbst:

```css
r-disclosure-row {
  --ran-disclosure-hover-background: var(--ran-color-bg-subtle);
}
```

Parts: `body` · `disclosure` · `leading` · `row` · `separator` · `summary` · `title`

Die vollständige Liste steht bei den [Style-Tokens](/de/src/ranui/style-tokens#disclosure-row); welches Token das richtige ist, klärt das [Designsystem](/de/src/ranui/design-system/).

## Bewährte Vorgehensweisen

- **Gib einer Zeile einen Rumpf, oder mach sie nicht aufklappbar.** Ein Winkelzeichen, das auf leeren Raum aufgeht, hat keinen Zweck; lass `expandable` weg, und die Zeile bleibt eine einzelne Zeile.
- **Halte die Überschrift bei einem festen Wortschatz** (`Datei lesen`, `Tests laufen lassen`, `Suchen`) und stecke den veränderlichen Teil in die Zusammenfassung. Genau das macht eine Spalte von Zeilen überfliegbar.
- **Setze `tone="error"` immer zusammen mit Worten, nie mit Farbe allein**: Die Zusammenfassung soll sagen, was schiefging.
