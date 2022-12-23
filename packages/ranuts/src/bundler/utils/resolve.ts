import { dirname, extname, isAbsolute, resolve } from 'node:path';

export function removeExtension(p: string):string {
  return p.replace(extname(p), '');
}

export function defaultResolver(id: string, importer: string | null):string | false {
  // absolute paths are left untouched
  if (isAbsolute(id)) return id;

  // external modules stay external
  if (!id.startsWith('.')) return false;

  const resolvedPath = importer ? resolve(dirname(importer), id) : resolve(id);
  return resolvedPath;
}
