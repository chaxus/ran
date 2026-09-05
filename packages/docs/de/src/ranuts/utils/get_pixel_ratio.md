# getPixelRatio

Liefert das Auflösungsverhältnis eines Canvas-Kontexts, um Bildschirme mit hoher Pixeldichte zu bedienen.

## API

### getPixelRatio

#### Rückgabe

| Argument | Beschreibung        | Typ      |
| -------- | ------------------- | -------- |
| `number` | Das Pixelverhältnis | `number` |

#### Parameter

| Parameter | Beschreibung                 | Typ                        | Standard     |
| --------- | ---------------------------- | -------------------------- | ------------ |
| `context` | 2D-Zeichenkontext des Canvas | `CanvasRenderingContext2D` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);
console.log('Pixelverhältnis:', ratio);
```

### An Bildschirme mit hoher Pixeldichte anpassen

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);

// Die Canvas-Größe an das Verhältnis anpassen
canvas.width = canvas.clientWidth * ratio;
canvas.height = canvas.clientHeight * ratio;

// Den Kontext skalieren, damit die Zeichengröße stimmt
ctx.scale(ratio, ratio);
```

### Scharf zeichnen

```js
import { getPixelRatio } from 'ranuts';

function drawHighDPI(canvas) {
  const ctx = canvas.getContext('2d');
  const ratio = getPixelRatio(ctx);

  // Die tatsächliche Größe setzen
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;

  // Den Kontext skalieren
  ctx.scale(ratio, ratio);

  // Den Inhalt zeichnen (in logischen Pixeln)
  ctx.fillRect(10, 10, 100, 100);
}
```

## Hinweise

1. **Browser-Kompatibilität**: berücksichtigt die `backingStorePixelRatio`-Eigenschaft der verschiedenen Browser.
2. **Hohe Pixeldichte**: kümmert sich von allein um Retina-Bildschirme, damit die Grafik scharf bleibt.
3. **Berechnung**: liefert `devicePixelRatio / backingStorePixelRatio`.
4. **Einsatz**: üblich beim Zeichnen auf Canvas, in Diagrammbibliotheken und in der Spieleentwicklung, wo Schärfe zählt.
