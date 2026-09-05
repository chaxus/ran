# ranuts/conversation — Vom Ereignisprotokoll zu darstellbaren Knoten

Projiziert ein Ereignisprotokoll, an das nur angehängt wird, auf die Knoten, die eine Gesprächsansicht zeichnet.

```js
import { createConversationEngine } from 'ranuts/conversation';
```

**Ein eigener Einstiegspunkt**, und ohne DOM: Die Projektion lässt sich für sich allein testen und auf dem Server rendern. [`<r-conversation>`](../../ranui/conversation/) ist der Abnehmer im DOM.

## Warum nicht nach Ereignistyp verzweigen

Der übliche Weg, ein Gespräch zu zeichnen, ist eine Ansicht, die nach Ereignistyp verzweigt und einen Komponentenbaum verändert. Damit landen Reihenfolge, Identität und der Abgleich von Teilaktualisierungen **in der Ansicht**, und jede neue Art von Inhalt (ein Werkzeugaufruf, eine Freigabeabfrage, eine Statuszeile) muss von Hand durchgefädelt werden — die Ansicht bekommt einen Zweig je Art.

Hier ist jede Art ein **eigenständig angemeldeter Zustandsautomat**. Eine Definition sagt, welche Ereignisse ihre sind, faltet sie in ihren eigenen Zustand und erfährt nie, dass es die anderen gibt. Eine Art hinzuzufügen heißt, eine Definition hinzuzufügen, nicht einen Renderer zu bearbeiten.

## Eine Definition

```ts
const message = {
  kind: 'message',
  // Welche Ereignisse meine sind, und zu welchem Knoten sie gehören.
  match: (event) =>
    event.type === 'message/start'
      ? { id: event.id, role: 'start' }
      : event.type === 'message/delta'
        ? { id: event.id, role: 'update' }
        : null,
  // Falte sie in meinen eigenen Zustand.
  start: (event, reader) => ({ text: '', after: reader.previous('message')?.id }),
  update: (state, event) => ({ ...state, text: state.text + event.text }),
  // Wie oft Abonnenten das Ergebnis sehen sollen.
  publication: (event) => (event.type === 'message/delta' ? 'animation-frame' : 'immediate'),
};

const engine = createConversationEngine({ definitions: [message, toolCall] });
engine.subscribe((nodes) => render(nodes));
engine.push(event);
```

`definitions` ist über einem `unknown`-Zustand deklariert, sodass sich Definitionen mit unterschiedlichen Zustandstypen ohne Umtypung an der Aufrufstelle nebeneinander anmelden lassen — und jede dort, wo sie geschrieben steht, vollständig typisiert bleibt.

## Semantik

- **Jede Definition sieht jedes Ereignis.** Die Engine hält nicht beim ersten Anspruch an, ein einzelnes Protokollereignis kann also zwei Knoten antreiben.
- **Die Reihenfolge steht mit `start` fest.** Ein Knoten, der sich weiter aktualisiert, bleibt dort, wo er aufging — eine gestreamte Nachricht springt also nicht bei jedem Delta ans Ende der Liste.
- **Ein `update` für eine id ohne offenen Knoten wird verworfen.** Das ist das richtige Ergebnis, wenn das Startereignis aus einem seitenweisen Fenster herausgefallen ist; einen Knoten allein aus einer Teilaktualisierung zu bauen, zeichnete etwas, das es nie gab.
- **Ein wiederholtes `start` öffnet den Knoten an Ort und Stelle neu.** Die Definition hat entschieden, dass dies ein neuer Knoten ist, der alte Zustand wird also verworfen statt hineinverschmolzen, und die Position bleibt.
- **`reader.previous(kind)` blickt nur zurück.** Eine Definition, die Knoten sehen könnte, die nach ihr begonnen haben, gäbe je nach Laufzeitpunkt eine andere Antwort, und dasselbe Protokoll erneut abzuspielen ergäbe nicht dieselbe Ansicht.

## Takt der Veröffentlichung

`publication` steuert, wie oft Abonnenten Aktualisierungen sehen, und ist die einzige Stellschraube, an der du für die Leistung drehen musst:

| Takt              | Wofür                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| `animation-frame` | Deltas je Token: Alles zwischen zwei Bildern verschmilzt zu einer einzigen Benachrichtigung            |
| `immediate`       | einzelne Tatsachen: ein Werkzeugergebnis, eine Freigabe; ein Bild zu warten fügt nur Verzögerung hinzu |
| `none`            | Zustand, den eine spätere Veröffentlichung ohnehin mitträgt; wird notiert, ohne die Ansicht zu wecken  |

**Der Takt steigt und lockert sich nie.** Eine `immediate`-Veröffentlichung während ein Bild aussteht feuert sofort und verwirft das Bild, statt zweimal zu benachrichtigen. `publication` wegzulassen bedeutet `immediate`.

Die Option `scheduler` ersetzt die Bildplanung; so wird der Takt ohne echtes Zeichnen getestet. Voreingestellt sind `requestAnimationFrame` im Browser und ein Microtask sonst.

## Knoten

```ts
interface ConversationNode<State> {
  key: string; // `kind:id`, über das ganze Leben des Knotens stabil
  kind: string;
  id: string;
  seq: number; // die Ordnungszahl des Startereignisses — der Sortierschlüssel
  state: State;
}
```

`nodes()` gibt bis zum nächsten angenommenen Ereignis dasselbe Array zurück, und jeder Knoten ist eingefroren — eine Ansicht kann einen also über eine Veröffentlichung hinweg festhalten, ohne dass er sich darunter verändert.

## Siehe auch

- [ranuts/stream](../stream/): erzeugt die Ereignisse
- [`<r-conversation>`](../../ranui/conversation/): zeichnet die Knoten
- `createBottomFollower` in [ranuts/utils](../utils/): hält die Ansicht am unteren Rand fest
