/**
 * @description: 冒泡排序，两两比较，交换位置，遍历n^2
 * @param {Array} list
 * @return {Array}
 */
const bubble = (list: number[]): number[] => {
  const size = list.length
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (list[i] < list[j]) {
        list[i] = list[i] ^ list[j]
        list[j] = list[i] ^ list[j]
        list[i] = list[i] ^ list[j]
      }
    }
  }
  return list
}

export default bubble
