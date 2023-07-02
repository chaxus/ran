// import randomArray from "./randomArray"

class Heap {
  arr: Array<number>
  size: number
  constructor(arr: Array<number>) {
    this.arr = arr
    this.size = arr.length
    this.buildMaxHeap()
  }
  swap = (i: number, j: number) => {
    this.arr[i] = this.arr[i] ^ this.arr[j]
    this.arr[j] = this.arr[i] ^ this.arr[j]
    this.arr[i] = this.arr[i] ^ this.arr[j]
  }
  heapHandler = (i: number) => {
    const left = 2 * i + 1
    const right = 2 * i + 2
    let largest = i
    if (left < this.size && this.arr[left] > this.arr[largest]) {
      largest = left
    }
    if (right < this.size && this.arr[right] > this.arr[largest]) {
      largest = right
    }
    if (largest !== i) {
      this.swap(i, largest)
      this.heapHandler(largest)
    }
  }
  buildMaxHeap = () => {
    for (let i = Math.floor(this.size / 2); i >= 0; i--) {
      this.heapHandler(i)
    }
    for (let i = this.size; i >= 0; i--) {
      this.swap(0, i)
      this.size--
      this.heapHandler(0)
    }
  }
}

/**
 * @description: 堆排序
 * @param {Array} list
 * @return {Array}
 */
const heap = (list: Array<number>): Array<number> => {
  const { arr } = new Heap(list)
  return arr
}


export default heap
