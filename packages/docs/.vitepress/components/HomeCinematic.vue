<template>
  <div class="cine" ref="root">
    <!-- minimal ambient: one neutral glow + a faint dot grid (Vercel/Geist),
         no colored aurora, no heavy blur — dark-safe. -->
    <div class="bg" aria-hidden="true">
      <span class="glow"></span>
      <span class="grid"></span>
    </div>

    <!-- hero -->
    <header class="hero">
      <div class="hero-copy">
        <span class="eyebrow" data-hero :style="hd(0)"> <span class="dot"></span>{{ t.eyebrow }} </span>

        <h1 class="headline">
          <span class="line" v-for="(line, li) in headlineLines" :key="li">
            <span class="word" v-for="(w, wi) in line" :key="wi" :style="hd(2 + wordIndex(li, wi))">
              <span class="word-in">{{ w }}</span>
            </span>
          </span>
        </h1>

        <p class="subtitle" data-hero :style="hd(2 + totalWords)">{{ t.subtitle }}</p>

        <div class="cmd" data-hero :style="hd(3 + totalWords)">
          <code>npm&nbsp;i&nbsp;ranui&nbsp;ranuts</code>
          <button class="copy" :class="{ done: copied }" @click="copyInstall" :aria-label="t.copy">
            <svg v-if="!copied" viewBox="0 0 24 24" width="16" height="16">
              <rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.8" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" fill="none" stroke="currentColor" stroke-width="1.8" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="16" height="16">
              <path
                d="M4 12l5 5L20 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div class="cta" data-hero :style="hd(4 + totalWords)">
          <a class="btn btn-primary" :href="localeHref('/src/ranui/')">
            {{ t.ctaPrimary }}
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
          <a class="btn btn-ghost" href="https://github.com/chaxus/ran" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.4 9.4 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
              />
            </svg>
            {{ t.ctaSecondary }}
          </a>
        </div>
      </div>

      <div class="hero-live" data-hero :style="hd(3 + totalWords)">
        <div class="live-head"><span class="live-dot"></span>{{ t.liveLabel }}</div>
        <div v-if="mounted" class="live-body">
          <div class="live-row">
            <r-button type="contrast">Contrast</r-button>
            <r-button>Default</r-button>
            <r-button type="primary">Primary</r-button>
          </div>
          <div class="live-row">
            <r-progress class="live-progress" percent="66" total="100"></r-progress>
          </div>
          <div class="live-row live-inline">
            <r-loading class="live-loading" name="circle-line"></r-loading>
            <r-checkbox checked="true">Subscribe</r-checkbox>
          </div>
        </div>
        <div v-else class="live-body live-skeleton"><span></span><span></span><span></span></div>
        <span class="live-note">{{ t.liveNote }}</span>
      </div>
    </header>

    <!-- stats: count up on scroll into view -->
    <section class="stats reveal" data-reveal>
      <div v-for="(s, i) in t.stats" :key="s.label" class="stat" :style="rd(i)">
        <span class="stat-num" ref="statNums">{{ s.num }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </section>

    <!-- pillars: subtle tilt on hover -->
    <section class="pillars">
      <a
        v-for="(p, i) in t.pillars"
        :key="p.title"
        class="pillar reveal"
        data-reveal
        :style="rd(i)"
        :href="localeHref(p.link)"
        @pointermove="tilt"
        @pointerleave="untilt"
      >
        <span class="spotlight" aria-hidden="true"></span>
        <span class="pillar-icon" :data-kind="p.kind" v-html="icons[p.kind]"></span>
        <h3>{{ p.title }}</h3>
        <p>{{ p.desc }}</p>
        <span class="pillar-more"
          >{{ p.more }}
          <svg viewBox="0 0 24 24" width="15" height="15">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </a>
    </section>

    <!-- signature capabilities -->
    <section class="section caps">
      <div class="sec-head reveal" data-reveal>
        <span class="kicker">{{ t.capsKicker }}</span>
        <h2>{{ t.capsTitle }}</h2>
        <p class="sec-sub">{{ t.capsSub }}</p>
      </div>
      <div class="bento reveal" data-reveal>
        <div v-for="col in t.caps" :key="col.lib" class="caps-col">
          <div class="caps-col-head">
            <span class="caps-lib">{{ col.lib }}</span>
            <span class="caps-lib-tag">{{ col.tag }}</span>
          </div>
          <ul class="caps-list">
            <li v-for="(item, ii) in col.items" :key="item.name" :style="rd(ii)">
              <span class="caps-ico" v-html="icons[item.kind]"></span>
              <div class="caps-text">
                <span class="caps-name"
                  >{{ item.name }} <code>{{ item.api }}</code></span
                >
                <span class="caps-desc">{{ item.desc }}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- get started -->
    <section class="section start">
      <div class="sec-head reveal" data-reveal>
        <span class="kicker">{{ t.startKicker }}</span>
        <h2>{{ t.startTitle }}</h2>
        <p class="sec-sub">{{ t.startDesc }}</p>
      </div>

      <div class="panel reveal" data-reveal>
        <div class="code-cell">
          <div class="code-head">{{ t.startStep1 }}</div>
          <pre class="snippet" v-pre><span class="c-com">$ npm i ranui ranuts</span>

<span class="c-com">// register the &lt;r-*&gt; elements once</span>
<span class="c-kw">import</span> <span class="c-str">'ranui'</span>
<span class="c-kw">import</span> { debounce } <span class="c-kw">from</span> <span class="c-str">'ranuts'</span></pre>
        </div>
        <div class="code-cell">
          <div class="code-head">{{ t.startStep2 }}</div>
          <pre class="snippet" v-pre><span class="c-com">&lt;!-- Vue, React, or plain HTML --&gt;</span>
<span class="c-tag">&lt;r-button</span> <span class="c-attr">type</span>=<span class="c-str">"primary"</span><span class="c-tag">&gt;</span>Save<span class="c-tag">&lt;/r-button&gt;</span>
<span class="c-tag">&lt;r-progress</span> <span class="c-attr">percent</span>=<span class="c-str">"66"</span><span class="c-tag">&gt;&lt;/r-progress&gt;</span></pre>
        </div>
      </div>
    </section>

    <!-- feature strip -->
    <section class="strip reveal" data-reveal>
      <div v-for="(f, i) in t.features" :key="f.title" class="feature" :style="rd(i)">
        <span class="feature-head">
          <span class="feature-icon" v-html="icons[f.kind]"></span>
          <h4>{{ f.title }}</h4>
        </span>
        <p>{{ f.desc }}</p>
      </div>
    </section>

    <footer class="closing reveal" data-reveal>
      <span>{{ t.closing }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useData, withBase } from 'vitepress';

const { lang } = useData();
const isCN = computed(() => (lang.value || '').toLowerCase().startsWith('zh'));
const localeHref = (path: string): string => withBase(isCN.value ? `/cn${path}` : path);

const root = ref<HTMLElement | null>(null);
const statNums = ref<HTMLElement[]>([]);

// ranui registers the custom elements only on the client.
const mounted = ref(false);

const copied = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | undefined;
const copyInstall = async () => {
  try {
    await navigator.clipboard?.writeText?.('npm i ranui ranuts');
  } catch {
    /* clipboard 不可用时静默降级 */
  }
  copied.value = true;
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => (copied.value = false), 1800);
};

