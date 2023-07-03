# 插入排序（Insert Sort）

表现稳定的排序算法，因为无论什么数据进去都是 O(n2)的时间复杂度，所以用到它的时候，数据规模越小越好。优点是不占用额外的内存空间。工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

## 算法描述

- 从第一个元素开始，该元素可以认为已经被排序；
- 取出下一个元素，在已经排序的元素序列中从后向前扫描；
- 如果该元素（已排序）大于新元素，将该元素移到下一位置；
- 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置；
- 将新元素插入到该位置后；
- 重复步骤 2~5。

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

插入排序在实现上，通常采用 in-place 排序（即只需用到 O(1)的额外空间的排序），因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间。
