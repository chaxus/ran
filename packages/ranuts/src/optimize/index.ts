interface FT {
    new(): Object,
    (): void;
    prototype: Object;
}
/**
 * @description: 实现object.create，将传入的对象作为原型
 * @param {*} obj
 * @return {*}
 */
const objectCreate = (obj: Object) => {
    function F() { }
    F.prototype = obj
    return new (F as FT)()
}
/**
 * @description: 实现 instanceof: object instanceof constructor
 * @param {*} left
 * @param {*} right
 * @return {*}
 */
const instanceOf = (obj: Object, cst: Function) => {
    let proto = Object.getPrototypeOf(obj) // 获取对象的 prototype
    const prototype = cst.prototype // 获取构造函数的 prototype
    while (true) {
        if (!proto) return false
        if (proto === prototype) return true
        proto = Object.getPrototypeOf(proto) // 一直向上获取 prototype
    }
}
/**
 * @description: 实现new操作符
 * @param {*} 构造函数
 * @param {*} 参数
 * @return {*} Object
 */
function customNew() {
    const constructor = Array.prototype.shift.call(arguments)
    if(typeof constructor !== 'function'){
        throw new Error("constructor must be function");
    }
    const newObject = Object.create(constructor.prototype)
    const result = constructor.apply(newObject,arguments)
    const flag = result && result instanceof Object
    return flag ? result : newObject
}