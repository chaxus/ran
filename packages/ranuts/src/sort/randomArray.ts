
/**
 * @description: 通过数组长度，数组最大值，数组的最小值随机生成数组
 * @param {number} length
 * @param {number} min
 * @param {number} max
 * @return {Array<number>}
 */
const randomArray = (length: number = 10, min: number = 0, max: number = min + 100) => {
    if(min > max){
        throw new Error('max must be max min')
    }
    return Array.from({ length }, _ => Math.floor(Math.random() * (max - min) + min))
}

export default randomArray