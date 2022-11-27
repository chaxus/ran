import { Parser } from "@/astParser/Parser";
import { Tokenizer } from "@/astParser/Tokenizer";

export function parse(code: string) {
  const tokenizer = new Tokenizer(code);
  const tokens = tokenizer.tokenize();
  const parser = new Parser(tokens);
  return parser.parse();
}

export * from "@/astParser/Tokenizer";
export * from "@/astParser/nodeTypes";
