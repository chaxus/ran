---
description: 'Eine experimentelle Rubbellos-Fläche, bei der das Ziehen über ein Canvas-Deckblatt den Inhalt darunter freilegt — über die Pointer-Events-API.'
---

# Scratch

Experimentelle Rubbellos-Fläche, die in ihrem Shadow DOM ein bildschirmfüllendes `<canvas>` als Deckblatt über eine Enthüllungsschicht legt. Das Ziehen über das Canvas radiert das Deckblatt mit `destination-out`-Komposition entlang des tatsächlichen Wegs weg, den dein Zeiger nimmt; ist genug Fläche freigerubbelt, erscheint, was darunter liegt. Der Host ist `display: block` — gib ihm also eine ausdrückliche Breite und Höhe.

> **Nimm sie, wenn** du eine experimentelle Rubbellos-Fläche brauchst, bei der Ziehen ein Deckblatt-Canvas wegradiert und beliebigen Inhalt darunter freilegt. Dank der Pointer-Events-API funktioniert das mit Maus, Finger und Stift gleichermaßen.

> ⚠️ **Experimentell**: Diese Komponente ist in Arbeit. Behandle sie als spielerische Interaktion, nicht als abgehärtetes Produktions-Widget.

## Schnellstart

### Grundlegende Verwendung

Was du in `<r-scratch>` hineinlegst, ist der freigelegte Inhalt (ein Betrag, ein Bild, ein `<r-icon>`, mehrere Elemente) — über den Standard-Slot in die Schicht unter dem Deckblatt projiziert, genau wie die Inhaltsprojektion in jeder anderen ranui-Komponente.

<Demo>
  <r-scratch style="display: block; width: 240px; height: 120px;">Du hast 50 Münzen gewonnen!</r-scratch>
</Demo>

```html
<r-scratch style="display: block; width: 240px; height: 120px;">Du hast 50 Münzen gewonnen!</r-scratch>
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ       | Standard | Beschreibung                                                                                            |
| ----------- | --------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `disabled`  | `boolean` | `false`  | Schaltet das Rubbeln ab (`pointer-events: none` am Deckblatt-Canvas, dazu eine Sperre in den Handlern). |
| `sheet`     | `string`  | `''`     | CSS, das in das Shadow DOM der Komponente injiziert wird.                                               |

### Deaktiviert `disabled`

<Demo>
  <r-scratch disabled style="display: block; width: 240px; height: 120px;">Du hast 50 Münzen gewonnen!</r-scratch>
</Demo>

```html
<r-scratch disabled style="display: block; width: 240px; height: 120px;">Du hast 50 Münzen gewonnen!</r-scratch>
```

### Externe Styles `sheet`

<Demo>
  <r-scratch sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }" style="display: block; width: 240px; height: 120px;">🎁</r-scratch>
</Demo>

```html
<r-scratch
  sheet=".ran-scratch-ticket-award { align-items: center; justify-content: center; display: flex; }"
  style="display: block; width: 240px; height: 120px;"
>
  🎁
