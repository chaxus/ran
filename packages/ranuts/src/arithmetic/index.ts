/*
 * @Author: chaxus nouo18@163.com
 * @Date: 2023-09-14 21:21:31
 * @LastEditors: chaxus nouo18@163.com
 * @LastEditTime: 2023-12-18 00:05:29
 * @FilePath: /ran/packages/ranuts/src/arithmetic/index.ts
 * @Description: 字符串 string
 * @Description: 链表
 * @Description: 二叉树
 * @Description: 双指针
 * @Description: 排序
 */
interface ListNode {
  val: number;
  next: ListNode | null;
}

interface HeadNode {
  val: string;
  next?: HeadNode;
  random?: HeadNode;
}

interface TreeNode {
  val: number;
  left?: TreeNode;
  right?: TreeNode;
}

// 字符串 string

/**
 * @description: 请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
 * @param {string} s
 * @return {string}
 */
const replaceSpace = function (s: string) {
  return s.split(' ').join('%20');
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
  return s.slice(n) + s.slice(0, n);
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
  return /^\s*(?:[+\-]?\d+|[+\-]?(?:\d+\.|\d+\.\d+|\.\d+))(?:[eE][+\-]?\d+)?\s*$/.test(s);
};

/**
 * @description: 剑指 Offer 67. 把字符串转换成整数
 * @param {string} str
 * @return {number}
 */
const strToInt = function (str: string) {
  const [item] = /^\s*([+\-]?\d+)/.exec(str) || [0];
  if (Number(item) >= Math.pow(2, 31) - 1) {
    return Math.pow(2, 31) - 1;
  }
  if (Number(item) <= -Math.pow(2, 31)) {
    return -Math.pow(2, 31);
  }
  return item;
};

// 链表
/**
 * @description: 剑指 Offer 06. 从尾到头打印链表
 * @param {ListNode} head
 * @return {Array<number>}
 */

const reversePrint = function (head: ListNode | null) {
  const result = [];
  while (head) {
    result.unshift(head.val);
    head = head.next;
  }
  return result;
};

/**
 * @description: 剑指 Offer 24. 反转链表
 * @param {ListNode} head
 * @return {ListNode}
 */
const reverseList = function (head: ListNode | null) {
  // prev curr next
  let prev = null;
  let curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
};
/**
 * @description: 剑指 Offer 35. 复杂链表的复制
 * @param {*} head
 * @param {*} cacheNode
 * @return {*}
 */

const copyRandomList = function (head?: HeadNode, cacheNode = new Map()) {
  if (head == null) {
    return null;
  }
  if (!cacheNode.get(head)) {
    cacheNode.set(head, { val: head.val });
    Object.assign(cacheNode.get(head), {
      next: copyRandomList(head.next, cacheNode),
      random: copyRandomList(head.random, cacheNode),
    });
  }
  return cacheNode.get(head);
};

// 二叉树

/**
 * @description: 二叉树的前序遍历
 * @return {*}
 */
const preOrderTraversal = (root?: TreeNode, res: Array<number> = []) => {
  if (!root) return;
  res.push(root.val);
  preOrderTraversal(root.left, res);
  preOrderTraversal(root.right, res);
  return res;
};

/**
 * @description: 二叉树的中序遍历
 * @return {*}
 */
const inOrderTraversal = (root?: TreeNode, res: Array<number> = []) => {
  if (!root) return;
  preOrderTraversal(root.left, res);
  res.push(root.val);
  preOrderTraversal(root.right, res);
  return res;
};

/**
 * @description: 二叉树的后序遍历
 * @return {*}
 */
const postOrderTraversal = (root?: TreeNode, res: Array<number> = []) => {
  if (!root) return;
  preOrderTraversal(root.left, res);
  preOrderTraversal(root.right, res);
  res.push(root.val);
  return res;
};

/**
 * @description: 二叉树的层序遍历
 * @return {*}
 */
const leverOrderTraversal = (root?: TreeNode, res: Array<number> = []) => {
  if (!root) return;
  preOrderTraversal(root.left, res);
  preOrderTraversal(root.right, res);
  res.push(root.val);
  return res;
};

// 双指针

/**
 * @description: 剑指 Offer 18. 删除链表的节点
 * @param {ListNode} head
 * @param {number} val
 * @return {*}
 */
