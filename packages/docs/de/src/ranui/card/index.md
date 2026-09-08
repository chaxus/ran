---
description: 'Ein strukturierter Inhaltscontainer mit Kopf-, Körper- und Fußbereich, dargestellt als umrandete Fläche im Geist-Stil, um Zusammengehöriges zu gruppieren.'
---

# Card

Ein strukturierter Inhaltscontainer mit Kopf-, Körper- und Fußbereich, um Zusammengehöriges zu gruppieren. Karten sind umrandete Flächen im Geist-Stil (Seitenhintergrund plus 1px-Rahmen, keine graue Füllung) und bleiben beim Überfahren untätig, sofern du es nicht mit `hoverable` einschaltest.

> **Nimm sie, wenn** du zusammengehörige Inhalte in einer umrandeten Fläche mit Titel-, Beschreibungs-, Körper- und Fußbereich bündeln willst: `<r-card>` liefert diese Slots plus einen optionalen interaktiven Zustand über `hoverable`.

## Schnellstart

### Grundlegende Verwendung

<ran-demo>
  <r-card heading="Kartentitel" description="Optionale Unterzeile" style="max-width: 360px;">
    <span slot="extra" style="font-size: 12px;">tag</span>
    <p style="margin: 0;">Der Inhalt kommt in den Standard-Slot.</p>
    <a slot="footer" href="#">Notizen ansehen</a>
  </r-card>
</ran-demo>

```html
<r-card heading="Kartentitel" description="Optionale Unterzeile">
  <span slot="extra">tag</span>
  <p>Der Inhalt kommt in den Standard-Slot.</p>
  <a slot="footer" href="#">Notizen ansehen</a>
</r-card>
```

## API-Referenz

### Eigenschaften

| Eigenschaft   | Typ       | Standard | Beschreibung                                                                        |
| ------------- | --------- | -------- | ----------------------------------------------------------------------------------- |
| `heading`     | `string`  | `''`     | Überschrift der Karte, oben im Kopfbereich. Leer bedeutet ausgeblendet.             |
| `description` | `string`  | `''`     | Unterzeile unter dem Titel. Leer bedeutet ausgeblendet.                             |
| `hoverable`   | `boolean` | `false`  | Interaktive Karte: Beim Überfahren dunkelt der Rahmen nach und die Karte hebt sich. |
| `sheet`       | `string`  | `''`     | CSS, das in das Shadow DOM der Karte injiziert wird.                                |

### Überschrift `heading`

Die Überschrift der Karte, oben im Kopfbereich. Leer bedeutet ausgeblendet.

<ran-demo>
  <r-card heading="Nur ein Titel" style="max-width: 360px;">
    <p style="margin: 0;">Inhalt.</p>
  </r-card>
</ran-demo>

```html
<r-card heading="Nur ein Titel">
  <p>Inhalt.</p>
</r-card>
```

### Beschreibung `description`

Eine Unterzeile unter dem Titel. Leer bedeutet ausgeblendet. Sind weder `title` noch `description` gesetzt, verschwindet der ganze Kopfbereich.

<ran-demo>
  <r-card heading="Titel" description="Eine kurze begleitende Unterzeile" style="max-width: 360px;">
    <p style="margin: 0;">Inhalt.</p>
  </r-card>
</ran-demo>

```html
<r-card heading="Titel" description="Eine kurze begleitende Unterzeile">
  <p>Inhalt.</p>
</r-card>
```

### Interaktive Karte `hoverable`

Karten reagieren standardmäßig nicht auf das Überfahren. Setze das Attribut `hoverable` nur auf Karten, die wirklich anklickbar sind: Beim Überfahren dunkelt der Rahmen eine Stufe auf der Grauleiter nach (`--ran-color-border` → `--ran-color-border-hover`), und die Fläche bekommt den zurückhaltenden erhobenen Schatten (`--ran-shadow-elevated`).

<ran-demo>
  <r-card hoverable heading="Karte mit Hover" description="Fahr mich an" style="max-width: 360px; cursor: pointer;">
    <p style="margin: 0;">Der Rahmen dunkelt nach und die Karte hebt sich leicht.</p>
  </r-card>
</ran-demo>

```html
<r-card hoverable heading="Karte mit Hover" description="Fahr mich an">
  <p>Der Rahmen dunkelt nach und die Karte hebt sich leicht.</p>
</r-card>
```

`hoverable` ist rein gestalterisch: Behalte es Karten vor, die auf Klicks reagieren, und lass nicht interaktive Karten untätig.

### Externe Styles `sheet`

CSS, das in das Shadow DOM der Karte injiziert wird — dieselbe `sheet`-Konvention wie bei jeder anderen ranui-Komponente.

```html
<r-card heading="Karte mit Theme" sheet=".ran-card { background: #f6ffed; }">
  <p>Inhalt.</p>
</r-card>
```

## Slots

| Slot         | Beschreibung                                                            |
| ------------ | ----------------------------------------------------------------------- |
| _(Standard)_ | Inhalt, gerendert im Körper der Karte.                                  |
| `extra`      | Rechte Seite des Kopfbereichs: Abzeichen, Links oder Aktionen.          |
| `footer`     | Fußinhalt. Der Fußbereich bleibt verborgen, bis dieser Slot Knoten hat. |

## CSS-Parts

Die Karte stellt diese `::part()`-Haken zum Gestalten von außen bereit:

| Part          | Beschreibung                       |
| ------------- | ---------------------------------- |
| `card`        | Der äußere Kartencontainer.        |
| `header`      | Die Kopfzeile.                     |
| `title`       | Der Titeltext.                     |
| `description` | Der Unterzeilentext.               |
| `extra`       | Der Slot `extra` im Kopfbereich.   |
| `body`        | Der Körperbereich (Standard-Slot). |
| `footer`      | Der Fußbereich (Slot `footer`).    |

Folgende CSS-Variablen lassen sich überschreiben: `--ran-card-display`, `--ran-card-min-height`, `--ran-card-gap`, `--ran-card-padding`, `--ran-card-radius`, `--ran-card-background`, `--ran-card-border-color`, `--ran-card-shadow`, `--ran-card-hover-border-color`, `--ran-card-hover-shadow` (die letzten beiden greifen mit `hoverable`), `--ran-card-title-color`, `--ran-card-title-font-size`, `--ran-card-title-font-weight`, `--ran-card-description-color`, `--ran-card-description-font-size`.

```css
r-card {
  --ran-card-background: var(--surface-2);
  --ran-card-radius: 12px;
  --ran-card-min-height: 148px;
}
r-card::part(header) {
  border-bottom: 1px solid var(--line);
}
```

## Events

Die Karte ist ein passiver Container und löst keine eigenen Events aus.

## Bewährte Praxis

- **Titel & Beschreibung**: Nimm `title` für die Überschrift und `description` für eine kurze begleitende Unterzeile; lässt du beide weg, verschwindet der Kopfbereich ganz.
- **Körperinhalt**: Lege den Hauptinhalt in den Standard-Slot.
- **Aktionen im Kopfbereich**: Nutze den Slot `extra` für Abzeichen, Links oder Aktionen, die rechts im Kopf sitzen.
- **Fußbereich**: Nutze den Slot `footer` für sekundäre Aktionen oder Links; er bleibt verborgen, bis du Inhalt hineingibst.
- **Hover-Rückmeldung**: Setze `hoverable` nur auf anklickbare Karten; nicht interaktive Karten dürfen nicht auf das Überfahren reagieren.
- **Theming**: Bevorzuge für wiederverwendbares Styling CSS-Variablen und `::part()` gegenüber dem Attribut `sheet`.
