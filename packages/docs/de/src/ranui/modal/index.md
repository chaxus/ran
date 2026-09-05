---
description: 'Das ranui-Modal (<r-modal>) ist ein Dialog für konzentrierte Interaktionen — mit Fokusfalle, Scroll-Sperre, inertem Hintergrund und einer imperativen Modal.confirm-API.'
---

# Modal

Dialogkomponente für konzentrierte Interaktionen über der aktuellen Seite, mit Fokusfalle, Scroll-Sperre und inertem Hintergrund.

> **Einsetzen, wenn** du einen Dialog für eine konzentrierte Interaktion über der Seite brauchst, samt Fokusfalle, Scroll-Sperre und inertem Hintergrund. Steuere `<r-modal>` über das Attribut `open` oder über die imperativen Helfer `Modal.confirm` / `Modal.info`.

## Schnellstart

### Grundlegende Verwendung

Ob das Modal sichtbar ist, steuert das Attribut `open` (oder die Eigenschaft `open`). Es beginnt geschlossen und zeichnet nichts, bis es geöffnet wird — verdrahte also einen Auslöser, der es umschaltet.

<Demo>
  <r-button onclick="document.getElementById('quickstart-modal').open = true">Modal öffnen</r-button>
  <r-modal id="quickstart-modal" heading="Einfaches Modal">
    <p>Das ist der Inhalt des Modals.</p>
    <div slot="footer">
      <r-button type="primary" onclick="document.getElementById('quickstart-modal').open = false">OK</r-button>
    </div>
  </r-modal>
</Demo>

```html
<r-button onclick="modal.open = true">Modal öffnen</r-button>

<r-modal id="modal" heading="Einfaches Modal">
  <p>Das ist der Inhalt des Modals.</p>
  <div slot="footer">
    <r-button type="primary" onclick="modal.open = false">OK</r-button>
  </div>
</r-modal>
```

## API-Referenz

### Eigenschaften

| Eigenschaft    | Typ       | Standard | Beschreibung                                                                         |
| -------------- | --------- | -------- | ------------------------------------------------------------------------------------ |
| `open`         | `boolean` | `false`  | Ob das Modal sichtbar ist                                                            |
| `heading`      | `string`  | `''`     | Titeltext der Kopfzeile (fällt bei leerem Wert auf `Modal` zurück)                   |
| `closable`     | `boolean` | `true`   | Ob die Schließen-Schaltfläche (`x`) gezeigt wird                                     |
| `maskClosable` | `boolean` | `true`   | Ob ein Klick auf die Hintergrundmaske das Modal schließt                             |
| `closeOnEsc`   | `boolean` | `true`   | Ob `Escape` das Modal schließt                                                       |
| `lockScroll`   | `boolean` | `true`   | Ob das Scrollen des Body gesperrt wird, solange das Modal offen ist                  |
| `autoFocus`    | `boolean` | `true`   | Ob beim Öffnen das erste fokussierbare Element den Fokus bekommt                     |
| `hideHeader`   | `boolean` | `false`  | Lässt die Titelleiste ganz weg und behält nur eine schwebende Schließen-Schaltfläche |
| `sheet`        | `string`  | `''`     | CSS, das in das Shadow DOM eingefügt wird                                            |

`closing` ist ein schreibgeschütztes Attribut, das das Element auf sich selbst spiegelt (keine setzbare Eigenschaft): Es ist vom Moment an gesetzt, in dem `close()` läuft, bis der Übergang von Maske und Dialog (Ausblenden und Verkleinern) tatsächlich fertig ist — etwa 0,3 s später, zum selben Zeitpunkt wie das `afterclose`-Ereignis. Nützlich für eine Gastgeberseite, für die das Modal während dieses sichtbaren Nachlaufs noch als „vorhanden" zählen muss; siehe die bewährten Vorgehensweisen weiter unten.

### Titel `title`

```html
<r-modal open heading="Eintrag löschen">
  <p>Soll dieser Eintrag wirklich gelöscht werden?</p>
</r-modal>
```

### Schließen-Schaltfläche `closable`

Blendet die Schließen-Schaltfläche in der Kopfzeile aus, sodass sich das Modal nur über deine eigenen Bedienelemente schließen lässt.