// staggered entrance delay for hero elements (headline words + copy blocks)
const hd = (i: number) => ({ '--hd': `${i * 55}ms` });
// staggered delay for scroll-revealed children
const rd = (i: number) => ({ '--rd': `${i * 60}ms` });

// subtle 3D tilt on pillar cards
const tilt = (e: PointerEvent) => {
  const el = e.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  const mx = e.clientX - r.left;
  const my = e.clientY - r.top;
  el.style.setProperty('--mx', `${mx}px`);
  el.style.setProperty('--my', `${my}px`);
  const rx = ((my / r.height) * 2 - 1) * -3;
  const ry = ((mx / r.width) * 2 - 1) * 3;
  el.style.setProperty('--rx', `${rx}deg`);
  el.style.setProperty('--ry', `${ry}deg`);
};
const untilt = (e: PointerEvent) => {
  const el = e.currentTarget as HTMLElement;
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
};

let io: IntersectionObserver | undefined;

// count a numeric stat up from 0 → target when it scrolls into view
const countUp = (el: HTMLElement) => {
  const raw = el.textContent || '';
  const m = raw.match(/^(\d+)(.*)$/);
  if (!m) return; // non-numeric (e.g. "MIT") — leave as-is
  const target = parseInt(m[1], 10);
  const suffix = m[2];
  const dur = 1100;
  let start = 0;
  const tick = (now: number) => {
    if (!start) start = now;
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

onMounted(() => {
  mounted.value = true;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduce) {
    io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) {
          if (!en.isIntersecting) continue;
          en.target.classList.add('in');
          if ((en.target as HTMLElement).classList.contains('stats')) {
            statNums.value.forEach(countUp);
          }
          io?.unobserve(en.target);
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    );
    root.value?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => io?.observe(el));
  } else {
    root.value?.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('in'));
  }
});

