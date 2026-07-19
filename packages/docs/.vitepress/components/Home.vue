<template>
  <div class="ran-home">
    <!-- ambient background: dot grid + a single quiet blue glow -->
    <div class="bg" aria-hidden="true">
      <span class="bg-glow"></span>
      <span class="bg-dots"></span>
    </div>

    <!-- hero: copy left, live product right -->
    <header class="hero">
      <div class="hero-copy">
        <span class="eyebrow reveal" :style="delay(0)"> <span class="dot"></span>{{ t.eyebrow }} </span>

        <h1 class="headline reveal" :style="delay(1)">{{ t.headline }}</h1>

        <p class="subtitle reveal" :style="delay(2)">{{ t.subtitle }}</p>

        <div class="cmd reveal" :style="delay(3)">
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

        <div class="cta reveal" :style="delay(4)">
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

      <div class="hero-live reveal" :style="delay(2)">
        <div class="live-head"><span class="live-dot"></span>{{ t.liveLabel }}</div>
        <div v-if="mounted" class="live-body">
          <div class="live-row">
            <r-button type="primary">Primary</r-button>
            <r-button>Default</r-button>
            <r-button type="warning">Warning</r-button>
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

    <!-- stats: a bare hairline strip, not another card -->
    <section class="stats reveal" :style="delay(5)">
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
        :style="delay(6 + i)"
        :href="localeHref(p.link)"
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

    <!-- signature capabilities: one bordered bento, columns welded by a hairline -->
    <section class="section caps">
      <div class="sec-head reveal" :style="delay(8)">
        <span class="kicker">{{ t.capsKicker }}</span>
        <h2>{{ t.capsTitle }}</h2>
        <p class="sec-sub">{{ t.capsSub }}</p>
      </div>
      <div class="bento reveal" :style="delay(9)">
        <div v-for="col in t.caps" :key="col.lib" class="caps-col">
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

    <!-- get started: install/register left, use-anywhere right -->
    <section class="section start">
      <div class="sec-head reveal" :style="delay(10)">
        <span class="kicker">{{ t.startKicker }}</span>
        <h2>{{ t.startTitle }}</h2>
        <p class="sec-sub">{{ t.startDesc }}</p>
      </div>

      <div class="panel reveal" :style="delay(11)">
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

    <!-- feature strip: four cells welded by hairlines, no boxes -->
    <section class="strip reveal" :style="delay(12)">
      <div v-for="f in t.features" :key="f.title" class="feature">
        <span class="feature-head">
          <span class="feature-icon" v-html="icons[f.kind]"></span>
          <h4>{{ f.title }}</h4>
        </span>
        <p>{{ f.desc }}</p>
      </div>
    </section>

    <footer class="closing reveal" :style="delay(13)">
      <span>{{ t.closing }}</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useData, withBase } from 'vitepress';

const { lang } = useData();

const isCN = computed(() => (lang.value || '').toLowerCase().startsWith('zh'));

// Internal links point at the current locale's pages (the cn home lives under /cn/).
const localeHref = (path: string): string => withBase(isCN.value ? `/cn${path}` : path);

// ranui registers the custom elements only on the client — render the live
// demo after mount, showing a skeleton during SSR / first paint.
const mounted = ref(false);
onMounted(() => (mounted.value = true));

const copied = ref(false);
let copyTimer: ReturnType<typeof setTimeout> | undefined;
const copyInstall = async () => {
  const text = 'npm i ranui ranuts';
  try {
    await navigator.clipboard?.writeText?.(text);
  } catch {
    /* clipboard 不可用时静默降级,仍给出复制成功反馈 */
  }
  copied.value = true;
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => (copied.value = false), 1800);
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

const delay = (i: number) => ({ '--d': `${i * 70}ms` });
</script>

<style scoped>
/* Geist layout model: one container width, one hairline color, left-aligned
   section heads with a blue kicker, panels welded by 1px lines instead of
   floating cards. Ink carries hierarchy; blue is the single accent. */
.ran-home {
  --container: 1080px;
  --hairline: var(--vp-c-divider);
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: clamp(48px, 8vw, 96px) 24px 96px;
  isolation: isolate;
}
.ran-home > * {
  max-width: var(--container);
  margin-left: auto;
  margin-right: auto;
}

