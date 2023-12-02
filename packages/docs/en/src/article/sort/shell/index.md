# Shell Sort

Shell was invented in 1959, and the first breakthrough O(n2) sorting algorithm was an improved version of simple insertion sorting. It differs from insertion sort in that it gives preference to more distant elements. Hill sort is also called reduced increment sort.

## Algorithm description

First, the whole record sequence to be sorted is divided into several sub-sequences for direct insertion sorting. The specific algorithm is described as follows:

- Select an incremental sequence t1, t2,... tk, wherein ti&gt; tj, tk=1;
- According to the number of incremental sequences k, the sequence is sorted by k passes.
- For each sequence, according to the corresponding increment ti, the sequence to be sorted is divided into several sub-sequences with length m, and each sub-table is sorted by direct insertion. When the increment factor is only 1, the entire sequence is treated as a table, and the length of the table is the length of the entire sequence.

## GIF presentation

![Shell Sort](../../../../../assets/ranuts/sort/shell.gif)

## Code implementation

```js
/**
 * @description: Hill sort is an improved version of simple insertion sort. It differs from insertion sort in that it gives preference to more distant elements. Hill sort is also called reduced increment sort.
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
```

## Algorithm analysis

The core of Hill sort is the setting of interval sequence. The interval sequence can be set in advance, and the interval sequence can be defined dynamically. The algorithm for dynamically defining interval sequences was developed by Robert Sedgewick, co-author of Algorithms (4th Edition).
