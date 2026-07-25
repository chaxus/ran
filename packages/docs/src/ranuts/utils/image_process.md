# Image processing

Canvas-based image helpers. Each transform returns an **offscreen canvas** rather than a data URL,
so several of them can be chained without encoding and decoding a PNG at every step.

## Usage

```ts
import { getImage, cutRound, opacity } from 'ranuts/utils';

const img = await getImage('/avatar.png');
const rounded = cutRound(img, 24);
const faded = opacity(rounded, 0.5);
document.body.appendChild(faded as HTMLCanvasElement);
```

## API

### getImage

Load an image by path; resolves once it has decoded.

#### Parameters

| Parameter | Description | Type     | Default  |
| --------- | ----------- | -------- | -------- |
| `src`     | Image path  | `string` | Required |

#### Return

| Argument  | Description              | Type                 |
| --------- | ------------------------ | -------------------- |
| `promise` | The loaded image element | `Promise<ImgSource>` |

::: tip
Rejection passes through the raw `error` **event**, not an `Error` object. `<img>`'s `onerror`
carries no reason — browsers deliberately withhold it for cross-origin failures — so wrapping it in
an `Error` would only manufacture a fake message.
:::

### cutRound

Clip an image to rounded corners.

#### Parameters

| Parameter | Description   | Type        | Default  |
| --------- | ------------- | ----------- | -------- |
| `img`     | Source image  | `ImgSource` | Required |
| `radius`  | Corner radius | `number`    | Required |

#### Return

| Argument | Description      | Type        |
| -------- | ---------------- | ----------- |
| `canvas` | Offscreen canvas | `ImgSource` |

### opacity

Apply a uniform opacity to an image.

Prefers `ctx.filter` (GPU-accelerated); where unsupported it falls back to rewriting the alpha
channel pixel by pixel. The fallback skips pixels whose alpha is already `0`, so fully transparent
regions cannot pick up a non-zero value.

#### Parameters

| Parameter | Description    | Type        | Default  |
| --------- | -------------- | ----------- | -------- |
| `img`     | Source image   | `ImgSource` | Required |
| `opacity` | Opacity, 0 – 1 | `number`    | Required |

#### Return

| Argument | Description      | Type        |
| -------- | ---------------- | ----------- |
| `canvas` | Offscreen canvas | `ImgSource` |

### getMatrix

Build a 2D Gaussian weight matrix, normalised so the weights sum to `1`.

Normalisation is required: without it, convolving with the matrix changes the image's overall
brightness. `sigma` defaults to `radius / 3`, at which point the Gaussian has decayed to nearly
zero by the radius, so the truncation error is negligible.

#### Parameters

| Parameter | Description        | Type     | Default      |
| --------- | ------------------ | -------- | ------------ |
| `radius`  | Blur radius        | `number` | Required     |
| `sigma`   | Standard deviation | `number` | `radius / 3` |

#### Return

| Argument | Description                                     | Type       |
| -------- | ----------------------------------------------- | ---------- |
| `matrix` | Flat `(2r+1)²` array, row-major, summing to `1` | `number[]` |

## Types

```ts
type ImgSource = HTMLImageElement | HTMLCanvasElement;
```

## Related

- [convertImageToBase64](/src/ranuts/utils/convert_image_to_base64) — `File` → base64 data URL
- [isImageSize](/src/ranuts/utils/is_image_size) — validate an image's dimensions
