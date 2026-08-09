# 插入排序（Insert Sort）

表现稳定的排序算法，因为无论什么数据进去都是 O(n2) 的时间复杂度，所以用到它的时候，数据规模越小越好。优点是不占用额外的内存空间。工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。

## 算法描述

- 从第一个元素开始，该元素可以认为已经被排序；
- 取出下一个元素，在已经排序的元素序列中从后向前扫描；
- 如果该元素（已排序）大于新元素，将该元素移到下一位置；
- 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置；
- 将新元素插入到该位置后；
- 重复步骤 2~5。

## 动画演示

<video src="../../../../../assets/ranuts/sort/insert.mp4" autoplay loop muted playsinline style="max-width: 100%; border-radius: 8px;"></video>

## 代码演示

```ts
const insert = (list: number[]): number[] => {
  const size = list.length;
  for (let i = 1; i < size; i++) {
    const current = list[i];
    let preIndex = i - 1;
    while (preIndex >= 0 && list[preIndex] > current) {
      list[preIndex + 1] = list[preIndex];
      preIndex--;
    }
    list[preIndex + 1] = current;
  }
  return list;
};
```

## 算法分析

插入排序是稳定的——`while` 循环只会移动严格大于 `current` 的元素，相等的元素不会被换过顺序——并且是原地排序，只需要 O(1) 的额外空间。平均和最坏情况（逆序输入）下时间复杂度是 O(n²)，但这份实现的 `while` 循环一旦 `list[preIndex]` 不再大于 `current` 就会立刻退出，所以输入已经有序（或接近有序）时几乎是 O(n)，不需要额外加标志位——这一点跟本页冒泡排序的实现不同，冒泡排序无论输入是否有序都会跑完整个 O(n²)。
