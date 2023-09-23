import { describe, expect, it } from 'vitest';
import randomArray from '../src/sort/randomArray';
import { MinHeap } from '../src/arithmetic/index';

describe('Heap', () => {
  it('Heap sort', () => {
    const list = randomArray(20);
    const { value } = new MinHeap(list);
    expect(value).toEqual([...list].sort((a, b) => a - b));
  });
});
