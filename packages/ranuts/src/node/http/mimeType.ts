export const mimes: Record<string, string> = {}

export function lookup(ext: string):string {
  const tmp = ('' + ext).trim().toLowerCase()
  let idx = tmp.lastIndexOf('.')
  return mimes[!~idx ? tmp : tmp.substring(++idx)]
}
