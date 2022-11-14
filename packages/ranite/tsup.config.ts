// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  // 后续会增加 entry
  entry: {
    index: "src/node/cli.ts",
  },
  // 产物格式，包含 esm 和 cjs 格式
  format: ["esm", "cjs"],
  // 目标语法
  target: "es2020",
  // 生成 sourcemap
  sourcemap: true,
  // 没有拆包的需求，关闭拆包能力
  splitting: false,
});