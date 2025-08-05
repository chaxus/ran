const combile = (left: number[], right: number[]): number[] => {
  const result: number[] = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      result.push(left.unshift());
    } else {
      result.push(right.unshift());
    }
  }
  while (left.length) {
    result.push(left.unshift());
  }
  while (right.length) {
    result.push(right.unshift());
  }
  return result;
};
/**
 * @description: 归并排序
 * @param {Array} list
 * @return {Array}
 */
const merge = (list: Array<number>): Array<number> => {
  const size = list.length;
  if (size <= 1) return list;
  const middle = size >> 1;
  const left = list.slice(0, middle);
  const right = list.slice(middle);
  return combile(merge(left), merge(right));
};

export default merge;
