# visual

Un motor de dibujo 2D al estilo de PixiJS. Construye un grafo de escena con formas y lo dibuja a través de uno de tres motores traseros (Canvas2D, WebGL o WebGPU), elegido en tiempo de ejecución.

El motor está por capas: **`Application`** (ciclo de vida y bucle de dibujado), debajo **`Renderer`** (el motor trasero), y luego un grafo de escena que va de **`Container`** (un grupo) a **`Graphics`** (algo dibujable). Tú añades nodos a `app.stage` y el renderizador los pinta.

> **Solo navegador.** `ranuts/visual` necesita un `HTMLCanvasElement` real y un contexto de GPU o de Canvas. En Node no puede correr.

## Importar

```js
import { Application, Graphics, Container } from 'ranuts/visual';
```

## Primeros pasos

Crea una aplicación, dibuja un rectángulo con relleno y contorno más un círculo, y arranca el bucle de dibujado.

```js
import { Application, Graphics, RENDERER_TYPE } from 'ranuts/visual';

const view = document.querySelector('canvas');

// Application.create es asíncrona: el motor trasero de WebGPU inicializa su dispositivo
// de forma asíncrona y tiene que terminar antes del primer dibujado.
const app = await Application.create({
  view,
  prefer: RENDERER_TYPE.CANVAS, // CANVAS | WEB_GL | WEB_GPU
  backgroundColor: '#1e1e1e',
});

// Un rectángulo: relleno rojo y contorno azul de 4px.
const rect = new Graphics();
rect.beginFill('#ff0000');
rect.lineStyle(4, '#0000ff');
rect.drawRect(20, 20, 160, 100);
rect.endFill();

// Un círculo.
const circle = new Graphics();
circle.beginFill('#00cc88', 0.8);
circle.drawCircle(300, 120, 60);
circle.endFill();

// Añade los dibujables al stage, el antepasado de todo lo que se pinta.
app.stage.addChild(rect);
app.stage.addChild(circle);

// Arranca el bucle de requestAnimationFrame (o llama a app.render() para un solo fotograma).
app.start();
```

## API

### `Application`

El punto de entrada del motor. Es dueño del canvas, del renderizador y de la raíz del grafo de escena (`stage`).

Usa la fábrica asíncrona **`Application.create(...)`** antes que `new Application(...)`: el motor trasero de WebGPU inicializa su dispositivo de forma asíncrona y eso tiene que terminar antes del primer dibujado. Canvas y WebGL resuelven al instante, así que la fábrica es segura y uniforme para los tres.

#### `Application.create(options)`

`static async`. Construye una `Application` y espera a que termine la inicialización asíncrona del renderizador.

##### Parámetros

| Parámetro | Descripción                                | Tipo                  | Por defecto |
| --------- | ------------------------------------------ | --------------------- | ----------- |
| `options` | Opciones de configuración de la aplicación | `IApplicationOptions` | Obligatorio |

##### Devuelve

| Valor                  | Descripción                   | Tipo                   |
| ---------------------- | ----------------------------- | ---------------------- |
| `Promise<Application>` | La aplicación ya inicializada | `Promise<Application>` |

#### Properties

| Propiedad     | Descripción                                                                | Tipo                |
| ------------- | -------------------------------------------------------------------------- | ------------------- |
| `stage`       | La raíz del grafo de escena. Añade aquí todo nodo que quieras ver pintado. | `Container`         |
| `view`        | El elemento canvas en el que se pinta.                                     | `HTMLCanvasElement` |
| `eventSystem` | El reparto de punteros y eventos, atado al canvas y al stage.              | `EventSystem`       |

#### Methods

| Método     | Descripción                                               | Devuelve |
| ---------- | --------------------------------------------------------- | -------- |
| `render()` | Pinta un solo fotograma de `stage`.                       | `void`   |
| `start()`  | Arranca el bucle de dibujado con `requestAnimationFrame`. | `void`   |
| `stop()`   | Detiene el bucle de dibujado que arrancó `start()`.       | `void`   |

#### `IApplicationOptions`

| Campo             | Descripción                                                      | Tipo                | Por defecto            |
| ----------------- | ---------------------------------------------------------------- | ------------------- | ---------------------- |
| `prefer`          | Qué motor trasero usar. Si se omite, recae en Canvas.            | `RENDERER_TYPE`     | `RENDERER_TYPE.CANVAS` |
| `view`            | El canvas de destino. Si se omite, se crea un `<canvas>` suelto. | `HTMLCanvasElement` | un canvas nuevo        |
| `backgroundColor` | El fondo del canvas. Acepta cualquier cadena de color CSS.       | `string`            | —                      |
| `backgroundAlpha` | Opacidad del fondo, de `0` a `1`.                                | `number`            | —                      |
| `debug`           | Escribe en la consola qué motor trasero se eligió.               | `boolean`           | `false`                |

