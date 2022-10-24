
const combine = (left: Array<number>, right: Array<number>) => {
    const list: Array<number> = []
    while (left.length > 0 && right.length > 0) {
        if (left[0] <= right[0]) {
            list.push(left.shift() as number)

        } else {
            list.push(right.shift() as number)
        }
    }

    while (left.length) {
        list.push(left.shift() as number)
    }
    while (right.length) {
        list.push(right.shift() as number)
    }
    return list
}
/**
 * @description: 归并排序
 * @param {Array} list
 * @return {Array}
 */
const merge = (list: Array<number>): Array<number> => {
    const { length } = list
    if (length < 2) {
        return list
    }
    const middle = Math.floor(length / 2)
    const left = list.slice(0, middle)
    const right = list.slice(middle)
    return combine(merge(left), merge(right))
}

export default merge