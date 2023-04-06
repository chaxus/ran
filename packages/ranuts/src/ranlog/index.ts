import { handleClick } from './behavior'
import { handleError } from './error'
import { getPerformance } from './performance'
import { createData, throttle } from './utils'
import { report } from './report'
import { handleFetchHook, handleXhrHook } from './request'

export interface Payload {
    payload: Record<string, unknown>,
    type?: string
}
class Monitor {
    /**
     * @description: 页面加载性能上报
     * @param {Payload} param1
     */
    reportPerformance(): void {
        const params = getPerformance()
        const payload = createData()
        report({
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
        report({ payload })
    }
    /**
     * @description: 点击上报
     * @return {*}
     */
    reportClick(): void {
        const throttleReport = throttle(report)
        const payload = createData()
        const hook = (event: MouseEvent) => {
            throttleReport({ payload: { ...payload, event, type: 'click' } })
        }
        handleClick(hook)
    }
    // ajax 上报
    reportXhr(): void {
        const throttleReport = throttle(report)
        const payload = createData()
        const requestHook = (...args: unknown[]) => {
            throttleReport({ payload: { ...payload, ...args, type: 'xhrRequest' } })
        }
        const responseHook = (...args: unknown[]) => {
            throttleReport({ payload: { ...payload, ...args, type: 'xhrResponse' } })
        }
        const errorHook = (...args: unknown[]) => {
            throttleReport({ payload: { ...payload, ...args, type: 'xhrError' } })
        }
        handleXhrHook({ requestHook, responseHook, errorHook })
    }
    reportFetch(): void {
        const throttleReport = throttle(report)
        const payload = createData()
        const requestHook = (...args: unknown[]) => {
            throttleReport({ payload: { ...payload, ...args, type: 'fetchRequest' } })
        }
        const responseHook = (...args: unknown[]) => {
            throttleReport({ payload: { ...payload, ...args, type: 'fetchResponse' } })
        }
        const errorHook = (...args: unknown[]) => {
            throttleReport({ payload: { ...payload, ...args, type: 'fetchError' } })
        }
        handleFetchHook({ requestHook, responseHook, errorHook })
    }
    reportError(): void {
        const throttleReport = throttle(report)
        const payload = createData()
        const hook = (...args: unknown[]) => {
            throttleReport({ payload: { ...payload, ...args, type: 'error' } })
        }
        handleError(hook)
    }
}

export default Monitor