
const swap = (list: Array<number>, left: number, right: number) => {
    let temp = list[left]
    list[left] = list[right]
    list[right] = temp
}
/**
 * @description: 设置基准值pivot
 * @param {Array} list
 * @param {number} left
 * @param {number} right
 * @return {number} index
 */
const partition = (list: Array<number>, left: number, right: number) => {
    let pivot = left
    let index = pivot + 1
    for (let i = index; i <= right; i++) {
        if (list[i] < list[pivot]) {
            let temp = list[i]
            list[i] = list[index]
            list[index] = temp
            index++
        }
    }
    let temp = list[pivot]
    list[pivot] = list[index - 1]
    list[index - 1] = temp
    return index - 1
}
/**
 * @description: 不断分区，设置基准值
 * @param {Array} list
 * @param {number} left
 * @param {number} right
 * @return {Array}
 */
const combine = (list: Array<number>, left: number, right: number) => {
    let partitionIndex;
    if (left < right) {
        partitionIndex = partition(list, left, right)
        combine(list, left, partitionIndex - 1)
        combine(list, partitionIndex + 1, right)
    }
    return list

}
/**
 * @description: 快速排序
 * @param {Array} list
 * @return {Array}
 */
const quick = (list: Array<number>) => {
    const { length } = list;
    return combine(list, 0, length - 1)
}

export default quick