---
description: 'Eine aufklappbare Gedankenkette, die sich öffnet, solange die Begründung streamt, und sich schließt, wenn sie endet — bis der Leser es anders entscheidet.'
---

# Reasoning

Eine aufklappbare Gedankenkette.

> **Nimm es, wenn** ein Modell seine Begründung getrennt von der Antwort zeigt und du willst,
> dass der Leser ihr beim Entstehen zusieht, ohne sie danach auf dem Schirm zu behalten.

Die Begründung ist der einzige Teil einer Antwort, den ein Leser während des Entstehens sehen
will und fast nie behalten möchte. Deshalb klappt das Element auf, solange `streaming` gesetzt
ist, und wieder zu, sobald es entfällt.

**Bis der Leser es anfasst.** Sobald er selbst auf- oder zuklappt, hört das automatische
Verhalten endgültig auf. Für das Scrollen gilt bei
[`createBottomFollower`](../../ranuts/utils/) dieselbe Besitzregel, und aus demselben Grund: Eine
Oberfläche, die etwas immer wieder neu entscheidet, was der Leser bereits entschieden hat, ist
schlimmer als eine, die nie entschieden hat. Auch `open` per Skript zu setzen gilt als
Übernahme, denn das Skript handelt für einen Aufrufer, der eine Meinung hat.

## Schnellstart

```html
<r-reasoning label="Thinking"></r-reasoning>
```

```ts
const reasoning = document.createElement('r-reasoning');

reasoning.streaming = true; // klappt auf
reasoning.content += delta; // wächst sichtbar weiter
reasoning.duration = 4200; // „4.2s“ neben der Beschriftung
reasoning.streaming = false; // klappt zu, sofern der Leser nicht eingegriffen hat

conversation.append(reasoning);
```

`ranuts/stream` hält `reasoning-delta` bereits von `text-delta` getrennt, eine View kann das also
direkt aus einem Snapshot speisen:

```ts
reasoning.content = snapshot.blocks
  .filter((block) => block.type === 'reasoning')
  .map((block) => block.text)
  .join('');
reasoning.streaming = !snapshot.done;
```

## Wissenswerte Details

- **Dauern unter einer Sekunde werden gar nicht gezeigt.** Dem Leser ist wichtig, dass es schnell
  war, nicht dass es 340 ms waren.
- **Die Beschriftung pulsiert während des Streamings**, damit langes stilles Nachdenken nicht wie
  ein Hänger wirkt. `prefers-reduced-motion` schaltet die Animation ab, ohne die Information zu
  nehmen.
- **Der Standard-Slot ersetzt den gerenderten Text**, für Aufrufer, die im Rumpf lieber
  `<r-markdown>` als reinen Text hätten.

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ              | Standard      | Beschreibung                                                      |
| ----------- | ---------------- | ------------- | ----------------------------------------------------------------- |
| `content`   | `string`         | `''`          | Der Begründungstext. Wiederholtes Zuweisen ist der Streaming-Weg. |
| `streaming` | `boolean`        | `false`       | Ob noch Begründung eintrifft.                                     |
| `open`      | `boolean`        | `false`       | Ob der Rumpf aufgeklappt ist.                                     |
| `label`     | `string`         | `'Reasoning'` | Text der Zusammenfassungszeile.                                   |
| `duration`  | `number \| null` | `null`        | Millisekunden Nachdenken. Unter einer Sekunde ausgeblendet.       |
| `sheet`     | `string`         | `''`          | CSS, das in das Shadow DOM des Elements injiziert wird.           |

Ein `duration`, das keine endliche, nicht negative Zahl ist, liest sich als `null` zurück.

### Slots

| Slot       | Beschreibung                                              |
| ---------- | --------------------------------------------------------- |
| (Standard) | Ersetzt den gerenderten Text durch deinen eigenen Inhalt. |

### Parts

`reasoning`, `summary`, `marker`, `label`, `meta`, `body`, `text`.

### Barrierefreiheit

Die Zusammenfassung ist ein echter `<button type="button">` mit `aria-expanded` und damit ohne
Zusatzaufwand per Tastatur erreichbar und bedienbar.

## Styling

`<r-reasoning>` stellt **4 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens,
die es aus dem Theme liest. Setze eine dort, wo sie vererbt wird — `:root`, ein Wrapper oder das
Element selbst:

```css
r-reasoning {
  --ran-reasoning-color: var(--ran-color-text-secondary);
}
```

Parts: `body` · `row` · `text`

Die vollständige Liste steht in den [Style-Tokens](/de/src/ranui/style-tokens#reasoning); welches Token du wählst, klärt das [Designsystem](/de/src/ranui/design-system/).

## Siehe auch

- [Conversation](../conversation/): dies als Begründungszeile eines Verlaufs einhängen
- [ranuts/stream](../../ranuts/stream/): woher `reasoning-delta` kommt
