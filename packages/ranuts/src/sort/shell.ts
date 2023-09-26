/**
 * @description: 希尔排序，是简单插入排序的改进版。它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫缩小增量排序。
 * @param {Array} list
 * @return {Array}
 */
const shell = (list: number[]): number[] => {
  const size = list.length;
  for (let gap = size >> 1; gap > 0; gap >>= 1) {
    for (let i = gap; i < size; i += gap) {
      const current = list[i];
      let preIndex = i - gap;
      while (preIndex >= 0 && list[preIndex] > current) {
        list[preIndex + gap] = list[preIndex];
        preIndex -= gap;
      }
      list[preIndex + gap] = current;
    }
  }
  return list;
};

export default shell;
