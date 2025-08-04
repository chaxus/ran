/**
 * @description: 冒泡排序，两两比较，交换位置，遍历 n^2
 * @param {Array} list
 * @return {Array}
 */
const bubble = (list: number[]): number[] => {
 const size = list.length;
 for (let i = 0; i < size - 1; i++) {
   for (let j = 0; j < size - i - 1; j++) {
     if (list[j] > list[j + 1]) {
       // 交换位置
       [list[j], list[j + 1]] = [list[j + 1], list[j]];
     }
   }
 }
 return list;
};

export default bubble;
