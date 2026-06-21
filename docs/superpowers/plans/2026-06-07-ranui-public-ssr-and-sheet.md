# ranui Public SSR and Sheet Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose ranui SSR helpers as public package subpaths and make `r-button` dynamic `sheet` injection idempotent.

**Architecture:** Add thin root-level SSR entry files that re-export existing utilities, then wire them into Vite and `package.json` exports. Replace `Button.handlerExternalCss` with the shared `syncSheetAttribute` path used by other components.

**Tech Stack:** TypeScript, Vite library build, Vitest, Web Components, Shadow DOM style helpers.

---

### Task 1: Public SSR Export Contracts

**Files:**
- Modify: `packages/ranui/test/unit/package-exports.source.test.ts`
- Create: `packages/ranui/ssr.ts`
- Create: `packages/ranui/ssr-stream.ts`
- Modify: `packages/ranui/vite.config.ts`
- Modify: `packages/ranui/package.json`

- [x] **Step 1: Write the failing export contract test**

Add expectations for `ssr.ts`, `ssr-stream.ts`, Vite ESM entries, and package export records.

- [x] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm --filter ranui test:unit -- test/unit/package-exports.source.test.ts --runInBand`

Expected: FAIL because `ssr.ts`, `ssr-stream.ts`, and related export records do not exist.

- [x] **Step 3: Add minimal public entry files**

Create `packages/ranui/ssr.ts`:

```ts
export { HTMLElementSSR, RanElement, h, renderToString } from '@/utils/ssr';
```

Create `packages/ranui/ssr-stream.ts`:

```ts
export { renderHTMLToString, renderToStream } from '@/utils/ssr-stream';
```

- [x] **Step 4: Wire build and package exports**

Add `ssr` and `ssr-stream` to the Vite ESM entry map and to `package.json` `exports`.

- [x] **Step 5: Run the targeted test to verify it passes**

Run: `pnpm --filter ranui test:unit -- test/unit/package-exports.source.test.ts --runInBand`

Expected: PASS.

### Task 2: Button Sheet Idempotency

**Files:**
- Modify: `packages/ranui/test/unit/button.contract.test.ts`
- Modify: `packages/ranui/components/button/index.ts`

- [x] **Step 1: Write the failing idempotency test**

Add a test that sets `sheet`, calls `handlerExternalCss()` repeatedly in fallback mode, and expects only one `style[data-ranui-sheet]`.

- [x] **Step 2: Run the targeted test to verify it fails**

Run: `pnpm --filter ranui test:unit -- test/unit/button.contract.test.ts --runInBand`

Expected: FAIL because current `Button.handlerExternalCss` appends duplicate unmarked `<style>` tags.

- [x] **Step 3: Use the shared sheet helper**

Import `syncSheetAttribute` from `@/utils/component` and replace `Button.handlerExternalCss` with:

```ts
handlerExternalCss = (): void => {
  syncSheetAttribute(this, this._shadowDom, 'sheet', null, this.sheet);
};
```

- [x] **Step 4: Run the targeted test to verify it passes**

Run: `pnpm --filter ranui test:unit -- test/unit/button.contract.test.ts --runInBand`

Expected: PASS.

### Task 3: Full Verification

**Files:**
- No new files.

- [x] **Step 1: Run TypeScript**

Run: `pnpm --filter ranui run tsc`

Expected: PASS.

- [x] **Step 2: Run unit tests**

Run: `pnpm --filter ranui test:unit -- --runInBand`

Expected: PASS.

- [x] **Step 3: Run SSR tests**

Run: `pnpm --filter ranui test:ssr`

Expected: PASS.

- [x] **Step 4: Run package build**

Run: `pnpm --filter ranui run build`

Expected: PASS and generated declaration files include `dist/ssr.d.ts` and `dist/ssr-stream.d.ts`.
