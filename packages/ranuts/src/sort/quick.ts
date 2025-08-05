const partition = (list: number[], left: number, right: number): number => {
  const pivot = left;
  let index = pivot + 1;
  for (let i = index; i <= right; i++) {
    if (list[i] > list[pivot]) {
      [list[i], list[index]] = [list[index], list[i]];
      index++;
    }
  }
  [list[index - 1], list[pivot]] = [list[pivot], list[index - 1]];
  return index - 1;
};

const combine = (list: number[], left: number, right: number): number[] => {
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
  return combine(list, 0, size);
};

export default quick;
