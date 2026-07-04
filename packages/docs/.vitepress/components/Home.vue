<template>
  <div class="ran-hero">
    <!-- animated aurora background -->
    <div class="ran-aurora" aria-hidden="true">
      <span class="blob blob-1"></span>
      <span class="blob blob-2"></span>
      <span class="blob blob-3"></span>
      <span class="grid"></span>
    </div>

    <!-- hero -->
    <header class="hero-inner">
      <span class="eyebrow reveal" :style="delay(0)"> <span class="dot"></span>{{ t.eyebrow }} </span>

      <h1 class="wordmark reveal" :style="delay(1)">ran</h1>

      <p class="subtitle reveal" :style="delay(3)">{{ t.subtitle }}</p>

      <div class="cta reveal" :style="delay(4)">
        <a class="btn btn-primary" :href="withBase('/src/ranui/')">
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

      <ul class="chips reveal" :style="delay(5)">
        <li v-for="c in t.chips" :key="c">{{ c }}</li>
      </ul>
    </header>

    <!-- stats band -->
    <section class="stats reveal" :style="delay(6)">
      <div v-for="s in t.stats" :key="s.label" class="stat">
        <span class="stat-num">{{ s.num }}</span>
        <span class="stat-label">{{ s.label }}</span>
      </div>
    </section>

    <!-- pillars -->
    <section class="pillars">
      <a
        v-for="(p, i) in t.pillars"
        :key="p.title"
        class="pillar reveal"
        :style="delay(7 + i)"
        :href="withBase(p.link)"
        @pointermove="spot"
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
    <section class="caps">
      <h2 class="caps-title reveal" :style="delay(9)">{{ t.capsTitle }}</h2>
      <p class="caps-sub reveal" :style="delay(9)">{{ t.capsSub }}</p>
      <div class="caps-grid">
        <div v-for="(col, ci) in t.caps" :key="col.lib" class="caps-col reveal" :style="delay(10 + ci)">
          <div class="caps-col-head">
            <span class="caps-lib">{{ col.lib }}</span>
            <span class="caps-lib-tag">{{ col.tag }}</span>
          </div>
          <ul class="caps-list">
            <li v-for="item in col.items" :key="item.name">
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

    <!-- get started: code + live preview -->
    <section class="showcase">
      <div class="showcase-copy reveal" :style="delay(10)">
        <h2>{{ t.startTitle }}</h2>
        <p>{{ t.startDesc }}</p>

        <div class="cmd">
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

        <pre class="snippet" v-pre><span class="c-com">// register the &lt;r-*&gt; elements once</span>
<span class="c-kw">import</span> <span class="c-str">'ranui'</span>
<span class="c-kw">import</span> { debounce } <span class="c-kw">from</span> <span class="c-str">'ranuts'</span></pre>
      </div>

      <div class="showcase-live reveal" :style="delay(11)">
        <div class="live-head"><span class="live-dot"></span>{{ t.liveLabel }}</div>
        <div v-if="mounted" class="live-body">
          <div class="live-row">
            <r-button type="primary">Primary</r-button>
            <r-button type="warning">Warning</r-button>
            <r-button type="text">Text</r-button>
          </div>
          <div class="live-row">
            <r-progress percent="66" total="100" style="width: 100%"></r-progress>
          </div>
          <div class="live-row live-inline">
            <r-loading name="circle"></r-loading>
            <r-checkbox checked="true">Subscribe</r-checkbox>
          </div>
        </div>
        <div v-else class="live-body live-skeleton"><span></span><span></span><span></span></div>
        <span class="live-note">{{ t.liveNote }}</span>
      </div>
    </section>

    <!-- feature strip -->
    <section class="features">
      <div v-for="(f, i) in t.features" :key="f.title" class="feature reveal" :style="delay(12 + i)">
        <span class="feature-icon" v-html="icons[f.kind]"></span>
        <div>
          <h4>{{ f.title }}</h4>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <footer class="closing reveal" :style="delay(16)">
      <span>{{ t.closing }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useData, withBase } from 'vitepress';

const { lang } = useData();

const isCN = computed(() => (lang.value || '').toLowerCase().startsWith('zh'));

