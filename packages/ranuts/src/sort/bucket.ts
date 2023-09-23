import count from '@/sort/count';
const getMax = (list: Array<number>) => {
  let max = list[0];
  for (let i = 0; i < list.length; i++) {
    if (max < list[i]) {
      max = list[i];
    }
  }
  return max;
};
const getMin = (list: Array<number>) => {
  let min = list[0];
  for (let i = 0; i < list.length; i++) {
    if (min > list[i]) {
      min = list[i];
    }
  }
  return min;
};

/**
 * @description: 桶排序
 * @param {Array<number>} list
 * @return {Array<number>}
 */
const bucket = (
  list: Array<number>,
  bucketSize: number = 5,
  max?: number,
  min?: number,
): Array<number> => {
  if (list.length === 0) return list;
  if (!max) max = getMax(list);
  if (!min) min = getMin(list);
  const bucketCount = Math.floor((max - min) / bucketSize) + 1;
  const buckets = new Array(bucketCount + 1).fill(0).map(() => new Array(0));

  for (let i = 0; i < list.length; i++) {
    buckets[Math.floor((list[i] - min) / bucketSize)].push(list[i]);
  }
  list = [];
  for (let i = 0; i < bucketCount; i++) {
    list = list.concat(count(buckets[i]));
  }
  return list;
};
export default bucket;