onBeforeUnmount(() => {
  io?.disconnect();
  clearTimeout(copyTimer);
});

const icons: Record<string, string> = {
  ui: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/></svg>',
  utils:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6a1.5 1.5 0 0 0 2.1 2.1l6-6a4 4 0 0 0 5.4-5.4l-2.3 2.3-2.1-2.1z"/></svg>',
  article:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/><path d="M14 4v5h5M8 13h8M8 17h5"/></svg>',
  agnostic:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  typed:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/></svg>',
  pwa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2"/></svg>',
  i18n: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.9 6 4 9-.1 3-1.5 6.4-4 9-2.5-2.6-3.9-6-4-9 .1-3 1.5-6.4 4-9z"/></svg>',
  bridge:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="5" cy="12" r="2.4"/><circle cx="19" cy="12" r="2.4"/><path d="M7.4 12h9.2"/></svg>',
  gpu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9.5 3v3M14.5 3v3M9.5 18v3M14.5 18v3M3 9.5h3M3 14.5h3M18 9.5h3M18 14.5h3"/></svg>',
  vdom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="5" r="2.2"/><circle cx="6" cy="19" r="2.2"/><circle cx="18" cy="19" r="2.2"/><path d="M12 7.2v3.3M12 10.5 6.6 16.9M12 10.5l5.4 6.4"/></svg>',
  totp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="M12 9v3.2l2 1.4"/></svg>',
  mime: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4M10 13h5M10 17h4"/></svg>',
  player:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M10.5 9l4.5 3-4.5 3z" fill="currentColor" stroke="none"/></svg>',
  droplet:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3s6 6.4 6 10.5a6 6 0 0 1-12 0C6 9.4 12 3 12 3z"/></svg>',
  radar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3.5l8 5.8-3 9.2H7l-3-9.2z"/><path d="M12 3.5v15M4 9.3l16 0"/></svg>',
  sigma:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M17 5H7l6 7-6 7h10"/></svg>',
  scratch:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3l2.1 5.3 5.4 2.1-5.4 2.1L12 18l-2.1-5.5L4.5 10.4l5.4-2.1z"/></svg>',
};

