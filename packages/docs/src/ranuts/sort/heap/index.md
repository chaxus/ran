# 堆排序（Heap Sort）

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。

## 算法描述

- 将初始待排序关键字序列(R1,R2….Rn)构建成大顶堆，此堆为初始的无序区；
- 将堆顶元素 R[1]与最后一个元素 R[n]交换，此时得到新的无序区(R1,R2,……Rn-1)和新的有序区(Rn),且满足 R[1,2…n-1]<=R[n]；
- 由于交换后新的堆顶 R[1]可能违反堆的性质，因此需要对当前无序区(R1,R2,……Rn-1)调整为新堆，然后再次将 R[1]与无序区最后一个元素交换，得到新的无序区(R1,R2….Rn-2)和新的有序区(Rn-1,Rn)。不断重复此过程直到有序区的元素个数为 n-1，则整个排序过程完成。
- 升序用大根堆，降序用小根堆

## 动图演示

![堆排序](../../../../assets/ranuts/sort/heap.gif)

## 代码演示

```ts
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
```