/* ---------- ambient background ---------- */
.bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  max-width: none;
  overflow: hidden;
}
.bg-glow {
  position: absolute;
  top: -320px;
  left: 50%;
  transform: translateX(-50%);
  width: min(1100px, 120vw);
  height: 720px;
  background: radial-gradient(
    ellipse 55% 50% at 50% 22%,
    color-mix(in srgb, var(--ran-blue-700, #006bff) 8%, transparent),
    transparent 68%
  );
  filter: blur(48px);
}
.bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(var(--vp-c-divider) 1px, transparent 1px);
  background-size: 26px 26px;
  opacity: 0.5;
  mask-image: radial-gradient(ellipse 75% 55% at 50% 0%, #000 25%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 75% 55% at 50% 0%, #000 25%, transparent 75%);
}
:global(.dark) .bg-glow {
  background: radial-gradient(
    ellipse 55% 50% at 50% 22%,
    color-mix(in srgb, var(--ran-blue-700, #006bff) 18%, transparent),
    transparent 68%
  );
}

/* ---------- hero: copy left, live product right ---------- */
.hero {
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  gap: clamp(36px, 5vw, 64px);
  align-items: center;
  padding-top: clamp(16px, 3vw, 40px);
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
  background: color-mix(in srgb, var(--vp-c-bg) 60%, transparent);
  backdrop-filter: blur(8px);
}
.eyebrow .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ran-color-success, #28a948);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ran-color-success, #28a948) 25%, transparent);
}
.headline {
  margin: 22px 0 0;
  font-family: var(--vp-font-family-base);
  font-size: clamp(34px, 4.4vw, 50px);
  line-height: 1.08;
  text-wrap: balance;
  font-weight: 700;
  letter-spacing: -0.03em;
  background: linear-gradient(
    180deg,
    var(--vp-c-text-1) 60%,
    color-mix(in srgb, var(--vp-c-text-1) 60%, transparent) 130%
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.subtitle {
  margin: 18px 0 0;
  max-width: 520px;
  font-size: 15.5px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

/* install command, inline in the hero */
.cmd {
  margin: 26px 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 340px;
  padding: 10px 10px 10px 16px;
  border-radius: 10px;
  border: 1px solid var(--hairline);
  background: var(--vp-c-bg-alt);
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
  transition:
    color 0.18s ease,
    border-color 0.18s ease;
}
.copy:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-3);
}
.copy.done {
  color: var(--ran-color-success, #28a948);
  border-color: color-mix(in srgb, var(--ran-color-success, #28a948) 45%, transparent);
}

/* ---------- buttons ---------- */
.cta {
  margin-top: 22px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: 999px;
  font-size: 14.5px;
  font-weight: 600;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}
.btn svg {
  transition: transform 0.18s ease;
}
.btn-primary {
  color: var(--ran-color-primary-text, var(--ran-background-100, #fff));
  background: var(--ran-color-primary, var(--ran-gray-1000, #171717));
}
.btn-primary:hover {
  background: var(--ran-color-primary-hover, #383838);
}
.btn-primary:hover svg {
  transform: translateX(3px);
}
.btn-ghost {
  color: var(--vp-c-text-1);
  border: 1px solid var(--hairline);
  background: color-mix(in srgb, var(--vp-c-bg) 55%, transparent);
  backdrop-filter: blur(8px);
}
.btn-ghost:hover {
  border-color: var(--vp-c-text-3);
}

/* ---------- hero live panel ---------- */
.hero-live {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--hairline);
  border-radius: 12px;
  background: var(--vp-c-bg);
  overflow: hidden;
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
/* the live demo rides the same Geist palette as the rest of the page:
   progress + spinner get their token overrides here (green/teal defaults
   would break the one-accent rule) */
.live-progress {
  width: 100%;
  --ran-progress-wrap-height: 6px;
  --ran-progress-wrap-value-background: linear-gradient(
    90deg,
    var(--ran-blue-600, #48aeff),
    var(--ran-blue-700, #006bff)
  );
}
.live-loading {
  --loading-circle-line-border-width: 22px;
  --loading-circle-line-border-height: 22px;
  --loading-circle-line-border-padding: 2.5px;
  --loading-circle-line-border-background: linear-gradient(
    0deg,
    color-mix(in srgb, var(--ran-blue-700, #006bff) 12%, transparent) 33%,
    var(--ran-blue-700, #006bff) 100%
  );
  --loading-circle-line-core-background: var(--vp-c-bg);
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

/* ---------- stats strip: hairlines, no box ---------- */
.stats {
  margin-top: clamp(56px, 8vw, 88px);
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
  padding: 28px 12px;
}
.stat-num {
  display: block;
  font-family: var(--vp-font-family-base);
  font-size: clamp(28px, 4vw, 36px);
  font-weight: 650;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--vp-c-text-1);
}
.stat-label {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

/* ---------- pillars ---------- */
.pillars {
  margin-top: clamp(64px, 9vw, 112px);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.pillar {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 28px;
  border-radius: 12px;
  border: 1px solid var(--hairline);
  background: var(--vp-c-bg);
  overflow: hidden;
  transition:
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
    color-mix(in srgb, var(--ran-blue-700, #006bff) 12%, transparent),
    transparent 60%
  );
}
.pillar::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  background: linear-gradient(130deg, var(--ran-blue-700, #006bff), var(--ran-blue-500, #94ccff));
  -webkit-mask:
    linear-gradient(#000 0 0) content-box,
    linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.22s ease;
}
.pillar:hover {
  box-shadow: var(--ran-shadow-menu, 0 8px 24px -6px rgba(0, 0, 0, 0.14));
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
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: var(--vp-c-text-1);
  border: 1px solid var(--hairline);
  background: var(--vp-c-bg-soft);
}
.pillar-icon :deep(svg) {
  width: 22px;
  height: 22px;
}
.pillar h3 {
  margin: 18px 0 0;
  font-size: 20px;
  font-weight: 600;
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
  color: var(--vp-c-brand, #006bff);
}
.pillar-more svg {
  transition: transform 0.18s ease;
}
.pillar:hover .pillar-more svg {
  transform: translateX(3px);
}

/* ---------- section head: kicker + left-aligned title ---------- */
.section {
  margin-top: clamp(72px, 10vw, 120px);
}
.sec-head {
  border-top: 1px solid var(--hairline);
  padding-top: 28px;
  margin-bottom: 32px;
}
.kicker {
  display: block;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--vp-c-brand, #006bff);
}
.sec-head h2 {
  margin: 12px 0 0;
  font-family: var(--vp-font-family-base);
  font-size: clamp(24px, 3.2vw, 32px);
  font-weight: 650;
  letter-spacing: -0.02em;
  line-height: 1.2;
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

/* ---------- capabilities bento: columns welded by a hairline ---------- */
.bento {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--hairline);
  border: 1px solid var(--hairline);
  border-radius: 12px;
  overflow: hidden;
}
.caps-col {
  padding: 26px 28px;
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
  font-weight: 650;
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

/* ---------- get started: two welded code cells ---------- */
.panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--hairline);
  border: 1px solid var(--hairline);
  border-radius: 12px;
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
}
.snippet .c-com {
  color: var(--vp-c-text-3);
}
.snippet .c-kw {
  color: var(--ran-blue-700, #006bff);
}
.snippet .c-str {
  color: var(--ran-green-700, #28a948);
}
.snippet .c-tag {
  color: var(--ran-blue-700, #006bff);
}
.snippet .c-attr {
  color: var(--vp-c-text-2);
}

/* ---------- feature strip: hairline-welded cells, no boxes ---------- */
.strip {
  margin-top: clamp(72px, 10vw, 120px);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--hairline);
  border-top: 1px solid var(--hairline);
  border-bottom: 1px solid var(--hairline);
}
.feature {
  background: var(--vp-c-bg);
  padding: 22px 24px;
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
  margin-top: clamp(72px, 10vw, 112px);
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
    transform: none;
  }
}

/* ---------- responsive ---------- */
@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 36px;
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
  .reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .live-skeleton span {
    animation: none;
  }
}
</style>
