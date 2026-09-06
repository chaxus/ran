# computePlacement

Setzt ein schwebendes Feld (Dropdown, Popover, Tooltip) relativ zum Rechteck eines Ankers: Fehlt der bevorzugten Seite Platz und hat die gegenüberliegende mehr, klappt es um; danach verschiebt es sich entlang der Querachse, um innerhalb einer Grenze zu bleiben. Macht dasselbe wie die Middleware `flip` und `shift` von Floating UI, ohne die Abhängigkeit.

Reine Geometrie: Das DOM selbst wird nie angefasst. Übergib die Ergebnisse von `getBoundingClientRect()`, und du bekommst die Koordinaten zurück, die du schreiben sollst.

## Verwendung

```ts
import { computePlacement } from 'ranuts/utils';

const anchorRect = trigger.getBoundingClientRect();
const { top, left, placement } = computePlacement({
  anchor: anchorRect,
  floating: { width: panel.offsetWidth, height: panel.offsetHeight },
  placement: 'bottom',
  offset: 4,
});

panel.style.position = 'absolute';
panel.style.top = `${top + window.scrollY}px`;
panel.style.left = `${left + window.scrollX}px`;
// `placement` ist die Seite, die nach dem Umklappen tatsächlich verwendet wurde —
// nimm sie, um eine Einblendklasse oder die Pfeilrichtung zu wählen.
```

## API

### computePlacement

#### Parameter

| Parameter           | Beschreibung                                                                                    | Typ                                      | Standard                  |
| ------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------- |
| `options.anchor`    | Rechteck des Ankers (des Auslösers), in Viewport-Koordinaten (etwa `getBoundingClientRect()`)   | `{ top, left, width, height }`           | Erforderlich              |
| `options.floating`  | Die eigene Größe des schwebenden Feldes                                                         | `{ width, height }`                      | Erforderlich              |
| `options.placement` | Bevorzugte Seite. Klappt zur gegenüberliegenden um, wenn hier der Platz fehlt und dort mehr ist | `'top' \| 'bottom' \| 'left' \| 'right'` | Erforderlich              |
| `options.offset`    | Abstand zwischen Anker und schwebendem Feld, in px                                              | `number`                                 | `0`                       |
| `options.boundary`  | Bereich, in dem das Feld bleiben muss, in Viewport-Koordinaten                                  | `{ top, left, width, height }`           | Der Viewport des Fensters |
| `options.padding`   | Kleinster Abstand zwischen Feld und Grenzkante beim Verschieben, in px                          | `number`                                 | `8`                       |

#### Rückgabe

| Argument    | Beschreibung                                                  | Typ                                      |
| ----------- | ------------------------------------------------------------- | ---------------------------------------- |
| `top`       | Das ermittelte `top`, im selben Koordinatenraum wie `anchor`  | `number`                                 |
| `left`      | Das ermittelte `left`, im selben Koordinatenraum wie `anchor` | `number`                                 |
| `placement` | Die nach dem Umklappen tatsächlich verwendete Seite           | `'top' \| 'bottom' \| 'left' \| 'right'` |

## Hinweise

1. **Die Koordinaten sind durchweg auf den Viewport bezogen**, im selben Raum wie `anchor`. Setzt du das Feld mit `position: absolute` relativ zum Dokument, addiere beim Schreiben der Stile selbst `scrollX` und `scrollY` (siehe das Beispiel oben).
2. **Ohne echtes Layout kein Umklappen und kein Verschieben.** Hat `anchor` oder `floating` die Breite oder Höhe null (jsdom, das nie wirklich layoutet, oder ein Feld, das gelesen wird, bevor sein Inhalt steht), würden die Platzberechnungen bei jedem Aufruf fälschlich eine Kollision „erkennen“. Deshalb überspringt `computePlacement` Umklappen und Verschieben vollständig und gibt das gewünschte `placement` unverändert zurück.
3. **Verschoben wird nicht, wenn das Feld größer ist als die Grenze selbst**: Es einzupassen würde es nur nach der anderen Seite weiter aus dem Bild schieben.
4. Wird intern von `r-popover` und `r-select` aus `ranui` benutzt, damit ein in den `body` portiertes Dropdown im Bild bleibt.
