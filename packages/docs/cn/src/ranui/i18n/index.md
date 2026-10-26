---
description: '框架无关的国际化引擎：一个小巧的核心加上可选的全局单例，不与 DOM 耦合。'
---

# i18n 国际化

框架无关的国际化引擎。它和 [路由](/cn/src/ranui/router/) 的设计思路一样：一个小巧的核心
（`I18nCore`）加上可选的全局单例（`createI18n` / `useI18n`），不和 DOM 耦合，你可以用任意方式
把它接到 UI 上。

> **使用场景**：需要在 ranui 应用里运行时切换语言：调用一次 `createI18n`，然后用
> `useI18n().t(key, params)` 读取文案，用 `setLocale` 切换语言。它不依赖任何框架或 DOM，所以
> 在纯 JS、任意框架以及 SSR 里都能用。

引擎以独立的 **`ranui/i18n`** 入口提供，引入它**不会**注册任何自定义元素，所以只需要翻译功能的
页面不会把整个组件库带进来。这些导出也可以从顶层 `ranui` 主入口拿到。

## 快速开始

启动时创建一次 i18n 单例，之后即可在任意位置翻译：

```js
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // 每种语言都是「扁平」字典：key 原样查找，不做嵌套。
  messages: {
    en: { 'hero.title': 'Hi {name}', 'nav.home': 'Home' },
    zh: { 'hero.title': '你好 {name}', 'nav.home': '首页' },
  },
  fallbackLocale: 'en', // 当前语言缺少某 key 时的回退语言
  persist: true, // 记住选择，保存在 localStorage 键 'ran-locale'
  detectNavigator: true, // 用浏览器的语言偏好初始化语言
});

const i18n = useI18n();

i18n.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
i18n.setLocale('zh'); // 持久化并通知订阅者
i18n.t('hero.title', { name: 'Ada' }); // → "你好 Ada"
```

`t(key)` 依次查找 `messages[当前语言][key]`、`messages[回退语言][key]`，都没有时返回 `key`
本身。字符串中的 `{param}` 占位符会用第二个参数插值。由于查找就是一次扁平的映射访问，**key 是字面量
字符串**：写成 `'hero.title'` 这一个 key，而不是嵌套的 `{ hero: { title } }` 对象。

## 参数（插值）

文案可以接收运行时参数。在字符串里放 `{name}` 形式的占位符，调用 `t()` 时把值作为第二个
参数传入，每个 `{param}` 会被对应的值替换：

```js
createI18n({
  messages: {
    en: {
      'cart.summary': '{count} items · ${total}',
      greeting: 'Welcome back, {user}!',
    },
    zh: {
      'cart.summary': '{count} 件商品 · ¥{total}',
      greeting: '欢迎回来，{user}！',
    },
  },
});

const i18n = useI18n();
i18n.t('cart.summary', { count: 3, total: 59.9 }); // → "3 件商品 · ¥59.9"（当前语言为 zh 时）
i18n.t('greeting', { user: 'Ada' }); // → "欢迎回来，Ada！"
```

细节：

- 占位符语法为 `{word}`（字母、数字、`_`）。值可以是字符串或数字，数字会被转成字符串。
- 没有对应键的占位符会**原样保留**（`{oops}` 会字面出现在输出里），便于发现漏传的参数，而不是
  静默变空。
- 插值发生在语言回退之后，因此无论最终解析到哪种语言，同一组参数都能生效。
- 内置**不含**复数和数字 / 日期格式化，请先用 `Intl.NumberFormat` / `Intl.PluralRules` 格式化，
  再把结果作为参数传入。

## 转义字面花括号

单个 `{` 或 `}`、以及像 `{ color: red }` 这种带空格的组合**都不是**占位符，会原样输出，所以消息
里的 CSS、JSON、代码片段默认是安全的。唯一有歧义的情况是想原样显示 `{word}` 这样的字面量。转义方式
是**把花括号写两遍**，和 Rust `format!`、Python `str.format`、.NET `String.Format` 的约定相同：

::: v-pre

