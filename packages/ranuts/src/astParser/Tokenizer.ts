import { isAlpha, isDigit, isUnderline, isWhiteSpace } from './utils'

// 词法分析器，将代码划分为一个个词法单元，便于进行后续的语法分析
// 本质上是对代码字符串进行逐个字符的扫描，然后根据一定的语法规则进行分组。
/**
 * @description: 声明一些必要的类型
 */
export enum TokenType {
  Let = 'Let',
  Const = 'Const',
  Var = 'Var',
  Assign = 'Assign',
  Function = 'Function',
  Class = 'Class',
  Number = 'Number',
  Operator = 'Operator',
  Identifier = 'Identifier',
  LeftParen = 'LeftParen',
  RightParen = 'RightParen',
  LeftCurly = 'LeftCurly',
  RightCurly = 'RightCurly',
  Comma = 'Comma',
  Dot = 'Dot',
  Semicolon = 'Semicolon',
  StringLiteral = 'StringLiteral',
  Return = 'Return',
  Import = 'Import',
  Export = 'Export',
  Default = 'Default',
  From = 'From',
  As = 'As',
  Asterisk = 'Asterisk',
}

// 扫描模式
export enum ScanMode {
  Normal,
  Identifier, // 扫描标识符，单词
  StringLiteral,
  Number,
}

// 词法分析，token的类型，值，开始位置，结束位置，文本
export type Token = {
  type: TokenType
  value?: string
  start: number
  end: number
  raw?: string
}

// 策略模式
// Token 的生成器对象，关键词的映射
const TOKENS_GENERATOR: Record<string, (...args: any[]) => Token> = {
  let(start: number) {
    return { type: TokenType.Let, value: 'let', start, end: start + 3 }
  },
  const(start: number) {
    return { type: TokenType.Const, value: 'const', start, end: start + 5 }
  },
  var(start: number) {
    return { type: TokenType.Var, value: 'var', start, end: start + 3 }
  },
  assign(start: number) {
    return { type: TokenType.Assign, value: '=', start, end: start + 1 }
  },
  import(start: number) {
    return {
      type: TokenType.Import,
      value: 'import',
      start,
      end: start + 6,
    }
  },
  export(start: number) {
    return {
      type: TokenType.Export,
      value: 'export',
      start,
      end: start + 6,
    }
  },
  from(start: number) {
    return {
      type: TokenType.From,
      value: 'from',
      start,
      end: start + 4,
    }
  },
  as(start: number) {
    return {
      type: TokenType.As,
      value: 'as',
      start,
      end: start + 2,
    }
  },
  asterisk(start: number) {
    return {
      type: TokenType.Asterisk,
      value: '*',
      start,
      end: start + 1,
    }
  },
  default(start: number) {
    return {
      type: TokenType.Default,
      value: 'default',
      start,
      end: start + 7,
    }
  },
  number(start: number, value: string) {
    return {
      type: TokenType.Number,
      value,
      start,
      end: start + value.length,
      raw: value,
    }
  },
  class(start: number) {
    return {
      type: TokenType.Class,
      value: 'class',
      start,
      end: start + 5,
    }
  },
  function(start: number) {
    return {
      type: TokenType.Function,
      value: 'function',
      start,
      end: start + 8,
    }
  },
  return(start: number) {
    return {
      type: TokenType.Return,
      value: 'return',
      start,
      end: start + 6,
    }
  },
  operator(start: number, value: string) {
    return {
      type: TokenType.Operator,
      value,
      start,
      end: start + value.length,
    }
  },
  comma(start: number) {
    return {
      type: TokenType.Comma,
      value: ',',
      start,
      end: start + 1,
    }
  },
  leftParen(start: number) {
    return { type: TokenType.LeftParen, value: '(', start, end: start + 1 }
  },
  rightParen(start: number) {
    return { type: TokenType.RightParen, value: ')', start, end: start + 1 }
  },
  leftCurly(start: number) {
    return { type: TokenType.LeftCurly, value: '{', start, end: start + 1 }
  },
  rightCurly(start: number) {
    return { type: TokenType.RightCurly, value: '}', start, end: start + 1 }
  },
  dot(start: number) {
    return { type: TokenType.Dot, value: '.', start, end: start + 1 }
  },
  semicolon(start: number) {
    return { type: TokenType.Semicolon, value: ';', start, end: start + 1 }
  },
  stringLiteral(start: number, value: string, raw: string) {
    return {
      type: TokenType.StringLiteral,
      value,
      start,
      end: start + value.length + 2,
      raw,
    }
  },
  identifier(start: number, value: string) {
    return {
      type: TokenType.Identifier,
      value,
      start,
      end: start + value.length,
    }
  },
}