const deleteNode = function (head: ListNode, val: number) {
  let prev = head;
  let cur = head.next;
  if (head.val === val) {
    head.next = null;
    return cur;
  }
  while (cur) {
    if (cur.val === val) {
      prev.next = cur.next;
      break;
    } else {
      prev = cur;
      cur = cur.next;
    }
  }
  return head;
};
/**
 * @description: 剑指 Offer 22. 链表中倒数第k个节点
 * @param {ListNode} head
 * @param {number} k
 * @return {*}
 */
const getKthFromEnd = function (head: ListNode, k: number) {
  let pre: ListNode | null = head;
  let cur: ListNode | null = head;
  while (cur) {
    if (k <= 0) {
      pre = pre?.next || null;
    } else {
      k--;
    }
    cur = cur.next;
  }
  return pre;
};
/**
 * @description: 剑指 Offer 25. 合并两个排序的链表
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {*}
 */
const mergeTwoLists = function (l1: ListNode | null, l2: ListNode | null) {
  if (l1 == null) {
    return l2;
  } else if (l2 == null) {
    return l1;
  } else if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};
/**
 * @description: 剑指 Offer 52. 两个链表的第一个公共节点
 * @param {*} headA
 * @param {*} headB
 * @return {*}
 */
const getIntersectionNode = function (headA: ListNode | null, headB: ListNode | null) {
  if (headA === null || headB === null) {
    return null;
  }
  let p1: ListNode | null = headA,
    p2: ListNode | null = headB;
  while (p1 !== p2) {
    p1 = p1 === null ? headB : p1.next;
    p2 = p2 === null ? headA : p2.next;
  }
  return p1;
};
/**
 * @description: 剑指 Offer 21. 调整数组顺序使奇数位于偶数前面
 * @param {*} nums
 * @return {*}
 */
const exchange = function (nums: Array<number>) {
  let left = 0,
    right = nums.length - 1;
  while (left < right) {
    while (left < right && nums[left] % 2 === 1) {
      left++;
    }
    while (left < right && nums[right] % 2 === 0) {
      right--;
    }
    if (left < right) {
      nums[left] = nums[left] ^ nums[right];
      nums[right] = nums[left] ^ nums[right];
      nums[left] = nums[left] ^ nums[right];
      left++;
      right--;
    }
  }
  return nums;
};
/**
 * @description: 剑指 Offer 57. 和为s的两个数字
 * @param {Array} nums
 * @param {number} target
 * @return {*}
 */
const twoSum = function (nums: Array<number>, target: number) {
  let l = 0,
    r = nums.length - 1;
  while (l < r) {
    if (nums[l] + nums[r] === target) return [nums[l], nums[r]];
    if (nums[l] + nums[r] > target) {
      r--;
    } else {
      l++;
    }
  }
  return [];
};

// 排序
export class MinHeap {
  value: Array<number>;
  size: number;
  constructor(arr: Array<number>) {
    this.value = [...arr];
    this.size = this.value.length;
    this.buildMaxHeap();
  }
  private swap = (i: number, j: number) => {
    if (i === j) return;
    this.value[i] = this.value[i] ^ this.value[j];
    this.value[j] = this.value[i] ^ this.value[j];
    this.value[i] = this.value[i] ^ this.value[j];
  };
  /**
   * @description: 自上而下的调整，比较当前节点和子节点的大小
   * @param {number} i 父节点
   * @return {*}
   */
  private heapHandler = (i: number) => {
    // i 是当前节点，left 和 right 是左节点和右节点
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;
    if (left < this.size && this.value[left] > this.value[largest]) {
      largest = left;
    }
    if (right < this.size && this.value[right] > this.value[largest]) {
      largest = right;
    }
    if (largest !== i) {
      this.swap(i, largest);
      this.heapHandler(largest);
    }
  };
  /**
   * @description: 自下而上的调整
   * @param {number} i
   * @return {*}
   */
  private heapHand = (i: number) => {
    let largest = i;
    if (i % 2 === 0) {
      largest = (i - 2) / 2;
    } else {
      largest = (i - 1) / 2;
    }
    if (this.value[largest] < this.value[i]) {
      this.swap(i, largest);
    }
    if (largest > 0) {
      this.heapHandler(largest);
    }
  };
  /**
   * @description: 堆排序
   * @return {*}
   */
  private buildMaxHeap = () => {
    for (let i = Math.floor(this.size / 2); i >= 0; i--) {
      this.heapHandler(i);
    }
    for (let i = this.size - 1; i >= 0; i--) {
      this.swap(0, i);
      this.size--;
      this.heapHandler(0);
    }
    this.size = this.value.length;
  };
  /**
   * @description: 插入
   * @param {number} item
   * @return {*}
   */
  insert = (item: number): Array<number> => {
    this.value.push(item);
    this.size = this.value.length;
    this.heapHand(this.size - 1);
    return this.value;
  };
  /**
   * @description: 查找，返回索引 index
   * @param {number} item
   * @return {*}
   */
  select = (item: number): number => {
    if (this.value.length <= 0) return -1;
    return 0;
  };
  delete = (): Array<number> => {
    return this.value;
  };
  /**
   * @description: 堆的调整
   * @return {*}
   */
  sort = (): Array<number> => {
    this.buildMaxHeap();
    return this.value;
  };
}

