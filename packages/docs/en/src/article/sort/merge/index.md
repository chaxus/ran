# Merge Sort

Merge sort is an effective sort algorithm based on merge operation. This algorithm is a very typical application of Divide and Conquer. By combining the ordered subsequences, a completely ordered sequence is obtained. That is, each subsequence is ordered first, and then the subsequence segments are ordered. If two ordered tables are merged into one ordered table, it is called a 2-way merge.

## Algorithm description

- Divide the input sequence of length n into two subsequences of length n/2;
- The two subsequences were merged and sorted respectively.
- Merge two sorted subsequences into one final sorted sequence.

## GIF presentation

![Merge Sort](../../../../../assets/ranuts/sort/merge.gif)

## Code demonstration

```ts
const combine = (left: Array<number>, right: Array<number>) => {
  const list: Array<number> = [];
  while (left.length > 0 && right.length > 0) {
    if (left[0] <= right[0]) {
      list.push(left.shift()!);
    } else {
      list.push(right.shift()!);
    }
  }

  while (left.length) {
    list.push(left.shift()!);
  }
  while (right.length) {
    list.push(right.shift()!);
  }
  return list;
};
/**
 * @description: Merge sort
 * @param {Array} list
 * @return {Array}
 */
const merge = (list: Array<number>): Array<number> => {
  const { length } = list;
  if (length <= 1) {
    return list;
  }
  const middle = length >> 1;
  const left = list.slice(0, middle);
  const right = list.slice(middle);
  return combine(merge(left), merge(right));
};
```

## Algorithm analysis

Merge sort is a stable sort method. Like select sort, merge sort performs independently of the input data, but performs much better than select sort because it is always O(nlogn) in time complexity. The trade-off is extra memory space.
