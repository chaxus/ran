import { querystring } from './utils'

interface BeaconPayload {
    url: string,
    type?: string,
    payload: Record<string, unknown>
}


const sendBeacon = ({ url = '', type = 'application/json; charset=UTF-8', payload = {} }: BeaconPayload) => {
    if (navigator.sendBeacon) {  // 判断sendBeacon是否支持可用
        const param = new Blob([JSON.stringify(payload)], { type });
        return navigator.sendBeacon(url, param)
    }
}

const sendImage = ({ url = "", payload = {} }) => {
    const image = new Image();
    image.width = 1;
    image.height = 1;
    image.src = `${url}?${querystring(payload)}`
}

export const report = ({ url = '', type = 'application/json; charset=UTF-8', payload = {} }: BeaconPayload): boolean | undefined | void => {
    if (typeof navigator.sendBeacon !== 'undefined') {  // 判断sendBeacon是否支持可用
        return sendBeacon({ url, type, payload })
    }
    return sendImage({ url, payload })
}