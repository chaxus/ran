# 桶排序 (Bucket Sort）

高效与否的关键在于这个分桶函数。将数据分到有限数量的桶里，每个桶再分别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排）。

## 算法描述

- 设置一个定量的数组当作空桶；
- 遍历输入数据，并且把数据一个一个放到对应的桶里去；
- 对每个不是空的桶进行排序；
- 从不是空的桶里把排好序的数据拼接起来。

## 代码演示

```ts
const count = (list: Array<number>, max: number = 100): Array<number> => {
  const countList = new Array(max + 1)
  for (let i = 0; i < list.length; i++) {
    if (!countList[list[i]]) {
      countList[list[i]] = 0
    }
    countList[list[i]]++
  }
  let startIndex = 0
  for (let i = 0; i < countList.length; i++) {
    while (countList[i] > 0) {
      list[startIndex++] = i
      countList[i]--
    }
  }
  return list
}
const getMax = (list: Array<number>) => {
  let max = list[0]
  for (let i = 0; i < list.length; i++) {
    if (max < list[i]) {
      max = list[i]
    }
  }
  return max
}
const getMin = (list: Array<number>) => {
  let min = list[0]
  for (let i = 0; i < list.length; i++) {
    if (min > list[i]) {
      min = list[i]
    }
  }
  return min
}

/**
 * @description: 桶排序
 * @param {Array<number>} list
 * @return {Array<number>}
 */
const bucket = (
  list: Array<number>,
  bucketSize: number = 5,
  max?: number,
  min?: number,
): Array<number> => {
  if (list.length === 0) return list
  if (!max) max = getMax(list)
  if (!min) min = getMin(list)
  const bucketCount = Math.floor((max - min) / bucketSize) + 1
  const buckets = new Array(bucketCount + 1).fill(0).map(() => new Array(0))

  for (let i = 0; i < list.length; i++) {
    buckets[Math.floor((list[i] - min) / bucketSize)].push(list[i])
  }
  list = []
  for (let i = 0; i < bucketCount; i++) {
    list = list.concat(count(buckets[i]))
  }
  return list
}
```

## 算法分析

桶排序最好情况下使用线性时间 O(n)，桶排序的时间复杂度，取决与对各个桶之间数据进行排序的时间复杂度，因为其它部分的时间复杂度都为 O(n)。很显然，桶划分的越小，各个桶之间的数据越少，排序所用的时间也会越少。但相应的空间消耗就会增大。
