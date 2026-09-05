---
description: 'Rendert ein reines Anhänge-Ereignisprotokoll als Konversation — mit Projektion, Bodenverfolgung und Zeilenabgleich, wobei jede Inhaltsart als eigenständige Ansicht registriert wird.'
---

# Conversation

Rendert ein reines Anhänge-Ereignisprotokoll als Konversation. Das Element übernimmt genau die drei
Dinge, die mühsam und leicht falsch zu machen sind, und sonst nichts: Ereignisse in Knoten
projizieren, die Ansicht am unteren Rand halten, ohne das Scrollen des Lesers zu übergehen, und die
Zeilen gegen die Knotenliste abgleichen.

> **Nimm es, wenn** du einen streamenden Verlauf renderst (einen Chat, eine Agenten-Sitzung, ein
> Protokoll) und jede Inhaltsart (Nachricht, Werkzeugaufruf, Statuszeile) eine eigenständige
> Registrierung sein soll statt ein weiterer Zweig in einem immer größeren Renderer.

Wie eine Nachricht oder ein Werkzeugaufruf _aussieht_, ist Sache einer registrierten Ansicht, nicht
des Elements. Seine Projektion ist [ranuts/conversation](../../ranuts/conversation/), sein Scrollen
`createBottomFollower` aus [ranuts/utils](../../ranuts/utils/).

## Schnellstart

```html
<r-conversation empty="Noch keine Nachrichten" style="height: 400px"></r-conversation>
```

```ts
const chat = document.createElement('r-conversation');

chat.register({
  kind: 'message',
  // Welche Ereignisse mir gehören und zu welchem Knoten.
  match: (e) =>
    e.type === 'message/start'
      ? { id: e.id, role: 'start' }
      : e.type === 'message/delta'
        ? { id: e.id, role: 'update' }
        : null,
  // Wie sie sich in meinen eigenen Zustand falten.
  start: () => ({ text: '' }),
  update: (state, e) => ({ text: state.text + e.text }),
  // Deltas pro Token bündeln sich zu einem Neuzeichnen je Frame; feste Fakten warten nicht.
  publication: (e) => (e.type === 'message/delta' ? 'animation-frame' : 'immediate'),
  // Wie dieser Zustand auf den Schirm kommt.
  mount: () => document.createElement('r-markdown'),
  patch: (el, node) => {
    el.content = node.state.text;
  },
});

chat.push({ type: 'message/start', id: 'm1' });
chat.push({ type: 'message/delta', id: 'm1', text: 'Hello' });

container.append(chat);
```

`<r-markdown>` ist die vorgesehene Zeile für Fließtext: In seinem Standard `mode="streaming"`
schließt es halb angekommene `**bold`, Backticks, Links und `$$`-Formeln bereits selbst, eine Ansicht
muss das also nie tun.

## Regeln, die beißen, wenn man sie bricht

- **Registriere jede Ansicht vor dem ersten `push`.** Die Projektion wird einmalig aus der
  registrierten Menge gebaut; eine spätere Registrierung würde also jedes bereits eingefaltete
  Ereignis stillschweigend verpassen. Das Element wirft lieber einen Fehler.
- **`update` faltet den Zustand, `patch` schreibt ihn ins DOM.** Sie heißen unterschiedlich, weil sie
  Unterschiedliches tun: `patch` faltet nichts und läuft bei einer streamenden Zeile einmal pro
  Frame — halte es also günstig.
- **`mount` ist optional.** Eine Ansicht ohne es steuert Zustand bei, den andere Ansichten über
  `reader.previous` lesen, und rendert selbst nichts.
- **Zeilen behalten die Position, an der sie geöffnet wurden.** Eine streamende Nachricht springt
  nicht bei jedem Delta ans Ende der Liste.

## Bodenverfolgung