```js
const i18n = useI18n(); // 假设下面的消息已注册

i18n.t('use {{ and }} for literal braces'); // → "use { and } for literal braces"
i18n.t('the {{count}} token'); // → "the {count} token"（不插值）
i18n.t('{{{name}}}', { name: 'Ada' }); // → "{Ada}"（把值包在字面花括号里）
```

| 消息中写   | 输出                              |
| ---------- | --------------------------------- |
| `{{`       | `{`                               |
| `}}`       | `}`                               |
| `{name}`   | `name` 参数，缺失时为 `{name}`    |
| `{ name }` | `{ name }`（有空格 → 不是占位符） |
| `{`        | `{`（单个花括号）                 |

转义与插值在同一次从左到右的扫描中完成，且无论是否传参都生效，因此 `{{`/`}}` 永远表示字面花括号。

> 花括号加倍与 Rust `format!`、Python `str.format`、.NET `String.Format` 的转义写法一致，无需引入
> 新的转义字符。若确实需要复数/性别/数字语法，请用 `Intl.*` 格式化后作为参数传入。

:::

## 响应语言变化

`onChange` 在每次 `setLocale` 后触发，用它重新渲染已经绘制的文案：

```js
const i18n = useI18n();

const unsubscribe = i18n.onChange((locale) => {
  document.documentElement.lang = locale;
  repaintStrings(); // 重新执行你的 t() 调用
});

// 视图卸载时
unsubscribe();
```

## 按需加载词条

按需（例如按语言分包）加载某语言的字典并合并进去：

```js
const i18n = useI18n();

const { default: fr } = await import('./locales/fr.js');
i18n.addMessages('fr', fr); // 合并进已有的 'fr' 字典
i18n.setLocale('fr');
```

## 组件内置文案

组件自己写出的少量文字，比如播放器各个控件的无障碍名称，`r-markdown`、`r-math`、`r-mermaid` 上的复制和下载按钮，表单校验提示，以及 token 计量条的超限提示，会跟着读者的语言走。应用注册了 i18n 时用它的当前语言，否则用最近的 `lang` 属性（通常是 `<html lang>`）。内置中文、日语、韩语、西班牙语、葡萄牙语、德语和波斯语七种语言，其他语言显示英文。

想改其中某一条，在自己的词典里定义 `ranui.<key>` 就行，它优先于内置文案：

```js
createI18n({
  messages: {
    en: { 'ranui.player.error': 'This video is unavailable' },
    zh: { 'ranui.player.error': '视频暂时无法播放' },
  },
});
```

每个组件的 key 和英文原文都在 ranui 源码里该组件自己的 `components/<name>/text.ts` 中。元素上设置的属性（如 `label`、`label-*`）仍然比这两者都优先。文案在写入时才确定：元素连接到页面时，或它所表示的状态变化时。所以运行中切换语言后，已经在页面上的元素要等下一次写入才会更新；想立即生效，就按下文的办法重新设置一遍。

## 组件文案的本地化

所有用户可见的文案同时也是输入：attribute、property、选项或插槽内容。传进去的值优先于内置文案，所以另一种本地化方式，就是把 `t()` 的结果传到文案本来就该去的地方：

```js
const i18n = useI18n(); // 假设消息已注册

modal.setAttribute('title', i18n.t('dialog.deleteProject.title'));
themeSwitch.setAttribute('label-dark', i18n.t('theme.dark'));
```

多数组件根本没有自己的文案，文字都来自你本来就在写的插槽和属性。下面这些字符串没有别的来源，表里列出英文原文和用来覆盖它的输入：

