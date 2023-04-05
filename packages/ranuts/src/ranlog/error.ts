import { report } from './report'
import type { Payload } from './index'

export const handleError = ({ url, payload }: Payload): void => {
    window.addEventListener('unhandledrejection', (error) => {
        const param = {
            url,
            payload: Object.assign({}, payload, { error })
        }
        report(param)
    }, true);
    window.addEventListener('error', (error) => {
        const param = {
            url,
            payload: Object.assign({}, payload, { error })
        }
        report(param)
        return false // 取消默认事件
    }, true) // 捕获阶段
}