// ranui registers the custom elements only on the client — render the live
// demo after mount, showing a skeleton during SSR / first paint.
const mounted = ref(false);
onMounted(() => (mounted.value = true));

const copied = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | undefined;
const copyInstall = () => {
  const text = 'npm i ranui ranuts';
  const done = () => {
    copied.value = true;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => (copied.value = false), 1800);
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(done)
      .catch(() => done());
  } else {
    done();
  }
};

const spot = (e: PointerEvent) => {
  const el = e.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};

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
  tagline: 'A troupe of little vagrants of the world, leave your footprints in my words.',
  subtitle:
    'A web-native toolkit: a Web Components UI library and a typed utility belt — framework-agnostic, tree-shakeable, and documented in two languages.',
  ctaPrimary: 'Explore Components',
  ctaSecondary: 'Star on GitHub',
  chips: ['Web Components', 'TypeScript', 'Framework-agnostic', 'Offline-ready PWA'],
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
      link: '/src/article/design_mode.md',
    },
  ],
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
  startTitle: 'Get started in seconds',
  startDesc:
    'Install both packages, register the elements once, and use them anywhere — no build step or framework required.',
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
  tagline: '世界上一队小小的漂泊者呀，请留下你们的足印在我的文字里。',
  subtitle:
    '面向 Web 的工具集：一个 Web Components 组件库，加一套带类型的工具函数 —— 框架无关、可 Tree-shaking、中英双语维护。',
  ctaPrimary: '浏览组件',
  ctaSecondary: '前往 GitHub',
  chips: ['Web Components', 'TypeScript', '框架无关', '可离线 PWA'],
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
      link: '/src/article/design_mode.md',
    },
  ],
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
  startTitle: '几秒钟即可上手',
  startDesc: '安装两个包，注册一次元素，即可在任意地方使用 —— 无需构建步骤，也不依赖任何框架。',
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

const delay = (i: number) => ({ '--d': `${i * 65}ms` });
</script>

<style scoped>
/* brand gradient stops — deeper on light bg, brighter on dark bg.
   Defined globally on :root/.dark so no intermediate element can shadow them. */
:global(:root) {
  --ran-g1: #7c5cff;
  --ran-g2: #4aa6ff;
  --ran-g3: #ff5db1;
}
:global(.dark) {
  --ran-g1: #a78bff;
  --ran-g2: #7cc4ff;
  --ran-g3: #ff8fcf;
}
.ran-hero {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: clamp(64px, 12vw, 140px) 24px 96px;
  isolation: isolate;
}

/* ---------- aurora background ---------- */
.ran-aurora {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}
.ran-aurora .blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.55;
  will-change: transform;
}
.blob-1 {
  width: 46vw;
  height: 46vw;
  top: -14vw;
  left: -6vw;
  background: radial-gradient(circle at 30% 30%, #7c5cff, transparent 70%);
  animation: drift 22s ease-in-out infinite;
}
.blob-2 {
  width: 40vw;
  height: 40vw;
  top: -10vw;
  right: -8vw;
  background: radial-gradient(circle at 60% 40%, #33b6ff, transparent 70%);
  animation: drift 26s ease-in-out infinite reverse;
}
.blob-3 {
  width: 34vw;
  height: 34vw;
  top: 22vw;
  left: 34vw;
  background: radial-gradient(circle at 50% 50%, #ff5db1, transparent 70%);
  opacity: 0.35;
  animation: drift 30s ease-in-out infinite;
}
.ran-aurora .grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--vp-c-divider) 1px, transparent 1px),
    linear-gradient(90deg, var(--vp-c-divider) 1px, transparent 1px);
  background-size: 56px 56px;
  opacity: 0.18;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 78%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 78%);
}
:global(.dark .ran-aurora .blob) {
  opacity: 0.4;
}
:global(.dark .blob-3) {
  opacity: 0.28;
}

@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(4%, 6%) scale(1.08);
  }
  66% {
    transform: translate(-5%, 3%) scale(0.95);
  }
}

