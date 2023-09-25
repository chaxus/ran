class Heap {
  value: Array<number>;
  size: number;
  constructor(arr: Array<number> = []) {
    this.value = [...arr];
    this.size = arr.length;
    this.buildMaxHeap();
  }
  swap = (i: number, j: number) => {
    if (i === j) return;
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
    for (let i = Math.floor(this.size / 2); i >= 0; i--) {
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
 * @description: 堆排序
 * @param {Array} list
 * @return {Array}
 */
const heap = (list: Array<number>): Array<number> => {
  const { value } = new Heap(list);
  return value;
};

export default heap;
