# visual

Eine 2D-Rendermaschine nach Art von PixiJS. Bau einen Szenengraph aus Formen und lass ihn über eines von drei Backends zeichnen (Canvas2D, WebGL oder WebGPU), zur Laufzeit gewählt.

Die Maschine ist geschichtet: **`Application`** (Lebenszyklus und Zeichenschleife), darunter **`Renderer`** (das Backend), darunter ein Szenengraph von **`Container`** (einer Gruppe) bis **`Graphics`** (etwas Zeichenbarem). Du hängst Knoten an `app.stage`, und der Renderer zeichnet sie.

> **Nur für den Browser.** `ranuts/visual` braucht ein echtes `HTMLCanvasElement` und einen GPU- oder Canvas-Kontext. In Node läuft es nicht.

## Import

```js
import { Application, Graphics, Container } from 'ranuts/visual';
```

## Schnellstart

Eine Anwendung erzeugen, ein gefülltes und umrandetes Rechteck sowie einen Kreis zeichnen und die Zeichenschleife starten.

```js
import { Application, Graphics, RENDERER_TYPE } from 'ranuts/visual';

const view = document.querySelector('canvas');

// Application.create ist asynchron: Das WebGPU-Backend richtet sein Gerät
// asynchron ein, und das muss vor dem ersten Zeichnen fertig sein.
const app = await Application.create({
  view,
  prefer: RENDERER_TYPE.CANVAS, // CANVAS | WEB_GL | WEB_GPU
  backgroundColor: '#1e1e1e',
});

// Ein Rechteck: rote Füllung und eine 4px breite blaue Kontur.
const rect = new Graphics();
rect.beginFill('#ff0000');
rect.lineStyle(4, '#0000ff');
rect.drawRect(20, 20, 160, 100);
rect.endFill();

// Ein Kreis.
const circle = new Graphics();
circle.beginFill('#00cc88', 0.8);
circle.drawCircle(300, 120, 60);
circle.endFill();

// Zeichenbares an die stage hängen – den Vorfahren von allem, was gezeichnet wird.
app.stage.addChild(rect);
app.stage.addChild(circle);

// Die requestAnimationFrame-Schleife starten (oder app.render() für ein einzelnes Bild aufrufen).
app.start();
```

## API

### `Application`

Der Einstiegspunkt der Maschine. Ihm gehören das Canvas, der Renderer und die Wurzel des Szenengraphs (`stage`).

Nimm lieber die asynchrone Fabrik **`Application.create(...)`** als `new Application(...)`: Das WebGPU-Backend richtet sein Gerät asynchron ein, und das muss vor dem ersten Zeichnen fertig sein. Canvas und WebGL lösen sofort auf, die Fabrik ist also für alle Backends sicher und einheitlich.

#### `Application.create(options)`

`static async`. Baut eine `Application` und wartet die asynchrone Einrichtung des Renderers ab.

##### Parameter

| Parameter | Beschreibung                    | Typ                   | Standard     |
| --------- | ------------------------------- | --------------------- | ------------ |
| `options` | Einstellungen für die Anwendung | `IApplicationOptions` | Erforderlich |

##### Rückgabe

| Wert                   | Beschreibung                       | Typ                    |
| ---------------------- | ---------------------------------- | ---------------------- |
| `Promise<Application>` | Die fertig eingerichtete Anwendung | `Promise<Application>` |

#### Properties

| Eigenschaft   | Beschreibung                                                                        | Typ                 |
| ------------- | ----------------------------------------------------------------------------------- | ------------------- |
| `stage`       | Die Wurzel des Szenengraphs. Häng hier jeden Knoten an, der gezeichnet werden soll. | `Container`         |
| `view`        | Das Canvas-Element, in das gezeichnet wird.                                         | `HTMLCanvasElement` |
| `eventSystem` | Die Verteilung von Zeiger- und anderen Ereignissen, gebunden an Canvas und stage.   | `EventSystem`       |