/* ---------- hero ---------- */
.hero-inner {
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
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
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-bg) 60%, transparent);
  backdrop-filter: blur(8px);
}
.eyebrow .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #33d17a;
  box-shadow: 0 0 0 3px color-mix(in srgb, #33d17a 25%, transparent);
}
.wordmark {
  margin: 26px 0 0;
  font-family: 'Bricolage Grotesque', var(--vp-font-family-base);
  font-size: clamp(96px, 21vw, 228px);
  line-height: 0.86;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(115deg, var(--ran-g1) 6%, var(--ran-g2) 50%, var(--ran-g3) 96%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
:global(.dark .wordmark) {
  filter: drop-shadow(0 8px 40px color-mix(in srgb, var(--ran-g1) 40%, transparent));
}
.tagline {
  margin: 20px auto 0;
  max-width: 620px;
  font-size: clamp(17px, 2.4vw, 22px);
  font-weight: 500;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
.subtitle {
  margin: 16px auto 0;
  max-width: 600px;
  font-size: 15.5px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
}

/* ---------- buttons ---------- */
.cta {
  margin-top: 34px;
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
}
.btn svg {
  transition: transform 0.18s ease;
}
.btn-primary {
  color: #fff;
  background: linear-gradient(115deg, #7c5cff, #4aa6ff);
  box-shadow: 0 8px 26px -8px color-mix(in srgb, #4aa6ff 65%, transparent);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 34px -8px color-mix(in srgb, #4aa6ff 75%, transparent);
}
.btn-primary:hover svg {
  transform: translateX(3px);
}
.btn-ghost {
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg) 55%, transparent);
  backdrop-filter: blur(8px);
}
.btn-ghost:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-text-3);
}

/* ---------- chips ---------- */
.chips {
  margin: 30px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}
.chips li {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

/* ---------- stats ---------- */
.stats {
  max-width: 720px;
  margin: clamp(56px, 8vw, 88px) auto 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 26px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 70%, transparent);
  backdrop-filter: blur(6px);
}
.stat {
  text-align: center;
}
.stat-num {
  display: block;
  font-family: 'Bricolage Grotesque', var(--vp-font-family-base);
  font-size: clamp(30px, 5vw, 42px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  background: linear-gradient(120deg, var(--ran-g1), var(--ran-g2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.stat-label {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

/* ---------- pillars ---------- */
.pillars {
  max-width: 1080px;
  margin: clamp(56px, 8vw, 96px) auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.pillar {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px;
  border-radius: 18px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}
.pillar .spotlight {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.25s ease;
  background: radial-gradient(
    220px circle at var(--mx, 50%) var(--my, 0),
    color-mix(in srgb, #7c5cff 22%, transparent),
    transparent 60%
  );
}
.pillar::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(130deg, #7c5cff, #4aa6ff, #ff5db1);
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.22s ease;
}
.pillar:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -22px rgba(60, 80, 200, 0.45);
}
.pillar:hover::before {
  opacity: 1;
}
.pillar:hover .spotlight {
  opacity: 1;
}
.pillar > * {
  position: relative;
}
.pillar-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(135deg, #7c5cff, #4aa6ff);
}
.pillar-icon[data-kind='utils'] {
  background: linear-gradient(135deg, #23c483, #4aa6ff);
}
.pillar-icon[data-kind='article'] {
  background: linear-gradient(135deg, #ff8a5b, #ff5db1);
}
.pillar-icon :deep(svg) {
  width: 24px;
  height: 24px;
}
.pillar h3 {
  margin: 18px 0 0;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  border: 0;
}
.pillar p {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  flex: 1;
}
.pillar-more {
  margin-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--vp-c-brand-1, #4aa6ff);
}
.pillar-more svg {
  transition: transform 0.18s ease;
}
.pillar:hover .pillar-more svg {
  transform: translateX(3px);
}

/* ---------- signature capabilities ---------- */
.caps {
  max-width: 1080px;
  margin: clamp(64px, 9vw, 112px) auto 0;
}
.caps-title {
  margin: 0;
  font-family: 'Bricolage Grotesque', var(--vp-font-family-base);
  font-size: clamp(26px, 3.8vw, 38px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  text-align: center;
}
.caps-sub {
  margin: 10px auto 0;
  text-align: center;
  font-size: 15px;
  color: var(--vp-c-text-2);
}
.caps-grid {
  margin-top: clamp(28px, 4vw, 44px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.caps-col {
  padding: 26px;
  border-radius: 18px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.caps-col-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding-bottom: 16px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.caps-lib {
  font-family: 'Bricolage Grotesque', var(--vp-font-family-base);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
  background: linear-gradient(120deg, var(--ran-g1), var(--ran-g2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.caps-lib-tag {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.caps-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.caps-list li {
  display: flex;
  gap: 13px;
  padding: 12px 0;
}
.caps-list li + li {
  border-top: 1px solid var(--vp-c-divider);
}
.caps-ico {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: var(--ran-g2);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}
.caps-ico :deep(svg) {
  width: 18px;
  height: 18px;
}
.caps-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}
.caps-name {
  font-size: 14.5px;
  font-weight: 650;
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

/* ---------- showcase (code + live) ---------- */
.showcase {
  max-width: 1080px;
  margin: clamp(56px, 8vw, 96px) auto 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: stretch;
}
.showcase-copy {
  padding: 6px 4px;
}
.showcase-copy h2 {
  margin: 0;
  font-family: 'Bricolage Grotesque', var(--vp-font-family-base);
  font-size: clamp(26px, 3.6vw, 34px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  border: 0;
}
.showcase-copy > p {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.65;
  color: var(--vp-c-text-2);
  max-width: 420px;
}
.cmd {
  margin: 22px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 12px 12px 18px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
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
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition:
    color 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}
.copy:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}
.copy.done {
  color: #23c483;
  border-color: color-mix(in srgb, #23c483 45%, transparent);
}
.snippet {
  margin: 14px 0 0;
  padding: 16px 18px;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  font-family: var(--vp-font-family-mono);
  font-size: 13.5px;
  line-height: 1.7;
  overflow-x: auto;
}
.snippet .c-com {
  color: var(--vp-c-text-3);
}
.snippet .c-kw {
  color: #c678dd;
}
.snippet .c-str {
  color: #98c379;
}

.showcase-live {
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}
.live-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
}
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #23c483;
  box-shadow: 0 0 0 3px color-mix(in srgb, #23c483 22%, transparent);
}
.live-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 26px 22px;
  justify-content: center;
}
.live-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.live-inline {
  align-items: center;
  gap: 20px;
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
  padding: 12px 18px 16px;
  font-size: 12.5px;
  color: var(--vp-c-text-3);
}

/* ---------- features ---------- */
.features {
  max-width: 1080px;
  margin: clamp(56px, 8vw, 88px) auto 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.feature {
  display: flex;
  gap: 13px;
  padding: 4px;
}
.feature-icon {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: var(--vp-c-brand-1, #4aa6ff);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.feature-icon :deep(svg) {
  width: 20px;
  height: 20px;
}
.feature h4 {
  margin: 2px 0 0;
  font-size: 15px;
  font-weight: 650;
  color: var(--vp-c-text-1);
}
.feature p {
  margin: 5px 0 0;
  font-size: 13px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
}

/* ---------- closing ---------- */
.closing {
  max-width: 1080px;
  margin: clamp(64px, 9vw, 104px) auto 0;
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}
.closing span {
  font-size: 15px;
  font-style: italic;
  color: var(--vp-c-text-3);
}

/* ---------- reveal animation ---------- */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  animation: reveal 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
  animation-delay: var(--d, 0ms);
}
@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .pillars {
    grid-template-columns: 1fr;
  }
  .features {
    grid-template-columns: repeat(2, 1fr);
  }
  .showcase {
    grid-template-columns: 1fr;
  }
  .caps-grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 22px 16px;
  }
  .features {
    grid-template-columns: 1fr;
  }
  .cta {
    flex-direction: column;
  }
  .btn {
    justify-content: center;
  }
}
@media (prefers-reduced-motion: reduce) {
  .reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .ran-aurora .blob,
  .live-skeleton span {
    animation: none;
  }
}
</style>
