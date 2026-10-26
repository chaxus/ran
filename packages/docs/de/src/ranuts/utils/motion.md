# spring / stagger / observeEntry

Bewegungsbausteine, die das Zeichnen dir überlassen: eine exakt gelöste Feder (auch als CSS-`linear()`-Easing), gestaffelte Verzögerungen, ein einmaliger Viewport-Eintritt und die Einstellung „Bewegung reduzieren“ der Lesenden. Keiner davon hat eine eigene Animationsschleife, sie treiben also Web Animations, CSS-Transitions oder dein eigenes `requestAnimationFrame` gleichermaßen an.

## API

### spring(options?)

Liefert `{ at, duration, easing }`. `at(seconds)` ist der Fortschritt von 0 bis 1 (eine unterdämpfte Feder schwingt über 1 hinaus, bevor sie ruht); `duration` ist die Zeit, bis sie innerhalb von 0,1 % des Ziels bleibt; `easing` ist dieselbe Kurve als CSS-`linear()`-String für diese Dauer.

| Option      | Beschreibung                                                     | Standard |
| ----------- | ---------------------------------------------------------------- | -------- |
| `stiffness` | Zug zum Ziel; höher ist schneller                                | `170`    |
| `damping`   | Widerstand; unter `2 * sqrt(stiffness * mass)` schwingt sie über | `26`     |
| `mass`      | Trägheit                                                         | `1`      |
| `velocity`  | Anfangsgeschwindigkeit in Fortschritt pro Sekunde                | `0`      |

### stagger(index, count, options?)

Verzögerung in Sekunden für Element `index` von `count`, beginnend beim ersten, letzten oder mittleren (`from`).

### observeEntry(element, options)

Ruft `onEnter` einmal auf, sobald die Oberkante des Elements `line` überschreitet (Anteil der Viewport-Höhe von oben), und beendet dann die Beobachtung. Der Callback erhält `{ reduced }`: bei `true` den Endzustand ohne Animation zeigen. Gibt eine Funktion zurück, die die Beobachtung vorzeitig beendet.

### prefersReducedMotion()

`true`, wenn die Lesenden reduzierte Bewegung eingestellt haben; `false` ohne window (SSR, Node).

## Beispiel

```js
import { observeEntry, prefersReducedMotion, spring, stagger } from 'ranuts';

const { duration, easing } = spring({ stiffness: 260, damping: 20 });
const cards = [...document.querySelectorAll('.card')];

cards.forEach((card, index) => {
  observeEntry(card, {
    line: 0.85,
    onEnter: ({ reduced }) => {
      if (reduced) return; // already in its final place
      card.animate(
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: duration * 1000,
          delay: stagger(index, cards.length, { each: 0.06 }) * 1000,
          easing,
          fill: 'backwards',
        },
      );
    },
  });
});
```

## Hinweise

1. **Inhalt bleibt ohne Skript sichtbar.** Animiere _von_ einem Versatz aus mit `fill: 'backwards'`, statt Elemente per CSS zu verstecken – so bleibt bei einem fehlgeschlagenen Skript oder reduzierter Bewegung alles an seinem Platz.
2. **Ohne IntersectionObserver tritt `observeEntry` sofort ein,** statt das Element warten zu lassen.
3. **Die Feder ist exakt, nicht schrittweise,** dieselben Optionen ergeben also bei jeder Bildrate dieselbe Kurve.
