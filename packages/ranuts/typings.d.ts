declare module '@/file/*';
declare module '@/designMode/*';
declare module '@/node/*';
declare module '@/sort/*';
declare module '@/astParser/*';
declare module '@/utils/*';
declare module '@/bundler/*';
declare module '@/vnode/*';
declare module '@/server/*';

declare namespace Ranuts {
  interface Identification {
    success: boolean;
    _identification?: boolean;
    message?: string;
    data?: unknown;
  }
}

interface Window {
  returnCitySN: {
    cid: string;
    cip: string;
    cname: string;
  };
  ranlog: boolean | undefined;
}

declare namespace NodeJS {
  interface Process {
    ranlog: boolean | undefined;
  }
}
