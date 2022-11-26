

export type Next = () => Promise<never> | Promise<void>;

declare namespace Compose {
    type Middleware<T> = (context: T, next: Next) => any;
    type ComposedMiddleware<T> = (context: T, next?: Next) => Promise<void>;
}
/**
 * @description: 将异步函数转化为同步的方式进行执行
 * @param {Array} middleware
 * @return {*} 
 */
export function compose<T>(middleware: Array<Compose.Middleware<T>>): Compose.ComposedMiddleware<T> {
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }
    return function (context, next) {
        let index = -1
        return dispatch(0)
        function dispatch(i: number): Promise<never> | Promise<void> {
            if (i <= index) return Promise.reject(new Error('next() called multiple times'))
            index = i
            let fn = middleware[i]
            if (i === middleware.length && next) fn = next
            if (!fn) return Promise.resolve()
            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)))
            } catch (err) {
                return Promise.reject(err)
            }
        }
    }
}

