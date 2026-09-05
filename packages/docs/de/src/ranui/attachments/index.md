---
description: 'Die ranui-Attachments-Leiste (<r-attachments>) hält, zeigt und prüft die zu einer Nachricht vorbereiteten Dateien und gibt die Object-URLs, die sie anlegt, selbst wieder frei.'
---

# Attachments

Die zu einer Nachricht vorbereiteten Dateien: `<r-attachments>` hält die Liste, zeigt Vorschauen,
prüft, was hereinkommt, und gibt die Object-URLs, die es anlegt, selbst wieder frei.

> **Einsetzen, wenn** ein Editor zeigen soll, was gleich verschickt wird. Dateien **einsammeln**
> tut das Element nicht: Einfügen, Drag-and-drop und ein Dateiauswahldialog sind drei
> verschiedene Gesten, jede gehört zu einem anderen Element des Editors, und welche davon deine
> Anwendung anbietet, entscheidest du. Rufe `add()` aus dem auf, das du verdrahtest.

## Schnellstart

### Grundlegende Verwendung

```html
<r-attachments accept="image/*,.pdf" max-size="5242880" max-count="4"></r-attachments>
```

```js
const strip = document.createElement('r-attachments');

// Ein Dateiauswahldialog
picker.addEventListener('change', () => strip.add(picker.files));

// Einfügen — nur wenn die Zwischenablage tatsächlich Dateien trägt. Jedes Einfügen
// abzufangen zerstört das Einfügen von Text, wofür das Feld die meiste Zeit da ist.
input.addEventListener('paste', (event) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    strip.add(event.clipboardData.files);
  }
});

// Drag-and-drop
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  strip.add(event.dataTransfer.files);
});

composer.append(strip);
```

Die Leiste zeichnet pro Datei eine Zeile mit Vorschaubild (bei Bildern), Namen, Größe und einer
Schaltfläche zum Entfernen. `count` wird am Host gespiegelt und bei leerer Leiste **entfernt**,
statt auf `0` zu stehen, damit eine leere Leiste keinen Platz beansprucht:

```css
r-attachments:not([count]) {
  display: none;
}
```

### Senden

```js
const body = new FormData();
for (const file of strip.files) body.append('files', file);
await fetch('/api/messages', { method: 'POST', body });
strip.clear();
```

`files` sind nur die `File`-Objekte in ihrer Reihenfolge — genau die Form, die der Rumpf einer
Anfrage will. `attachments` ist die reichere Liste (`id`, `name`, `size`, `type`, `previewUrl`),
wenn du deine eigene Ansicht desselben Zustands zeichnen musst.

### Eine Ablehnung wird gemeldet, niemals verschwiegen

Eine Datei, die verschwindet, weil sie ein nirgends genanntes Limit um 3 MB überschritt, liest sich
als kaputte Seite. Jede Ablehnung löst ein Ereignis mit der Datei und der verletzten Regel aus:

```js
const explain = {
  'too-large': 'Diese Datei ist größer als 5 MB.',
  'type-not-accepted': 'Dieser Dateityp wird hier nicht angenommen.',
  'too-many': 'Du kannst höchstens 4 Dateien anhängen.',
  duplicate: 'Diese Datei ist bereits angehängt.',
};

strip.addEventListener('attachmentrejected', (event) => {
  toast(explain[event.detail.reason]);
});
```

`duplicate` vergleicht Name, Größe und Änderungszeitpunkt zusammen — so, wie auch ein
Dateimanager zwei Dateien für dieselbe hält. Dieselbe Datei zweimal anzuhängen ist ein Versehen,
keine Anweisung.

## API-Referenz

### Eigenschaften

| Eigenschaft   | Attribut    | Typ                     | Standard | Beschreibung                                                           |
| ------------- | ----------- | ----------------------- | -------- | ---------------------------------------------------------------------- |
| `accept`      | `accept`    | `string`                | `''`     | Kommagetrennte Typen oder Endungen, in der Form von `<input accept>`.  |
| `maxSize`     | `max-size`  | `number`                | `10 MB`  | Größte angenommene Datei, in Bytes.                                    |
| `maxCount`    | `max-count` | `number`                | —        | Höchstzahl gleichzeitig vorbereiteter Dateien; ohne Angabe unbegrenzt. |
| `attachments` | —           | `readonly Attachment[]` | `[]`     | Die vorbereiteten Dateien, in der Reihenfolge ihres Eintreffens.       |
| `files`       | —           | `File[]`                | `[]`     | Nur die Dateien, zum Bauen eines Anfragerumpfs.                        |
| `sheet`       | `sheet`     | `string`                | `''`     | CSS, das in den Shadow Root eingefügt wird.                            |

