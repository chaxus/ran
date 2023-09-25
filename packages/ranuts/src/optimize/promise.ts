// Promise上一共有9个方法，其中6个静态方法，3个原型链上的方法

/**
 * @description: 参数是数组，有一个拒绝就返回第一个被拒绝的，否则返回所有成功的数组
 * @return {*}
 */
Promise.all([]);
/**
 * @description: 参数是数组，返回所有结果的数组，无论成功还是失败
 * @return {*}
 */
Promise.allSettled([]);
/**
 * @description: 参数是数组，任何有一个成功，就返回成功的结果，如果全部失败，返回失败的数组结果
 * @return {*}
 */
Promise.any([]);
/**
 * @description: 参数是数组，返回第一个结果
 * @return {*}
 */
Promise.race([]);
/**
 * @description: 返回一个已拒绝的 Promise 对象，拒绝原因为给定的参数
 * @return {*}
 */
Promise.reject();
/**
 * @description: 返回一个已敲定的 Promise 对象
 * @return {*}
 */
Promise.resolve();

// 原型链上的方法

Promise.prototype.catch;

Promise.prototype.finally;

Promise.prototype.then;
