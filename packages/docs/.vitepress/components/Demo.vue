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
