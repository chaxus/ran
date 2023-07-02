const getMax = (list: Array<number>) => {
  let max = list[0]
  for (let i = 0; i < list.length; i++) {
    if (max < list[i]) {
      max = list[i]
    }
  }
  return max
}
// TODO: 最小值默认为0，后续完善最小值为负数的情况
/**
 * @description: 计数排序
 * @param {Array<number>} list
 * @return {Array<number>}
 */
const count = (list: Array<number>, max?: number): Array<number> => {
  if (list.length === 0) return list
  if (!max) max = getMax(list)
  const countList = new Array(max + 1)
  for (let i = 0; i < list.length; i++) {
    if (!countList[list[i]]) {
      countList[list[i]] = 0
    }
    countList[list[i]]++
  }
  let startIndex = 0
  for (let i = 0; i < countList.length; i++) {
    while (countList[i] > 0) {
      list[startIndex++] = i
      countList[i]--
    }
  }
  return list
}

export default count
