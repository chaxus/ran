# Geometrie für Canvas 2D

Pfadbau und Winkelrechnung für Canvas 2D. Jede Pfadfunktion **baut nur den Pfad**; sie ruft niemals `fill()` oder `stroke()` auf — wie gemalt wird, entscheidet die aufrufende Seite.

## Verwendung

```ts
import { roundRectByArc, getLinearGradient } from 'ranuts/utils';

const ctx = canvas.getContext('2d')!;

roundRectByArc(ctx, 10, 10, 200, 80, 12);
ctx.fillStyle = getLinearGradient(ctx, 10, 10, 200, 80, 'linear-gradient(90deg, #06f, #0cf)');
ctx.fill();
```

## API

### getAngle

Grad in Bogenmaß.

#### Parameter

| Parameter | Beschreibung   | Typ      | Standard     |
| --------- | -------------- | -------- | ------------ |
| `deg`     | Winkel in Grad | `number` | Erforderlich |

#### Rückgabe

| Argument | Beschreibung       | Typ      |
| -------- | ------------------ | -------- |
| `rad`    | Winkel im Bogenmaß | `number` |

### getArcPointerByDeg

Der Punkt auf einem Kreis, der zu einem Winkel gehört.

#### Parameter

| Parameter | Beschreibung       | Typ      | Standard     |
| --------- | ------------------ | -------- | ------------ |
| `deg`     | Winkel im Bogenmaß | `number` | Erforderlich |
| `r`       | Radius             | `number` | Erforderlich |

#### Rückgabe

| Argument | Beschreibung | Typ                |
| -------- | ------------ | ------------------ |
| `point`  | `[x, y]`     | `[number, number]` |

### getTangentByPointer

Die Tangente in einem Punkt auf einem Kreis.

#### Parameter

| Parameter | Beschreibung | Typ      | Standard     |
| --------- | ------------ | -------- | ------------ |
| `x`       | x-Koordinate | `number` | Erforderlich |
| `y`       | y-Koordinate | `number` | Erforderlich |

#### Rückgabe

| Argument | Beschreibung                  | Typ             |
| -------- | ----------------------------- | --------------- |
| `line`   | `[Steigung, Achsenabschnitt]` | `Array<number>` |

### roundRectByArc

Zeichnet ein Rechteck mit abgerundeten Ecken. Ein Eckenradius, der größer ist als die Hälfte der kürzeren Seite, wird **auf diese Hälfte begrenzt**, sodass benachbarte Ecken sich nie überlappen.

#### Parameter

| Parameter | Beschreibung          | Typ                        | Standard     |
| --------- | --------------------- | -------------------------- | ------------ |
| `ctx`     | 2D-Kontext des Canvas | `CanvasRenderingContext2D` | Erforderlich |
| `...rest` | `x, y, w, h, r`       | `number[]`                 | Erforderlich |

#### Rückgabe

Kein Rückgabewert (`void`)

### fanShapedByArc

Zeichnet ein Tortenstück, samt dem Zwischenraum zu den anderen.

#### Parameter

| Parameter   | Beschreibung                                  | Typ                        | Standard     |
| ----------- | --------------------------------------------- | -------------------------- | ------------ |
| `ctx`       | 2D-Kontext des Canvas                         | `CanvasRenderingContext2D` | Erforderlich |
| `maxRadius` | Äußerer Radius                                | `number`                   | Erforderlich |
| `start`     | Anfangswinkel im Bogenmaß                     | `number`                   | Erforderlich |
| `end`       | Endwinkel im Bogenmaß                         | `number`                   | Erforderlich |
| `gutter`    | Breite des Zwischenraums zwischen den Stücken | `number`                   | Erforderlich |

#### Rückgabe

Kein Rückgabewert (`void`)

### getLinearGradient

Übersetzt eine CSS-Zeichenkette `linear-gradient(...)` in einen `CanvasGradient` des Canvas.

`createLinearGradient` nimmt nur einen Anfangs- und einen Endpunkt, während CSS die Richtung als Winkel angibt. Deshalb wird der Kreis in acht Sektoren zu 45° geteilt, und die Tangente rechnet den Winkel wieder in Anfangs- und Endkoordinaten auf dem Rand des Rechtecks um. Richtungen als Schlüsselwort (`to top`, `to bottom`, `to left`, `to right`) werden unmittelbar behandelt.

#### Parameter

| Parameter    | Beschreibung                             | Typ                        | Standard     |
| ------------ | ---------------------------------------- | -------------------------- | ------------ |
| `ctx`        | 2D-Kontext des Canvas                    | `CanvasRenderingContext2D` | Erforderlich |
| `x`          | x der linken oberen Ecke des Rechtecks   | `number`                   | Erforderlich |
| `y`          | y der linken oberen Ecke des Rechtecks   | `number`                   | Erforderlich |
| `w`          | Breite des Rechtecks                     | `number`                   | Erforderlich |
| `h`          | Höhe des Rechtecks                       | `number`                   | Erforderlich |
| `background` | etwa `linear-gradient(90deg, red, blue)` | `string`                   | Erforderlich |

#### Rückgabe

| Argument   | Beschreibung                                                 | Typ              |
| ---------- | ------------------------------------------------------------ | ---------------- |
| `gradient` | Lässt sich direkt an `fillStyle` oder `strokeStyle` zuweisen | `CanvasGradient` |

::: warning
Farbstopps müssen ohne Einheit angegeben werden (`red 0, blue 1`). Ein Stopp in Prozent (`red 50%`) wird zu `NaN` geparst, und `addColorStop` wirft.
:::
