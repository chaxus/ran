# Insert Sort

Stable sorting algorithm, because no matter what data is entered is O(n2) time complexity, so when it is used, the smaller the data size, the better. The advantage is that no additional memory space is taken up. It works by building an ordered sequence and, for unsorted data, scanning from back to front in the sorted sequence, finding the appropriate position and inserting it.

## Algorithm description

- Start with the first element, which can be considered to have been sorted;
- Take the next element and scan it from back to front in the already sorted sequence of elements;
- If the element (sorted) is larger than the new element, move the element to the next position;
- Repeat step 3 until you find a position where the sorted element is less than or equal to the new element;
- After inserting a new element into this position;
- Repeat Steps 2 to 5.

## GIF presentation

![Insert Sort](../../../../../assets/ranuts/sort/insert.gif)

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

Insertion sort in the implementation, usually use in-place sort (that is, only need to use O(1) of the additional space of the sort), so in the process of scanning from back to forward, the sorted elements need to be repeatedly moved backward step by step, to provide insertion space for the latest elements.
