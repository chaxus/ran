/**
 * @description: 希尔排序，是简单插入排序的改进版。它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫缩小增量排序。
 * @param {Array} list
 * @return {Array}
 */
const shell = (list: Array<number>) => {
    const { length } = list
    for (let gap = Math.floor(length / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for(let i = gap; i < length; i++){
            let j = i;
            const current = list[i]
            while(j - gap >= 0 && current < list[j - gap]){
                list[j] = list[j - gap]
                j = j - gap
            }
            list[j] = current
        }
    }
    return list
}

export default shell