### `Container`

Un nodo de agrupación, la idea de «grupo» del grafo de escena. Guarda hijos y el estado de transformación, pero él mismo no pinta nada; los dibujables como `Graphics` lo extienden. Añade un `Container` para armar subárboles que se muevan, escalen y roten juntos.

#### Methods

| Método               | Descripción                                                            | Devuelve  |
| -------------------- | ---------------------------------------------------------------------- | --------- |
| `addChild(child)`    | Añade un hijo (`Container`) al final. Si ya tenía padre, se lo cambia. | `void`    |
| `removeChild(child)` | Quita un hijo de `children`.                                           | `void`    |
| `sortChildren()`     | Reordena `children` por `zIndex` (solo cuando hace falta).             | `void`    |
| `containsPoint(p)`   | Comprueba si un `Point` cae dentro del `hitArea` de este nodo.         | `boolean` |

#### Propiedades de transformación y presentación

Viven en el nodo base común (`Vertex`) y están disponibles en cualquier `Container` o `Graphics`.

| Propiedad          | Descripción                                                                                 | Tipo                     |
| ------------------ | ------------------------------------------------------------------------------------------- | ------------------------ |
| `children`         | Los nodos hijos (array de solo lectura).                                                    | `Container[]`            |
| `parent`           | El nodo padre, si está enganchado.                                                          | `Container \| undefined` |
| `x` / `y`          | La posición, en el sistema de coordenadas del padre.                                        | `number`                 |
| `position`         | El punto de posición (`{ x, y }`).                                                          | `ObservablePoint`        |
| `scale`            | El punto de escala (`{ x, y }`).                                                            | `ObservablePoint`        |
| `pivot`            | El punto de pivote para giro y escala.                                                      | `ObservablePoint`        |
| `skew`             | El punto de sesgo.                                                                          | `ObservablePoint`        |
| `rotation`         | Giro en **radianes**.                                                                       | `number`                 |
| `angle`            | Giro en **grados** (va a la par de `rotation`).                                             | `number`                 |
| `alpha`            | Opacidad del nodo, de `0` a `1` (se multiplica al bajar por el árbol).                      | `number`                 |
| `visible`          | Con `false`, el nodo y su subárbol se saltan.                                               | `boolean`                |
| `zIndex`           | El orden de dibujado entre hermanos.                                                        | `number`                 |
| `hitArea`          | Forma opcional para las comprobaciones de impacto.                                          | `Shape \| null`          |
| `cursor`           | El aspecto del cursor al apuntar al nodo.                                                   | `Cursor`                 |
| `structureVersion` | Versión de la estructura de escena (solo en la raíz); guía el seguimiento de lo que cambió. | `number`                 |

### `Graphics`

Un dibujable que extiende `Container`. Fija un relleno, un estilo de línea o ambos, y luego llama a un método de forma. Casi todos los métodos devuelven `this`, así que las llamadas se encadenan.

#### Estilo

| Método                             | Descripción                                                                                       | Devuelve   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- | ---------- |
| `beginFill(color?, alpha?)`        | Empieza a rellenar con `color` (cadena CSS, por defecto `'#000000'`) y `alpha` (por defecto `1`). | `Graphics` |
| `endFill()`                        | Deja de rellenar.                                                                                 | `Graphics` |
| `lineStyle(width, color?, alpha?)` | Fija el contorno: `width` px, `color` (por defecto `'#000000'`), `alpha` (por defecto `1`).       | `Graphics` |
| `lineStyle(options)`               | Fija el contorno a partir de un objeto `ILineStyleOptions`.                                       | `Graphics` |
| `resetLineStyle()`                 | Devuelve el contorno actual a sus valores por defecto.                                            | `void`     |

#### Formas

| Método                                         | Descripción                                                        | Devuelve   |
| ---------------------------------------------- | ------------------------------------------------------------------ | ---------- |
| `drawRect(x, y, width, height)`                | Rectángulo.                                                        | `Graphics` |
| `drawRoundedRect(x, y, width, height, radius)` | Rectángulo de esquinas redondeadas.                                | `Graphics` |
| `drawCircle(x, y, radius)`                     | Círculo centrado en `(x, y)`.                                      | `Graphics` |
| `drawEllipse(x, y, radiusX, radiusY)`          | Elipse centrada en `(x, y)`.                                       | `Graphics` |
| `drawPolygon(points)`                          | Polígono cerrado a partir de un array llano `[x0, y0, x1, y1, …]`. | `Graphics` |

#### Trazados

