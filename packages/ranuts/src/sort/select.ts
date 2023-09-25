/**
 * @description: 选择排序，遍历一遍，找到最小值，放到最前面，重复n次上述操作。
 * @param {Array} list
 * @return {Array}
 */
const select = (list: number[]): number[] => {
  const size = list.length;
  for (let i = 0; i < size; i++) {
    let minIndex = i;
    for (let j = i + 1; j < size; j++) {
      if (list[minIndex] >= list[j]) {
        minIndex = j;
      }
    }
    if (list[i] !== list[minIndex]) {
      list[i] = list[i] ^ list[minIndex];
      list[minIndex] = list[i] ^ list[minIndex];
      list[i] = list[i] ^ list[minIndex];
    }
  }
  return list;
};

export default select;