// 单字符token
type SingleCharTokens = '(' | ')' | '{' | '}' | '.' | ';' | ',' | '*' | '='

// 单字符到 Token 生成器的映射
const KNOWN_SINGLE_CHAR_TOKENS = new Map<
  SingleCharTokens,
  typeof TOKENS_GENERATOR[keyof typeof TOKENS_GENERATOR]
>([
  ['(', TOKENS_GENERATOR.leftParen],
  [')', TOKENS_GENERATOR.rightParen],
  ['{', TOKENS_GENERATOR.leftCurly],
  ['}', TOKENS_GENERATOR.rightCurly],
  ['.', TOKENS_GENERATOR.dot],
  [';', TOKENS_GENERATOR.semicolon],
  [',', TOKENS_GENERATOR.comma],
  ['*', TOKENS_GENERATOR.asterisk],
  ['=', TOKENS_GENERATOR.assign],
])
// 引号token
const QUOTATION_TOKENS = ["'", '"', '`']
// 操作符token
const OPERATOR_TOKENS = [
  '+',
  '-',
  '*',
  '/',
  '%',
  '^',
  '&',
  '|',
  '~',
  '<<',
  '>>',
]

/**
 * @description: 词法分析器，分词器
 * 在扫描字符的过程，我们需要对不同的字符各自进行不同的处理，具体的策略如下：
 * 1. 当前字符为分隔符，如空格，直接跳过，不处理；
 * 2. 当前字符为字母，需要继续扫描，获取完整的单词:
 *  如果单词为语法关键字，则新建相应关键字的 Token
 *  否则视为普通的变量名
 * 3. 当前字符为单字符，如{、}、(、)，则新建单字符对应的 Token
 */