const en = {
  eyebrow: 'Open source · MIT Licensed',
  headline: 'A Web Components UI library & typed utility belt',
  subtitle:
    'ranui ships 28+ framework-agnostic r- elements; ranuts packs 90+ tree-shakeable TypeScript helpers. Use them in Vue, React, or plain HTML — no build step required.',
  ctaPrimary: 'Explore Components',
  ctaSecondary: 'Star on GitHub',
  stats: [
    { num: '28+', label: 'Components' },
    { num: '90+', label: 'Utilities' },
    { num: '2', label: 'Languages' },
    { num: 'MIT', label: 'Licensed' },
  ],
  pillars: [
    {
      kind: 'ui',
      title: 'ranui',
      desc: 'A framework-agnostic Web Components library. Drop 28+ styled r- elements into any stack — Vue, React, or plain HTML.',
      more: 'Browse components',
      link: '/src/ranui/',
    },
    {
      kind: 'utils',
      title: 'ranuts',
      desc: 'A utility belt of 90+ typed helpers for strings, objects, color, time, files and the DOM. Tree-shakeable, zero-dependency.',
      more: 'Read the docs',
      link: '/src/ranuts/',
    },
    {
      kind: 'article',
      title: 'Articles',
      desc: 'Field notes and deep dives — design patterns, functional programming, ASTs and the web platform, written along the way.',
      more: 'Start reading',
      link: '/src/article/design_mode.html',
    },
  ],
  capsKicker: 'Capabilities',
  capsTitle: 'Not just another toolkit',
  capsSub: "A handful of things you won't find in most libraries.",
  caps: [
    {
      lib: 'ranuts',
      tag: 'utilities',
      items: [
        {
          kind: 'bridge',
          name: 'Bridge',
          api: 'PostMessageBridge',
          desc: 'Promise-based RPC over postMessage across iframes, workers & tabs — structured-clone transport, channel isolation.',
        },
        {
          kind: 'gpu',
          name: 'Visual',
          api: 'Application',
          desc: 'A PixiJS-style scene graph with a pluggable WebGPU / WebGL / Canvas renderer backend.',
        },
        {
          kind: 'vdom',
          name: 'Virtual DOM',
          api: 'h() · init()',
          desc: 'A snabbdom-style vDOM — hyperscript, patch, pluggable modules and lifecycle hooks.',
        },
        {
          kind: 'totp',
          name: 'TOTP',
          api: 'TOTP',
          desc: 'RFC-6238 one-time passwords, SHA-1 through SHA3-512, with zero crypto dependencies.',
        },
        {
          kind: 'mime',
          name: 'MIME registry',
          api: 'getMime()',
          desc: 'A ~1000-entry bidirectional MIME ⇄ file-extension lookup.',
        },
      ],
    },
    {
      lib: 'ranui',
      tag: 'components',
      items: [
        {
          kind: 'player',
          name: 'Player',
          api: '<r-player>',
          desc: 'An HLS adaptive-streaming video player with a modular controller core.',
        },
        {
          kind: 'droplet',
          name: 'Color picker',
          api: '<r-colorpicker>',
          desc: 'A full HSV picker with hue + alpha sliders and live HEX / RGBA output.',
        },
        {
          kind: 'radar',
          name: 'Radar chart',
          api: '<r-radar>',
          desc: 'A canvas-drawn radar / ability chart — real data-viz, not a generic widget.',
        },
        {
          kind: 'sigma',
          name: 'Math',
          api: '<r-math>',
          desc: 'Renders LaTeX via lazily-loaded KaTeX from a single attribute.',
        },
        {
          kind: 'scratch',
          name: 'Scratch card',
          api: '<r-scratch>',
          desc: 'An interactive canvas scratch-to-reveal with a completion threshold.',
        },
      ],
    },
  ],
  startKicker: 'Quick start',
  startTitle: 'Get started in seconds',
  startDesc:
    'Install both packages, register the elements once, and use them anywhere — no build step or framework required.',
  startStep1: 'Install & register',
  startStep2: 'Use anywhere',
  copy: 'Copy install command',
  liveLabel: 'Live',
  liveNote: 'Real ranui components, running right on this page.',
  features: [
    {
      kind: 'agnostic',
      title: 'Works everywhere',
      desc: 'Standards-based custom elements run in any framework, or none at all.',
    },
    { kind: 'typed', title: 'Fully typed', desc: 'Written in TypeScript, shipped with declarations end to end.' },
    {
      kind: 'pwa',
      title: 'Installable & offline',
      desc: 'The docs themselves are a PWA with a hand-rolled service worker.',
    },
    { kind: 'i18n', title: 'Bilingual', desc: 'Every page maintained in English and 简体中文.' },
  ],
  closing: 'If you want to go fast, go alone. If you want to go far, go together.',
};

