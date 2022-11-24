/**
 * @description: 选择排序，遍历一遍，找到最小值，放到最前面，重复n次上述操作。
 * @param {Array} list
 * @return {Array}
 */
const select = (list: Array<number>) => {
    const { length } = list
    for (let i = 0; i < length; i++) {
        let minIndex = i
        for (let j = i + 1; j < length; j++) {
            if (list[j] <= list[minIndex]) {
                minIndex = j
            }
        }
        let temp
        temp = list[i]
        list[i] = list[minIndex]
        list[minIndex] = temp
    }
    return list
}

export default select