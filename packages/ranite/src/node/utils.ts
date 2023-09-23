import path from 'node:path';
import os from 'node:os';
import {
  CLIENT_PUBLIC_PATH,
  HASH_RE,
  JS_TYPES_RE,
  QEURY_RE,
} from './constants';

const INTERNAL_LIST = [CLIENT_PUBLIC_PATH, '/@react-refresh'];

export function slash(p: string): string {
  return p.replace(/\\/g, '/');
}

export const isWindows = os.platform() === 'win32';

// 兼容window解析路径
export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id);
}

export const cleanUrl = (url: string): string =>
  url.replace(HASH_RE, '').replace(QEURY_RE, '');

export const isCSSRequest = (id: string): boolean =>
  cleanUrl(id).endsWith('.css');

export const isJSRequest = (id: string): boolean => {
  id = cleanUrl(id);
  if (JS_TYPES_RE.test(id)) {
    return true;
  }
  if (!path.extname(id) && !id.endsWith('/')) {
    return true;
  }
  return false;
};

export function isImportRequest(url: string): boolean {
  return url.endsWith('?import');
}

export function isInternalRequest(url: string): boolean {
  return INTERNAL_LIST.includes(url);
}

export function removeImportQuery(url: string): string {
  return url.replace(/\?import$/, '');
}

export function isPlainObject(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

export function getShortName(file: string, root: string): string {
  return file.startsWith(root + '/') ? path.posix.relative(root, file) : file;
}
