import { Noop } from './utils'

export const handleError = (hooks: (error:Error|PromiseRejectionEvent|ErrorEvent)=>void = Noop): void => {
    if(typeof window !== 'undefined'){
        window.addEventListener('unhandledrejection', (error) => {hooks(error)}, true);
        window.addEventListener('error', (error) => {
            hooks(error)
            return false // 取消默认事件
        }, true) // 捕获阶段
    }
 
}

