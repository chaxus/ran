<script setup lang="ts">
// The canonical demo container for component docs. Wrap live `<r-*>` examples in
// <Demo>…</Demo> instead of hand-rolled inline-styled divs, so every demo shares
// one source of truth for framing, spacing, wrapping and light/dark theming.
withDefaults(
  defineProps<{
    /** Cross-axis alignment of the demo items. */
    align?: 'center' | 'start' | 'end';
    /** Stack items vertically instead of in a wrapping row. */
    column?: boolean;
  }>(),
  { align: 'center', column: false },
);
</script>

<template>
  <div class="ran-demo">
    <div class="ran-demo__preview" :class="[`is-${align}`, { 'is-column': column }]">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.ran-demo {
  margin: 22px 0;
}

.ran-demo__preview {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  padding: 26px 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  /* A demo may embed a component that carries its own elevated z-index (e.g.
   * r-dropdown's --ran-z-dropdown: 1100) as *content*, not as a real triggered
   * overlay — just an always-open panel shown for illustration. Without a
   * stacking context of its own, that z-index would compare directly against
   * page-level chrome (VitePress's mobile sidebar + its backdrop), painting
   * the demo panel on top of the dimmed sidebar instead of staying inside its
   * own box. isolation:isolate contains it, and costs nothing extra: an
   * isolated box with no z-index/position of its own still paints at the
   * plain in-flow tier in *its* parent's stacking order, i.e. below
   * VitePress's nav (z-index:30, see `vitepress/theme-default`'s `vars.css`).
   * That's why every demo gets isolation unconditionally. */
  isolation: isolate;
}

/* `r-modal` demoed inline renders a *real*, fixed-position, page-covering
 * dialog while open (unlike the always-open-dropdown-as-content case above)
 * — and isolation traps position:fixed descendants into the box's own
 * stacking context same as anything else, so without extra priority the
 * open dialog would render below the nav/sidebar instead of over them.
 * `:has(r-modal[open])` (native attribute reflection — see r-modal's `open`
 * accessor) scopes the escape to exactly the moment a nested modal is open,
 * so a closed demo (the common case) never pays for it: no `position` or
 * `z-index` sits on the box the rest of the time, so it can never paint over
 * the sticky nav during ordinary scrolling the way the old *unconditional*
 * z-index:100 on every demo did — that blanket rule promoted the box itself,
 * not just its overlay content, above chrome that in-flow page content is
 * only ever supposed to sit below.
 * `r-message` needs no such rule: its toasts already portal to
 * `document.body` (see `components/message/container.ts`), so they're never
 * descendants of this box to begin with and their own z-index (1200) already
 * outranks VitePress's whole chrome range on its own.
 * See `packages/ranui/docs/DESIGN.md` §4 for the component-side z-index
 * ladder this is bridging into the host page. */
.ran-demo__preview:has(r-modal[open]) {
  position: relative;
  z-index: 100;
}

.ran-demo__preview.is-start {
  align-items: flex-start;
}
.ran-demo__preview.is-end {
  align-items: flex-end;
}
.ran-demo__preview.is-column {
  flex-direction: column;
  align-items: stretch;
}

/* Markdown may wrap slotted demo lines in a <p>. Collapse it so the items still
 * flow as flex children — and so any global demo heuristic can't double-frame it. */
.ran-demo__preview :deep(p) {
  display: contents;
  margin: 0;
}
</style>
