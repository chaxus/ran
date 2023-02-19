import { dirname, extname, isAbsolute, resolve } from 'node:path';

export function removeExtension(p: string): string {
  return p.replace(extname(p), '');
}
/**
 * @description: 返回完整的路径
 * @param {string} id
 * @param {string} importer
 */
export function defaultResolver(id: string, importer: string | null): string | false {
  // 如果是绝对路径，直接返回绝对路径
  if (isAbsolute(id)) return id;

  // 如果不是绝对路径，那必然是相对路径，必燃以 . 开头，如果不是，则返回false
  if (!id.startsWith('.')) return false;
  // 返回完整的路径
  const resolvedPath = importer ? resolve(dirname(importer), id) : resolve(id);
  return resolvedPath;
}
