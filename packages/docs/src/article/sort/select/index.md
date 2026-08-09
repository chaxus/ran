# Selection Sort

Select-sort is a simple and intuitive sorting algorithm. It works by first finding the smallest (large) element in the unsorted sequence and storing it at the beginning of the sorted sequence, then continuing to find the smallest (large) element from the remaining unsorted elements and placing it at the end of the sorted sequence. And so on until all the elements are sorted.

## Algorithm description

Ordering results can be obtained by direct selection sorting of n records through n-1 direct selection sorting. The specific algorithm is described as follows:

- Initial state: disordered region is R[1..n], ordered region is empty;
- i sort (i=1,2,3... n-1) At the beginning, the current ordered and disordered regions are R[1..i-1] and R(i.. n). The run sort selects the record R[k] with the smallest keyword from the current unordered area and swaps it with the first record R in the unordered area, so that R[1..i] and R[i+1..n) become a new ordered area with 1 more records and a new unordered area with 1 less records, respectively.
- n-1 is done. The array is ordered.

## Animation

<video src="../../../../assets/ranuts/sort/select.mp4" autoplay loop muted playsinline style="max-width: 100%; border-radius: 8px;"></video>

## Code demo

```js
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
```

## Algorithm analysis

Selection sort is **not stable**: swapping the found minimum into place can jump it past other elements with an equal key, changing their relative order (e.g. sorting `[3a, 3b, 1]` by value, where `3a`/`3b` are equal-valued but distinguishable, leaves `3b` before `3a`). It sorts in place, needing only O(1) extra space, and is O(n²) in the best, average, **and** worst case — unlike insertion sort, an already-sorted input gets no speedup, because the inner loop always scans the entire remaining unsorted region to find the minimum. Its one real advantage is a bounded number of swaps: at most n-1, versus up to O(n²) for bubble or insertion sort, which matters when a swap is expensive relative to a comparison.
