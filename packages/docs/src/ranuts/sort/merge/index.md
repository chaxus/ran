# 归并排序（Merge Sort）

归并排序是建立在归并操作上的一种有效的排序算法。该算法是采用分治法（Divide and Conquer）的一个非常典型的应用。将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为 2-路归并。

## 算法描述

- 把长度为 n 的输入序列分成两个长度为 n/2 的子序列；
- 对这两个子序列分别采用归并排序；
- 将两个排序好的子序列合并成一个最终的排序序列。

## 动图演示

![归并排序](../../../../assets/ranuts/sort/merge.gif)

## 代码演示

```ts
const combine = (left: Array<number>, right: Array<number>) => {
  const list: Array<number> = []
  while (left.length > 0 && right.length > 0) {
    if (left[0] <= right[0]) {
      list.push(left.shift() as number)
    } else {
      list.push(right.shift() as number)
    }
  }

  while (left.length) {
    list.push(left.shift() as number)
  }
  while (right.length) {
    list.push(right.shift() as number)
  }
  return list
}
/**
 * @description: 归并排序
 * @param {Array} list
 * @return {Array}
 */
const merge = (list: Array<number>): Array<number> => {
  const { length } = list
  if (length < 2) {
    return list
  }
  const middle = Math.floor(length / 2)
  const left = list.slice(0, middle)
  const right = list.slice(middle)
  return combine(merge(left), merge(right))
}
```

## 算法分析

归并排序是一种稳定的排序方法。和选择排序一样，归并排序的性能不受输入数据的影响，但表现比选择排序好的多，因为始终都是 O(nlogn）的时间复杂度。代价是需要额外的内存空间。
