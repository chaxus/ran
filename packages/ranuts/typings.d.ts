declare module '@/file/*'
declare module '@/designMode/*'
declare module '@/node/*'
declare module '@/sort/*'
declare module '@/astParser/*'
declare module '@/utils/*'
declare module '@/bundler/*'
declare module '@/vnode/*'
declare module '@/server/*'


declare namespace Ranuts {
  interface Identification {
    _identification: boolean
    message?: string
    data?: any
  }
}

interface Window {
  returnCitySN: {
    cid: string,
    cip: string,
    cname: string
  }
}