</r-scratch>
```

## Interaktion

Die Komponente löst **keine** eigenen Events aus: Es gibt nichts, woran man einen Listener hängen könnte. Das Rubbeln wird ausschließlich von internen [Pointer-Events](https://developer.mozilla.org/de/docs/Web/API/Pointer_events)-Listenern am Canvas getrieben, Maus, Finger und Stift teilen sich also denselben Codepfad:

- `pointerdown`: schärft das Rubbeln und radiert genau dort, wo der Zeiger aufsetzt, einen kleinen Tupfer weg (so legt selbst ein Tippen ohne Ziehen etwas frei).
- `pointermove`: zieht, solange geschärft, eine **durchgehende Linie** (keine einzelnen Tupfer) vom vorherigen zum aktuellen Punkt mit `globalCompositeOperation = 'destination-out'`, sodass ein schnelles Ziehen eine zusammenhängende Spur statt einer gepunkteten freilegt — und summiert dabei die freigerubbelte Fläche.
- `pointerup` / `pointercancel`: entschärft das Rubbeln; sobald die summierte Fläche **35 % der Pixelfläche des Canvas** übersteigt, wird das ganze Deckblatt mit `clearRect` gelöscht und die Schicht darunter vollständig sichtbar (eine bewusst großzügige Schwelle nach dem Motto „ein bisschen rubbeln, den Rest macht es selbst“ — die übliche Rubbellos-Erfahrung, statt das gesamte Deckblatt von Hand entfernen zu lassen).

Die Zeigerkoordinaten werden über die tatsächliche Auflösung des Zeichenpuffers abgebildet (siehe unten), das Rubbeln folgt also korrekt Finger oder Cursor — unabhängig von der CSS-Größe des Elements und vom Pixelverhältnis des Bildschirms. Alle Handler tun nichts, solange `disabled` gesetzt ist, und `touch-action: none` am Canvas verhindert, dass ein Ziehen per Finger zusätzlich die Seite scrollt.

Ein paar gerätespezifische Sonderfälle werden ausdrücklich behandelt, statt dem überlassen, was das „Vereinheitlichen“ von Maus, Finger und Stift von sich aus tut:

- **Maus**: Nur die Haupttaste (links) startet ein Rubbeln; Ziehen mit der rechten oder ein Klick mit der mittleren Taste nicht.
- **Multitouch**: Der zuerst aufgesetzte Finger führt den Strich; ein zweiter Finger, der mitten im Rubbeln aufsetzt, wird ignoriert, bis der erste abhebt — statt dass beide gleichzeitig in denselben Zeichenzustand schreiben.
- **Unterbrochene Gesten**: Holt sich das Betriebssystem die Zeigererfassung mitten im Ziehen zurück, ohne je `pointerup` auszulösen (beobachtet in manchen Android-WebViews, wenn eine System-Zurück-Geste das Rubbeln unterbricht), setzt ein `lostpointercapture`-Listener den internen Zustand trotzdem zurück; sonst bliebe er geschärft und die nächste, völlig unabhängige Zeigerbewegung würde stillschweigend weiterzeichnen.

### Canvas-Auflösung

Die interne Auflösung des Canvas wird auf seine tatsächlich gerenderte CSS-Größe × `devicePixelRatio` abgeglichen (beim Verbinden und erneut bei jedem `resize` des Fensters), statt beim festen 300×150 des Browsers zu bleiben. So bleibt das Deckblatt auf HiDPI-Bildschirmen scharf und die Zuordnung von Zeiger zu Canvas bei jeder Elementgröße genau; eine Größenänderung setzt ein laufendes Rubbeln zurück (der Puffer leert sich zwangsläufig, wenn sich seine Maße ändern).

## Slots

| Slot       | Beschreibung                                                           |
| ---------- | ---------------------------------------------------------------------- |
| (Standard) | Der freigelegte Inhalt, projiziert in die Schicht unter dem Deckblatt. |

## Styling

Diese Komponente stellt **keine `::part()`-Haken** bereit, aber die Farben ihrer beiden Schichten sind CSS-Variablen, die von Theme-Tokens getrieben werden. Ihr Shadow DOM besteht aus drei festen Schichten:

| Klasse                       | Rolle                                                                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.ran-scratch-ticket`        | Relativ positionierter Container in voller Größe (`width: 100%; height: 100%`)                                                                          |
| `.ran-scratch-ticket-award`  | Die Enthüllungsschicht, `z-index: 1`, `background: var(--ran-scratch-award-background, var(--ran-color-bg-elevated, #fff))`; enthält den Standard-Slot  |
| `.ran-scratch-ticket-canvas` | Das Deckblatt-Canvas, `z-index: 2`; gefüllt mit `--ran-scratch-cover-background` (Standard `var(--ran-color-text-secondary, #6b6b6b)`), am Host gesetzt |

Beide Farben laufen über Theme-Tokens mit einem Literal als Rückfall, passen sich also von selbst an hellen und dunklen Modus an und lassen sich mit `--ran-scratch-award-background` / `--ran-scratch-cover-background` überschreiben. Die Größe des Hosts setzt du mit gewöhnlichem `width` / `height`.

## Bewährte Praxis

- **Gib dem Host immer Maße**: Er ist `display: block` ohne eigene Größe; ohne ausdrückliche `width` und `height` fallen seine inneren `100%`-Schichten auf null zusammen.
- **Jeder freizulegende Inhalt geht**: Text, ein Bild, ein `<r-icon>`, mehrere Elemente. Lege in den Slot, was der Gewinn tatsächlich ist; es gibt keine feste Icon-plus-Größe-API, um die man herumarbeiten müsste.
- **Funktioniert mit Maus, Finger und Stift**: Pointer Events vereinheitlichen alle drei, es reagiert also am Desktop wie am Handy gleich.
- **Als experimentell behandeln**: noch in Arbeit; verlass dich für den Produktivbetrieb nicht darauf.
