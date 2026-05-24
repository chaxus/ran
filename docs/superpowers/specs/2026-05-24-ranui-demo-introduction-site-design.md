# ranui Demo Introduction Site Design

## Goal

Turn `packages/ranui/demo/index.html` from a component test gallery into a complete product-style introduction site for ranui. The page should still exercise real ranui Web Components, but it should first communicate what ranui is, why it matters, and how developers can start using it.

## Context

ranui is an experimental Web Components UI library. Its strongest messages are:

- Framework-neutral custom elements that work across HTML, JavaScript, React, Vue, and other runtimes.
- Native-feeling usage, including full import and per-component import paths.
- TypeScript implementation and typed public APIs.
- Theme tokens, `::part()` styling, dark mode, and multiple theme packs.
- SSR and builder utilities for declarative rendering.

The current demo page already registers and displays many components, plus live theme switching. Its weakness is presentation: it reads as a long component test page, uses a muted one-note visual language, and does not give visitors a strong first impression.

## Direction

Use a product-grade developer website as the primary direction. The visual model should feel closer to modern engineering product sites: high contrast, precise spacing, dense but organized information, and real component previews. The theme-pack personality should remain visible as ranui's distinctive feature, but it should support the core product story rather than dominate it.

## Page Structure

1. **Top navigation**
   - Brand, version, section anchors, theme mode switch, and theme pack selector.
   - Sticky behavior for quick scanning and repeated interaction.

2. **Hero**
   - Position ranui as a framework-neutral Web Components UI library.
   - Include install and import examples.
   - Show key stats such as components, theme packs, color modes, and styling APIs.
   - Use real ranui components in a right-side live preview surface.

3. **Why ranui**
   - Explain cross-framework compatibility, native custom elements, modular imports, TypeScript, style tokens, and SSR builder support.
   - Keep this section concise and scannable.

4. **Theme Lab**
   - Make the existing theme pack controls a prominent interactive feature.
   - Show the theme packs as distinct visual worlds: Default, Dark, Pixel Retro, Windows 98, Windows XP, System 6, Wired, Paper, and Neo Brutalism.
   - The selected pack should affect the page and visible components immediately.

5. **Component Gallery**
   - Keep the current real component examples, but group them by use case instead of one long flat list:
     - Actions and inputs: button, input, select, checkbox, color picker.
     - Feedback: message, loading, skeleton, progress.
     - Navigation and overlays: tabs, popover, modal.
     - Media and advanced: image, player, math, radar, form, scratch, Declarative Shadow DOM example.
   - Use tighter cards and labels so the gallery feels like a polished showcase, not a raw test matrix.

6. **Code Paths**
   - Include short install and import examples for npm, full ESM import, per-component import, HTML usage, React/JSX, and Vue.
   - Keep examples short enough to scan.

7. **Style API**
   - Highlight CSS tokens, `::part()`, dark mode, and theme-pack extensibility.
   - Link the concept back to the live controls and examples already on the page.

## Visual System

- Use a neutral, high-contrast product palette with restrained accent colors rather than the current warm monotone treatment.
- Avoid decorative blobs and purely atmospheric hero art.
- Use real UI surfaces, code panes, component previews, metrics, and theme swatches as the main visual assets.
- Keep cards at 8px radius or less where possible, except larger showcase shells where a slightly larger radius improves hierarchy.
- Maintain responsive constraints so text does not overlap or resize unpredictably on mobile.
- Avoid remote fonts and remote images so the demo remains reliable offline.

## Implementation Scope

The implementation should stay inside the demo experience:

- Primary target: `packages/ranui/demo/index.html`.
- Preserve `packages/ranui/demo/index.ts` unless a small supporting change is required.
- Do not change component implementations.
- Do not introduce new runtime dependencies.
- Continue using the existing Vite demo workflow and current component registration.

## Behavior

- Light/dark mode and theme-pack controls should continue to update the document attributes used by the theme system.
- All current component demos should remain present or be represented in the grouped gallery.
- Buttons that trigger existing examples such as message, modal, and scratch should remain functional.
- Navigation anchors should scroll to the appropriate sections.

## Verification

Run the ranui demo locally and inspect it in a browser. Verify:

- The page loads without console-breaking errors.
- The hero and navigation render correctly on desktop and mobile widths.
- Theme mode and theme-pack switching works.
- Key interactive demos still work.
- Text does not visibly overlap inside buttons, cards, navigation, or code blocks.
