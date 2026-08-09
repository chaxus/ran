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
   * overlay. Without a stacking context of its own, that z-index compares
   * directly against page-level chrome (VitePress's mobile sidebar + its
   * backdrop), so the demo panel paints on top of the dimmed sidebar instead
   * of staying inside its own box. isolation:isolate contains it.
   *
   * `isolation` alone only *contains* the comparison — it doesn't grant this
   * box any priority in its *own* parent's stacking order, and a plain
   * `position:static` element with no `z-index` still paints at the lowest
   * "in-flow content" tier there. VitePress's own fixed-position chrome (nav
   * z-index:30, backdrop:50, sidebar:60 — see `vitepress/theme-default`'s
   * `vars.css`) sits above that tier regardless of what's isolated inside it,
   * so a *real*, user-triggered overlay demoed inline here — `r-modal`,
   * `r-message` (unlike the always-open-in-demo dropdown case above, these
   * are opened on click and meant to cover the whole page) — rendered below
   * the nav/sidebar instead of over them. `position:relative` + a `z-index`
   * comfortably above VitePress's whole range gives the isolated box itself
   * that priority, so its truly-fixed-position contents now escape upward
   * past the site's own chrome without needing to out-rank it token-by-token. */
  isolation: isolate;
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
