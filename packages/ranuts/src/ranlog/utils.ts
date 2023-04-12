import os from 'node:os'

export function querystring(data = {}): string {
  if (typeof data !== 'object') {
    throw new TypeError('param must be object')
  }
  return Object.entries(data)
    .reduce(
      (searchParams, [name, value]) =>
        value === undefined || value == null
          ? searchParams
          : (searchParams.append(
              decodeURIComponent(name),
              decodeURIComponent(value),
            ),
            searchParams),
      new URLSearchParams(),
    )
    .toString()
}

export function randomString(len: number = 8): string {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  const maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return `${Date.now()}-${pwd}`
}

export function getCookie(name: string): string {
  if (typeof window !== 'undefined') {
    const cookieList = document.cookie.match(
      new RegExp(`(^| )${name}(?:=([^;]*))?(;|$)`),
    )
    if (cookieList && cookieList[2]) return cookieList[2]
  }
  return ''
}

interface ClientRatio {
  width: number
  height: number
}

/**
 * 跨浏览器获取可视窗口大小
 */
export const getWindow = (): ClientRatio => {
  if (typeof window.innerWidth !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }
  return {
    width: 0,
    height: 0,
  }
}

export function createData(
  params: Record<string, unknown> = {},
): Record<string, unknown> {
  if (typeof window !== 'undefined') {
    const { width, height } = getWindow()
    return Object.assign(
      {},
      {
        id: randomString(),
        path: window.location.href,
        time: Date.now(),
        userAgent: window.navigator.userAgent,
        referrer: document.referrer,
        ip: window.returnCitySN || { cid: '', cip: '', cname: '' },
        userId: getCookie('chaxus_prod'),
        ratio: `${width}x${height}`,
      },
      params,
    )
  }
  return {}
}

export const throttle = (fn: Function, wait: number = 500): Function => {
  let timer: NodeJS.Timeout | null = null
  return function (this: unknown, ...args: unknown[]) {
    const context = this
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        fn.apply(context, args)
      }, wait)
    }
  }
}

export const Noop = (): void => {}

export function changeHumpToLowerCase(str: string): string {
  const arr = str.split('')
  const lowerCase = arr.map((val) => {
    if (val.toUpperCase() === val) {
      return '_' + val.toLowerCase()
    } else {
      return val
    }
  })
  str = lowerCase.join('')
  return str
}

/**
 * 重写对象上面的某个属性
 *
 * @export
 * @param {IAnyObject} source 需要被重写的对象
 * @param {string} name 需要被重写对象的key
 * @param {(...args: any[]) => any} replacement 以原有的函数作为参数，执行并重写原有函数
 * @param {boolean} isForced 是否强制重写（可能原先没有该属性）
 */
export function replaceOld(
  source: any,
  name: string,
  replacement: (...args: unknown[]) => unknown,
  isForced?: boolean,
): void {
  if (typeof source === 'undefined') return
  if (name in source || isForced) {
    const original = source[name]
    const wrapped = replacement(original)
    if (typeof wrapped === 'function') {
      source[name] = wrapped
    }
  }
}

export const isString = (obj: unknown): boolean => {
  return toString.call(obj) === '[object String]'
}

export type Hooks = (...args: unknown[]) => void

export function getIPAdress(): string | undefined {
  const interfaces = os.networkInterfaces()
  for (const name in interfaces) {
    const iface: any = interfaces[name]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}
