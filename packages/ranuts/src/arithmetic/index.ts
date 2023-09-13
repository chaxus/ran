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
const reverseLeftWords = function (s: string, n: number) {
    return s.slice(n) + s.slice(0, n)
};

/**
 * @description: 剑指 Offer 20. 表示数值的字符串
 * @param {string} s
 * @return {boolean}
 */
const isNumber = function (s: string) {
    // 整数：[\+\-]?\d+ 
    // 小数：[\+\-]?(\d+\.|\d+\.\d+|\.\d+)
    // [eE][\+\-]?\d+ 
    return /^\s*(?:[+\-]?\d+|[+\-]?(?:\d+\.|\d+\.\d+|\.\d+))(?:[eE][+\-]?\d+)?\s*$/.test(s)
};

/**
 * @description: 剑指 Offer 67. 把字符串转换成整数
 * @param {string} str
 * @return {number}
 */
const strToInt = function (str: string) {
    const [item] = /^\s*([+\-]?\d+)/.exec(str) || [0]
    if (Number(item) >= Math.pow(2, 31) - 1) {
        return Math.pow(2, 31) - 1
    }
    if (Number(item) <= -Math.pow(2, 31)) {
        return -Math.pow(2, 31)
    }
    return item
};

// 链表
/**
 * @description: 剑指 Offer 06. 从尾到头打印链表
 * @param {ListNode} head
 * @return {Array<number>}
 */
interface ListNode {
    val: number,
    next: ListNode | null
}
const reversePrint = function (head: ListNode | null) {
    const result = []
    while (head) {
        result.unshift(head.val)
        head = head.next
    }
    return result
};

/**
 * @description: 剑指 Offer 24. 反转链表
 * @param {ListNode} head
 * @return {ListNode}
 */
const reverseList = function(head:ListNode | null) {
    // prev curr next
    let prev = null
    let curr = head
    while(curr){
        const next = curr.next
        curr.next = prev
        prev = curr
        curr = next
    }
    return prev
};