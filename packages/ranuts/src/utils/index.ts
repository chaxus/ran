import { AudioRecorder } from '@/utils/audioRecorder';
import { audioVendor, canvasVendor, webglVendor } from '@/utils/behavior';
import { TOTP } from '@/utils/totp/totp';
import { localStorageGetItem, localStorageSetItem } from '@/utils/storage';
import {
  appendUrl,
  connection,
  createObjectURL,
  durationHandler,
  encodeUrl,
  getAllQueryString,
  getCookie,
  getCookieByName,
  getFrame,
  getHost,
  getPixelRatio,
  getWindow,
  imageRequest,
  networkSpeed,
  removeGhosting,
  requestUrlToBuffer,
  retain,
} from '@/utils/bom';
import {
  Color,
  ColorScheme,
  FMT,
  Hsl,
  Hsla,
  Rgb,
  Rgba,
  componentToHex,
  hexToRgb,
  hsbToRgb,
  hslToRgb,
  hsvToHsl,
  hsvToRgb,
  hue2rgb,
  randomColor,
  rgbToHex,
  rgbToHsb,
  rgbToHsl,
} from '@/utils/color';
import { compose } from '@/utils/compose';
import { handleConsole } from '@/utils/console';
import { debounce } from '@/utils/debounce';
import { currentDevice, isBangDevice, isClient, isMobile, isWeiXin } from '@/utils/device';
import type { CurrentDevice } from '@/utils/device';
import {
  addClassToElement,
  createDocumentFragment,
  escapeHtml,
  removeClassToElement,
  setFontSize2html,
} from '@/utils/dom';
import { handleError } from '@/utils/error';
import { convertImageToBase64, isImageSize } from '@/utils/img';
import { memoize } from '@/utils/memoize';
import { MimeType, getMime, setMime } from '@/utils/mimeType';
import { Monitor } from '@/utils/monitor';
import { getStatus, status } from '@/utils/network';
import { noop } from '@/utils/noop';
import { Mathjs, mathjs, perToNum, range } from '@/utils/number';
import { filterObj, formatJson, merge, mergeExports, querystring, replaceOld, setAttributeByGlobal } from '@/utils/obj';
import { getPerformance } from '@/utils/performance';
import { QuestQueue } from '@/utils/queue';
import { createData, report } from '@/utils/report';
import { handleFetchHook } from '@/utils/request';
import { scriptOnLoad } from '@/utils/script';
import { changeHumpToLowerCase, clearBr, clearStr, isString, randomString, str2Xml, strParse } from '@/utils/str';
import { SyncHook } from '@/utils/subscribe';
import { generateThrottle, requestAnimation, throttle } from '@/utils/throttle';
import { performanceTime, timeFormat, timestampToTime } from '@/utils/time';
export {
  performanceTime,
  timeFormat,
  timestampToTime,
  generateThrottle,
  requestAnimation,
  throttle,
  SyncHook,
  changeHumpToLowerCase,
  clearBr,
  clearStr,
  isString,
  randomString,
  str2Xml,
  strParse,
  scriptOnLoad,
  handleFetchHook,
  createData,
  report,
  QuestQueue,
  noop,
  getPerformance,
  querystring,
  formatJson,
  filterObj,
  merge,
  replaceOld,
  mergeExports,
  perToNum,
  range,
  Mathjs,
  mathjs,
  getStatus,
  status,
  Monitor,
  MimeType,
  setMime,
  getMime,
  memoize,
  isImageSize,
  convertImageToBase64,
  handleError,
  addClassToElement,
  removeClassToElement,
  createDocumentFragment,
  escapeHtml,
  isClient,
  isWeiXin,
  isMobile,
  debounce,
  currentDevice,
  handleConsole,
  compose,
  Color,
  FMT,
  Hsl,
  Hsla,
  Rgb,
  Rgba,
  randomColor,
  hexToRgb,
  componentToHex,
  rgbToHex,
  rgbToHsl,
  hue2rgb,
  hslToRgb,
  rgbToHsb,
  hsbToRgb,
  hsvToRgb,
  hsvToHsl,
  ColorScheme,
  AudioRecorder,
  webglVendor,
  canvasVendor,
  audioVendor,
  retain,
  getCookie,
  requestUrlToBuffer,
  getPixelRatio,
  createObjectURL,
  getFrame,
  getHost,
  getAllQueryString,
  appendUrl,
  removeGhosting,
  getCookieByName,
  getWindow,
  connection,
  encodeUrl,
  imageRequest,
  durationHandler,
  networkSpeed,
  TOTP,
  isBangDevice,
  localStorageGetItem,
  localStorageSetItem,
  setAttributeByGlobal,
  setFontSize2html,
};

export type { CurrentDevice };
