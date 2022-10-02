
class EventEmitter {
    _events: Record<string | symbol, any>;
    constructor() {
        this._events = {};
    }

    on = (eventName: string | symbol, callback: any) => {
        if (this._events[eventName] && eventName !== Symbol.for('new-listener')) {
            // 注册一个 newListener 用于监听新的事件订阅
            this.emit(Symbol.for('new-listener'), eventName)
        }
        // 由于一个事件可能注册多个回调函数，所以使用数组来存储事件队列
        const callbacks = this._events[eventName] || [];
        callbacks.push(callback);
        this._events[eventName] = callbacks
    }

    emit = (eventName: string | symbol, ...args: any) => {
        const callbacks = this._events[eventName] || [];
        callbacks.forEach((cb: any) => cb(...args))
    }

    once = (eventName: string | symbol, callback: any) => {
        // 由于需要在回调函数执行后，取消订阅当前事件，所以需要对传入的回调函数做一层包装,然后绑定包装后的函数
        const one = (...args: any) => {
            callback(...args)
            this.off(eventName, one)
        }
        // 考虑：如果当前事件在未执行，被用户取消订阅，能否取消？
        // 由于：我们订阅事件的时候，修改了原回调函数的引用，所以，用户触发 off 的时候不能找到对应的回调函数
        // 所以，我们需要在当前函数与用户传入的回调函数做一个绑定，我们通过自定义属性来实现
        one.initialCallback = callback;
        this.on(eventName, one)
    }

    off = (eventName: string | symbol, callback: any) => {
        // 找到事件对应的回调函数，删除对应的回调函数
        const callbacks = this._events[eventName] || []
        const newCallbacks = callbacks.filter((fn: any) => fn != callback && fn.initialCallback != callback /* 用于once的取消订阅 */)
        this._events[eventName] = newCallbacks;
    }

}

export default EventEmitter