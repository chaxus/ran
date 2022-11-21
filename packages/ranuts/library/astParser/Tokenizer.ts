import { isWhiteSpace, isAlpha, isDigit, isUnderline } from "./utils";

export enum TokenType {
  Let = "Let",
  Const = "Const",
  Var = "Var",
  Assign = "Assign",
  Function = "Function",
  Number = "Number",
  Operator = "Operator",
  Identifier = "Identifier",
  LeftParen = "LeftParen",
  RightParen = "RightParen",
  LeftCurly = "LeftCurly",
  RightCurly = "RightCurly",
  Comma = "Comma",
  Dot = "Dot",
  Semicolon = "Semicolon",
  StringLiteral = "StringLiteral",
  Return = "Return",
  Import = "Import",
  Export = "Export",
  Default = "Default",
  From = "From",
  As = "As",
  Asterisk = "Asterisk",
}

export enum ScanMode {
  Normal,
  Identifier,
  StringLiteral,
  Number,
}

export type Token = {
  type: TokenType;
  value?: string;
  start: number;
  end: number;
  raw?: string;
};

// 策略模式
const TOKENS_GENERATOR: Record<string, (...args: any[]) => Token> = {
  let(start: number) {
    return { type: TokenType.Let, value: "let", start, end: start + 3 };
  },
  const(start: number) {
    return { type: TokenType.Const, value: "const", start, end: start + 5 };
  },
  var(start: number) {
    return { type: TokenType.Var, value: "var", start, end: start + 3 };
  },
  assign(start: number) {
    return { type: TokenType.Assign, value: "=", start, end: start + 1 };
  },
  import(start: number) {
    return {
      type: TokenType.Import,
      value: "import",
      start,
      end: start + 6,
    };
  },
  export(start: number) {
    return {
      type: TokenType.Export,
      value: "export",
      start,
      end: start + 6,
    };
  },
  from(start: number) {
    return {
      type: TokenType.From,
      value: "from",
      start,
      end: start + 4,
    };
  },
  as(start: number) {
    return {
      type: TokenType.As,
      value: "as",
      start,
      end: start + 2,
    };
  },
  asterisk(start: number) {
    return {
      type: TokenType.Asterisk,
      value: "*",
      start,
      end: start + 1,
    };
  },
  default(start: number) {
    return {
      type: TokenType.Default,
      value: "default",
      start,
      end: start + 7,
    };
  },
  number(start: number, value: string) {
    return {
      type: TokenType.Number,
      value,
      start,
      end: start + value.length,
      raw: value,
    };
  },
  function(start: number) {
    return {
      type: TokenType.Function,
      value: "function",
      start,
      end: start + 8,
    };
  },
  return(start: number) {
    return {
      type: TokenType.Return,
      value: "return",
      start,
      end: start + 6,
    };
  },
  operator(start: number, value: string) {
    return {
      type: TokenType.Operator,
      value,
      start,
      end: start + value.length,
    };
  },
  comma(start: number) {
    return {
      type: TokenType.Comma,
      value: ",",
      start,
      end: start + 1,
    };
  },
  leftParen(start: number) {
    return { type: TokenType.LeftParen, value: "(", start, end: start + 1 };
  },
  rightParen(start: number) {
    return { type: TokenType.RightParen, value: ")", start, end: start + 1 };
  },
  leftCurly(start: number) {
    return { type: TokenType.LeftCurly, value: "{", start, end: start + 1 };
  },
  rightCurly(start: number) {
    return { type: TokenType.RightCurly, value: "}", start, end: start + 1 };
  },
  dot(start: number) {
    return { type: TokenType.Dot, value: ".", start, end: start + 1 };
  },
  semicolon(start: number) {
    return { type: TokenType.Semicolon, value: ";", start, end: start + 1 };
  },
  stringLiteral(start: number, value: string, raw: string) {
    return {
      type: TokenType.StringLiteral,
      value,
      start,
      end: start + value.length + 2,
      raw,
    };
  },
  identifier(start: number, value: string) {
    return {
      type: TokenType.Identifier,
      value,
      start,
      end: start + value.length,
    };
  },
};

type SingleCharTokens = "(" | ")" | "{" | "}" | "." | ";" | "," | "*" | "=";

const KNOWN_SINGLE_CHAR_TOKENS = new Map<
  SingleCharTokens,
  typeof TOKENS_GENERATOR[keyof typeof TOKENS_GENERATOR]
>([
  ["(", TOKENS_GENERATOR.leftParen],
  [")", TOKENS_GENERATOR.rightParen],
  ["{", TOKENS_GENERATOR.leftCurly],
  ["}", TOKENS_GENERATOR.rightCurly],
  [".", TOKENS_GENERATOR.dot],
  [";", TOKENS_GENERATOR.semicolon],
  [",", TOKENS_GENERATOR.comma],
  ["*", TOKENS_GENERATOR.asterisk],
  ["=", TOKENS_GENERATOR.assign],
]);

const QUOTATION_TOKENS = ["'", '"', "`"];

const OPERATOR_TOKENS = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "^",
  "&",
  "|",
  "~",
  "<<",
  ">>",
];

export class Tokenizer {
  private _tokens: Token[] = [];
  private _currentIndex: number = 0;
  private _source: string;
  private _scanMode = ScanMode.Normal;
  constructor(input: string) {
    this._source = input;
  }