const cn = {
  eyebrow: '开源 · MIT 协议',
  headline: 'Web Components 组件库与 TypeScript 工具集',
  subtitle:
    'ranui 提供 28+ 个框架无关的 r- 元素，ranuts 收录 90+ 个可 Tree-shaking 的类型化工具函数 —— 在 Vue、React 或纯 HTML 中直接使用，无需构建步骤。',
  ctaPrimary: '浏览组件',
  ctaSecondary: '前往 GitHub',
  stats: [
    { num: '28+', label: '组件' },
    { num: '90+', label: '工具函数' },
    { num: '2', label: '语言' },
    { num: 'MIT', label: '协议' },
  ],
  pillars: [
    {
      kind: 'ui',
      title: 'ranui',
      desc: '框架无关的 Web Components 组件库。28+ 个开箱即用的 r- 元素，可放进 Vue、React 或纯 HTML 的任意技术栈。',
      more: '查看组件',
      link: '/src/ranui/',
    },
    {
      kind: 'utils',
      title: 'ranuts',
      desc: '90+ 个带类型的工具函数，覆盖字符串、对象、颜色、时间、文件与 DOM。支持 Tree-shaking，零依赖。',
      more: '阅读文档',
      link: '/src/ranuts/',
    },
    {
      kind: 'article',
      title: '文章',
      desc: '一路记录的技术笔记与深度剖析 —— 设计模式、函数式编程、AST 与 Web 平台。',
      more: '开始阅读',
      link: '/src/article/design_mode.html',
    },
  ],
  capsKicker: '特色能力',
  capsTitle: '不只是又一个工具库',
  capsSub: '一些在多数库里找不到的能力。',
  caps: [
    {
      lib: 'ranuts',
      tag: '工具函数',
      items: [
        {
          kind: 'bridge',
          name: 'Bridge 通信桥',
          api: 'PostMessageBridge',
          desc: '基于 postMessage 的 Promise 化 RPC，跨 iframe、Worker 与标签页通信，结构化克隆传输、通道隔离。',
        },
        {
          kind: 'gpu',
          name: 'Visual 渲染引擎',
          api: 'Application',
          desc: 'PixiJS 风格的场景图，可插拔 WebGPU / WebGL / Canvas 渲染后端。',
        },
        {
          kind: 'vdom',
          name: '虚拟 DOM',
          api: 'h() · init()',
          desc: 'snabbdom 风格的 vDOM —— hyperscript、patch、可插拔模块与生命周期钩子。',
        },
        {
          kind: 'totp',
          name: 'TOTP 验证码',
          api: 'TOTP',
          desc: 'RFC-6238 一次性口令，支持 SHA-1 到 SHA3-512，零加密依赖。',
        },
        { kind: 'mime', name: 'MIME 注册表', api: 'getMime()', desc: '约 1000 条的 MIME ⇄ 文件扩展名双向查询。' },
      ],
    },
    {
      lib: 'ranui',
      tag: '组件',
      items: [
        { kind: 'player', name: '播放器', api: '<r-player>', desc: 'HLS 自适应码率视频播放器，模块化的控制器内核。' },
        {
          kind: 'droplet',
          name: '取色器',
          api: '<r-colorpicker>',
          desc: '完整 HSV 取色，带色相 + 透明度滑块，实时输出 HEX / RGBA。',
        },
        {
          kind: 'radar',
          name: '雷达图',
          api: '<r-radar>',
          desc: 'Canvas 绘制的雷达 / 能力图 —— 真正的数据可视化，而非通用控件。',
        },
        { kind: 'sigma', name: '数学公式', api: '<r-math>', desc: '通过懒加载的 KaTeX，用一个属性渲染 LaTeX 公式。' },
        { kind: 'scratch', name: '刮刮卡', api: '<r-scratch>', desc: '可交互的 Canvas 刮开揭晓，带完成度阈值。' },
      ],
    },
  ],
  startKicker: '快速开始',
  startTitle: '几秒钟即可上手',
  startDesc: '安装两个包，注册一次元素，即可在任意地方使用 —— 无需构建步骤，也不依赖任何框架。',
  startStep1: '安装并注册',
  startStep2: '随处使用',
  copy: '复制安装命令',
  liveLabel: '实时',
  liveNote: '真实的 ranui 组件，就运行在这个页面上。',
  features: [
    { kind: 'agnostic', title: '随处可用', desc: '基于标准的自定义元素，在任意框架或无框架下都能运行。' },
    { kind: 'typed', title: '完整类型', desc: '全程 TypeScript 编写，附带类型声明。' },
    { kind: 'pwa', title: '可安装 · 离线', desc: '文档本身就是一个 PWA，配有手写的 Service Worker。' },
    { kind: 'i18n', title: '双语维护', desc: '每一页都同时维护英文与简体中文。' },
  ],
  closing: '一个人可以走得很快，一群人可以走得更远。',
};

const t = computed(() => (isCN.value ? cn : en));

// split the headline into words so each can rise on its own.
// CN has no spaces → treat the whole string as one segment.
const headlineLines = computed<string[][]>(() => {
  const h = t.value.headline;
  if (isCN.value) return [[h]];
  return [h.split(/\s+/)];
});
const totalWords = computed(() => headlineLines.value.reduce((n, l) => n + l.length, 0));
const wordIndex = (li: number, wi: number): number => {
  let n = 0;
  for (let i = 0; i < li; i++) n += headlineLines.value[i].length;
  return n + wi;
};
</script>

<style scoped>
/* Vercel / Geist monochrome home: ink carries all hierarchy, surfaces ride the
   gray ladder, hairlines weld panels. No colored accent, no heavy blur — dark
   mode is just the token scale flipping (bright ink text on near-black). */
.cine {
  --container: 1120px;
  --hairline: var(--vp-c-divider);
  --ink: var(--vp-c-text-1);
  /* card surface, lifted one step off the page so dark mode reads clearly */
  --surface: var(--vp-c-bg-soft);
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: clamp(56px, 9vw, 128px) 24px 112px;
  isolation: isolate;
}
.cine > * {
  max-width: var(--container);
  margin-left: auto;
  margin-right: auto;
}

