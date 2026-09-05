# ranuts/stream — Modellantworten im Strom

Auswertung von Server-Sent Events, ein anbieterneutrales Vokabular für eine gestreamte Modellantwort, und eine Faltung dieses Vokabulars zu darstellbaren Blöcken.

```js
import { parseEventStream, mapEventStream, createStreamAccumulator } from 'ranuts/stream';
```

**Ein eigener Einstiegspunkt.** Nichts hier fasst das DOM an, eine Antwort lässt sich also in einem Test oder auf einem Server falten; ihn aus `ranuts/utils` zu importieren zöge DOM-nahe Module mit.

**Hier wohnt kein Anbieter.** Jede gängige Chat-Completion-API streamt dieselben vier Dinge (Assistenztext, gesondert abgerechneten Denktext, Werkzeugaufrufe, eine Token-Zahl), aber jede benennt und verschränkt sie anders. Das Ereignis eines Anbieters auf `StreamChunk` abzubilden ist der einzige anbieterspezifische Schritt, und der bleibt bei dir: Ein Drahtformat fest einzubacken machte die anderen beiden Ebenen für alle anderen unbrauchbar.

## Drei Ebenen

| Ebene                       | Was sie tut                                                   |
| --------------------------- | ------------------------------------------------------------- |
| `parseEventStream(source)`  | Bytes → `ServerSentEvent`. Nur Transport.                     |
| `StreamChunk`               | das Vokabular, in dem eine Antwort eintrifft.                 |
| `createStreamAccumulator()` | faltet die Stücke zu Blöcken, die eine Ansicht zeichnen kann. |

`mapEventStream(source, map)` verbindet die ersten beiden: Es läuft die Ereignisse ab und lässt deine Abbildung je Ereignis null oder mehr Stücke zurückgeben. `[]` zurückzugeben ist der Weg, ein Keep-alive oder einen `[DONE]`-Wächter fallen zu lassen.

## Das Vokabular

```ts
type StreamChunk =
  | { type: 'block-start'; index: number; blockType: ContentBlockType }
  | { type: 'text-delta'; index: number; text: string }
  | { type: 'reasoning-delta'; index: number; text: string }
  | { type: 'tool-call-delta'; index: number; id: string; name?: string; argumentsDelta: string }
  | { type: 'block-end'; index: number; block: ContentBlock }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'finish'; reason: FinishReason };
```

- **`index` bringt die verschränkten Deltas zusammen.** Denken und Text treffen ineinander verwoben ein, und mehrere Werkzeugaufrufe gehen gleichzeitig auf — die Ankunftsreihenfolge gruppiert also nichts.
- **`block-end` trägt den fertig zusammengesetzten Block** und sticht das, was die Deltas gebaut haben. Wer nur fertige Blöcke will, kann jedes Delta ignorieren.
- **Werkzeugargumente bleiben roher JSON-Text.** Ein halbes JSON-Dokument ist kein Wert. Parse `arguments` einmal, nach `finish`: `argumentsDelta` mitten im Strom zu parsen ist genau die Stelle, an der gestreamte Werkzeugaufrufe üblicherweise zerbrechen.
- **`block-start` ist optional.** Mehrere Anbieter öffnen einen Block mit dessen erstem Delta, der Akkumulator öffnet daher bei Bedarf einen. Verlange es auch in deiner Abbildung nicht.
- **`finish` beendet.** `usage` kommt davor; danach folgt nichts mehr.

## Eine Antwort falten

```js
const accumulator = createStreamAccumulator();

for await (const chunk of mapEventStream(response.body, toStreamChunks)) {
  accumulator.push(chunk);
  render(accumulator.snapshot());
}

const { blocks, usage, finishReason } = accumulator.snapshot();
const calls = accumulator.toolCalls(); // die Argumente sind noch Text — hier parsen
```

`snapshot()` ist unveränderlich: Eine mitten im Strom genommene Momentaufnahme behält ihre Werte, eine Ansicht kann also eine festhalten, ohne dass ein späteres `push` sie darunter verändert. `text()` und `reasoning()` fügen ihre Blöcke in Indexreihenfolge zusammen, und `reset()` räumt die Instanz für die nächste Antwort frei.

## Womit der SSE-Parser fertig wird

Die Regeln der Rahmung sind wenige und werden fast nie vollständig umgesetzt. `parseEventStream` deckt ab:

- eine Stückgrenze **an beliebiger Stelle**, auch innerhalb eines Mehrbyte-Zeichens und zwischen den beiden Hälften eines `\r\n`
- wiederholte `data:`-Felder, mit `\n` verbunden
- genau ein Leerzeichen, das nach dem Doppelpunkt entfernt wird
- `:`-Kommentarzeilen, mit denen Server eine Verbindung warm halten
- ein führendes BOM
- einen letzten Block, den der Server nie mit einer Leerzeile abgeschlossen hat
- einen `ReadableStream` ohne `Symbol.asyncIterator`

Er nimmt neben einem `ReadableStream` jedes `AsyncIterable<Uint8Array>` an, ein Test kann ihm also ohne Netz Byte-Scheiben übergeben.

## Eine ausgearbeitete Abbildung

`packages/im` in diesem Repository ist ein funktionierender Abnehmer: eine OpenAI-kompatible SSE-Route, die Abbildung auf `StreamChunk` und eine Ansicht, die eine Momentaufnahme hält, statt Deltas selbst aneinanderzuhängen. Ihr Hin-und-zurück-Test schickt die Bytes des echten Servers in mehreren Stückgrößen durch den echten Client, damit die beiden Hälften nicht auseinanderlaufen können.

## Siehe auch

- [ranuts/conversation](../conversation/): projiziert die entstandenen Ereignisse auf darstellbare Knoten
- [`<r-conversation>`](../../ranui/conversation/): zeichnet diese Knoten