#### Methods

| Methode    | Beschreibung                                              | Rückgabe |
| ---------- | --------------------------------------------------------- | -------- |
| `render()` | Zeichnet ein einzelnes Bild von `stage`.                  | `void`   |
| `start()`  | Startet die Zeichenschleife über `requestAnimationFrame`. | `void`   |
| `stop()`   | Beendet die Zeichenschleife, die `start()` begonnen hat.  | `void`   |

#### `IApplicationOptions`

| Feld              | Beschreibung                                                           | Typ                 | Standard               |
| ----------------- | ---------------------------------------------------------------------- | ------------------- | ---------------------- |
| `prefer`          | Welches Backend genommen wird. Ohne Angabe fällt es auf Canvas zurück. | `RENDERER_TYPE`     | `RENDERER_TYPE.CANVAS` |
| `view`            | Das Ziel-Canvas. Ohne Angabe wird ein loses `<canvas>` erzeugt.        | `HTMLCanvasElement` | ein neues Canvas       |
| `backgroundColor` | Der Hintergrund des Canvas. Nimmt jede CSS-Farbzeichenkette an.        | `string`            | —                      |
| `backgroundAlpha` | Deckkraft des Hintergrunds, `0` bis `1`.                               | `number`            | —                      |
| `debug`           | Schreibt das gewählte Zeichen-Backend in die Konsole.                  | `boolean`           | `false`                |

### `Container`

Ein Gruppenknoten – der Begriff „Gruppe“ des Szenengraphs. Er hält Kinder und den Zustand der Transformation, zeichnet selbst aber nichts; Zeichenbares wie `Graphics` erweitert ihn. Nimm einen `Container`, um Teilbäume zu bauen, die sich gemeinsam bewegen, skalieren und drehen.

#### Methods

| Methode              | Beschreibung                                                                                  | Rückgabe  |
| -------------------- | --------------------------------------------------------------------------------------------- | --------- |
| `addChild(child)`    | Hängt ein Kind (`Container`) hinten an. Hatte es schon einen Elternknoten, wird es umgehängt. | `void`    |
| `removeChild(child)` | Nimmt ein Kind aus `children` heraus.                                                         | `void`    |
| `sortChildren()`     | Sortiert `children` neu nach `zIndex` (nur wenn nötig).                                       | `void`    |
| `containsPoint(p)`   | Prüft, ob ein `Point` in die `hitArea` dieses Knotens fällt.                                  | `boolean` |

#### Eigenschaften für Transformation und Darstellung

Sie sitzen am gemeinsamen Basisknoten (`Vertex`) und stehen an jedem `Container` und jeder `Graphics` zur Verfügung.

| Eigenschaft        | Beschreibung                                                                          | Typ                      |
| ------------------ | ------------------------------------------------------------------------------------- | ------------------------ |
| `children`         | Die Kindknoten (nur lesbares Array).                                                  | `Container[]`            |
| `parent`           | Der Elternknoten, sofern angehängt.                                                   | `Container \| undefined` |
| `x` / `y`          | Die Position, im Koordinatenraum des Elternknotens.                                   | `number`                 |
| `position`         | Der Punkt der Position (`{ x, y }`).                                                  | `ObservablePoint`        |
| `scale`            | Der Punkt der Skalierung (`{ x, y }`).                                                | `ObservablePoint`        |
| `pivot`            | Der Drehpunkt für Drehung und Skalierung.                                             | `ObservablePoint`        |
| `skew`             | Der Punkt der Scherung.                                                               | `ObservablePoint`        |
| `rotation`         | Drehung im **Bogenmaß**.                                                              | `number`                 |
| `angle`            | Drehung in **Grad** (läuft mit `rotation` mit).                                       | `number`                 |
| `alpha`            | Deckkraft des Knotens, `0` bis `1` (multipliziert sich den Baum hinab).               | `number`                 |
| `visible`          | Bei `false` werden der Knoten und sein Teilbaum übersprungen.                         | `boolean`                |
| `zIndex`           | Die Zeichenreihenfolge unter Geschwistern.                                            | `number`                 |
| `hitArea`          | Eine wahlweise Form für die Trefferprüfung.                                           | `Shape \| null`          |
| `cursor`           | Die Gestalt des Zeigers, wenn er auf den Knoten zeigt.                                | `Cursor`                 |
| `structureVersion` | Version der Szenenstruktur (nur an der Wurzel); steuert das Verfolgen von Änderungen. | `number`                 |

