import { querystring } from '@/utils/obj';
import { getCookie, getHost, getWindow } from '@/utils/bom';
import { randomString } from '@/utils/str';

interface BeaconPayload {
  url?: string;
  type?: string;
  payload: Record<string, unknown>;
}

/** sendBeacon 上报；不可用或被浏览器拒绝（超出队列配额）时返回 false，交由调用方降级 */
const sendBeacon = ({ url = '', type = 'application/json; charset=UTF-8', payload = {} }: BeaconPayload): boolean => {
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  if (typeof navigator === 'undefined' || !navigator.sendBeacon || !url) return false;
  const param = new Blob([JSON.stringify(payload)], { type });
  // eslint-disable-next-line n/no-unsupported-features/node-builtins
  return navigator.sendBeacon(url, param);
};

/** 1x1 图片上报：最古老但最通用的兜底，跨域无需 CORS，页面卸载时也大多能发出去 */
const sendImage = ({ url = '', payload = {} }: { url?: string; payload?: Record<string, unknown> }): boolean => {
  if (typeof document === 'undefined' || !url) return false;
  const image = new Image();
  image.width = 1;
  image.height = 1;
  image.src = `${url}?${querystring(payload)}`;
  return true;
};

/**
 * @description: 埋点上报。优先 `navigator.sendBeacon`（不阻塞卸载、浏览器保证送达），
 * 不可用时降级到 1x1 图片。
 *
 * 降级判断看的是 **sendBeacon 本身是否可用/成功**，而不是 `navigator` 存不存在——
 * `navigator` 在所有浏览器里都存在，按它判断会让图片兜底永远走不到，
 * 于是 sendBeacon 缺失或返回 false（超出队列配额）时上报被静默丢弃。
 *
 * @param {BeaconPayload} options
 * @return {boolean} 是否成功交给了某条通道
 */
export const report = ({
  url = '',
  type = 'application/json; charset=UTF-8',
  payload = {},
}: BeaconPayload): boolean => {
  const requestUrl = url || getHost() || '';
  if (!requestUrl) return false;
  return sendBeacon({ url: requestUrl, type, payload }) || sendImage({ url: requestUrl, payload });
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
