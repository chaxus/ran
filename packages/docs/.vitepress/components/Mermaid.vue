<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

// The markdown fence hook (see .vitepress/config.ts) turns ```mermaid blocks into
// <Mermaid code="<base64>"> so the diagram source survives Vue template compilation
// untouched. We decode + render client-side with the `mermaid` runtime — no
// vitepress-plugin-mermaid (it peers on VitePress 1.x; this repo is on 2.x-alpha).

const props = defineProps<{ code: string; id: string }>();

const svg = ref('');

// base64 (UTF-8 safe) → string
const decode = (b64: string): string => {
  const bin = atob(b64);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

let seq = 0;
let observer: MutationObserver | undefined;

async function render(): Promise<void> {
  if (typeof window === 'undefined') return;
  const mermaid = (await import('mermaid')).default;
  const dark = document.documentElement.classList.contains('dark');
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme: dark ? 'dark' : 'neutral',
    fontFamily: 'inherit',
  });
  try {
    const { svg: out } = await mermaid.render(`${props.id}-${seq++}`, decode(props.code));
    svg.value = out;
  } catch (e) {
    svg.value = `<pre class="mermaid-error">${String(e)}</pre>`;
  }
}

onMounted(() => {
  render();
  // Re-render when the site light/dark toggle flips <html class="dark">.
  observer = new MutationObserver(() => render());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="mermaid-diagram" v-html="svg"></div>
</template>

<style>
.mermaid-diagram {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  overflow-x: auto;
}
.mermaid-diagram svg {
  max-width: 100%;
  height: auto;
}
.mermaid-error {
  color: #c00;
  white-space: pre-wrap;
}
</style>
