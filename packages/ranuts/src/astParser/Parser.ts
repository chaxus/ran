import { Token, TokenType } from "./Tokenizer";
import {
  BlockStatement,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionDeclaration,
  FunctionType,
  Identifier,
  ImportDeclaration,
  ImportSpecifiers,
  Literal,
  MemberExpression,
  NodeType,
  Program,
  Statement,
  VariableDeclaration,
  VariableDeclarator,
  VariableKind,
  ReturnStatement,
  ExportSpecifier,
  ExportDeclaration,
  FunctionExpression,
  BinaryExpression,
} from "./node-types";

export class Parser {
  private _tokens: Token[] = [];
  private _currentIndex = 0;
  constructor(token: Token[]) {
    this._tokens = [...token];
  }

  parse(): Program {
    const program = this._parseProgram();
    return program;
  }

  private _parseProgram(): Program {
    const program: Program = {
      type: NodeType.Program,
      body: [],
      start: 0,
      end: Infinity,
    };
    while (!this._isEnd()) {
      const node = this._parseStatement();
      program.body.push(node);
      if (this._isEnd()) {
        program.end = node.end;
      }
    }
    return program;
  }

  private _parseStatement(): Statement {
    if (this._checkCurrentTokenType(TokenType.Function)) {
      return this._parseFunctionDeclaration() as FunctionDeclaration;
    } else if (this._checkCurrentTokenType(TokenType.Identifier)) {
      return this._parseExpressionStatement();
    } else if (this._checkCurrentTokenType(TokenType.LeftCurly)) {
      return this._parseBlockStatement();
    } else if (this._checkCurrentTokenType(TokenType.Return)) {
      return this._parseReturnStatement();
    } else if (this._checkCurrentTokenType(TokenType.Import)) {
      return this._parseImportStatement();
    } else if (this._checkCurrentTokenType(TokenType.Export)) {
      return this._parseExportStatement();
    } else if (
      this._checkCurrentTokenType([
        TokenType.Let,
        TokenType.Var,
        TokenType.Const,
      ])
    ) {
      return this._parseVariableDeclaration();
    }
    console.log(this._getCurrentToken());
    throw new Error("Unexpected token");
  }

  private _parseImportStatement(): ImportDeclaration {
    const { start } = this._getCurrentToken();
    const specifiers = [];
    this._goNext(TokenType.Import);
    // import a
    if (this._checkCurrentTokenType(TokenType.Identifier)) {
      const local = this._parseIdentifier();
      const defaultSpecifier = {
        type: NodeType.ImportDefaultSpecifier,
        local,
        start: local.start,
        end: local.end,
      };
      specifiers.push(defaultSpecifier);
      if (this._checkCurrentTokenType(TokenType.Comma)) {
        this._goNext(TokenType.Comma);
      }
    }
    // import { name1 }
    if (this._checkCurrentTokenType(TokenType.LeftCurly)) {
      this._goNext(TokenType.LeftCurly);
      while (!this._checkCurrentTokenType(TokenType.RightCurly)) {
        const specifier = this._parseIdentifier();
        let local = null;
        if (this._checkCurrentTokenType(TokenType.As)) {
          this._goNext(TokenType.As);
          local = this._parseIdentifier();
        }
        const importSpecifier = {
          type: NodeType.ImportSpecifier,
          imported: specifier,
          local: local ? local : specifier,
          start: specifier.start,
          end: local ? local.end : specifier.end,
        };
        specifiers.push(importSpecifier);
        if (this._checkCurrentTokenType(TokenType.Comma)) {
          this._goNext(TokenType.Comma);
        }
      }
      this._goNext(TokenType.RightCurly);
    }
    // import * as a
    else if (this._checkCurrentTokenType(TokenType.Asterisk)) {
      const { start } = this._getCurrentToken();
      this._goNext(TokenType.Asterisk);
      this._goNext(TokenType.As);
      const local = this._parseIdentifier();
      const importNamespaceSpecifier = {
        type: NodeType.ImportNamespaceSpecifier,
        local,
        start,
        end: local.end,
      };
      specifiers.push(importNamespaceSpecifier);
    }

    // from 'a'
    if (this._checkCurrentTokenType(TokenType.From)) {
      this._goNext(TokenType.From);
    }
    const source = this._parseLiteral();
    const node: ImportDeclaration = {
      type: NodeType.ImportDeclaration,
      specifiers: specifiers as ImportSpecifiers,
      start,
      end: source.end,
      source,
    };
    this._skipSemicolon();
    return node;
  }