/* ---------- minimal ambient ---------- */
.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  max-width: none;
  overflow: hidden;
}
/* one soft neutral glow at the top — a radial gradient (inherently soft, no
   filter:blur, so it never trips dark-mode compositing) */
.glow {
  position: absolute;
  top: -180px;
  left: 50%;
  transform: translateX(-50%);
  width: min(1000px, 120vw);
  height: 620px;
  background: radial-gradient(
    ellipse 50% 50% at 50% 50%,
    color-mix(in srgb, var(--ink) 5%, transparent),
    transparent 70%
  );
  opacity: 0.55;
}
:global(.dark) .glow {
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255, 255, 255, 0.06), transparent 70%);
  opacity: 0.8;
}
.grid {
  position: absolute;
  inset: -10%;
  background-image: radial-gradient(var(--vp-c-divider) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.5;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 20%, transparent 72%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 20%, transparent 72%);
}

/* ---------- hero ---------- */
.hero {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: clamp(36px, 5vw, 72px);
  align-items: center;
  padding-top: clamp(20px, 4vw, 56px);
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-2);
  padding: 6px 14px;
  border: 1px solid var(--hairline);
  border-radius: 999px;
  background: var(--surface);
}
.eyebrow .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ran-color-success, #28a948);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ran-color-success, #28a948) 25%, transparent);
}
.headline {
  margin: 24px 0 0;
  font-family: var(--vp-font-family-base);
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.02;
  font-weight: 720;
  letter-spacing: -0.035em;
  text-wrap: balance;
}
.headline .line {
  display: block;
}
.headline .word {
  display: inline-block;
  overflow: hidden;
  vertical-align: top;
  padding-bottom: 0.16em;
  margin-right: 0.26em;
}
.headline .word-in {
  display: inline-block;
  transform: translateY(115%);
  opacity: 0;
  background: linear-gradient(180deg, var(--ink) 46%, color-mix(in srgb, var(--ink) 55%, transparent) 130%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: word-rise 0.8s cubic-bezier(0.16, 0.84, 0.24, 1) forwards;
  animation-delay: var(--hd, 0ms);
}
@keyframes word-rise {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.subtitle {
  margin: 22px 0 0;
  max-width: 540px;
  font-size: 16px;
  line-height: 1.72;
  color: var(--vp-c-text-2);
}

/* hero copy blocks: fade-up with staggered delay */
[data-hero] {
  opacity: 0;
  transform: translateY(18px);
  animation: hero-in 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
  animation-delay: var(--hd, 0ms);
}
@keyframes hero-in {
  to {
    opacity: 1;
    transform: none;
  }
}

.cmd {
  margin: 28px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 340px;
  padding: 10px 10px 10px 16px;
  border-radius: 10px;
  border: 1px solid var(--hairline);
  background: var(--surface);
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  color: var(--vp-c-text-1);
}
.cmd code::before {
  content: '$ ';
  color: var(--vp-c-text-3);
}
.copy {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  border: 1px solid var(--hairline);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  /* palette props change instantly on hover — never transition color across a
     theme flip, or light/dark switching fades element-by-element */
}
.copy:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}
.copy.done {
  color: var(--ran-color-success, #28a948);
  border-color: color-mix(in srgb, var(--ran-color-success, #28a948) 45%, transparent);
}

.cta {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 999px;
  font-size: 14.5px;
  font-weight: 600;
  /* motion props only (transform / shadow) — color/bg/border change instantly
     on hover so a theme flip never fades button-by-button. Shadow uses a
     theme-stable rgba (not color-mix on --ink) so it doesn't animate on flip. */
  transition:
    transform var(--ran-motion-duration-base, 0.2s) var(--ran-motion-ease-spring, ease),
    box-shadow var(--ran-motion-duration-base, 0.2s) var(--ran-motion-ease-spring, ease);
}
.btn svg {
  transition: transform var(--ran-motion-duration-base, 0.2s) var(--ran-motion-ease-spring, ease);
}
.btn-primary {
  color: var(--ran-color-contrast-text, var(--ran-background-100, #fff));
  background: var(--ran-color-contrast-bg, var(--ran-gray-1000, #171717));
}
.btn-primary:hover {
  background: var(--ran-color-contrast-bg-hover, #383838);
  transform: translateY(-1px);
  box-shadow: 0 8px 22px -10px rgba(0, 0, 0, 0.28);
}
.btn-primary:hover svg {
  transform: translateX(3px);
}
.btn-ghost {
  color: var(--vp-c-text-1);
  border: 1px solid var(--hairline);
  background: var(--surface);
}
.btn-ghost:hover {
  border-color: var(--vp-c-text-3);
  transform: translateY(-1px);
}

/* ---------- hero live panel ---------- */
.hero-live {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--hairline);
  border-radius: 14px;
  background: var(--surface);
  overflow: hidden;
  box-shadow: 0 24px 60px -34px color-mix(in srgb, var(--ink) 45%, transparent);
}
.live-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--hairline);
  background: var(--vp-c-bg-alt);
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ran-color-success, #28a948);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ran-color-success, #28a948) 22%, transparent);
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--ran-color-success, #28a948) 22%, transparent);
  }
  50% {
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--ran-color-success, #28a948) 8%, transparent);
  }
}
.live-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 30px 24px;
  justify-content: center;
}
.live-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.live-inline {
  gap: 18px;
}
.live-progress {
  width: 100%;
  --ran-progress-wrap-height: 6px;
  --ran-progress-wrap-value-background: linear-gradient(90deg, var(--vp-c-text-3), var(--ink));
}
.live-loading {
  --loading-circle-line-border-width: 22px;
  --loading-circle-line-border-height: 22px;
  --loading-circle-line-border-padding: 2.5px;
  --loading-circle-line-border-background: linear-gradient(
    0deg,
    color-mix(in srgb, var(--ink) 12%, transparent) 33%,
    var(--ink) 100%
  );
  --loading-circle-line-core-background: var(--surface);
}
.live-skeleton {
  gap: 14px;
}
.live-skeleton span {
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--vp-c-bg-alt), var(--vp-c-divider), var(--vp-c-bg-alt));
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}
.live-skeleton span:nth-child(2) {
  width: 70%;
}
.live-skeleton span:nth-child(3) {
  width: 45%;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
.live-note {
  padding: 12px 20px 16px;
  font-size: 12.5px;
  color: var(--vp-c-text-3);
}

/* ---------- scroll reveal ---------- */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.7s cubic-bezier(0.2, 0.7, 0.2, 1),
    transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.reveal.in {
  opacity: 1;
  transform: none;
}
.reveal .stat,
.reveal.pillar,
.reveal .caps-list li,
.reveal .feature {
  transition-delay: var(--rd, 0ms);
}

/* ---------- stats ---------- */
.stats {
  margin-top: clamp(64px, 9vw, 104px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--hairline);
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
}
.stat {
  background: var(--vp-c-bg);
  text-align: center;
  padding: 30px 12px;
}
.stat-num {
  display: block;
  font-family: var(--vp-font-family-base);
  font-size: clamp(30px, 4.4vw, 42px);
  font-weight: 680;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}
.stat-label {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

/* ---------- pillars: subtle tilt ---------- */
.pillars {
  margin-top: clamp(72px, 10vw, 120px);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  perspective: 1000px;
}
.pillar {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 30px;
  border-radius: 14px;
  border: 1px solid var(--hairline);
  background: var(--surface);
  overflow: hidden;
  transform: perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
  /* motion props only — border-color changes instantly on hover; box-shadow
     uses theme-stable rgba so neither drags on a theme flip */
  transition:
    box-shadow var(--ran-motion-duration-slow, 0.35s) var(--ran-motion-ease-spring, ease),
    transform var(--ran-motion-duration-base, 0.2s) var(--ran-motion-ease-spring, ease),
    opacity 0.7s var(--ran-motion-ease-smooth, ease);
  transform-style: preserve-3d;
}
.pillar .spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--ran-motion-duration-base, 0.25s) var(--ran-motion-ease-smooth, ease);
  background: radial-gradient(
    240px circle at var(--mx, 50%) var(--my, 0),
    color-mix(in srgb, var(--ink) 8%, transparent),
    transparent 60%
  );
}
.pillar:hover {
  border-color: var(--vp-c-text-3);
  box-shadow: 0 18px 40px -22px rgba(0, 0, 0, 0.32);
}
.pillar:hover .spotlight {
  opacity: 1;
}
.pillar > * {
  position: relative;
  transform: translateZ(18px);
}
.pillar-icon {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: var(--vp-c-text-1);
  border: 1px solid var(--hairline);
  background: var(--vp-c-bg);
}
.pillar-icon :deep(svg) {
  width: 22px;
  height: 22px;
}
.pillar h3 {
  margin: 18px 0 0;
  font-size: 21px;
  font-weight: 640;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  border: 0;
}
.pillar p {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  flex: 1;
}
.pillar-more {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.pillar-more svg {
  transition: transform var(--ran-motion-duration-base, 0.2s) var(--ran-motion-ease-spring, ease);
}
.pillar:hover .pillar-more svg {
  transform: translateX(3px);
}

/* ---------- section head ---------- */
.section {
  margin-top: clamp(80px, 11vw, 128px);
}
.sec-head {
  border-top: 1px solid var(--hairline);
  padding-top: 30px;
  margin-bottom: 34px;
}
.kicker {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--vp-c-text-3);
}
.sec-head h2 {
  margin: 12px 0 0;
  font-family: var(--vp-font-family-base);
  font-size: clamp(26px, 3.6vw, 38px);
  font-weight: 680;
  letter-spacing: -0.025em;
  line-height: 1.16;
  color: var(--vp-c-text-1);
  border: 0;
  padding: 0;
}
.sec-sub {
  margin: 10px 0 0;
  max-width: 560px;
  font-size: 15px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

/* ---------- capabilities bento ---------- */
.bento {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--hairline);
  border: 1px solid var(--hairline);
  border-radius: 14px;
  overflow: hidden;
}
.caps-col {
  padding: 28px 30px;
  background: var(--vp-c-bg);
}
.caps-col-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding-bottom: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--hairline);
}
.caps-lib {
  font-family: var(--vp-font-family-base);
  font-size: 18px;
  font-weight: 660;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}
