import { noop } from '@/utils/noop';
import { isClient } from '@/utils/device';

/**
 * @description: Listen for every click on the document, in the capture phase so a handler
 * calling `stopPropagation` cannot hide it.
 *
 * Returns an **unsubscribe function**; without one the listener outlives whatever installed it.
 *
 * @param {Function} hooks receives the click event
 * @return {Function} unsubscribe
 */
export const handleClick = (hooks: (event: MouseEvent) => void = noop): (() => void) => {
  if (typeof document === 'undefined') return noop;
  const onClick = (event: Event): void => hooks(event as MouseEvent);
  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
};

// const fingerprinting = () => {
//   // userAgent, browser language, maximum simultaneous touch points, logical CPU cores
//   const { userAgent, language, maxTouchPoints, hardwareConcurrency } = navigator;
//   const { width, height, colorDepth } = screen;
//   // Offset between GMT and local time
//   const timezone = new Date().getTimezoneOffset();
// };
/**
 * @description: Read the device's latitude and longitude (prompts the user for permission)
 * @return {*}
 */
export const getRegionalLatitudeAndLongitude = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    navigator.geolocation.getCurrentPosition(
      function (position) {
        resolve(position);
      },
      function (error) {
        reject(error);
        // error.code can be:
        //   0: unknown error
        //   1: permission denied
        //   2: position unavailable (error response from location provider)
        //   3: timed out
      },
    );
  });
};

export const webglVendor = (): { vendor: string; renderer: string } | null => {
  const glCanvas = document.createElement('canvas');
  const gl = glCanvas.getContext('webgl2');
  function getHardwareInfo(gl: WebGL2RenderingContext) {
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
      return null;
    }
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    return {
      vendor: vendor,
      renderer: renderer,
    };
  }
  if (gl) {
    return getHardwareInfo(gl);
  }
  return null;
};

export const canvasVendor = (): string | null => {
  const outScreenCanvas = document.createElement('canvas');
  const ctx = outScreenCanvas.getContext('2d');
  const txt = 'BrowserLeaks,com <canvas> 1.0';
  if (!ctx) return null;
  ctx.textBaseline = 'top';
  ctx.font = "14px 'Arial'";
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#f60';
  ctx.fillRect(125, 1, 62, 20);
  ctx.fillStyle = '#069';
  ctx.fillText(txt, 2, 15);
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
  ctx.fillText(txt, 4, 17);
  const canvasImageData = outScreenCanvas.toDataURL();
  return canvasImageData;
};

enum AudioCompressor {
  THRESHOLD = 'threshold',
  KNEE = 'knee',
  RATIO = 'ratio',
  REDUCTION = 'reduction',
  ATTACK = 'attack',
  RELEASE = 'release',
}
/**
 * @description: Audio fingerprint. 1. Generate an audio stream (triangle wave), run an FFT over it and hash the result with SHA. 2. Generate an audio stream (sine wave), run it through dynamic compression and hash with MD5.
 */
export const audioVendor = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isClient) reject('window is undefined');
    const each = function (
      obj: Array<[AudioCompressor, number]>,
      iterator: (value: [AudioCompressor, number], index: number, array: Array<[AudioCompressor, number]>) => void,
    ) {
      if (Array.prototype.forEach && obj.forEach === Array.prototype.forEach) {
        obj.forEach(iterator);
      } else if (obj.length === +obj.length) {
        for (let i = 0, l = obj.length; i < l; i++) {
          iterator(obj[i], i, obj);
        }
      } else {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            iterator(obj[key], Number(key), obj);
          }
        }
      }
    };
    const AudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const context = new AudioContext(1, 44100, 44100);
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(10000, context.currentTime);
    const compressor = context.createDynamicsCompressor();
    each(
      [
        [AudioCompressor.THRESHOLD, -50],
        [AudioCompressor.KNEE, 40],
        [AudioCompressor.RATIO, 12],
        [AudioCompressor.REDUCTION, -20],
        [AudioCompressor.ATTACK, 0],
        [AudioCompressor.RELEASE, 0.25],
      ],
      function (item: [AudioCompressor, number]) {
        if (compressor[item[0]] && typeof compressor[item[0]] !== 'number') {
          const { setValueAtTime } = compressor[item[0]] as AudioParam;
          setValueAtTime(item[1], context.currentTime);
        }
      },
    );
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);
    context.startRendering();
    const audioTimeoutId = setTimeout(function () {
      context.oncomplete = () => {};
      reject('audioTimeout');
      return 'audioTimeout';
    }, 100);
    context.oncomplete = (event) => {
      try {
        clearTimeout(audioTimeoutId);
        const result = event.renderedBuffer
          .getChannelData(0)
          .slice(4500, 5000)
          .reduce(function (acc, val) {
            return acc + Math.abs(val);
          }, 0)
          .toString();
        oscillator.disconnect();
        compressor.disconnect();
        resolve(result);
        return result;
      } catch (error) {
        reject(error);
        return;
      }
    };
  });
};
