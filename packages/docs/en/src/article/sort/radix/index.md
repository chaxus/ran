# Radix Sort

Radix sort is sorted by the lowest order first, and then collected; Then sort by high order, and then collect; And so on until you reach the top. Sometimes properties are prioritized, first by low priority and then by high priority. The final order is that the higher priority comes first and the lower priority comes first if the higher priority is the same. Bucket sort extension, similar to specifying bucket sort by bit, but can take advantage of the count sort for a small range of numbers.

## Algorithm description

- Get the largest number in the array, and get the number of bits;
- arr is the original array, and each bit is taken from the lowest point to form radix array.
- radix was sorted by counting (taking advantage of the feature that counting sort is suitable for a small range of numbers);

## GIF presentation

![Radix Sort](../../../../../assets/ranuts/sort/radix.gif)

## Code demo

```ts
const getMax = (list: Array<number>) => {
  let max = list[0];
  for (let i = 0; i < list.length; i++) {
    if (max < list[i]) {
      max = list[i];
    }
  }
  return max;
};
const getDigit = (num: number) => {
  let digit = 1;
  while (num >= 1) {
    digit++;
    num = num / 10;
  }
  return digit;
};
/**
 * @description: Radix Sort
 * @param {Array<number>} list
 * @return {Array<number>}
 */
const radix = (list: Array<number>, maxDigit?: number): Array<number> => {
  if (list.length === 0) return list;
  if (!maxDigit) maxDigit = getDigit(getMax(list));
  const buckets = new Array(maxDigit).fill(0).map(() => new Array(0));
  for (let j = 0; j < list.length; j++) {
    const digit = getDigit(list[j]);
    buckets[digit - 1].push(list[j]);
  }
  list = [];
  for (let i = 0; i < buckets.length; i++) {
    list = list.concat(count(buckets[i]));
  }
  return list;
};
```

## Algorithm analysis

Radix sort is based on distributive sort, so it is stable. But the performance of radix sort is slightly worse than bucket sort, each keyword bucket allocation requires O(n) time complexity, and after allocation to get a new keyword sequence requires O(n) time complexity. If the data to be sorted can be divided into d keywords, the time complexity of radix sort will be O(d\*2n), of course, d is far less than n, so it is basically linear level.

The spatial complexity of radix sort is O(n+k), where k is the number of buckets. Generally speaking, n&gt; &gt; k, so you need about n extra Spaces.
