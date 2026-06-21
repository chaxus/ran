type Lang = 'en' | 'zh';

const STORAGE_KEY = 'ran-lang';

const messages: Record<Lang, Record<string, string>> = {
  en: {
    // nav
    'nav.why': 'Why ranui',
    'nav.themes': 'Theme Lab',
    'nav.components': 'Components',
    'nav.code': 'Code',
    'nav.style': 'Style API',
    // hero
    'hero.eyebrow': 'Component Workbench',
    'hero.h1': 'Build native UI,<br>then <em>bend its skin.</em>',
    'hero.copy':
      'ranui ships Web Components that stay inspectable in plain HTML, typed app code, and CSS-token-driven theme packs.',
    'hero.cta.primary': 'Open theme lab',
    'hero.cta.secondary': 'Explore components',
    'hero.stat.elements': 'custom elements',
    'hero.stat.packs': 'theme packs',
    'hero.stat.wrappers': 'wrappers required',
    'hero.spec.shadow': 'Shadow DOM',
    'hero.spec.tokens': 'CSS tokens',
    'hero.spec.ssr': 'SSR helpers',
    'hero.spec.imports': 'Per-component imports',
    // workbench
    'workbench.title': 'Live DOM Preview',
    'workbench.panel': 'Ship controls',
    'workbench.typed': 'Typed custom elements',
    'workbench.trace.element': 'Element',
    'workbench.trace.style': 'Style hook',
    'workbench.trace.import': 'Import',
    // theme packs
    'pack.default': 'Default',
    'pack.pixel-retro': 'Pixel Retro',
    'pack.windows-98': 'Windows 98',
    'pack.windows-xp': 'Windows XP',
    'pack.system-6': 'System 6',
    'pack.wired': 'Wired',
    'pack.paper': 'Paper',
    'pack.neo-brutalism': 'Neo Brutalism',
    // component jump
    'jump.button': 'Button',
    'jump.input': 'Input',
    'jump.select': 'Select',
    'jump.message': 'Message',
    'jump.modal': 'Modal',
    'jump.radar': 'Radar',
    // gallery groups
    'group.actions': 'Actions and inputs',
    'group.feedback': 'Feedback',
    'group.navigation': 'Navigation and overlays',
    'group.media': 'Media and advanced',
    // feature cards
    'feature.cross.title': 'Cross-framework',
    'feature.cross.desc': 'Use the same components from plain HTML, React, Vue, Svelte, or any runtime that renders DOM.',
    'feature.native.title': 'Native custom elements',
    'feature.native.desc': 'Components ship as standards-based elements with encapsulated behavior and predictable markup.',
    'feature.modular.title': 'Modular imports',
    'feature.modular.desc': 'Import the whole library for prototypes or load individual controls for tighter bundles.',
    'feature.typed.title': 'Typed with TypeScript',
    'feature.typed.desc': 'Authoring and public paths are typed so component APIs stay clear in larger codebases.',
    'feature.tokens.title': 'Token-based styling',
    'feature.tokens.desc': 'Theme values flow through CSS variables, making brand colors and density easy to tune.',
    'feature.ssr.title': 'SSR builder path',
    'feature.ssr.desc':
      'Server rendering helpers keep markup generation available when hydration is not the first step.',
    // component cards
    'card.button.title': 'Button',
    'card.button.desc': 'Trigger actions with primary, warning, text, icon, and disabled states.',
    'card.button.meta': 'action',
    'card.icon.title': 'Icon',
    'card.icon.desc': 'Register SVG assets once and render consistent symbols anywhere.',
    'card.icon.meta': 'visual',
    'card.input.title': 'Input',
    'card.input.desc': 'Collect text, passwords, labels, and icon-assisted values.',
    'card.input.meta': 'form',
    'card.select.title': 'Select',
    'card.select.desc': 'Choose from option lists with popup placement and search support.',
    'card.select.meta': 'form',
    'card.checkbox.title': 'Checkbox',
    'card.checkbox.desc': 'Represent binary choices with checked, unchecked, and disabled states.',
    'card.checkbox.meta': 'form',
    'card.form.title': 'Form',
    'card.form.desc': 'Coordinate named controls and submit handling through slots.',
    'card.form.meta': 'form',
    'card.progress.title': 'Progress',
    'card.progress.desc': 'Show completion as a fixed value or draggable progress control.',
    'card.progress.meta': 'feedback',
    'card.loading.title': 'Loading',
    'card.loading.desc': 'Use compact loaders for pending network, media, or state transitions.',
    'card.loading.meta': 'feedback',
    'card.skeleton.title': 'Skeleton',
    'card.skeleton.desc': 'Reserve content shape while async data or media loads.',
    'card.skeleton.meta': 'feedback',
    'card.message.title': 'Message',
    'card.message.desc': 'Surface transient feedback inline or through the global message API.',
    'card.message.meta': 'feedback',
    'card.tabs.title': 'Tabs',
    'card.tabs.desc': 'Switch between related panels without leaving the current page context.',
    'card.tabs.meta': 'navigation',
    'card.popover.title': 'Popover',
    'card.popover.desc': 'Attach contextual floating content to a trigger element.',
    'card.popover.meta': 'overlay',
    'card.modal.title': 'Modal',
    'card.modal.desc': 'Focus attention on blocking decisions or richer temporary flows.',
    'card.modal.meta': 'overlay',
    'card.image.title': 'Image',
    'card.image.desc': 'Render image content with a consistent component wrapper.',
    'card.image.meta': 'media',
    'card.colorpicker.title': 'Color Picker',
    'card.colorpicker.desc': 'Let users select solid or alpha-aware colors in themed surfaces.',
    'card.colorpicker.meta': 'input',
    'card.math.title': 'Math',
    'card.math.desc': 'Display LaTeX expressions inside normal interface content.',
    'card.math.meta': 'content',
    'card.radar.title': 'Radar',
    'card.radar.desc': 'Compare weighted scores in a compact polygon chart.',
    'card.radar.meta': 'chart',
    'card.scratch.title': 'Scratch',
    'card.scratch.desc': 'Create an interactive reveal surface for promotional or game-like moments.',
    'card.scratch.meta': 'advanced',
    // sections
    'section.why.heading': 'Why ranui',
    'section.why.subtitle':
      'Small primitives for teams that want browser-native UI without giving up framework ergonomics.',
    'section.themes.heading': 'Theme Lab',
    'section.themes.subtitle':
      'Use the Theme and Pack selects in the nav to switch styles. Scan the palette below before choosing.',
    'section.components.heading': 'Component Directory',
    'section.components.subtitle': 'Live examples with same-page notes for imports, usage, and styling hooks.',
    'section.notes.heading': 'Component notes',
    'section.notes.subtitle': 'Quick import paths and usage reminders for the controls shown above.',
    'section.code.heading': 'Code',
    'section.code.subtitle':
      'Choose the path that matches the app boundary: direct browser script, package side effect, single component, or JSX.',
    'section.style.heading': 'Style API',
    'section.style.subtitle':
      'Theme with documented tokens first, then target exposed parts when a component needs local shape changes.',
    // shared
    'link.viewnotes': 'View notes',
  },

  zh: {
    // nav
    'nav.why': '为什么选 ranui',
    'nav.themes': '主题实验室',
    'nav.components': '组件',
    'nav.code': '代码',
    'nav.style': '样式 API',
    // hero
    'hero.eyebrow': '组件工作台',
    'hero.h1': '构建原生 UI，<br>然后<em>弯曲它的外观。</em>',
    'hero.copy': 'ranui 提供基于 Web Components 的 UI 组件，可在原生 HTML、框架代码和 CSS 变量驱动的主题包中无缝使用。',
    'hero.cta.primary': '打开主题实验室',
    'hero.cta.secondary': '探索组件',
    'hero.stat.elements': '个自定义元素',
    'hero.stat.packs': '个主题包',
    'hero.stat.wrappers': '无需包装器',
    'hero.spec.shadow': 'Shadow DOM',
    'hero.spec.tokens': 'CSS 变量',
    'hero.spec.ssr': 'SSR 支持',
    'hero.spec.imports': '按需引入',
    // workbench
    'workbench.title': '实时 DOM 预览',
    'workbench.panel': '组件面板',
    'workbench.typed': 'TypeScript 类型支持',
    'workbench.trace.element': '元素',
    'workbench.trace.style': '样式钩子',
    'workbench.trace.import': '引入方式',
    // theme packs
    'pack.default': '默认',
    'pack.pixel-retro': '像素复古',
    'pack.windows-98': 'Windows 98',
    'pack.windows-xp': 'Windows XP',
    'pack.system-6': 'System 6',
    'pack.wired': '手绘风格',
    'pack.paper': '纸张风格',
    'pack.neo-brutalism': '新野兽派',
    // component jump
    'jump.button': '按钮',
    'jump.input': '输入框',
    'jump.select': '选择器',
    'jump.message': '消息',
    'jump.modal': '弹窗',
    'jump.radar': '雷达图',
    // gallery groups
    'group.actions': '操作与输入',
    'group.feedback': '反馈',
    'group.navigation': '导航与浮层',
    'group.media': '媒体与高级',
    // feature cards
    'feature.cross.title': '跨框架',
    'feature.cross.desc': '同一套组件可在原生 HTML、React、Vue、Svelte 或任何渲染 DOM 的运行时中使用。',
    'feature.native.title': '原生自定义元素',
    'feature.native.desc': '组件以标准化元素形式提供，具有封装的行为和可预期的标记结构。',
    'feature.modular.title': '模块化引入',
    'feature.modular.desc': '原型阶段可引入整个库，对体积敏感的场景可按需加载单个组件。',
    'feature.typed.title': 'TypeScript 支持',
    'feature.typed.desc': '完整的类型声明，让组件 API 在大型代码库中始终清晰可见。',
    'feature.tokens.title': '基于 Token 的样式',
    'feature.tokens.desc': '主题值通过 CSS 变量流转，品牌色和密度都能轻松调整。',
    'feature.ssr.title': 'SSR 构建路径',
    'feature.ssr.desc': '服务端渲染辅助工具，在不依赖 hydration 的场景下也能生成标记。',
    // component cards
    'card.button.title': '按钮',
    'card.button.desc': '通过 primary、warning、text、icon 和 disabled 等状态触发操作。',
    'card.button.meta': '操作',
    'card.icon.title': '图标',
    'card.icon.desc': '一次注册 SVG 资源，在任何地方渲染统一的图标符号。',
    'card.icon.meta': '视觉',
    'card.input.title': '输入框',
    'card.input.desc': '支持文本、密码、标签和图标辅助等多种输入形式。',
    'card.input.meta': '表单',
    'card.select.title': '选择器',
    'card.select.desc': '从选项列表中选择，支持弹出层定位和搜索功能。',
    'card.select.meta': '表单',
    'card.checkbox.title': '复选框',
    'card.checkbox.desc': '用于表示选中、未选中和禁用三种二元状态。',
    'card.checkbox.meta': '表单',
    'card.form.title': '表单',
    'card.form.desc': '通过插槽协调多个命名控件并处理表单提交。',
    'card.form.meta': '表单',
    'card.progress.title': '进度条',
    'card.progress.desc': '以固定值或可拖拽控件展示完成进度。',
    'card.progress.meta': '反馈',
    'card.loading.title': '加载中',
    'card.loading.desc': '在网络、媒体或状态转换等待期间展示紧凑的加载动画。',
    'card.loading.meta': '反馈',
    'card.skeleton.title': '骨架屏',
    'card.skeleton.desc': '在异步数据或媒体加载时预留内容形状占位。',
    'card.skeleton.meta': '反馈',
    'card.message.title': '消息',
    'card.message.desc': '通过内联展示或全局消息 API 显示即时反馈信息。',
    'card.message.meta': '反馈',
    'card.tabs.title': '标签页',
    'card.tabs.desc': '在相关面板之间切换，无需离开当前页面上下文。',
    'card.tabs.meta': '导航',
    'card.popover.title': '气泡卡片',
    'card.popover.desc': '将上下文浮动内容附加到触发元素上。',
    'card.popover.meta': '浮层',
    'card.modal.title': '弹窗',
    'card.modal.desc': '聚焦用户注意力，用于需要决策或临时操作的场景。',
    'card.modal.meta': '浮层',
    'card.image.title': '图片',
    'card.image.desc': '在统一的组件容器中渲染图片内容。',
    'card.image.meta': '媒体',
    'card.colorpicker.title': '颜色选择器',
    'card.colorpicker.desc': '让用户在主题化界面中选择纯色或带透明度的颜色。',
    'card.colorpicker.meta': '输入',
    'card.math.title': '数学公式',
    'card.math.desc': '在普通界面内容中展示 LaTeX 数学表达式。',
    'card.math.meta': '内容',
    'card.radar.title': '雷达图',
    'card.radar.desc': '在紧凑的多边形图表中比较多维评分。',
    'card.radar.meta': '图表',
    'card.scratch.title': '刮刮卡',
    'card.scratch.desc': '创建用于促销或游戏化场景的交互式揭示界面。',
    'card.scratch.meta': '高级',
    // sections
    'section.why.heading': '为什么选 ranui',
    'section.why.subtitle': '轻量级组件，为需要浏览器原生 UI 但不想放弃框架便利性的团队而生。',
    'section.themes.heading': '主题实验室',
    'section.themes.subtitle': '通过导航栏中的主题和主题包选择器切换样式，在选择前可预览下方调色板。',
    'section.components.heading': '组件目录',
    'section.components.subtitle': '在线示例，附带引入路径、使用方法和样式钩子说明。',
    'section.notes.heading': '组件文档',
    'section.notes.subtitle': '以上所有组件的快速引入路径和使用提示。',
    'section.code.heading': '代码',
    'section.code.subtitle': '根据使用场景选择引入方式：浏览器 script 标签、副作用引入、单组件按需加载或 JSX。',
    'section.style.heading': '样式 API',
    'section.style.subtitle': '优先使用 CSS 变量主题化，若需要局部形状调整则使用 ::part()。',
    // shared
    'link.viewnotes': '查看文档',
  },
};

