/**
 * @description: 交换元素
 * @param {number} list
 * @param {number} left
 * @param {number} right
 * @return {*}
 */
const swap = (list: number[], left: number, right: number) => {
  if (list[left] !== list[right]) {
    list[left] = list[left] ^ list[right];
    list[right] = list[left] ^ list[right];
    list[left] = list[left] ^ list[right];
  }
};
/**
 * @description: 设置基准值 pivot
 * @param {Array} list
 * @param {number} left
 * @param {number} right
 * @return {number} index
 */
const partition = (list: number[], left: number, right: number) => {
  const pivot = left;
  let index = pivot + 1;
  for (let i = index; i <= right; i++) {
    if (list[i] < list[pivot]) {
      swap(list, i, index);
      index++;
    }
  }
  swap(list, index - 1, pivot);
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
    const partitionIndex = partition(list, left, right);
    combine(list, left, partitionIndex - 1);
    combine(list, partitionIndex + 1, right);
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
