import { querystring } from './utils';
import { getHost } from './env';

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
