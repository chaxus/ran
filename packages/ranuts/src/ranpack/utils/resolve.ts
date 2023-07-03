import { dirname, extname, isAbsolute, resolve } from 'node:path'

export function removeExtension(p: string): string {
  return p.replace(extname(p), '')
}

const extensions = '.js'

const getFileType = (val: string): string => {
  return val.substring(val.lastIndexOf('.') + 1)
}
/**
 * @description: 返回完整的路径
 * @param {string} id
 * @param {string} importer
 */
export function defaultResolver(
  id: string,
  importer: string | null,
): string | false {
  // // 处理文件名不以js结尾的情况，补全.js
  if (getFileType(id) !== 'js') {
    id += '.js'
  }
  // 如果是绝对路径，直接返回绝对路径
  if (isAbsolute(id)) {
    return id
  }
  // 如果不是绝对路径，那必然是相对路径，必燃以 . 开头，如果不是，则返回false
  if (!id.startsWith('.')) return false
  // 返回完整的路径
  const resolvedPath = importer ? resolve(dirname(importer), id) : resolve(id)
  return resolvedPath
}