| 组件                                              | 内置英文                                                                                                              | 覆盖方式                                             |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `Modal.confirm` / `Modal.open`                    | 标题 `Confirm`，按钮 `OK` / `Cancel`                                                                                  | `title`、`okText`、`cancelText` 选项                 |
| `Modal.info` / `.success` / `.warning` / `.error` | 标题 `Info` / `Success` / `Warning` / `Error`                                                                         | `title` 选项                                         |
| `<r-theme-switch>`                                | aria-label `Theme`、`System theme`、`Light theme`、`Dark theme`                                                       | `label`、`label-system`、`label-light`、`label-dark` |
| `<r-voice-button>`                                | aria-label `Start voice input` / `Stop voice input`；提示 `Release to keep · slide up to cancel`、`Release to cancel` | `label`、`active-label`、`hold-hint`、`cancel-hint`  |
| `<r-reasoning>`                                   | 头部标签 `Reasoning`                                                                                                  | `label`                                              |
| `<r-token-meter>`                                 | 标签 `Context`                                                                                                        | `label`                                              |
| `<r-colorpicker>`                                 | aria-label `Choose color`、`Hue`、`Alpha opacity`                                                                     | `label`、`hue-label`、`alpha-label`                  |
| `<r-player>`                                      | 错误面板标题 `Playback failed`，重试按钮 `Retry`                                                                      | `label-error`、`label-retry`                         |
| `<r-markdown>` / `<r-math>` / `<r-mermaid>`       | 工具栏按钮 `Copy code`、`Download` 等                                                                                 | `label-copy`、`label-download` 等 `label-*`          |

实用做法是把它们集中在一处、随语言切换重新应用，这样启动时和切换后跑的是同一段代码：

```js
const i18n = useI18n();

const applyLabels = () => {
  document.querySelectorAll('r-voice-button').forEach((el) => {
    el.setAttribute('label', i18n.t('voice.start'));
    el.setAttribute('active-label', i18n.t('voice.stop'));
  });
};

applyLabels();
i18n.onChange(applyLabels);
```

别忘了同步 `document.documentElement.lang`，浏览器、屏幕阅读器和 `:lang()` 选择器都以它为准。

## API

`createI18n(config)` 创建并注册全局单例（只调用一次）；`useI18n()` 返回该单例，若尚未调用
`createI18n` 则返回 `null`。

### `I18nConfig`

| 字段              | 类型             | 默认值         | 说明                                                                                                                                |
| ----------------- | ---------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `messages`        | `LocaleMessages` | `{}`           | `语言 → { key → 字符串 }`，每个字典都是扁平的。                                                                                     |
| `locale`          | `string`         | 回退语言       | 初始语言（开启持久化时会被已保存的选择覆盖）。                                                                                      |
| `fallbackLocale`  | `string`         | `'en'`         | 当前语言缺少某 key 时查询的回退语言。                                                                                               |
| `persist`         | `boolean`        | `false`        | 将当前语言持久化到 `localStorage`。                                                                                                 |
| `storageKey`      | `string`         | `'ran-locale'` | 开启持久化时使用的 localStorage 键。                                                                                                |
| `detectNavigator` | `boolean`        | `false`        | 用浏览器的语言偏好初始化语言。读的是完整有序的 `navigator.languages` 列表，首选语言没有字典时会取第二选择，而不是直接落到回退语言。 |

### `I18nCore` 方法

| 方法                        | 返回值        | 说明                                     |
| --------------------------- | ------------- | ---------------------------------------- |
| `t(key, params?)`           | `string`      | 翻译；依次回退到回退语言、再到 key。     |
| `setLocale(locale)`         | `void`        | 切换语言；持久化（若开启）并通知订阅者。 |
| `getLocale()`               | `string`      | 当前语言。                               |
| `onChange(handler)`         | `() => void`  | 订阅语言变化；返回取消订阅函数。         |
| `addMessages(locale, dict)` | `void`        | 向某语言合并更多词条。                   |
| `getMessages(locale?)`      | `MessageDict` | 读取某语言的字典（默认当前语言）。       |
| `availableLocales`          | `string[]`    | 已注册字典的语言列表。                   |
| `destroy()`                 | `void`        | 移除所有订阅者。                         |

**类型**

```ts
type MessageDict = Record<string, string>; // 扁平：'hero.title' → 'Hi {name}'
type LocaleMessages = Record<string, MessageDict>; // 语言 → MessageDict
type TranslateParams = Record<string, string | number>;
```

## SSR

核心逻辑是 SSR 安全的：对 `localStorage` 和 `navigator` 的访问都加了判断，所以 `createI18n` / `t`
在服务端渲染时不会抛错。持久化和浏览器语言检测在服务端什么都不做，等代码跑到浏览器里再生效。
