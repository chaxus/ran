const getMax = (list: number[]) => {
  let max = list[0];
  for (let i = 1; i < list.length; i++) {
    if (max < list[i]) {
      max = list[i];
    }
  }
  return max;
};
// TODO: 最小值默认为0，后续完善最小值为负数的情况
/**
 * @description: 计数排序
 * @param {Array<number>} list
 * @return {Array<number>}
 */
const count = (list: number[]): number[] => {
  if (list.length <= 1) return list;
  const max = getMax(list);
  const countList = new Array(max + 1).fill(0);
  list.forEach((item) => {
    if (!countList[item]) {
      countList[item] = 1;
    } else {
      countList[item]++;
    }
  });
  const result = [];
  for (let i = 0; i < countList.length; i++) {
    while (countList[i]) {
      result.push(i);
      countList[i]--;
    }
  }
  return result;
};

export default count;
