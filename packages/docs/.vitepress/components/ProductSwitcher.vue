<template>
  <div ref="root" class="product-switcher" :style="anchorStyle ?? undefined">
    <button
      class="product-switcher-btn"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click.stop.prevent="open = !open"
    >
      <span class="product-switcher-label">{{ activeProduct ? activeProduct.text : menuLabel }}</span>
      <svg
        class="product-switcher-chevron"
        :class="{ open }"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M6 9l6 6 6-6"
        />
      </svg>
    </button>
    <div v-show="open" class="product-switcher-menu" role="menu">
      <a
        v-for="p in products"
        :key="p.key"
        :href="p.link"
        class="product-switcher-item"
        :class="{ active: activeKey === p.key }"
        role="menuitem"
        @click.stop.prevent="go(p.link)"
      >
        <span class="product-switcher-item-name">{{ p.text }}</span>
        <span class="product-switcher-item-desc">{{ p.desc }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { useData, useRoute, useRouter } from 'vitepress';
import { useLayout } from 'vitepress/theme-without-fonts';

const { lang } = useData();
const route = useRoute();
const router = useRouter();
const { hasSidebar } = useLayout();

const open = ref(false);
const root = ref<HTMLElement>();

// The nav-bar-title-after slot renders inside the logo's <a href="/">, so clicks
// must be intercepted here and routed manually to avoid navigating home.
const go = (link: string) => {
  open.value = false;
  router.go(link);
};

// On pages with a sidebar, VitePress reserves a full sidebar-width column (272px)
// for the logo so it lines up with the sidebar below — the logo itself is far
// narrower than that column, and this switcher renders past the column's edge
// (in `#nav-bar-content-before`, see NavLayout.vue), which reads as "far from the
// logo". There is no such reserved column on the home page, so the switcher
// already sits right after the logo there. Rather than hardcode the logo's pixel
// width (it shifts at the >=1440px breakpoint, where the column becomes a
// viewport-centered calc()), measure the real rendered edge of the logo/title and
// pin the switcher there via absolute positioning, only when the reserved column
// is actually in effect. Below 960px `.title` is a normal flex item with no
// reserved column, so the switcher's default inline position is already correct.
const SWITCHER_GAP = 12;
const anchorStyle = ref<{ position: string; left: string; top: string; transform: string; margin: string } | null>(
  null,
);

const measure = (): void => {
  if (!hasSidebar.value || !root.value || window.innerWidth < 960) {
    anchorStyle.value = null;
    return;
  }
  const titleLink = document.querySelector<HTMLElement>('.VPNavBar .VPNavBarTitle a.title');
  const offsetParent = root.value.offsetParent as HTMLElement | null;
  if (!titleLink || !offsetParent) {
    anchorStyle.value = null;
    return;
  }
  let logoRight = titleLink.getBoundingClientRect().left;
  titleLink.querySelectorAll(':scope > *').forEach((el) => {
    logoRight = Math.max(logoRight, el.getBoundingClientRect().right);
  });
  const parentRect = offsetParent.getBoundingClientRect();
  const titleRect = titleLink.getBoundingClientRect();
  anchorStyle.value = {
    position: 'absolute',
    left: `${logoRight + SWITCHER_GAP - parentRect.left}px`,
    top: `${titleRect.top + titleRect.height / 2 - parentRect.top}px`,
    transform: 'translateY(-50%)',
    margin: '0',
  };
};

let resizeTimer: ReturnType<typeof setTimeout> | undefined;
const onResize = (): void => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(measure, 100);
};

watch([hasSidebar, () => route.path], () => nextTick(measure));

const isCn = computed(() => lang.value === 'zh-CN');
const prefix = computed(() => (isCn.value ? '/cn' : ''));
const menuLabel = computed(() => (isCn.value ? '产品' : 'Products'));

const products = computed(() => [
  {
    key: 'ranui',
    text: 'ranui',
    desc: isCn.value ? 'Web Components UI 库' : 'Web Components UI',
    link: `${prefix.value}/src/ranui/`,
  },
  {
    key: 'ranuts',
    text: 'ranuts',
    desc: isCn.value ? 'TypeScript 工具库' : 'TypeScript utilities',
    link: `${prefix.value}/src/ranuts/`,
  },
]);

const activeKey = computed(() => {
  if (route.path.includes('/src/ranui/')) return 'ranui';
  if (route.path.includes('/src/ranuts/')) return 'ranuts';
  return '';
});
const activeProduct = computed(() => products.value.find((p) => p.key === activeKey.value));

const onDocClick = (e: MouseEvent) => {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false;
};
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') open.value = false;
};

onMounted(() => {
  document.addEventListener('click', onDocClick);
  document.addEventListener('keydown', onKeydown);
  window.addEventListener('resize', onResize);
  measure();
  document.fonts?.ready.then(measure);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick);
  document.removeEventListener('keydown', onKeydown);
  window.removeEventListener('resize', onResize);
  clearTimeout(resizeTimer);
});
</script>

<style scoped>
.product-switcher {
  position: relative;
  display: inline-flex;
  margin-left: 12px;
}

.product-switcher-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  height: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-alt);
  transition:
    border-color 0.25s,
    background-color 0.25s,
    color 0.25s;
}
.product-switcher-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.product-switcher-chevron {
  transition: transform 0.25s;
}
.product-switcher-chevron.open {
  transform: rotate(180deg);
}

.product-switcher-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 100;
  min-width: 200px;
  padding: 6px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-elv);
  box-shadow: var(--vp-shadow-3);
}

.product-switcher-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.25s;
}
.product-switcher-item:hover {
  background-color: var(--vp-c-default-soft);
}
.product-switcher-item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.product-switcher-item.active .product-switcher-item-name {
  color: var(--vp-c-brand-1);
}
.product-switcher-item-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .product-switcher {
    margin-left: 8px;
  }
  .product-switcher-item-desc {
    display: none;
  }
}
</style>
