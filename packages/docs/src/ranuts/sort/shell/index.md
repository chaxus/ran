# 希尔排序（Shell Sort）

1959 年 Shell 发明，第一个突破 O(n2)的排序算法，是简单插入排序的改进版。它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫缩小增量排序。

## 算法描述

先将整个待排序的记录序列分割成为若干子序列分别进行直接插入排序，具体算法描述：

- 选择一个增量序列 t1，t2，…，tk，其中 ti>tj，tk=1；
- 按增量序列个数 k，对序列进行 k 趟排序；
- 每趟排序，根据对应的增量 ti，将待排序列分割成若干长度为 m 的子序列，分别对各子表进行直接插入排序。仅增量因子为 1 时，整个序列作为一个表来处理，表长度即为整个序列的长度。

## 动图演示

![希尔排序](../../../../assets/ranuts/sort/shell.gif)

## 代码实现

```js
/**
 * @description: 希尔排序，是简单插入排序的改进版。它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫缩小增量排序。
 * @param {Array} list
 * @return {Array}
 */
const shell = (list: Array<number>): Array<number> => {
  const { length } = list
  for (let gap = Math.floor(length / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < length; i++) {
      let j = i
      const current = list[i]
      while (j - gap >= 0 && current < list[j - gap]) {
        list[j] = list[j - gap]
        j = j - gap
      }
      list[j] = current
    }
  }
  return list
}
```

## 算法分析

希尔排序的核心在于间隔序列的设定。既可以提前设定好间隔序列，也可以动态的定义间隔序列。动态定义间隔序列的算法是《算法（第 4 版）》的合著者 Robert Sedgewick 提出的。