.caps-lib-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.caps-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.caps-list li {
  display: flex;
  gap: 12px;
  padding: 14px 0;
}
.caps-list li + li {
  border-top: 1px solid var(--hairline);
}
.caps-ico {
  flex: 0 0 auto;
  margin-top: 2px;
  width: 20px;
  height: 20px;
  color: var(--vp-c-text-3);
}
.caps-ico :deep(svg) {
  width: 20px;
  height: 20px;
}
.caps-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.caps-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.caps-name code {
  margin-left: 4px;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-alt);
  padding: 1px 6px;
  border-radius: 5px;
}
.caps-desc {
  font-size: 13px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

/* ---------- get started ---------- */
.panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--hairline);
  border: 1px solid var(--hairline);
  border-radius: 14px;
  overflow: hidden;
}
.code-cell {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
}
.code-head {
  padding: 12px 20px;
  font-family: var(--vp-font-family-mono);
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--hairline);
  background: var(--vp-c-bg-alt);
}
.snippet {
  flex: 1;
  margin: 0;
  padding: 20px 22px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.75;
  overflow-x: auto;
  color: var(--vp-c-text-1);
}
.snippet .c-com {
  color: var(--vp-c-text-3);
}
.snippet .c-kw {
  color: var(--vp-c-text-1);
  font-weight: 600;
}
.snippet .c-str {
  color: var(--vp-c-text-2);
}
.snippet .c-tag {
  color: var(--vp-c-text-1);
}
.snippet .c-attr {
  color: var(--vp-c-text-3);
}

