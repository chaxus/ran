// 分隔符
export function isWhiteSpace(char: string): boolean {
  return char === ' ' || char === '\t' || char === '\n' || char === '\r'
}

// 字母
export function isAlpha(char: string): boolean {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
}

// 数字
export function isDigit(char: string): boolean {
  return char >= '0' && char <= '9'
}

// 下划线
export function isUnderline(char: string): boolean {
  return char === '_'
}
/**
 * @description: 判断是否是下一行
 * @param {number} code code = string.charCodeAt(index)
 * @return {boolean}
 */
export function isNewLine(code: number): boolean {
  return code === 10 || code === 13 || code === 0x2028 || code === 0x2029
}
