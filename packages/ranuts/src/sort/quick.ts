/**
 * @description: 设置基准值pivot
 * @param {Array} list
 * @param {number} left
 * @param {number} right
 * @return {number} index
 */
const partition = (list: number[] = [], left: number, right: number) => {
  const pivot = left;
  let index = pivot + 1;
  for (let i = index; i <= right; i++) {
    if (list[i] < list[pivot]) {
      if (list[i] !== list[index]) {
        list[i] = list[i] ^ list[index];
        list[index] = list[i] ^ list[index];
        list[i] = list[i] ^ list[index];
      }
      index++;
    }
  }
  if (list[index - 1] !== list[pivot]) {
    list[index - 1] = list[index - 1] ^ list[pivot];
    list[pivot] = list[index - 1] ^ list[pivot];
    list[index - 1] = list[index - 1] ^ list[pivot];
  }
  return index - 1;
};
/**
 * @description: 不断分区，设置基准值
 * @param {Array} list
 * @param {number} left
 * @param {number} right
 * @return {Array}
 */
const combine = (list: number[], left: number, right: number) => {
  if (left < right) {
    const partitionIndex: number = partition(list, left, right);
    combine(list, partitionIndex + 1, right);
    combine(list, left, partitionIndex - 1);
  }
  return list;
};
/**
 * @description: 快速排序
 * @param {Array} list
 * @return {Array}
 */
const quick = (list: number[] = []): number[] => {
  const size = list.length;
  return combine(list, 0, size - 1);
};

export default quick;
