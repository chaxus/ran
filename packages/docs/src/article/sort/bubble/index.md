# Bubble Sort

Bubble sort is a simple sort algorithm. It repeatedly visits the sequence to be sorted, comparing two elements at a time and swapping them if they are in the wrong order. The work of visiting the sequence is repeated until no more exchanges are needed, that is, the sequence has been sorted. The algorithm gets its name from the fact that smaller elements slowly "float" to the top of the sequence through exchange.

## Algorithm description

- Compare adjacent elements. If the first one is bigger than the second, swap them both;
- Do the same for each pair of adjacent elements, from the first pair at the beginning to the last pair at the end, so that the last element should be the largest;
- Repeat the above steps for all elements except the last one;
- Repeat steps 1 to 3 until the sorting is complete.

## GIF presentation

![Bubble Sort](../../../../assets/ranuts/sort/bubble.gif)

## Code demo

```ts
const bubble = (list: number[]) => {
  const size = list.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (list[i] < list[j]) {
        list[i] = list[i] ^ list[j];
        list[j] = list[i] ^ list[j];
        list[i] = list[i] ^ list[j];
      }
    }
  }
  return list;
};
```
