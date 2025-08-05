/**
 * @description: 选择排序，遍历一遍，找到最小值，放到最前面，重复 n 次上述操作。
 * @param {Array} list
 * @return {Array}
 */
const select = (list: number[]): number[] => {
  const size = list.length;
  for (let i = 0; i < size; i++) {
    let minIndex = i;
    for (let j = i + 1; j < size; j++) {
      if (list[j] < list[minIndex]) {
        minIndex = j;
      }
    }
    [list[i], list[minIndex]] = [list[minIndex], list[i]];
  }
  return list;
};

export default select;
