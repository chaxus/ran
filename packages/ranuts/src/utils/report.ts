import { querystring } from '@/utils/obj';
import { getCookie, getHost, getWindow } from '@/utils/bom';
import { randomString } from '@/utils/str';

interface BeaconPayload {
  url?: string;
  type?: string;
  payload: Record<string, unknown>;
}

const sendBeacon = ({ url = '', type = 'application/json; charset=UTF-8', payload = {} }: BeaconPayload) => {
  const requestUrl = url ? url : getHost();
  if (navigator.sendBeacon && requestUrl) {
    // 判断sendBeacon是否支持可用
    const param = new Blob([JSON.stringify(payload)], { type });
    return navigator.sendBeacon(requestUrl, param);
  }
};

const sendImage = ({ url = '', payload = {} }) => {
  const requestUrl = url ? url : getHost();
  if (typeof document !== 'undefined' && requestUrl) {
    const image = new Image();
    image.width = 1;
    image.height = 1;
    image.src = `${requestUrl}?${querystring(payload)}`;
  }
};

export const report = ({
  url = '',
  type = 'application/json; charset=UTF-8',
  payload = {},
}: BeaconPayload): boolean | undefined | void => {
  const requestUrl = url ? url : getHost();
  if (typeof navigator !== 'undefined') {
    // 判断sendBeacon是否支持可用
    return sendBeacon({ url: requestUrl, type, payload });
  }
  return sendImage({ url: requestUrl, payload });
};

export function createData(params: Record<string, unknown> = {}): Record<string, unknown> {
  if (typeof window !== 'undefined') {
    const { width, height } = getWindow();
    return Object.assign(
      {},
      {
        id: randomString(),
        path: window.location.href,
        time: Date.now(),
        referrer: document.referrer,
        ip: window.returnCitySN || { cid: '', cip: '', cname: '' },
        userId: getCookie('chaxus_prod'),
        ratio: `${width}x${height}`,
        userAgent: window.navigator.userAgent,
      },
      params,
    );
  }
  return {};
}