| Método                                                      | Descripción                                                         | Devuelve   |
| ----------------------------------------------------------- | ------------------------------------------------------------------- | ---------- |
| `moveTo(x, y)`                                              | Empieza un subtrazado nuevo en `(x, y)`.                            | `Graphics` |
| `lineTo(x, y)`                                              | Línea recta hasta `(x, y)`.                                         | `Graphics` |
| `quadraticCurveTo(cpX, cpY, toX, toY)`                      | Curva de Bézier cuadrática (se trocea en segmentos).                | `Graphics` |
| `bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY)`             | Curva de Bézier cúbica (se trocea en segmentos).                    | `Graphics` |
| `arc(cx, cy, radius, startAngle, endAngle, anticlockwise?)` | Arco de circunferencia.                                             | `Graphics` |
| `arcTo(x1, y1, x2, y2, radius)`                             | Arco tangente a las dos rectas que pasan por los puntos de control. | `Graphics` |
| `closePath()`                                               | Cierra el subtrazado actual.                                        | `Graphics` |
| `clear()`                                                   | Borra toda la geometría y devuelve los estilos a su estado inicial. | `Graphics` |
| `containsPoint(p)`                                          | Comprueba si un `Point` cae dentro de la geometría dibujada.        | `boolean`  |

#### `IFillStyleOptions`

| Campo     | Descripción                             | Tipo      | Por defecto |
| --------- | --------------------------------------- | --------- | ----------- |
| `color`   | Color de relleno (cualquier color CSS). | `string`  | `'#ffffff'` |
| `alpha`   | Opacidad del relleno, de `0` a `1`.     | `number`  | `1`         |
| `visible` | Si el relleno se dibuja o no.           | `boolean` | `false`     |

#### `ILineStyleOptions`

Extiende `IFillStyleOptions` y añade:

| Campo   | Descripción                 | Tipo        | Por defecto       |
| ------- | --------------------------- | ----------- | ----------------- |
| `width` | Grosor del contorno, en px. | `number`    | `0`               |
| `cap`   | El remate de las líneas.    | `LINE_CAP`  | `LINE_CAP.BUTT`   |
| `join`  | La unión entre líneas.      | `LINE_JOIN` | `LINE_JOIN.MITER` |

### Enumeraciones

#### `RENDERER_TYPE`

Elige el motor trasero de dibujado a través de `IApplicationOptions.prefer`.

| Miembro   | Valor      | Descripción                                 |
| --------- | ---------- | ------------------------------------------- |
| `CANVAS`  | `'canvas'` | Motor trasero Canvas2D (el de por defecto). |
| `WEB_GL`  | `'webgl'`  | Motor trasero WebGL.                        |
| `WEB_GPU` | `'webgpu'` | Motor trasero WebGPU.                       |

#### `SHAPE_TYPE`

Las clases de forma que producen los métodos de dibujo de `Graphics`.

| Miembro             | Valor                 |
| ------------------- | --------------------- |
| `RECTANGLE`         | `'rectangle'`         |
| `POLYGON`           | `'polygon'`           |
| `CIRCLE`            | `'circle'`            |
| `ELLIPSE`           | `'ellipse'`           |
| `ROUNDED_RECTANGLE` | `'rounded rectangle'` |

#### `LINE_CAP`

| Miembro  | Valor      |
| -------- | ---------- |
| `BUTT`   | `'butt'`   |
| `ROUND`  | `'round'`  |
| `SQUARE` | `'square'` |

#### `LINE_JOIN`

| Miembro | Valor     |
| ------- | --------- |
| `MITER` | `'miter'` |
| `BEVEL` | `'bevel'` |
| `ROUND` | `'round'` |

### Constantes

| Constante          | Valor   | Descripción                                                       |
| ------------------ | ------- | ----------------------------------------------------------------- |
| `MAX_VERTEX_COUNT` | `65536` | Número máximo de vértices que admite cada búfer de lote.          |
| `BYTES_PER_VERTEX` | `12`    | Bytes por vértice (2 `Float32` de posición y 4 `Uint8` de color). |

## Motores traseros

El motor trasero se elige con `IApplicationOptions.prefer` (un `RENDERER_TYPE`); si se omite, se usa Canvas.

- **`CANVAS`** dibuja directamente con la API de Canvas2D (`fillRect`, `arc`, `ctx.stroke()`, …).
- **`WEB_GL`** y **`WEB_GPU`** comparten una misma tubería `BatchRenderer`: las formas se trocean en triángulos, se empaquetan en un único búfer de vértices entrelazado y se dibujan de una sola llamada.

Los tres aceptan **cualquier color CSS**: hexadecimal (`#rgb` o `#rrggbb`), colores con nombre, `rgb()` y `hsl()` se resuelven todos igual.

> **La geometría del contorno cambia según el motor trasero, y es a propósito.** En Canvas, los remates y las uniones de línea los dibuja el `ctx.stroke()` nativo del navegador; en WebGL y WebGPU, una triangulación propia. Los dos no coinciden píxel a píxel.
