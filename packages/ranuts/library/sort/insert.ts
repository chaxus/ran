

/**
 * @description: 插入排序，维护一个有序的数组，将后面的数字插入到前面的有序数组中国
 * @param {Array} list
 * @return {Array}
 */
const insert = (list: Array<string>) => {
    const { length } = list
    for (let i = 1; i < length; i++) {
        let preIndex = i - 1
        const current = list[i]
        while (preIndex >= 0 && list[preIndex] > current) {
            list[preIndex + 1] = list[preIndex]
            preIndex--
        }
        list[preIndex + 1] = current
    }
    return list
}

export default insert