  private _parseExportStatement(): ExportDeclaration {
    const { start } = this._getCurrentToken();
    let exportDeclaration: ExportDeclaration | null = null;
    const specifiers: ExportSpecifier[] = [];
    this._goNext(TokenType.Export);
    // export default
    if (this._checkCurrentTokenType(TokenType.Default)) {
      this._goNext(TokenType.Default);
      // export default a
      // export default obj.a
      if (this._checkCurrentTokenType(TokenType.Identifier)) {
        const local = this._parseExpression();
        exportDeclaration = {
          type: NodeType.ExportDefaultDeclaration,
          declaration: local,
          start: local.start,
          end: local.end,
        };
      }
      // export default function() {}
      else if (this._checkCurrentTokenType(TokenType.Function)) {
        const declaration = this._parseFunctionDeclaration();
        exportDeclaration = {
          type: NodeType.ExportDefaultDeclaration,
          declaration,
          start,
          end: declaration.end,
        };
      }
      // TODO: export default class {}
      // TODO: export default { a: 1 };
    }
    // export {
    else if (this._checkCurrentTokenType(TokenType.LeftCurly)) {
      this._goNext(TokenType.LeftCurly);
      while (!this._checkCurrentTokenType(TokenType.RightCurly)) {
        const local = this._parseIdentifier();
        let exported = local;
        if (this._checkCurrentTokenType(TokenType.As)) {
          this._goNext(TokenType.As);
          exported = this._parseIdentifier();
        }
        const exportSpecifier: ExportSpecifier = {
          type: NodeType.ExportSpecifier,
          local,
          exported,
          start: local.start,
          end: exported.end,
        };
        specifiers.push(exportSpecifier);
        if (this._checkCurrentTokenType(TokenType.Comma)) {
          this._goNext(TokenType.Comma);
        }
      }
      this._goNext(TokenType.RightCurly);
      if (this._checkCurrentTokenType(TokenType.From)) {
        this._goNext(TokenType.From);
      }
      const source = this._parseLiteral();
      exportDeclaration = {
        type: NodeType.ExportNamedDeclaration,
        specifiers,
        start,
        declaration: null,
        end: source.end,
        source,
      };
    }
    // export const/let/var
    else if (
      this._checkCurrentTokenType([
        TokenType.Const,
        TokenType.Let,
        TokenType.Var,
      ])
    ) {
      const declaration = this._parseVariableDeclaration();
      exportDeclaration = {
        type: NodeType.ExportNamedDeclaration,
        declaration,
        start,
        end: declaration.end,
        specifiers: specifiers as ExportSpecifier[],
        source: null,
      };
      return exportDeclaration;
    }
    // export function
    else if (this._checkCurrentTokenType(TokenType.Function)) {
      const declaration =
        this._parseFunctionDeclaration() as FunctionDeclaration;
      exportDeclaration = {
        type: NodeType.ExportNamedDeclaration,
        declaration,
        start,
        end: declaration.end,
        specifiers: specifiers as ExportSpecifier[],
        source: null,
      };
    }
    // export * from 'mod'
    else {
      this._goNext(TokenType.Asterisk);
      let exported: Identifier | null = null;
      if (this._checkCurrentTokenType(TokenType.As)) {
        this._goNext(TokenType.As);
        exported = this._parseIdentifier();
      }
      this._goNext(TokenType.From);
      const source = this._parseLiteral();
      exportDeclaration = {
        type: NodeType.ExportAllDeclaration,
        start,
        end: source.end,
        source,
        exported,
      };
    }
    if (!exportDeclaration) {
      throw new Error("Export declaration cannot be parsed");
    }
    this._skipSemicolon();
    return exportDeclaration!;
  }

