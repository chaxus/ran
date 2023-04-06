import { Noop } from './utils'
import type { Hooks } from './utils'

export const handleError = (hooks: Hooks = Noop): void => {
    window.addEventListener('unhandledrejection', (error) => {hooks(error)}, true);
    window.addEventListener('error', (error) => {
        hooks(error)
        return false // 取消默认事件
    }, true) // 捕获阶段
}

