# Insert Sort

Stable sorting algorithm, because no matter what data is entered is O(n2) time complexity, so when it is used, the smaller the data size, the better. The advantage is that no additional memory space is taken up. It works by building an ordered sequence and, for unsorted data, scanning from back to front in the sorted sequence, finding the appropriate position and inserting it.

## Algorithm description

- Start with the first element, which can be considered to have been sorted;
- Take the next element and scan it from back to front in the already sorted sequence of elements;
- If the element (sorted) is larger than the new element, move the element to the next position;
- Repeat step 3 until you find a position where the sorted element is less than or equal to the new element;
- After inserting a new element into this position;
- Repeat Steps 2 to 5.

## Animation

<video src="../../../../assets/ranuts/sort/insert.mp4" autoplay loop muted playsinline style="max-width: 100%; border-radius: 8px;"></video>

## Code demo

```ts
const insert = (list: number[]): number[] => {
  const size = list.length;
  for (let i = 1; i < size; i++) {
    const current = list[i];
    let preIndex = i - 1;
    while (preIndex >= 0 && list[preIndex] > current) {
      list[preIndex + 1] = list[preIndex];
      preIndex--;
    }
    list[preIndex + 1] = current;
  }
  return list;
};
```

## Algorithm analysis

Insertion sort is stable — the `while` loop only shifts elements strictly greater than `current`, so equal elements never cross — and sorts in place, needing only O(1) extra space. Its time complexity is O(n²) on average and in the worst case (a reverse-sorted input), but this implementation's `while` loop exits immediately when `list[preIndex]` is no longer greater than `current`, so an already-sorted (or nearly sorted) input runs in close to O(n) with no extra flag needed — unlike this page's bubble sort implementation, which always runs the full O(n²) regardless of input order.