Standardmäßig an. Die Ansicht bleibt am unteren Rand, während Inhalt eintrifft, hört in dem Moment
auf, in dem der Leser nach oben scrollt, und heftet sich wieder an, sobald er zurück nach unten
kommt — und übergeht das manuelle Scrollen zu keinem Zeitpunkt, weil der Verfolger seine eigenen
Scroll-Schreibvorgänge von denen des Lesers unterscheidet, statt auf Eingabegeräte zu horchen.

```ts
chat.addEventListener('pinnedchange', (e) => {
  jumpButton.hidden = e.detail.pinned;
});
```

`follow="false"` überlässt dem Leser von Anfang an die Kontrolle; `scrollToBottom()` holt sie zurück.
Zum Nachladen älterer Inhalte rufe vor dem Voranstellen `captureAnchor()` und danach
`restoreAnchor()` auf, damit der Leser weiter auf das schaut, worauf er geschaut hat.

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ       | Standard | Beschreibung                                                                |
| ----------- | --------- | -------- | --------------------------------------------------------------------------- |
| `follow`    | `boolean` | `true`   | Folgt neuem Inhalt, bis der Leser sich vom Boden entfernt.                  |
| `empty`     | `string`  | `''`     | Text, solange die Projektion keine Zeilen erzeugt hat. Leer = ausgeblendet. |
| `pinned`    | `boolean` | `true`   | Nur lesbar. Ob die Ansicht neuem Inhalt gerade folgt.                       |
| `sheet`     | `string`  | `''`     | CSS, das in das Shadow DOM des Elements injiziert wird.                     |

### Methoden

| Methode               | Beschreibung                                                                  |
| --------------------- | ----------------------------------------------------------------------------- |
| `register(view)`      | Registriert eine Inhaltsart. Wirft nach dem ersten `push`.                    |
| `push(event)`         | Projiziert ein Ereignis und rendert, was sich dadurch geändert hat.           |
| `reset()`             | Verwirft alle Knoten und Zeilen, behält die registrierten Ansichten.          |
| `scrollToBottom()`    | Scrollt an den Boden und nimmt die Verfolgung wieder auf.                     |
| `captureAnchor(key?)` | Merkt sich die Position einer Zeile, bevor älterer Inhalt vorangestellt wird. |
| `restoreAnchor()`     | Setzt die gemerkte Zeile dorthin zurück, wo sie war.                          |

### Events

| Event          | Detail                | Wird ausgelöst, wenn                             |
| -------------- | --------------------- | ------------------------------------------------ |
| `pinnedchange` | `{ pinned: boolean }` | die Bodenverfolgung gewonnen oder verloren wird. |

### Slots

| Slot     | Beschreibung                                                                                  |
| -------- | --------------------------------------------------------------------------------------------- |
| `footer` | Fester Bereich unter den Zeilen: Hier gehört ein Eingabefeld hin, seine Höhe wird beobachtet. |

### Parts

`conversation` (der Scrollbereich), `list`, `row`, `footer`, `empty`.

Jede Zeile trägt außerdem `data-kind` und `data-key`, ein Verwender kann sie also gestalten oder
finden, ohne in den Shadow-Baum zu greifen.

## Styling

`<r-conversation>` stellt **14 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens,
die es aus dem Theme liest. Setze eine dort, wo sie vererbt wird — `:root`, ein Wrapper oder das
Element selbst:

```css
r-conversation {
  --ran-conversation-background: var(--ran-color-bg-subtle);
}
```

Parts: `conversation` · `empty` · `footer` · `list` · `older`

Die vollständige Liste steht in den [Style-Tokens](/de/src/ranui/style-tokens#conversation); welches Token du wählst, klärt das [Designsystem](/de/src/ranui/design-system/).

## Siehe auch

- [ranuts/stream](../../ranuts/stream/): das SSE eines Anbieters in die hier gepushten Ereignisse verwandeln
- [ranuts/conversation](../../ranuts/conversation/): die Projektion, samt Taktung
- [Markdown](../markdown/): die streamingbewusste Zeile für Fließtext
