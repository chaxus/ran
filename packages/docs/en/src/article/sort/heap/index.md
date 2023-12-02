# Heap Sort

Heapsort (Heapsort) is a kind of sorting algorithm designed by using the heap data structure. A heap is an almost complete binary tree structure, but also satisfies the property of a heap: the key value or index of a child node is always less than (or greater than) its parent node.

## Algorithm description

- The initial sequence of keywords to be sorted (R1,R2... .Rn) builds a large top heap, which is the initial disordered region;
- Swap the top element R[1] with the last element R[n] to get a new unordered region (R1,R2,... Rn-1) and a new ordered region (Rn), satisfying R[1,2... n-1]&lt; =R[n];
- Since the new top R[1] may violate the nature of the heap after exchange, it is necessary to adjust the current disorder region (R1,R2,... Rn-1) adjusts to the new heap, then swaps R[1] again with the last element of the unordered area, giving a new unordered area (R1,R2... .Rn-2) and the new ordered region (RN-1,Rn). Repeat this process until the number of elements in the ordered area is n-1, then the sorting process is complete.
- Use large root piles in ascending order and small root piles in descending order

## GIF presentation

![Heap Sort](../../../../../assets/ranuts/sort/heap.gif)

## Code demonstration

```ts
class Heap {
  value: Array<number>;
  size: number;
  constructor(arr: Array<number> = []) {
    this.value = [...arr];
    this.size = arr.length;
    this.buildMaxHeap();
  }
  swap = (i: number, j: number) => {
    if (this.value[i] === this.value[j]) return;
    this.value[i] = this.value[i] ^ this.value[j];
    this.value[j] = this.value[i] ^ this.value[j];
    this.value[i] = this.value[i] ^ this.value[j];
  };
  heapHandler = (i: number) => {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;
    if (left < this.size && this.value[left] > this.value[largest]) {
      largest = left;
    }
    if (right < this.size && this.value[right] > this.value[largest]) {
      largest = right;
    }
    if (largest !== i) {
      this.swap(i, largest);
      this.heapHandler(largest);
    }
  };
  buildMaxHeap = () => {
    for (let i = this.size >> 1; i >= 0; i--) {
      this.heapHandler(i);
    }
    for (let i = this.size - 1; i >= 0; i--) {
      this.swap(0, i);
      this.size--;
      this.heapHandler(0);
    }
  };
}

/**
 * @description: Heap Sort
 * @param {Array} list
 * @return {Array}
 */
const heap = (list: Array<number>): Array<number> => {
  const { value } = new Heap(list);
  return value;
};
```
