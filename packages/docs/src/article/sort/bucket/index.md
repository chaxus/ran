# Bucket Sort

The key to efficiency is this bucket function. The data is divided into a limited number of buckets, and each bucket is sorted separately (it is possible to use another sorting algorithm or recursively continue to use bucket sorting).

## Algorithm description

- Set a quantitative array as an empty bucket;
- Iterate over the input data and place the data one by one into the corresponding bucket;
- Sort each bucket that is not empty;
- Piecing together sorted data from a bucket that is never empty.

<!-- ## GIF presentation -->

## Code demo

```ts
const count = (list: Array<number>, max: number = 100): Array<number> => {
  const countList = new Array(max + 1);
  for (let i = 0; i < list.length; i++) {
    if (!countList[list[i]]) {
      countList[list[i]] = 0;
    }
    countList[list[i]]++;
  }
  let startIndex = 0;
  for (let i = 0; i < countList.length; i++) {
    while (countList[i] > 0) {
      list[startIndex++] = i;
      countList[i]--;
    }
  }
  return list;
};
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
 * @description: Bucket Sort
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
```

## Algorithm analysis

Bucket sorting best uses linear time O(n), and the time complexity of bucket sorting depends on the time complexity of sorting data between buckets, because the time complexity of other parts is O(n). Obviously, the smaller the buckets, the less data there is between them, and the less time it takes to sort them. But the corresponding space consumption will increase.