### `Graphics`

Etwas Zeichenbares, das `Container` erweitert. Setz eine Füllung, einen Linienstil oder beides und ruf dann eine Formmethode auf. Die meisten Methoden geben `this` zurück, Aufrufe lassen sich also verketten.

#### Stil

| Methode                            | Beschreibung                                                                                                     | Rückgabe   |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------- |
| `beginFill(color?, alpha?)`        | Beginnt die Füllung mit `color` (CSS-Zeichenkette, voreingestellt `'#000000'`) und `alpha` (voreingestellt `1`). | `Graphics` |
| `endFill()`                        | Beendet die Füllung.                                                                                             | `Graphics` |
| `lineStyle(width, color?, alpha?)` | Legt die Kontur fest: `width` px, `color` (voreingestellt `'#000000'`), `alpha` (voreingestellt `1`).            | `Graphics` |
| `lineStyle(options)`               | Legt die Kontur anhand eines `ILineStyleOptions`-Objekts fest.                                                   | `Graphics` |
| `resetLineStyle()`                 | Setzt die aktuelle Kontur auf die Voreinstellungen zurück.                                                       | `void`     |

#### Formen

| Methode                                        | Beschreibung                                                         | Rückgabe   |
| ---------------------------------------------- | -------------------------------------------------------------------- | ---------- |
| `drawRect(x, y, width, height)`                | Rechteck.                                                            | `Graphics` |
| `drawRoundedRect(x, y, width, height, radius)` | Rechteck mit runden Ecken.                                           | `Graphics` |
| `drawCircle(x, y, radius)`                     | Kreis mit Mittelpunkt `(x, y)`.                                      | `Graphics` |
| `drawEllipse(x, y, radiusX, radiusY)`          | Ellipse mit Mittelpunkt `(x, y)`.                                    | `Graphics` |
| `drawPolygon(points)`                          | Geschlossenes Vieleck aus einem flachen Array `[x0, y0, x1, y1, …]`. | `Graphics` |

#### Pfade

| Methode                                                     | Beschreibung                                                    | Rückgabe   |
| ----------------------------------------------------------- | --------------------------------------------------------------- | ---------- |
| `moveTo(x, y)`                                              | Beginnt bei `(x, y)` einen neuen Teilpfad.                      | `Graphics` |
| `lineTo(x, y)`                                              | Gerade Linie bis `(x, y)`.                                      | `Graphics` |
| `quadraticCurveTo(cpX, cpY, toX, toY)`                      | Quadratische Bézierkurve (in Abschnitte zerlegt).               | `Graphics` |
| `bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)`             | Kubische Bézierkurve (in Abschnitte zerlegt).                   | `Graphics` |
| `arc(cx, cy, radius, startAngle, endAngle, anticlockwise?)` | Kreisbogen.                                                     | `Graphics` |
| `arcTo(x1, y1, x2, y2, radius)`                             | Bogen, der die beiden Geraden durch die Kontrollpunkte berührt. | `Graphics` |
| `closePath()`                                               | Schließt den aktuellen Teilpfad.                                | `Graphics` |
| `clear()`                                                   | Verwirft die gesamte Geometrie und setzt die Stile zurück.      | `Graphics` |
| `containsPoint(p)`                                          | Prüft, ob ein `Point` in die gezeichnete Geometrie fällt.       | `boolean`  |

#### `IFillStyleOptions`

