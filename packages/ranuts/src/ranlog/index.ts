import { handleClick } from './behavior'
import { handleError } from './error'
import { getPerformance } from './performance'
import { createData } from './utils'
import { report } from './report'

export interface Payload {
    url: string,
    payload: Record<string, unknown>,
    type?: string
}


class Monitor {
    url: string
    constructor(url: string) {
        this.url = url
        this.init()
    }
    init(): void {
        const url = this.url
        const payload = createData()
        if (typeof window !== 'undefined') {
            this.reportPerformance({ url, payload })
            handleClick({ url, payload })
            handleError({ url, payload })
        }
    }
    /**
     * @description: 页面加载性能上报
     * @param {Payload} param1
     */    
    reportPerformance({ url, payload }: Payload): void {
        const params = getPerformance()
        report({
            url,
            payload: {
                ...params,
                ...payload
            }
        })
    }
    /**
     * @description: 手动触发的上报
     * @param {Record} payload
     * @param {*} unknown
     */    
    log(payload: Record<string, unknown>): void {
        report({
            url: this.url,
            payload
        })
    }
    // ajax 上报
    // fetch 上报
    // 点击事件上报
    // pv
    // uv
}

export default Monitor