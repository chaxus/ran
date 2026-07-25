import { roundRectByArc } from '@/utils/canvas';
import type { BaseReturn } from '@/utils/bom';

/** A bitmap container usable both as a drawImage source and as a render target */
export type ImgSource = HTMLImageElement | HTMLCanvasElement;

/**
 * @description: Load an image by path, resolving once it has decoded.
 *
 * Note that it rejects with the raw error event rather than an Error: `<img>`'s onerror
 * carries no reason (the browser deliberately withholds it cross-origin), so wrapping it in
 * an Error would only invent a message that is not true.
 *
 * @param {string} src image path
 * @return {Promise<ImgSource>}
 */
export const getImage = (src: string): Promise<ImgSource> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = (): void => resolve(img);
    img.onerror = (err): void => reject(err);
    img.src = src;
  });
};

/**
 * @description: Round an image's corners, returning an offscreen canvas.
 *
 * A canvas rather than a dataURL: a canvas feeds straight into the next drawImage, so a
 * chain of filters does not encode and decode a PNG at every step.
 *
 * @param {ImgSource} img image to round
 * @param {number} radius corner radius
 * @return {ImgSource} offscreen canvas
 */
export const cutRound = (img: ImgSource, radius: number): ImgSource => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const { width, height } = img;
  canvas.width = width;
  canvas.height = height;
  roundRectByArc(ctx, 0, 0, width, height, radius);
  ctx.clip();
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
};

/**
 * @description: Apply an overall opacity to an image, returning an offscreen canvas.
 *
 * `ctx.filter` first (GPU accelerated); where unsupported, fall back to rewriting the alpha
 * channel pixel by pixel. The fallback skips pixels whose alpha is already 0, so fully
 * transparent regions do not come out with a non-zero value.
 *
 * @param {ImgSource} img image to process
 * @param {number} opacity opacity, 0–1
 * @return {ImgSource} offscreen canvas
 */
export const opacity = (img: ImgSource, opacity: number): ImgSource => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const { width, height } = img;
  canvas.width = width;
  canvas.height = height;
  // Some browsers lack the filter property, hence the fallback
  if (typeof ctx.filter === 'string') {
    ctx.filter = `opacity(${opacity * 100}%)`;
    ctx.drawImage(img, 0, 0, width, height);
  } else {
    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;
    const len = data.length;
    for (let i = 0; i < len; i += 4) {
      const alpha = data[i + 3];
      if (alpha !== 0) data[i + 3] = alpha * opacity;
    }
    ctx.putImageData(imageData, 0, 0);
  }
  return canvas;
};

/**
 * @description: Build a 2D Gaussian weight matrix, normalised so the weights sum to 1.
 *
 * Normalising is required: without it the convolution shifts the image's overall
 * brightness. Sigma defaults to `radius / 3`, by which point the Gaussian has decayed to
 * nearly 0 at the radius, making the truncation error negligible.
 *
 * @param {number} radius blur radius
 * @param {number} sigma standard deviation, defaults to radius / 3
 * @return {number[]} a flat (2r+1)² matrix in row-major order
 */
export const getMatrix = (radius: number, sigma?: number): number[] => {
  sigma = sigma || radius / 3;
  const r = Math.ceil(radius);
  const sigma_2 = sigma * sigma;
  const sigma2_2 = 2 * sigma_2;
  const denominator = 1 / (2 * Math.PI * sigma_2);
  const matrix = [];
  let total = 0;
  // Compute the weights
  for (let x = -r; x <= r; x++) {
    for (let y = -r; y <= r; y++) {
      // Each point's weight comes from the 2D Gaussian
      const res = denominator * Math.exp(-(x * x + y * y) / sigma2_2);
      matrix.push(res);
      total += res;
    }
  }
  // Normalise so the weights sum to 1
  for (let i = 0; i < matrix.length; i++) {
    matrix[i] /= total;
  }
  return matrix;
};

/**
 * @description: Check an image's dimensions against a given width / height. When both are
 * passed **both** must match; when neither is, decoding successfully is enough.
 *
 * `revokeObjectURL` runs on both paths, otherwise every check leaks a blob URL that lives
 * until the page unloads. A decode failure (a corrupt file, a non-image) rejects rather than
 * hanging forever.
 *
 * @param {File} file image file to check
 * @param {number} width expected width in pixels
 * @param {number} height expected height in pixels
 * @return {Promise<boolean>}
 */
export const isImageSize = (file: File, width?: number, height?: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // The return matters: this used to call reject without returning, then go on to touch window and throw a ReferenceError under SSR
    if (typeof window === 'undefined') {
      reject(new Error('isImageSize is browser-only: window is undefined'));
      return;
    }
    const _URL = window.URL || window.webkitURL;
    const img = new Image();
    const url = _URL.createObjectURL(file);
    const release = (): void => _URL.revokeObjectURL(url);
    img.onload = (): void => {
      release();
      // AND each condition in turn: the later check used to overwrite the earlier one, so passing both width and height made the width check a no-op
      const matchesWidth = width === undefined || img.width === width;
      const matchesHeight = height === undefined || img.height === height;
      resolve(matchesWidth && matchesHeight);
    };
    img.onerror = (): void => {
      release();
      reject(new Error('failed to decode image'));
    };
    img.src = url;
  });
};
export interface convertImageToBase64Return extends BaseReturn {
  data: string | ArrayBuffer | null;
}
/**
 * @description: Convert an image to base64
 * @param {File} file
 * @return {*}
 */
export const convertImageToBase64 = (file: File): Promise<convertImageToBase64Return> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      resolve({ success: true, data: reader.result, message: '' });
    };
    reader.onerror = (e) => {
      reject({ success: false, data: e, message: '' });
    };
    reader.readAsDataURL(file);
  });
};
