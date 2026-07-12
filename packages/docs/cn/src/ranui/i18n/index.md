# i18n 国际化

框架无关的国际化引擎。它与 [路由](/cn/src/ranui/router/) 采用相同的设计——一个小巧的核心
（`I18nCore`）加上可选的全局单例（`createI18n` / `useI18n`），不与 DOM 耦合，你可以用任意方式
把它绑定到 UI。

> **使用场景**：需要在 ranui 应用中运行时切换语言时——调用一次 `createI18n`，然后用
> `useI18n().t(key, params)` 读取文案、用 `setLocale` 切换语言。它不依赖任何框架或 DOM，因此
> 在纯 JS、任意框架以及 SSR 中都能工作。

引擎作为独立的 **`ranui/i18n`** 入口提供——引入它**不会**注册任何自定义元素，因此只需要翻译的
页面不会把整个组件库带进来。这些导出同样可从顶层 `ranui` 主入口获取。

## 快速开始

启动时创建一次 i18n 单例，之后即可在任意位置翻译：

```js
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // 每种语言都是「扁平」字典——key 原样查找，不做嵌套。
  messages: {
    en: { 'hero.title': 'Hi {name}', 'nav.home': 'Home' },
    zh: { 'hero.title': '你好 {name}', 'nav.home': '首页' },
  },
  fallbackLocale: 'en', // 当前语言缺少某 key 时的回退语言
  persist: true, // 记住选择，保存在 localStorage 键 'ran-locale'
  detectNavigator: true, // 用 navigator.language 初始化语言
});

const i18n = useI18n();

i18n.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
i18n.setLocale('zh'); // 持久化并通知订阅者
i18n.t('hero.title', { name: 'Ada' }); // → "你好 Ada"
```

`t(key)` 依次查找 `messages[当前语言][key]`、`messages[回退语言][key]`，都没有时返回 `key`
本身。字符串中的 `{param}` 占位符会用第二个参数插值。由于查找是扁平的映射访问，**key 是字面量
字符串**——写成 `'hero.title'` 一个 key，而不是嵌套的 `{ hero: { title } }` 对象。

## 参数（插值）

支持——文案可以接收运行时参数。在字符串里放 `{name}` 形式的占位符，调用 `t()` 时把值作为第二个
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

- 占位符语法为 `{word}`（字母、数字、`_`）。值可以是字符串或数字——数字会被转成字符串。
- 没有对应键的占位符会**原样保留**（`{oops}` 会字面出现在输出里），便于发现漏传的参数，而不是
  静默变空。
- 插值发生在语言回退之后，因此无论最终解析到哪种语言，同一组参数都能生效。
- 内置**不含**复数、数字/日期格式化——请配合 `Intl.NumberFormat` / `Intl.PluralRules` 先格式化，
  再把结果作为参数传入。

## 转义字面花括号

单个 `{` 或 `}`、以及像 `{ color: red }` 这种带空格的组合**都不是**占位符，会原样通过——因此消息
里的 CSS、JSON、代码片段默认是安全的。唯一有歧义的情况是想原样显示字面量 `{word}`。转义方式是
**把花括号加倍**——与 Rust `format!`、Python `str.format`、.NET `String.Format` 相同的约定：

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

> **为什么用加倍而不是反斜杠或 ICU 引号？** 重量级 i18n 方案各有取法：**ICU MessageFormat**
> （react-intl / FormatJS、Java、PHP）用单引号转义——`'{'`——因为它还要解析
> `{count, plural, …}` / `{gender, select, …}` 这类富语法，需要一个引用字符。**i18next** 干脆把
> `{{name}}` 本身作为占位符，于是单花括号天然是字面量。**Vue I18n** 用字面包裹形式 `{'{'}`。
> ranui 保持轻量的单花括号 `{name}` 语法，对它而言「花括号加倍」是最不意外的补充：不引入新的转义
> 字符、在各主流 format-string API 中都很熟悉、且一次扫描即可推理清楚。若确实需要复数/性别/数字
> 语法，请用 `Intl.*` 格式化后作为参数传入。

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

## API

`createI18n(config)` 创建并注册全局单例（只调用一次）；`useI18n()` 返回该单例，若尚未调用
`createI18n` 则返回 `null`。

### `I18nConfig`

| 字段              | 类型             | 默认值         | 说明                                            |
| ----------------- | ---------------- | -------------- | ----------------------------------------------- |
| `messages`        | `LocaleMessages` | `{}`           | `语言 → { key → 字符串 }`，每个字典都是扁平的。 |
| `locale`          | `string`         | 回退语言       | 初始语言（开启持久化时会被已保存的选择覆盖）。  |
| `fallbackLocale`  | `string`         | `'en'`         | 当前语言缺少某 key 时查询的回退语言。           |
| `persist`         | `boolean`        | `false`        | 将当前语言持久化到 `localStorage`。             |
| `storageKey`      | `string`         | `'ran-locale'` | 开启持久化时使用的 localStorage 键。            |
| `detectNavigator` | `boolean`        | `false`        | 用 `navigator.language` 初始化语言。            |

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

核心逻辑 SSR 安全：对 `localStorage` 和 `navigator` 的访问都有防护，因此 `createI18n` / `t`
在服务端渲染时不会抛错。持久化与浏览器语言检测在服务端只是空操作，等代码运行到浏览器后再生效。
