# Repository tooling

Repository-owned scripts are TypeScript ES modules executed directly by the supported
Node.js 24+ runtime. Use explicit `.ts` relative imports and erasable TypeScript syntax;
no loader, emitted copy, path alias or second script runner is required.

- `pnpm typecheck:tooling` checks strict NodeNext types without emitting files.
- `pnpm verify:scripts` runs isolated cleanup, declarations, licensing, size and release tests.
- `pnpm verify:agent-evals` checks the evaluation harness, including browser negative controls.

Node strips types when running these scripts; it does **not** check them. Keep the separate
type-check gate in CI. Narrow JSON and caught errors at the boundary before acting on paths,
package metadata or release receipts. `tooling-json.ts` owns the shared small validators.

Published library output remains JavaScript ESM with declarations. Temporary `.mjs` consumer
fixtures intentionally verify those JavaScript exports without a TypeScript runtime. Vendored
third-party skills and recorded historical evidence retain their original source files.

Browser evaluation files run serially to avoid competing Vite/browser cold starts. Each file
retains its asynchronous interaction cases, original timeouts, negative controls and zero retries.