export class Tokenizer {
  private _tokens: Token[] = [] // 最终返回的结果，tokens数组
  private _currentIndex: number = 0 // 扫描当前代码片段的位置
  private _source: string // 当前传入的代码片段
  private _scanMode = ScanMode.Normal // 扫描模式，对不同的类型做不同的操作
  /**
   * @description: 参数是代码片段
   * @param {string} input
   */
  constructor(input: string) {
    this._source = input // 获取源代码
  }
  /**
 * @description: 主程序，扫描字符串生成 token
 */
  tokenize(): Token[] {
    // 扫描
    while (this._currentIndex < this._source.length) {
      const currentChar = this._source[this._currentIndex]
      const startIndex = this._currentIndex
      // 1. 判断是否是分隔符
      if (isWhiteSpace(currentChar)) {
        this._currentIndex++
        continue
      }
      // 2. 判断是否是字母
      else if (isAlpha(currentChar)) {
        // 扫描标识符
        this.scanIdentifier()
        continue
      }
      // 3. 判断是否是单字符 () {} . ; *
      else if (KNOWN_SINGLE_CHAR_TOKENS.has(currentChar as SingleCharTokens)) {
        // * 字符特殊处理
        if (currentChar === '*') {
          // 前瞻，如果是非 import/export，则认为是二元运算符，避免误判
          const previousToken = this._getPreviousToken()
          if (previousToken.type !== TokenType.Import && previousToken.type !== TokenType.Export) {
            this._tokens.push(TOKENS_GENERATOR.operator(startIndex, currentChar))
            this._currentIndex++
            continue
          }
          // 否则按照 import/export 中的 * 处理
        }
        const token = KNOWN_SINGLE_CHAR_TOKENS.get(currentChar as SingleCharTokens)!(startIndex)
        this._tokens.push(token)
        this._currentIndex++
      }
      // 4. 判断是否为引号
      else if (QUOTATION_TOKENS.includes(currentChar)) {
        // 如果是引号，就去扫描字符串变量
        this.scanStringLiteral()
        // 跳过结尾的引号
        this._currentIndex++
        continue
      }
      // 5. 判断二元计算符
      else if (OPERATOR_TOKENS.includes(currentChar) && this._scanMode === ScanMode.Normal) {
        this._tokens.push(TOKENS_GENERATOR.operator(startIndex, currentChar))
        this._currentIndex++
        continue
      } else if (OPERATOR_TOKENS.includes(currentChar + this._getNextChar()) && this._scanMode === ScanMode.Normal) {
        this._tokens.push(TOKENS_GENERATOR.operator(startIndex, currentChar + this._getNextChar()))
        this._currentIndex += 2
        continue
      }
      // 6. 判断数字
      else if (isDigit(currentChar)) {
        this._scanNumber()
        continue
      }
    }
    this._resetCurrentIndex()
    // 返回结果 token 数组
    return this._getTokens()
  }
  /**
   * @description: 设置扫描的模式
   * @param {ScanMode} mode
   */
  private _setScanMode(mode: ScanMode) {
    this._scanMode = mode
  }
  /**
   * @description: 将扫描模式重置成普通模式
   */
  private _resetScanMode() {
    this._scanMode = ScanMode.Normal
  }
  // 扫描标识符
  scanIdentifier(): void {
    this._setScanMode(ScanMode.Identifier)
    // 继续扫描，直到收集完整的单词
    let identifier = ''
    let currentChar = this._getCurrentChar()
    const startIndex = this._currentIndex
    // 如果是字母，数字，下划线，收集成字符
    while (
      isAlpha(currentChar) ||
      isDigit(currentChar) ||
      isUnderline(currentChar)
    ) {
      identifier += currentChar
      this._currentIndex++
      currentChar = this._getCurrentChar()
    }
    let token
    // 1. 结果为关键字
    if (identifier in TOKENS_GENERATOR) {
      token = TOKENS_GENERATOR[identifier as keyof typeof TOKENS_GENERATOR](startIndex)
    }
    // 2. 结果为标识符
    else {
      token = TOKENS_GENERATOR['identifier'](startIndex, identifier)
    }
    // 词法分析加入this._tokens
    this._tokens.push(token)
    this._resetScanMode()
  }
  // 扫描字符串变量
  scanStringLiteral(): void {
    this._setScanMode(ScanMode.StringLiteral)
    const startIndex = this._currentIndex
    let currentChar = this._getCurrentChar()
    // 记录引号
    const startQuotation = currentChar
    // 继续找字符串
    this._currentIndex++
    let str = ''
    currentChar = this._getCurrentChar()
    while (currentChar && currentChar !== startQuotation) {
      str += currentChar
      this._currentIndex++
      currentChar = this._getCurrentChar()
    }
    const token = TOKENS_GENERATOR.stringLiteral(
      startIndex,
      str,
      `${startQuotation}${str}${startQuotation}`,
    )
    // 词法分析加入this._tokens
    this._tokens.push(token)
    this._resetScanMode()
  }
  // 扫描数字
  _scanNumber(): void {
    this._setScanMode(ScanMode.Number)
    const startIndex = this._currentIndex
    let number = ''
    let currentChar = this._getCurrentChar()
    let isFloat = false
    // 如果是数字，则继续扫描
    // 需要考虑到小数点
    while (isDigit(currentChar) || (currentChar === '.' && !isFloat)) {
      if (currentChar === '.') {
        isFloat = true
      }
      number += currentChar
      this._currentIndex++
      currentChar = this._getCurrentChar()
    }
    if (isFloat && currentChar === '.') {
      throw new Error('Unexpected character "."')
    }
    const token = TOKENS_GENERATOR.number(startIndex, number)
    // 词法分析加入this._tokens
    this._tokens.push(token)
    this._resetScanMode()
  }
  /**
   * @description: 返回当前的字符
   * @return {string}
   */
  private _getCurrentChar() {
    return this._source[this._currentIndex]
  }

  private _getNextChar() {
    if (this._currentIndex + 1 < this._source.length) {
      return this._source[this._currentIndex + 1]
    }
    return ''
  }

  private _resetCurrentIndex() {
    this._currentIndex = 0
  }

  private _getTokens() {
    return this._tokens
  }
  /**
   * @description: 返回最后一个 Token
   * @return {Token}
   */  
  private _getPreviousToken() {
    // 前瞻 Token
    if (this._tokens.length > 0) {
      return this._tokens[this._tokens.length - 1]
    }
    throw new Error('Previous token not found')
  }
}
