// 字符串 string
/**
 * @description: 请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
 * @param {string} s
 * @return {string}
 */
const replaceSpace = function (s: string) {
    return s.split(' ').join('%20')
};
/**
 * @description: 左旋转字符串
 * 字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。
 * 请定义一个函数实现字符串左旋转操作的功能。
 * 比如，输入字符串"abcdefg"和数字2，该函数将返回左旋转两位得到的结果"cdefgab"。
 * @param {*} s
 * @param {*} n
 * @return {*}
 */
const reverseLeftWords = function(s:string, n:number) {
    return s.slice(n) + s.slice(0,n)
};
