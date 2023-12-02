# Quick Sort

The basic idea of quick sorting is that the records to be sorted are separated into two independent parts through one sort. The keywords of one part of the records are smaller than those of the other part. Then the two parts of the records can be sorted separately to achieve the entire sequence.

## Algorithm description

Quicksort uses divide-and-conquer to divide a list into two sub-lists. The specific algorithm is described as follows:

- Picking out an element from the sequence, called a "pivot";
- Reorder the sequence so that all elements smaller than the base value are placed in front of the base value and all elements larger than the base value are placed behind the base value (the same number can go to either side). After the partition exits, the benchmark is in the middle of the sequence. This is called a partition operation;
- Recursively sorts subsequences of elements less than the base value and subsequences of elements greater than the base value.

## GIF presentation

![Quick Sort](../../../../../assets/ranuts/sort/quick.gif)

## Code demonstration

```ts
/**
 * @description: Sets the base value pivot
 * @param {Array} list
 * @param {number} left
 * @param {number} right
 * @return {number} index
 */
const partition = (list: number[] = [], left: number, right: number) => {
  const pivot = left;
  let index = pivot + 1;
  for (let i = index; i <= right; i++) {
    if (list[i] < list[pivot]) {
      if (list[i] !== list[index]) {
        list[i] = list[i] ^ list[index];
        list[index] = list[i] ^ list[index];
        list[i] = list[i] ^ list[index];
      }
      index++;
    }
  }
  if (list[index - 1] !== list[pivot]) {
    list[index - 1] = list[index - 1] ^ list[pivot];
    list[pivot] = list[index - 1] ^ list[pivot];
    list[index - 1] = list[index - 1] ^ list[pivot];
  }
  return index - 1;
};
/**
 * @description: Continuously partition, set the reference value
 * @param {Array} list
 * @param {number} left
 * @param {number} right
 * @return {Array}
 */
const combine = (list: number[], left: number, right: number) => {
  if (left < right) {
    const partitionIndex: number = partition(list, left, right);
    combine(list, partitionIndex + 1, right);
    combine(list, left, partitionIndex - 1);
  }
  return list;
};
/**
 * @description: Quick sort
 * @param {Array} list
 * @return {Array}
 */
const quick = (list: number[] = []): number[] => {
  const size = list.length;
  return combine(list, 0, size - 1);
};
```
