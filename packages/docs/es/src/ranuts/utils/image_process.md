# Procesamiento de imágenes

Utilidades de imagen basadas en canvas. Cada transformación devuelve un **canvas fuera de pantalla** en lugar de una data URL, así que se pueden encadenar varias sin codificar y descodificar un PNG en cada paso.

## Uso

```ts
import { getImage, cutRound, opacity } from 'ranuts/utils';

const img = await getImage('/avatar.png');
const rounded = cutRound(img, 24);
const faded = opacity(rounded, 0.5);
document.body.appendChild(faded as HTMLCanvasElement);
```

## API

### getImage

Carga una imagen a partir de su ruta; se resuelve una vez descodificada.

#### Parámetros

| Parámetro | Descripción       | Tipo     | Por defecto |
| --------- | ----------------- | -------- | ----------- |
| `src`     | Ruta de la imagen | `string` | Obligatorio |

#### Devuelve

| Argumento | Descripción                      | Tipo                 |
| --------- | -------------------------------- | -------------------- |
| `promise` | El elemento de imagen ya cargado | `Promise<ImgSource>` |

::: tip
El rechazo lleva el **evento** `error` en crudo, no un objeto `Error`. El `onerror` de un `<img>` no trae motivo alguno —los navegadores lo ocultan a propósito cuando el fallo es de origen cruzado—, así que envolverlo en un `Error` solo fabricaría un mensaje falso.
:::

### cutRound

Recorta una imagen con las esquinas redondeadas.

#### Parámetros

| Parámetro | Descripción         | Tipo        | Por defecto |
| --------- | ------------------- | ----------- | ----------- |
| `img`     | Imagen de origen    | `ImgSource` | Obligatorio |
| `radius`  | Radio de la esquina | `number`    | Obligatorio |

#### Devuelve

| Argumento | Descripción              | Tipo        |
| --------- | ------------------------ | ----------- |
| `canvas`  | Canvas fuera de pantalla | `ImgSource` |

### opacity

Aplica una opacidad uniforme a una imagen.

Prefiere `ctx.filter` (que corre en la GPU); donde no está disponible, recurre a reescribir el canal alfa píxel a píxel. Esa vía alternativa se salta los píxeles cuyo alfa ya vale `0`, de modo que las zonas del todo transparentes no pueden acabar con un valor distinto de cero.

#### Parámetros

| Parámetro | Descripción        | Tipo        | Por defecto |
| --------- | ------------------ | ----------- | ----------- |
| `img`     | Imagen de origen   | `ImgSource` | Obligatorio |
| `opacity` | Opacidad, de 0 a 1 | `number`    | Obligatorio |

#### Devuelve

| Argumento | Descripción              | Tipo        |
| --------- | ------------------------ | ----------- |
| `canvas`  | Canvas fuera de pantalla | `ImgSource` |

### getMatrix

Construye una matriz gaussiana de pesos en dos dimensiones, normalizada para que sumen `1`.

La normalización es imprescindible: sin ella, convolucionar con la matriz cambia el brillo general de la imagen. `sigma` vale por defecto `radius / 3`; con ese valor la gaussiana ya ha decaído casi a cero al llegar al radio, así que el error por truncamiento es despreciable.

#### Parámetros

| Parámetro | Descripción          | Tipo     | Por defecto  |
| --------- | -------------------- | -------- | ------------ |
| `radius`  | Radio del desenfoque | `number` | Obligatorio  |
| `sigma`   | Desviación típica    | `number` | `radius / 3` |

#### Devuelve

| Argumento | Descripción                                                  | Tipo       |
| --------- | ------------------------------------------------------------ | ---------- |
| `matrix`  | Array plano de `(2r+1)²` elementos, por filas, que suman `1` | `number[]` |

## Tipos

```ts
type ImgSource = HTMLImageElement | HTMLCanvasElement;
```

## Relacionado

- [convertImageToBase64](/es/src/ranuts/utils/convert_image_to_base64): de `File` a data URL en base64
- [isImageSize](/es/src/ranuts/utils/is_image_size): validar las dimensiones de una imagen