  scanIndentifier(): void {
    this._setScanMode(ScanMode.Identifier);
    // 继续扫描，直到收集完整的单词
    let identifier = "";
    let currentChar = this._getCurrentChar();
    const startIndex = this._currentIndex;
    while (
      isAlpha(currentChar) ||
      isDigit(currentChar) ||
      isUnderline(currentChar)
    ) {
      identifier += currentChar;
      this._currentIndex++;
      currentChar = this._getCurrentChar();
    }
    let token;
    // 1. 结果为关键字
    if (identifier in TOKENS_GENERATOR) {
      token =
        TOKENS_GENERATOR[identifier as keyof typeof TOKENS_GENERATOR](
          startIndex
        );
    }
    // 2. 结果为标识符
    else {
      token = TOKENS_GENERATOR["identifier"](startIndex, identifier);
    }
    this._tokens.push(token);
    this._resetScanMode();
  }

  scanStringLiteral(): void {
    this._setScanMode(ScanMode.StringLiteral);
    const startIndex = this._currentIndex;
    let currentChar = this._getCurrentChar();
    // 记录引号
    const startQuotation = currentChar;
    // 继续找字符串
    this._currentIndex++;
    let str = "";
    currentChar = this._getCurrentChar();
    while (currentChar && currentChar !== startQuotation) {
      str += currentChar;
      this._currentIndex++;
      currentChar = this._getCurrentChar();
    }
    const token = TOKENS_GENERATOR.stringLiteral(
      startIndex,
      str,
      `${startQuotation}${str}${startQuotation}`
    );
    this._tokens.push(token);
    this._resetScanMode();
  }

  _scanNumber(): void {
    this._setScanMode(ScanMode.Number);
    const startIndex = this._currentIndex;
    let number = "";
    let currentChar = this._getCurrentChar();
    let isFloat = false;
    // 如果是数字，则继续扫描
    // 需要考虑到小数点
    while (isDigit(currentChar) || (currentChar === "." && !isFloat)) {
      if (currentChar === ".") {
        isFloat = true;
      }
      number += currentChar;
      this._currentIndex++;
      currentChar = this._getCurrentChar();
    }
    if (isFloat && currentChar === ".") {
      throw new Error('Unexpected character "."');
    }
    const token = TOKENS_GENERATOR.number(startIndex, number);
    this._tokens.push(token);
    this._resetScanMode();
  }

  tokenize(): Token[] {
    // 扫描
    while (this._currentIndex < this._source.length) {
      let currentChar = this._source[this._currentIndex];
      const startIndex = this._currentIndex;
      // 1. 判断是否是分隔符
      if (isWhiteSpace(currentChar)) {
        this._currentIndex++;
        continue;
      }
      // 2. 判断是否是字母
      else if (isAlpha(currentChar)) {
        this.scanIndentifier();
        continue;
      }
      // 3. 判断是否是单字符 () {} . ; *
      else if (KNOWN_SINGLE_CHAR_TOKENS.has(currentChar as SingleCharTokens)) {
        // * 字符特殊处理
        if (currentChar === "*") {
          // 前瞻，如果是非 import/export，则认为是二元运算符，避免误判
          const previousToken = this._getPreviousToken();
          if (
            previousToken.type !== TokenType.Import &&
            previousToken.type !== TokenType.Export
          ) {
            this._tokens.push(
              TOKENS_GENERATOR.operator(startIndex, currentChar)
            );
            this._currentIndex++;
            continue;
          }
          // 否则按照 import/export 中的 * 处理
        }
        const token = KNOWN_SINGLE_CHAR_TOKENS.get(
          currentChar as SingleCharTokens
        )!(startIndex);
        this._tokens.push(token);
        this._currentIndex++;
      }
      // 4. 判断是否为引号
      else if (QUOTATION_TOKENS.includes(currentChar)) {
        this.scanStringLiteral();
        // 跳过结尾的引号
        this._currentIndex++;
        continue;
      }
      // 5. 判断二元计算符
      else if (
        OPERATOR_TOKENS.includes(currentChar) &&
        this._scanMode === ScanMode.Normal
      ) {
        this._tokens.push(TOKENS_GENERATOR.operator(startIndex, currentChar));
        this._currentIndex++;
        continue;
      } else if (
        OPERATOR_TOKENS.includes(currentChar + this._getNextChar()) &&
        this._scanMode === ScanMode.Normal
      ) {
        this._tokens.push(
          TOKENS_GENERATOR.operator(
            startIndex,
            currentChar + this._getNextChar()
          )
        );
        this._currentIndex += 2;
        continue;
      }
      // 6. 判断数字
      else if (isDigit(currentChar)) {
        this._scanNumber();
        continue;
      }
    }
    this._resetCurrentIndex();
    return this._getTokens();
  }

  private _getCurrentChar() {
    return this._source[this._currentIndex];
  }

  private _getNextChar() {
    if (this._currentIndex + 1 < this._source.length) {
      return this._source[this._currentIndex + 1];
    }
    return "";
  }

  private _resetCurrentIndex() {
    this._currentIndex = 0;
  }

  private _getTokens() {
    return this._tokens;
  }

  private _getPreviousToken() {
    // 前瞻 Token
    if (this._tokens.length > 0) {
      return this._tokens[this._tokens.length - 1];
    }
    throw new Error("Previous token not found");
  }

  private _setScanMode(mode: ScanMode) {
    this._scanMode = mode;
  }

  private _resetScanMode() {
    this._scanMode = ScanMode.Normal;
  }
}