/**
 * @description: 912. 排序数组--堆排序
 * @param {Array} list
 * @return {Array}
 */
export const heap = (list: Array<number>): Array<number> => {
  const { value } = new MinHeap(list);
  return value;
};

// 手写promise

const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

class CustomPromise {
  status: string;
  successValue: unknown;
  failValue: unknown;
  onResolvedCallbacks: Function[];
  onRejectedCallbacks: Function[];
  constructor(cb: unknown) {
    // 初始化状态
    this.status = PENDING;
    // 初始化成功的值
    this.successValue = undefined;
    // 初始化失败的值
    this.failValue = undefined;
    // 存储成功状态的回调函数
    this.onResolvedCallbacks = [];
    // 存储失败状态的回调函数
    this.onRejectedCallbacks = [];
    const resolve = (value: unknown) => {
      if (this.status === PENDING) {
        this.status = RESOLVED;
        this.successValue = value;
        this.onResolvedCallbacks.forEach((cb) => cb());
      }
    };
    const reject = (value: unknown) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.failValue = value;
        this.onRejectedCallbacks.forEach((cb) => cb());
      }
    };
    // 调用回调函数，将 resolve 和 reject 传递给它
    if (typeof cb === 'function') {
      cb(resolve, reject);
    }
  }
  then = (r: unknown, j: unknown) => {
    return new CustomPromise((resolve: Function, reject: Function) => {
      if (this.status === RESOLVED) {
        try {
          if (typeof r === 'function') {
            resolve(r());
          }
        } catch (error) {
          reject(error);
        }
      }
      if (this.status === REJECTED) {
        try {
          if (typeof j === 'function') {
            resolve(j());
          }
        } catch (error) {
          reject(error);
        }
      }
      if (this.status === PENDING) {
        if (typeof r === 'function') {
          this.onResolvedCallbacks.push(() => {
            try {
              resolve(r(this.successValue));
            } catch (error) {
              reject(error);
            }
          });
        }
        if (typeof j === 'function') {
          this.onRejectedCallbacks.push(() => {
            try {
              resolve(j(this.failValue));
            } catch (error) {
              reject(error);
            }
          });
        }
      } else {
        // 存储成功状态的回调函数
        this.onResolvedCallbacks = [];
        // 存储失败状态的回调函数
        this.onRejectedCallbacks = [];
      }
    });
  };
  catch = (r: Function) => {
    return this.then(undefined, r);
  };
}
/**
 * @description: 自定义 call
 * @return {*}
 */
const CustomCall = () => {
  (Function.prototype as any).CustomCall = function (ctx: any) {
    if (typeof this !== 'function') {
      throw new Error('is not func');
    }
    const context = ctx || window;
    const args = [...arguments].slice(1);
    context.fn = this;
    const result = context.fn(...args);
    delete context.fn;
    return result;
  };
};

export const curry = (fn: Function, ...args: unknown[]): Function => {
  const recursion = (...args: unknown[]) => {
    return fn.length <= args.length ? fn(...args) : (...arg: unknown[]) => recursion(...args, ...arg);
  };
  return recursion(...args);
};
