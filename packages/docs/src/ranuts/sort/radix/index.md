# 基数排序（Radix Sort）

基数排序是按照低位先排序，然后收集；再按照高位排序，然后再收集；依次类推，直到最高位。有时候有些属性是有优先级顺序的，先按低优先级排序，再按高优先级排序。最后的次序就是高优先级高的在前，高优先级相同的低优先级高的在前。桶排序扩展，类似于指定桶排序按位数排序规则，同时能利用计数排序适用于小范围数的特点。

## 算法描述

- 取得数组中的最大数，并取得位数；
- arr 为原始数组，从最低位开始取每个位组成 radix 数组；
- 对 radix 进行计数排序（利用计数排序适用于小范围数的特点）；

## 动图演示

![基数排序](../../../../assets/ranuts/sort/radix.gif)

## 代码演示

```ts
const getMax = (list: Array<number>) => {
  let max = list[0]
  for (let i = 0; i < list.length; i++) {
    if (max < list[i]) {
      max = list[i]
    }
  }
  return max
}
const getDigit = (num: number) => {
  let digit = 1
  while (num >= 1) {
    digit++
    num = num / 10
  }
  return digit
}
/**
 * @description: 基数排序
 * @param {Array<number>} list
 * @return {Array<number>}
 */
const radix = (list: Array<number>, maxDigit?: number): Array<number> => {
  if (list.length === 0) return list
  if (!maxDigit) maxDigit = getDigit(getMax(list))
  const buckets = new Array(maxDigit).fill(0).map(() => new Array(0))
  for (let j = 0; j < list.length; j++) {
    const digit = getDigit(list[j])
    buckets[digit - 1].push(list[j])
  }
  list = []
  for (let i = 0; i < buckets.length; i++) {
    list = list.concat(count(buckets[i]))
  }
  return list
}
```

## 算法分析

基数排序基于分配排序，所以是稳定的。但基数排序的性能比桶排序要略差，每一次关键字的桶分配都需要 O(n)的时间复杂度，而且分配之后得到新的关键字序列又需要 O(n)的时间复杂度。假如待排数据可以分为 d 个关键字，则基数排序的时间复杂度将是 O(d\*2n) ，当然 d 要远远小于 n，因此基本上还是线性级别的。

基数排序的空间复杂度为 O(n+k)，其中 k 为桶的数量。一般来说 n>>k，因此额外空间需要大概 n 个左右。
