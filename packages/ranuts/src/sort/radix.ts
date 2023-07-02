import count from '@/sort/count'
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

const a = radix([
  39, 1, 80, 28, 0, 19, 42, 37, 27, 93, 63, 65, 99, 31, 19, 72, 40, 20, 24, 89,
])
console.log('a', a)

export default radix
