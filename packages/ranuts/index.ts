import readFile from "@/file/readFile";
import watchFile from "@/file/watchFile";
import { SyncHook } from "@/mode/subscribe";
import queryFileInfo from "@/file/fileInfo";
import filterObj from "@/utils/filterObj";
import readDir from "@/file/readDir";
import str2Xml from "@/utils/str2Xml";
import writeFile from "@/file/writeFile";
import { init } from "@/vnode/init";
import { h } from "@/vnode/h";
import Monitor from "@/ranlog";
import { AudioRecorder } from "@/utils/audioRecorder";
import {
  addClassToElement,
  createObjectURL,
  debounce,
  formatJson,
  getAllQueryString,
  getCookie,
  getFreshUrl,
  getPixelRatio,
  isClient,
  isImageSize,
  isMobile,
  isWeiXin,
  judgeDevice,
  memoize,
  mergeExports,
  noop,
  querystring,
  removeGhosting,
  requestAnimation,
  requestUrlToBuffer,
  retain,
  scriptOnLoad,
  throttle,
  timestampToTime
} from "@/utils";
import type { Noop } from "@/utils";
import { MimeType, getMime, setMime } from "@/server/mimeType";

export type { Noop };

const vnode = {
  init,
  h,
};

export {
  writeFile,
  readFile,
  watchFile,
  SyncHook,
  queryFileInfo,
  filterObj,
  str2Xml,
  readDir,
  vnode,
  Monitor,
  MimeType,
  getMime,
  setMime,
  isClient,
  isWeiXin,
  judgeDevice,
  noop,
  mergeExports,
  memoize,
  debounce,
  getAllQueryString,
  getFreshUrl,
  requestAnimation,
  throttle,
  scriptOnLoad,
  isMobile,
  formatJson,
  getCookie,
  querystring,
  timestampToTime,
  removeGhosting,
  retain,
  isImageSize,
  getPixelRatio,
  requestUrlToBuffer,
  createObjectURL,
  addClassToElement,
  AudioRecorder
};

export const EventEmitter = SyncHook;
