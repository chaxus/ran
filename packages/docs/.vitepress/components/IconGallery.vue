<script setup lang="ts">
import { ref } from 'vue';

// Curated showcase set (all are registered via theme/register-icons.ts).
const icons = [
  'add-user',
  'book',
  'check-circle',
  'close-circle',
  'eye-close',
  'eye',
  'info-circle',
  'loading',
  'lock',
  'message',
  'power-off',
  'setting',
  'team',
  'unlock',
  'user',
  'more',
  'plus',
  'search',
  'menu',
  'sort',
];

const copied = ref('');
let timer: ReturnType<typeof setTimeout> | undefined;

const copy = async (name: string): Promise<void> => {
  try {
    await navigator.clipboard?.writeText?.(`<r-icon name="${name}"></r-icon>`);
  } catch {
    /* clipboard 不可用时静默降级,仍给出反馈 */
  }
  copied.value = name;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = ''), 1200);
};
</script>

<template>
  <div class="icon-gallery">
    <button
      v-for="name in icons"
      :key="name"
      type="button"
      class="icon-cell"
      :class="{ 'is-copied': copied === name }"
      :aria-label="`Copy markup for the ${name} icon`"
      @click="copy(name)"
    >
      <span class="icon-cell__glyph">
        <r-icon :name="name" size="26"></r-icon>
      </span>
      <span class="icon-cell__name">{{ copied === name ? 'Copied!' : name }}</span>
    </button>
  </div>
</template>

<style scoped>
.icon-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
  gap: 12px;
  margin: 22px 0;
}

.icon-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font: inherit;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background-color 0.18s ease,
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.icon-cell:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
  transform: translateY(-2px);
  box-shadow: 0 8px 22px -12px rgba(0, 0, 0, 0.35);
}

.icon-cell:active {
  transform: translateY(0);
}

.icon-cell:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.icon-cell.is-copied {
  border-color: var(--vp-c-brand-1);
}

.icon-cell__glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  color: var(--vp-c-text-1);
}

.icon-cell__name {
  max-width: 100%;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 12px;
  line-height: 1.2;
  color: var(--vp-c-text-2);
  text-align: center;
  word-break: break-word;
}

.icon-cell:hover .icon-cell__name {
  color: var(--vp-c-text-1);
}

.icon-cell.is-copied .icon-cell__name {
  color: var(--vp-c-brand-1);
}

@media (prefers-reduced-motion: reduce) {
  .icon-cell,
  .icon-cell:hover {
    transition: none;
    transform: none;
  }
}
</style>
