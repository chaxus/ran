declare namespace Ranuts {
  interface Identification {
    success: boolean;
    _identification?: boolean;
    message?: string;
    data?: unknown;
  }
}

interface Window {
  [key: any]: any;
  returnCitySN: {
    cid: string;
    cip: string;
    cname: string;
  };
  ranlog: boolean | undefined;
  webkitOfflineAudioContext: OfflineAudioContext;
}

declare namespace NodeJS {
  interface global {
    [key: any]: any;
  }
  interface Process {
    ranlog: boolean | undefined;
  }
}
