# 堆排序（Heap Sort）

堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。

## 算法描述

- 将初始待排序关键字序列(R1,R2….Rn)构建成大顶堆，此堆为初始的无序区；
- 将堆顶元素R[1]与最后一个元素R[n]交换，此时得到新的无序区(R1,R2,……Rn-1)和新的有序区(Rn),且满足R[1,2…n-1]<=R[n]；
- 由于交换后新的堆顶R[1]可能违反堆的性质，因此需要对当前无序区(R1,R2,……Rn-1)调整为新堆，然后再次将R[1]与无序区最后一个元素交换，得到新的无序区(R1,R2….Rn-2)和新的有序区(Rn-1,Rn)。不断重复此过程直到有序区的元素个数为n-1，则整个排序过程完成。
- 升序用大根堆，降序用小根堆

## 动图演示

![插入排序](../../../../assets/ranuts/sort/insert.gif)

## 代码演示

```ts
const insert = (list: Array<string>): Array<string> => {
  const { length } = list
  for (let i = 1; i < length; i++) {
    let preIndex = i - 1
    const current = list[i]
    while (preIndex >= 0 && list[preIndex] > current) {
      list[preIndex + 1] = list[preIndex]
      preIndex--
    }
    list[preIndex + 1] = current
  }
  return list
}
```

## 算法分析

插入排序在实现上，通常采用in-place排序（即只需用到O(1)的额外空间的排序），因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。