  private _parseVariableDeclaration(): VariableDeclaration {
    const { start } = this._getCurrentToken();
    const kind = this._getCurrentToken().value;
    this._goNext([TokenType.Let, TokenType.Var, TokenType.Const]);
    const declarations = [];
    const isVariableDeclarationEnded = (): boolean => {
      if (this._checkCurrentTokenType(TokenType.Semicolon)) {
        return true;
      }
      const nextToken = this._getNextToken();
      // 往后看一个 token，如果是 =，则表示没有结束
      if (nextToken && nextToken.type === TokenType.Assign) {
        return false;
      }
      return true;
    };
    while (!isVariableDeclarationEnded()) {
      const id = this._parseIdentifier();
      let init = null;
      if (this._checkCurrentTokenType(TokenType.Assign)) {
        this._goNext(TokenType.Assign);
        if (
          this._checkCurrentTokenType([
            TokenType.Number,
            TokenType.StringLiteral,
          ])
        ) {
          init = this._parseLiteral();
        } else {
          init = this._parseExpression();
        }
      }
      const declarator: VariableDeclarator = {
        type: NodeType.VariableDeclarator,
        id,
        init,
        start: id.start,
        end: init ? init.end : id.end,
      };
      declarations.push(declarator);
      if (this._checkCurrentTokenType(TokenType.Comma)) {
        this._goNext(TokenType.Comma);
      }
    }
    const node: VariableDeclaration = {
      type: NodeType.VariableDeclaration,
      kind: kind as VariableKind,
      declarations,
      start,
      end: this._getPreviousToken().end,
    };
    this._skipSemicolon();
    return node;
  }

  private _parseReturnStatement(): ReturnStatement {
    const { start } = this._getCurrentToken();
    this._goNext(TokenType.Return);
    const argument = this._parseExpression();
    const node: ReturnStatement = {
      type: NodeType.ReturnStatement,
      argument,
      start,
      end: argument.end,
    };
    this._skipSemicolon();
    return node;
  }

  private _parseExpressionStatement(): ExpressionStatement {
    const expression = this._parseExpression();
    const expressionStatement: ExpressionStatement = {
      type: NodeType.ExpressionStatement,
      expression,
      start: expression.start,
      end: expression.end,
    };
    return expressionStatement;
  }

  // 需要考虑 a.b.c 嵌套结构
  private _parseExpression(): Expression {
    // 先检查是否是一个函数表达式
    if (this._checkCurrentTokenType(TokenType.Function)) {
      return this._parseFunctionExpression();
    }
    if (
      this._checkCurrentTokenType([TokenType.Number, TokenType.StringLiteral])
    ) {
      return this._parseLiteral();
    }
    // 拿到标识符，如 a
    let expresion: Expression = this._parseIdentifier();
    while (!this._isEnd()) {
      if (this._checkCurrentTokenType(TokenType.LeftParen)) {
        expresion = this._parseCallExpression(expresion);
      } else if (this._checkCurrentTokenType(TokenType.Dot)) {
        // 继续解析，a.b
        expresion = this._parseMemberExpression(expresion as MemberExpression);
      } else if (this._checkCurrentTokenType(TokenType.Operator)) {
        // 解析 a + b
        expresion = this.__parseBinaryOperatorExpression(expresion);
      } else {
        break;
      }
    }
    return expresion;
  }

  private __parseBinaryOperatorExpression(
    expression: Expression
  ): BinaryExpression {
    const { start } = this._getCurrentToken();
    const operator = this._getCurrentToken().value!;
    this._goNext(TokenType.Operator);
    const right = this._parseExpression();
    const node: BinaryExpression = {
      type: NodeType.BinaryExpression,
      operator,
      left: expression,
      right,
      start,
      end: right.end,
    };
    return node;
  }

  private _parseMemberExpression(
    object: Identifier | MemberExpression
  ): MemberExpression {
    this._goNext(TokenType.Dot);
    const property = this._parseIdentifier();
    const node: MemberExpression = {
      type: NodeType.MemberExpression,
      object,
      property,
      start: object.start,
      end: property.end,
      computed: false,
    };
    return node;
  }

  private _parseCallExpression(callee: Expression) {
    const args = this._parseParams(FunctionType.CallExpression) as Expression[];
    // 获取最后一个字符的结束位置
    const { end } = this._getPreviousToken();
    const node: CallExpression = {
      type: NodeType.CallExpression,
      callee,
      arguments: args,
      start: callee.start,
      end,
    };
    this._skipSemicolon();
    return node;
  }

