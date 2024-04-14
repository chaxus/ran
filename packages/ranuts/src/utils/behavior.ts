import { noop } from '@/utils/noop';
import { isClient } from '@/utils/device'

export const handleClick = (hooks: (event: MouseEvent) => void = noop): void => {
  if (typeof document !== 'undefined') {
    document.addEventListener(
      'click',
      function (event) {
        hooks(event);
      },
      true,
    );
  }
};

const fingerprinting = () => {
  // userAgent(用户代理) 浏览器的语言 设备能够支持的最大同时触摸的点数 可用的逻辑处理器核心数
  const { userAgent, language, maxTouchPoints, hardwareConcurrency } = navigator;
  const { width, height, colorDepth } = screen;
  // 格林威治时间和本地时间之间的时差
  const timezone = new Date().getTimezoneOffset();
};
/**
 * @description: 获取地区经纬度（会弹出提示让用户授权）
 * @return {*}
 */
const getRegionalLatitudeAndLongitude = () => {
  return new Promise((resolve, reject) => {
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
 * @description: 音频指纹，1.生成音频信息流(三角波)，对其进行FFT变换，计算SHA值作为指纹。2.生成音频信息流（正弦波），进行动态压缩处理，计算MD5值。
 */
export const audioVendor = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    if(!isClient) reject('window is undefined')
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
    const AudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext
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
      context.oncomplete = function () {};
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