/* ---------- feature strip ---------- */
.strip {
  margin-top: clamp(80px, 11vw, 128px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--hairline);
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
}
.feature {
  background: var(--vp-c-bg);
  padding: 24px 24px;
}
.feature-head {
  display: flex;
  align-items: center;
  gap: 9px;
}
.feature-icon {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  color: var(--vp-c-text-3);
}
.feature-icon :deep(svg) {
  width: 18px;
  height: 18px;
}
.feature h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.feature p {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

/* ---------- closing ---------- */
.closing {
  margin-top: clamp(80px, 11vw, 120px);
  text-align: center;
}
.closing span {
  font-size: 15px;
  font-style: italic;
  color: var(--vp-c-text-3);
}

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .pillars {
    grid-template-columns: 1fr;
  }
  .bento,
  .panel,
  .strip {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .cta {
    flex-direction: column;
  }
  .btn {
    justify-content: center;
  }
  .cmd {
    max-width: none;
  }
}
@media (max-width: 900px) and (min-width: 521px) {
  .strip {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (prefers-reduced-motion: reduce) {
  .live-dot {
    animation: none;
  }
  .word-in {
    animation: none;
    transform: none;
    opacity: 1;
  }
  [data-hero] {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .reveal {
    opacity: 1;
    transform: none;
  }
  .live-skeleton span {
    animation: none;
  }
}
</style>
