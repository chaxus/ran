# ranui Public SSR and Sheet Consistency Design

## Goal

Make ranui's documented SSR helpers consumable from package subpaths, and align `r-button` dynamic `sheet` styling with the shared idempotent style injection path.

## Scope

- Add public package entrypoints for `ranui/ssr` and `ranui/ssr-stream`.
- Build those entrypoints as ESM files in `dist`.
- Extend package export source tests so the public entrypoints stay explicit.
- Change `Button.handlerExternalCss` to use `syncSheetAttribute`.
- Add a regression test showing repeated `sheet` application on `r-button` does not duplicate fallback `<style data-ranui-sheet>` tags.

## Non-Goals

- Do not refactor every component's event listener lifecycle in this pass.
- Do not change the theme pack API.
- Do not change the Node engine requirement.
- Do not redesign the demo page.

## Architecture

Public SSR entry files stay thin and re-export the existing internal SSR utilities, so the implementation remains in `utils/ssr.ts` and `utils/ssr-stream.ts`. The build config treats those files like `builder.ts` and `style.ts`: explicit ESM entries with explicit `package.json` export records.

For `r-button`, dynamic styles should go through the same helper used by the rest of the library. `syncSheetAttribute` delegates to `adoptSheetText`, which already caches constructable stylesheets and deduplicates fallback style tags.

## Testing

- Source export contract test covers `ssr` and `ssr-stream` source files, Vite entries, and package exports.
- Button contract test forces the fallback path and asserts duplicate `handlerExternalCss()` calls do not append duplicate dynamic style tags.
- Verification commands:
  - `pnpm --filter ranui test:unit -- --runInBand`
  - `pnpm --filter ranui test:ssr`
  - `pnpm --filter ranui run tsc`