| Feld      | Beschreibung                        | Typ       | Standard    |
| --------- | ----------------------------------- | --------- | ----------- |
| `color`   | Farbe der Füllung (jede CSS-Farbe). | `string`  | `'#ffffff'` |
| `alpha`   | Deckkraft der Füllung, `0` bis `1`. | `number`  | `1`         |
| `visible` | Ob die Füllung gezeichnet wird.     | `boolean` | `false`     |

#### `ILineStyleOptions`

Erweitert `IFillStyleOptions` und fügt hinzu:

| Feld    | Beschreibung                     | Typ         | Standard          |
| ------- | -------------------------------- | ----------- | ----------------- |
| `width` | Breite der Kontur in px.         | `number`    | `0`               |
| `cap`   | Die Form der Linienenden.        | `LINE_CAP`  | `LINE_CAP.BUTT`   |
| `join`  | Die Form der Linienverbindungen. | `LINE_JOIN` | `LINE_JOIN.MITER` |

### Aufzählungen

#### `RENDERER_TYPE`

Wählt über `IApplicationOptions.prefer` das Backend zum Zeichnen.

| Element   | Wert       | Beschreibung                       |
| --------- | ---------- | ---------------------------------- |
| `CANVAS`  | `'canvas'` | Canvas2D-Backend (voreingestellt). |
| `WEB_GL`  | `'webgl'`  | WebGL-Backend.                     |
| `WEB_GPU` | `'webgpu'` | WebGPU-Backend.                    |

#### `SHAPE_TYPE`

Die Formarten, die die Zeichenmethoden von `Graphics` hervorbringen.

| Element             | Wert                  |
| ------------------- | --------------------- |
| `RECTANGLE`         | `'rectangle'`         |
| `POLYGON`           | `'polygon'`           |
| `CIRCLE`            | `'circle'`            |
| `ELLIPSE`           | `'ellipse'`           |
| `ROUNDED_RECTANGLE` | `'rounded rectangle'` |

#### `LINE_CAP`

| Element  | Wert       |
| -------- | ---------- |
| `BUTT`   | `'butt'`   |
| `ROUND`  | `'round'`  |
| `SQUARE` | `'square'` |

#### `LINE_JOIN`

| Element | Wert      |
| ------- | --------- |
| `MITER` | `'miter'` |
| `BEVEL` | `'bevel'` |
| `ROUND` | `'round'` |

### Konstanten

| Konstante          | Wert    | Beschreibung                                                                |
| ------------------ | ------- | --------------------------------------------------------------------------- |
| `MAX_VERTEX_COUNT` | `65536` | Höchstzahl der Vertices je Stapelpuffer.                                    |
| `BYTES_PER_VERTEX` | `12`    | Bytes je Vertex (2 `Float32` für die Position und 4 `Uint8` für die Farbe). |

## Backends

Das Backend wird über `IApplicationOptions.prefer` gewählt (ein `RENDERER_TYPE`); lässt du es weg, wird Canvas genommen.

- **`CANVAS`** zeichnet unmittelbar über die Canvas2D-API (`fillRect`, `arc`, `ctx.stroke()`, …).
- **`WEB_GL`** und **`WEB_GPU`** teilen sich eine `BatchRenderer`-Strecke: Formen werden in Dreiecke zerlegt, in einen einzigen verschränkten Vertexpuffer gepackt und mit einem Aufruf gezeichnet.

Alle drei nehmen **jede CSS-Farbe** an: hexadezimal (`#rgb` oder `#rrggbb`), benannte Farben, `rgb()` und `hsl()` werden gleichermaßen aufgelöst.

> **Die Geometrie der Kontur unterscheidet sich je nach Backend – mit Absicht.** Linienenden und -verbindungen zeichnet auf dem Canvas-Backend das native `ctx.stroke()` des Browsers, auf WebGL und WebGPU dagegen eine eigene Zerlegung in Dreiecke. Pixelgleich sind die beiden nicht.
