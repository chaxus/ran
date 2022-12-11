import type { Program } from './nodeTypes';
import { Parser } from './Parser'
import { Tokenizer } from './Tokenizer'

export function parse(code: string):Program {
  const tokenizer = new Tokenizer(code)
  const tokens = tokenizer.tokenize()
  const parser = new Parser(tokens)
  return parser.parse()
}

export * from './Tokenizer'
export * from './nodeTypes'