  private _parseFunctionDeclaration(): FunctionDeclaration {
    const { start } = this._getCurrentToken();
    this._goNext(TokenType.Function);
    let id = null;
    if (this._checkCurrentTokenType(TokenType.Identifier)) {
      id = this._parseIdentifier();
    }
    const params = this._parseParams();
    const body = this._parseBlockStatement();
    const node: FunctionDeclaration = {
      type: NodeType.FunctionDeclaration,
      id,
      params,
      body,
      start,
      end: body.end,
    };
    return node;
  }

  private _parseFunctionExpression(): FunctionExpression {
    const { start } = this._getCurrentToken();
    this._goNext(TokenType.Function);
    let id = null;
    if (this._checkCurrentTokenType(TokenType.Identifier)) {
      id = this._parseIdentifier();
    }
    const params = this._parseParams();
    const body = this._parseBlockStatement();
    const node: FunctionExpression = {
      type: NodeType.FunctionExpression,
      id,
      params,
      body,
      start,
      end: body.end,
    };
    return node;
  }

  private _parseParams(
    mode: FunctionType = FunctionType.FunctionDeclaration
  ): Identifier[] | Expression[] {
    this._goNext(TokenType.LeftParen);
    const params = [];
    while (!this._checkCurrentTokenType(TokenType.RightParen)) {
      let param =
        mode === FunctionType.FunctionDeclaration
          ? // 函数声明
            this._parseIdentifier()
          : // 函数调用
            this._parseExpression();
      params.push(param);
      if (!this._checkCurrentTokenType(TokenType.RightParen)) {
        this._goNext(TokenType.Comma);
      }
    }
    this._goNext(TokenType.RightParen);
    return params;
  }

  private _parseLiteral(): Literal {
    const token = this._getCurrentToken();
    let value: string | number | boolean = token.value!;
    if (token.type === TokenType.Number) {
      value = Number(value);
    }
    const literal: Literal = {
      type: NodeType.Literal,
      value: token.value!,
      start: token.start,
      end: token.end,
      raw: token.raw!,
    };
    this._goNext(token.type);
    return literal;
  }

  private _parseIdentifier(): Identifier {
    const token = this._getCurrentToken();
    const identifier: Identifier = {
      type: NodeType.Identifier,
      name: token.value!,
      start: token.start,
      end: token.end,
    };
    this._goNext(TokenType.Identifier);
    return identifier;
  }

  private _parseBlockStatement(): BlockStatement {
    const { start } = this._getCurrentToken();
    const blockStatement: BlockStatement = {
      type: NodeType.BlockStatement,
      body: [],
      start,
      end: Infinity,
    };
    this._goNext(TokenType.LeftCurly);
    while (!this._checkCurrentTokenType(TokenType.RightCurly)) {
      const node = this._parseStatement();
      blockStatement.body.push(node);
    }
    blockStatement.end = this._getCurrentToken().end;
    this._goNext(TokenType.RightCurly);
    return blockStatement;
  }

  private _checkCurrentTokenType(type: TokenType | TokenType[]): boolean {
    if (this._isEnd()) {
      return false;
    }
    const currentToken = this._tokens[this._currentIndex];
    if (Array.isArray(type)) {
      return type.includes(currentToken.type);
    } else {
      return currentToken.type === type;
    }
  }

  private _skipSemicolon(): void {
    if (this._checkCurrentTokenType(TokenType.Semicolon)) {
      this._goNext(TokenType.Semicolon);
    }
  }

  private _goNext(type: TokenType | TokenType[]): Token {
    const currentToken = this._tokens[this._currentIndex];
    // 断言当前 Token 的类型，如果不能匹配，则抛出错误
    if (Array.isArray(type)) {
      if (!type.includes(currentToken.type)) {
        throw new Error(
          `Expect ${type.join(",")}, but got ${currentToken.type}`
        );
      }
    } else {
      if (currentToken.type !== type) {
        throw new Error(`Expect ${type}, but got ${currentToken.type}`);
      }
    }
    this._currentIndex++;
    return currentToken;
  }

  private _isEnd(): boolean {
    return this._currentIndex >= this._tokens.length;
  }

  private _getCurrentToken(): Token {
    return this._tokens[this._currentIndex];
  }

  private _getPreviousToken(): Token {
    return this._tokens[this._currentIndex - 1];
  }

  private _getNextToken(): Token | false {
    if (this._currentIndex + 1 < this._tokens.length) {
      return this._tokens[this._currentIndex + 1];
    } else {
      return false;
    }
  }
}