export type { Lang };

export function getLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'zh' ? 'zh' : 'en';
}

export function applyLanguage(lang: Lang): void {
  const t = messages[lang];

  // 1. Simple textContent via [data-i18n]
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n!;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // 2. innerHTML via [data-i18n-html]  (<br>, <em> etc.)
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html')!;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // 3. r-section: heading + subtitle attributes
  document.querySelectorAll<HTMLElement>('[data-i18n-section]').forEach((el) => {
    const prefix = `section.${el.dataset.i18nSection}`;
    const h = t[`${prefix}.heading`];
    const s = t[`${prefix}.subtitle`];
    if (h !== undefined) el.setAttribute('heading', h);
    if (s !== undefined) el.setAttribute('subtitle', s);
  });

  // 4. r-card: title + description attributes
  document.querySelectorAll<HTMLElement>('[data-i18n-card]').forEach((el) => {
    const prefix = el.dataset.i18nCard!;
    const title = t[`${prefix}.title`];
    const desc = t[`${prefix}.desc`];
    if (title !== undefined) el.setAttribute('title', title);
    if (desc !== undefined) el.setAttribute('description', desc);
  });

  // 5. Gallery group labels (data-group drives CSS ::before content: attr(data-group))
  document.querySelectorAll<HTMLElement>('[data-i18n-group]').forEach((el) => {
    const key = el.dataset.i18nGroup!;
    if (t[key] !== undefined) el.dataset.group = t[key];
  });

  // 6. Mark html element + persist
  document.documentElement.lang = lang;
  localStorage.setItem(STORAGE_KEY, lang);
}