`attachments` und `files` sind schreibgeschützte Sichten. Dateien werden über `add()` vorbereitet.

### Methoden

| Methode      | Rückgabe       | Beschreibung                                                       |
| ------------ | -------------- | ------------------------------------------------------------------ |
| `add(files)` | `Attachment[]` | Bereitet ein `File`-Iterable vor; liefert die angenommenen zurück. |
| `detach(id)` | `boolean`      | Entfernt einen Anhang per id; `false`, wenn es die id nicht gab.   |
| `clear()`    | `void`         | Entfernt alles und gibt die Object-URLs frei.                      |

::: tip Es heißt `detach(id)`, nicht `remove(id)`
Jedes Element hat bereits ein `remove()`, das keine Argumente nimmt und sich selbst aus dem Dokument
entfernt. Es mit einer anderen Bedeutung zu überdecken ist eine Falle für alle, die nach der
Standardmethode greifen.
:::

### Ereignisse

| Ereignis             | Detail             | Auslösung         | Beschreibung                                                                                                  |
| -------------------- | ------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------- |
| `attachmentschange`  | `{ attachments }`  | bubbles, composed | Die Liste der vorbereiteten Dateien hat sich geändert.                                                        |
| `attachmentrejected` | `{ file, reason }` | bubbles, composed | Eine Datei wurde abgelehnt. `reason` ist eines von `too-large`, `type-not-accepted`, `too-many`, `duplicate`. |

### Typen

```ts
interface Attachment {
  id: string; // stabil, solange dieser Anhang lebt
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string | null; // Object-URL bei Bildern, sonst null
}

type AttachmentRejection = 'too-large' | 'type-not-accepted' | 'too-many' | 'duplicate';
```

### Parts

`list` · `attachment` · `thumb` · `icon` · `name` · `size` · `remove`

## Wie die Vorschauen funktionieren

Vorschauen sind **Object-URLs, keine Data-URLs**. Eine Vorschau kostet eine Referenz auf Bytes, die
der Browser ohnehin schon hat; ein 10-MB-Foto in eine Base64-Zeichenkette zu lesen, nur um ein
40px-Vorschaubild zu zeigen, kostet diese Zeichenkette. Baue die Data-URL später, einmal, an der
Stelle, die tatsächlich sendet.

Jede URL, die das Element anlegt, gibt es auch wieder frei: beim Entfernen, beim Leeren und beim
Trennen vom Dokument. Halte `previewUrl` nicht über die Lebensdauer des Anhangs hinaus fest.

## Barrierefreiheit

Der Alternativtext eines Vorschaubilds ist **der Dateiname**, nicht „Bild“: vier Anhänge, die alle
als „Bild“ angesagt werden, haben der lesenden Person nichts darüber gesagt, welcher welcher ist.
Jede Entfernen-Schaltfläche trägt aus demselben Grund den Namen ihrer Datei.

## Styling

`<r-attachments>` stellt **17 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens,
die es aus dem Theme liest. Setze eines überall dort, wo es vererbt wird: `:root`, ein umgebendes
Element oder das Element selbst:

```css
r-attachments {
  --ran-attachment-background: var(--ran-color-bg-subtle);
}
```

Parts: `attachment` · `icon` · `list` · `name` · `remove` · `size` · `thumb`

Die vollständige Liste steht bei den [Style-Tokens](/de/src/ranui/style-tokens#attachments); welches Token das richtige ist, klärt das [Designsystem](/de/src/ranui/design-system/).

## Bewährte Vorgehensweisen

- **Prüfe auch auf dem Server.** `accept` und `max-size` sind eine Höflichkeit gegenüber der Person,
  die anhängt, keine Sicherheitsgrenze.
- **Leere nach erfolgreichem Senden**, nicht davor. Eine gescheiterte Anfrage soll die Dateien
  vorbereitet zurücklassen, damit ein neuer Versuch möglich ist.
- **Erkläre jede Ablehnung.** Das Ereignis gibt es, damit die Leiste niemals stillschweigend eine
  Datei verwirft.
