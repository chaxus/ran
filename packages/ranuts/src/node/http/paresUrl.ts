import type { IncomingMessage } from 'node:http'

interface ParseUrl {
  search?: string
  query?: string
  pathname?: string
  path?: string
  href?: string
  _raw?: string
}
interface Req extends IncomingMessage {
  _parsedUrl?: ParseUrl
}
/**
 * @description: 解析 IncomingMessage 类型的请求url，返回的类型永远是 ParseUrl
 * @param {Req} req
 * @return {ParseUrl}
 */
export default function (req: Req):ParseUrl | undefined {
  const url = req.url
  if (url === void 0) return 

  let obj = req._parsedUrl
  if (obj && obj._raw === url) return obj

  obj = {}
  obj.query = obj.search = undefined
  obj.href = obj.path = obj.pathname = url

  const idx = url.indexOf('?', 1)
  if (idx !== -1) {
    obj.search = url.substring(idx)
    obj.query = obj.search.substring(1)
    obj.pathname = url.substring(0, idx)
  }

  obj._raw = url

  return (req._parsedUrl = obj)
}