```html
<r-modal open heading="Bedingungen" closable="false">
  <p>Du musst die Bedingungen annehmen, um fortzufahren.</p>
  <div slot="footer">
    <r-button type="primary">Annehmen</r-button>
  </div>
</r-modal>
```

### Schließen per Maske `maskClosable`

Standardmäßig schließt ein Klick auf den Hintergrund das Modal. Auf `false` gesetzt, verlangt es eine ausdrückliche Handlung.

```html
<r-modal open heading="Ungespeicherte Änderungen" maskClosable="false">
  <p>Ein Klick außerhalb schließt diesen Dialog nicht.</p>
</r-modal>
```

### Schließen per Escape `closeOnEsc`

```html
<r-modal open heading="Bericht" closeOnEsc="false">
  <p>Die Escape-Taste ist für diesen Dialog abgeschaltet.</p>
</r-modal>
```

### Scrollen sperren `lockScroll`

```html
<r-modal open heading="Vorschau" lockScroll="false">
  <p>Die Seite hinter dem Modal lässt sich weiterhin scrollen.</p>
</r-modal>
```

### Automatischer Fokus `autoFocus`

```html
<r-modal open heading="Suchen" autoFocus="false">
  <input type="text" placeholder="Zum Suchen tippen" />
</r-modal>
```

### Modus ohne Kopfzeile `hideHeader`

Lässt die Titelleiste samt Trennlinie ganz weg und behält nur eine schwebende Schließen-Schaltfläche oben rechts, sofern `closable` gilt. Passt zu reinen Inhaltsdialogen wie einer Lightbox für ein Bild oder ein Diagramm, wo eine Titelleiste dem Inhalt nur Platz wegnähme. Der Dialog behält über `aria-label` (aus `title` abgeleitet) einen zugänglichen Namen, auch wenn der sichtbare `<h3>`-Titel fehlt — setze `title` also auch in diesem Modus als Beschriftung für Screenreader.

```html
<r-modal open hide-header>
  <img src="/diagram.png" alt="Architekturdiagramm" style="display: block; max-width: 100%;" />
</r-modal>
```

## Slots

| Slot       | Beschreibung                                                              |
| ---------- | ------------------------------------------------------------------------- |
| (Standard) | Der Textkörper des Modals                                                 |
| `footer`   | Aktionen in der Fußzeile; die Leiste erscheint nur, wenn hier etwas steht |

```html
<r-modal open heading="Bestätigen">
  <p>Der Textkörper gehört in den Default-Slot.</p>
  <div slot="footer">
    <r-button onclick="modal.open = false">Abbrechen</r-button>
    <r-button type="primary">Bestätigen</r-button>
  </div>
</r-modal>
```

## Ereignisse

Alle Ereignisse rund um das Schließen tragen in `event.detail` ein `trigger`, das beschreibt, was das Schließen ausgelöst hat: `'mask'`, `'button'`, `'escape'` oder `'program'`.

| Ereignis      | Abbrechbar | `detail`      | Beschreibung                                         |
| ------------- | ---------- | ------------- | ---------------------------------------------------- |
| `beforeopen`  | Ja         | —             | Vor dem Öffnen; `preventDefault()` bricht ab         |
| `open`        | Nein       | —             | Wird ausgelöst, wenn das Modal aufgeht               |
| `afteropen`   | Nein       | —             | Wird ausgelöst, wenn der Öffnungsübergang fertig ist |
| `beforeclose` | Ja         | `{ trigger }` | Vor dem Schließen; `preventDefault()` bricht ab      |
| `close`       | Nein       | `{ trigger }` | Wird ausgelöst, wenn das Modal schließt              |
| `afterclose`  | Nein       | `{ trigger }` | Wird ausgelöst, wenn der Schließübergang fertig ist  |

```html
<r-modal id="modal" heading="Beispiel"></r-modal>

<script>
  const modal = document.getElementById('modal');

  modal.addEventListener('beforeclose', (e) => {
    if (!confirm('Änderungen verwerfen?')) e.preventDefault();
  });

  modal.addEventListener('close', (e) => {
    console.log('geschlossen durch', e.detail.trigger); // 'mask' | 'button' | 'escape' | 'program'
  });
</script>
```

## Programmatische API

Die Klasse `Modal` stellt statische Helfer bereit, die ein Modal ohne Markup erzeugen, einhängen und auflösen. Jeder liefert ein `Promise<{ action, trigger }>`, wobei `action` `'confirm'`, `'cancel'` oder `'dismiss'` ist.

