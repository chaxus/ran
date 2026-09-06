# Geometría para Canvas 2D

Constructores de trazado y cuentas de ángulos para Canvas 2D. Toda función de trazado **solo construye el trazado**; nunca llama a `fill()` ni a `stroke()`, así que quien la usa decide cómo pintarlo.

## Uso

```ts
import { roundRectByArc, getLinearGradient } from 'ranuts/utils';

const ctx = canvas.getContext('2d')!;

roundRectByArc(ctx, 10, 10, 200, 80, 12);
ctx.fillStyle = getLinearGradient(ctx, 10, 10, 200, 80, 'linear-gradient(90deg, #06f, #0cf)');
ctx.fill();
```

## API

### getAngle

De grados a radianes.

#### Parámetros

| Parámetro | Descripción      | Tipo     | Por defecto |
| --------- | ---------------- | -------- | ----------- |
| `deg`     | Ángulo en grados | `number` | Obligatorio |

#### Devuelve

| Argumento | Descripción        | Tipo     |
| --------- | ------------------ | -------- |
| `rad`     | Ángulo en radianes | `number` |

### getArcPointerByDeg

El punto de una circunferencia que corresponde a un ángulo.

#### Parámetros

| Parámetro | Descripción        | Tipo     | Por defecto |
| --------- | ------------------ | -------- | ----------- |
| `deg`     | Ángulo en radianes | `number` | Obligatorio |
| `r`       | Radio              | `number` | Obligatorio |

#### Devuelve

| Argumento | Descripción | Tipo               |
| --------- | ----------- | ------------------ |
| `point`   | `[x, y]`    | `[number, number]` |

### getTangentByPointer

La recta tangente en un punto de una circunferencia.

#### Parámetros

| Parámetro | Descripción  | Tipo     | Por defecto |
| --------- | ------------ | -------- | ----------- |
| `x`       | Coordenada x | `number` | Obligatorio |
| `y`       | Coordenada y | `number` | Obligatorio |

#### Devuelve

| Argumento | Descripción                          | Tipo            |
| --------- | ------------------------------------ | --------------- |
| `line`    | `[pendiente, ordenada en el origen]` | `Array<number>` |

### roundRectByArc

Traza un rectángulo de esquinas redondeadas. Un radio mayor que la mitad del lado más corto se **recorta a esa mitad**, de modo que dos esquinas contiguas nunca se solapan.

#### Parámetros

| Parámetro | Descripción            | Tipo                       | Por defecto |
| --------- | ---------------------- | -------------------------- | ----------- |
| `ctx`     | Contexto 2D del canvas | `CanvasRenderingContext2D` | Obligatorio |
| `...rest` | `x, y, w, h, r`        | `number[]`                 | Obligatorio |

#### Devuelve

Sin valor de retorno (`void`)

### fanShapedByArc

Traza una porción de tarta, con el hueco que la separa de las demás.

#### Parámetros

| Parámetro   | Descripción                     | Tipo                       | Por defecto |
| ----------- | ------------------------------- | -------------------------- | ----------- |
| `ctx`       | Contexto 2D del canvas          | `CanvasRenderingContext2D` | Obligatorio |
| `maxRadius` | Radio exterior                  | `number`                   | Obligatorio |
| `start`     | Ángulo inicial en radianes      | `number`                   | Obligatorio |
| `end`       | Ángulo final en radianes        | `number`                   | Obligatorio |
| `gutter`    | Ancho del hueco entre porciones | `number`                   | Obligatorio |

#### Devuelve

Sin valor de retorno (`void`)

### getLinearGradient

Traduce una cadena `linear-gradient(...)` de CSS a un `CanvasGradient` de Canvas.

`createLinearGradient` solo admite un punto inicial y uno final, mientras que CSS describe la dirección como un ángulo. Por eso la circunferencia se parte en ocho sectores de 45° y la tangente convierte el ángulo de vuelta en coordenadas de inicio y fin sobre el borde del rectángulo. Las direcciones por palabra clave (`to top`, `to bottom`, `to left`, `to right`) se tratan directamente.

#### Parámetros

| Parámetro    | Descripción                                       | Tipo                       | Por defecto |
| ------------ | ------------------------------------------------- | -------------------------- | ----------- |
| `ctx`        | Contexto 2D del canvas                            | `CanvasRenderingContext2D` | Obligatorio |
| `x`          | x de la esquina superior izquierda del rectángulo | `number`                   | Obligatorio |
| `y`          | y de la esquina superior izquierda del rectángulo | `number`                   | Obligatorio |
| `w`          | Ancho del rectángulo                              | `number`                   | Obligatorio |
| `h`          | Alto del rectángulo                               | `number`                   | Obligatorio |
| `background` | por ejemplo `linear-gradient(90deg, red, blue)`   | `string`                   | Obligatorio |

#### Devuelve

| Argumento  | Descripción                                                 | Tipo             |
| ---------- | ----------------------------------------------------------- | ---------------- |
| `gradient` | Se puede asignar directamente a `fillStyle` o `strokeStyle` | `CanvasGradient` |

::: warning
Las paradas de color han de ir sin unidad (`red 0, blue 1`). Una parada en porcentaje (`red 50%`) se analiza como `NaN` y `addColorStop` lanzará.
:::
