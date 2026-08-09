# 选择排序（Selection Sort）

选择排序(Selection-sort)是一种简单直观的排序算法。它的工作原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

## 算法描述

n 个记录的直接选择排序可经过 n-1 趟直接选择排序得到有序结果。具体算法描述如下：

- 初始状态：无序区为 R[1..n]，有序区为空；
- 第 i 趟排序(i=1,2,3…n-1)开始时，当前有序区和无序区分别为 R[1..i-1]和 R(i..n）。该趟排序从当前无序区中-选出关键字最小的记录 R[k]，将它与无序区的第 1 个记录 R 交换，使 R[1..i]和 R[i+1..n)分别变为记录个数增加 1 个的新有序区和记录个数减少 1 个的新无序区；
- n-1 趟结束，数组有序化了。

## 动画演示

<video src="../../../../../assets/ranuts/sort/select.mp4" autoplay loop muted playsinline style="max-width: 100%; border-radius: 8px;"></video>

## 代码实现

```js
const select = (list: number[]): number[] => {
  const size = list.length;
  for (let i = 0; i < size; i++) {
    let minIndex = i;
    for (let j = i + 1; j < size; j++) {
      if (list[minIndex] >= list[j]) {
        minIndex = j;
      }
    }
    if (list[i] !== list[minIndex]) {
      list[i] = list[i] ^ list[minIndex];
      list[minIndex] = list[i] ^ list[minIndex];
      list[i] = list[i] ^ list[minIndex];
    }
  }
  return list;
};
```

## 算法分析

选择排序**不是稳定的**：把找到的最小值换到当前位置时，可能会跳过其他值相等的元素，改变它们的相对顺序（比如按值排序 `[3a, 3b, 1]`，`3a`/`3b` 值相等但可区分，排完后 `3b` 会跑到 `3a` 前面）。它是原地排序，只需要 O(1) 的额外空间，并且在最好、平均、**以及最坏**情况下都是 O(n²)——和插入排序不同，输入已经有序也不会变快，因为内层循环每次都要扫完剩下的整个无序区间才能找到最小值。它真正的优势是交换次数有上限：最多 n-1 次，远少于冒泡或插入排序最坏情况下的 O(n²) 次——在交换成本比比较成本高得多的场景下，这一点很重要。