| Methode               | Beschreibung                                        |
| --------------------- | --------------------------------------------------- |
| `Modal.open(opts)`    | Öffnet ein Modal mit einer einzigen OK-Schaltfläche |
| `Modal.confirm(opts)` | Öffnet ein Modal mit OK und Abbrechen               |
| `Modal.info(opts)`    | Hinweis-Modal (Titel fällt auf `Info` zurück)       |
| `Modal.success(opts)` | Erfolgs-Modal (Titel fällt auf `Success` zurück)    |
| `Modal.warning(opts)` | Warn-Modal (Titel fällt auf `Warning` zurück)       |
| `Modal.error(opts)`   | Fehler-Modal (Titel fällt auf `Error` zurück)       |

Optionen (alle optional): `title`, `content`, `okText`, `cancelText`, `showCancel`, `maskClosable`, `closeOnEsc`, `lockScroll`, `autoFocus`, `closable`, `onConfirm`, `onCancel`. `onConfirm` / `onCancel` dürfen `false` zurückgeben (oder ein Promise, das zu `false` auflöst), um das Modal offen zu lassen.

```js
import { Modal } from 'ranui/modal';

const result = await Modal.confirm({
  title: 'Projekt löschen',
  content: 'Diese Aktion lässt sich nicht rückgängig machen.',
  okText: 'Löschen',
  cancelText: 'Behalten',
  onConfirm: async () => {
    await deleteProject();
  },
});

if (result.action === 'confirm') {
  // gelöscht
}
```

## CSS-Parts

Gestalte die inneren Teile über `::part()`.

| Part     | Beschreibung                  |
| -------- | ----------------------------- |
| `root`   | Äußerer Overlay-Container     |
| `mask`   | Hintergrund hinter dem Dialog |
| `dialog` | Der Dialogkasten              |
| `header` | Kopfleiste                    |
| `title`  | Titelüberschrift              |
| `close`  | Schließen-Schaltfläche (`x`)  |
| `body`   | Scrollbarer Textbereich       |
| `footer` | Aktionsleiste am Fuß          |

```css
r-modal::part(dialog) {
  border-radius: 8px;
}
r-modal::part(mask) {
  background: rgba(0, 0, 0, 0.6);
}
```

## Styling

`<r-modal>` stellt **23 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens, die es aus dem Theme liest. Setze eines überall dort, wo es vererbt wird: `:root`, ein umgebendes Element oder das Element selbst:

```css
r-modal {
  --ran-modal-mask-background: var(--ran-color-bg-subtle);
}
```

Parts: `body` · `close` · `dialog` · `footer` · `header` · `mask` · `root` · `title`

Die vollständige Liste steht bei den [Style-Tokens](/de/src/ranui/style-tokens#modal); welches Token wofür gedacht ist, klärt das [Designsystem](/de/src/ranui/design-system/).

## Bewährte Vorgehensweisen

- **Auslöser und Umschalten**: Öffne mit `modal.open = true` und schließe mit `modal.open = false` oder `close()`.
- **Zerstörerisches Schließen absichern**: Höre auf `beforeclose` und rufe `preventDefault()`, um vor dem Verwerfen ungesicherter Arbeit nachzufragen.
- **Aktionen im Fuß**: Primäre und sekundäre Schaltflächen gehören in `slot="footer"`; die Fußleiste erscheint nur, wenn der Slot Inhalt hat.
- **Abläufe ohne Ausweg**: Setze `closable="false"` und `maskClosable="false"`, um eine ausdrückliche Entscheidung zu erzwingen.
- **Einmalige Dialoge**: Nimm `Modal.confirm` / `Modal.info` für kurze Rückfragen, statt Markup zu schreiben.
- **Eine Gastgeberseite über das offene Modal heben**: Matche `:has(r-modal[open]), :has(r-modal[closing])`, nicht nur `[open]`. `open` verschwindet in dem Moment, in dem `close()` läuft, aber der Übergang von Maske und Dialog zeichnet noch etwa 0,3 s weiter; wer die z-index-Anhebung mitten im Ausblenden fallen lässt, lässt die noch sichtbare Maske unter dem neu zeichnen, worüber sie gerade gehoben war.
