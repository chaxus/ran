# i18n

一个与框架无关的国际化引擎：一个小的响应式内核（`I18nCore`），外加一个可选的全局单例（`createI18n` / `useI18n`）。它完全不碰 DOM —— 怎么绑到 UI 上由你决定。

```ts
import { createI18n, useI18n } from 'ranuts/i18n';
```

`ranuts/utils` 里也有再导出。如果你只需要 i18n，请从 `ranuts/i18n` 引入 —— 这个入口只带引擎和它依赖的两个工具，而不是 `utils` 大 barrel 顺带拖进来的一堆东西。

## 使用

```ts
import { createI18n, useI18n } from 'ranuts/i18n';

createI18n({
  messages: {
    en: { 'hero.title': 'Hello, {name}', 'nav.docs': 'Docs' },
    zh: { 'hero.title': '你好，{name}', 'nav.docs': '文档' },
  },
  fallbackLocale: 'en',
  persist: true,
  detectNavigator: true,
});

const i18n = useI18n()!;
i18n.t('hero.title', { name: 'Ada' }); // "Hello, Ada"
i18n.setLocale('zh');
i18n.t('hero.title', { name: 'Ada' }); // "你好，Ada"
```

词典是**扁平**的 —— `t()` 直接做 `messages[locale][key]` 查表，所以 key 是 `'hero.title'` 这样的字面字符串，不是嵌套对象。

## 初始语言的确定

在构造函数里一次性解析，顺序如下：

1. `localStorage` 里持久化的选择（仅当 `persist` 打开，且该语言有对应词典）
2. `config.locale`
3. 浏览器的语言偏好（仅当 `detectNavigator` 打开）
4. `fallbackLocale`

第 3 步走的是 [`resolveLocale`](/cn/src/ranuts/utils/resolve_locale)，它读的是完整有序的 `navigator.languages` 列表而不是只读 `navigator.language` —— 首选语言不在你的词典里的读者，仍然能拿到他的第二选择，而不是直接掉到 fallback。

## 插值

`t(key, params)` 用一次从左到右的扫描替换 `{param}` 占位符，遵循 Rust `format!`、Python `str.format`、.NET `String.Format` 的格式串约定：

::: v-pre

| 输入                  | 输出                                                 |
| --------------------- | ---------------------------------------------------- |
| `{{`                  | 字面量 `{`                                           |
| `}}`                  | 字面量 `}`                                           |
| `{name}`              | `params.name`，转成字符串                            |
| `{name}` 但没有该参数 | 原样保留，这样漏掉的占位符是可见的，而不是悄悄变成空 |

:::

单独的 `{` / `}`，或者 `{ x }` 这种带空格的组合，**不是**占位符，会原样输出 —— 所以消息里夹带 CSS、JSON 或代码片段不会被破坏。想让值外面包一层字面量花括号，把外层那对写两遍 —— <code v-pre>{{{name}}}</code>。

## 配置

| 字段              | 说明                                           | 类型             | 默认值         |
| ----------------- | ---------------------------------------------- | ---------------- | -------------- |
| `locale`          | 初始语言。`persist` 打开时会被持久化的选择覆盖 | `string`         | `-`            |
| `fallbackLocale`  | 当前语言缺失某个 key 时回退到的语言            | `string`         | `'en'`         |
| `messages`        | 语言 → key → 文案                              | `LocaleMessages` | `{}`           |
| `persist`         | 把当前语言持久化到 `localStorage`              | `boolean`        | `false`        |
| `storageKey`      | `persist` 打开时使用的 `localStorage` key      | `string`         | `'ran-locale'` |
| `detectNavigator` | 用浏览器的语言偏好来确定初始语言               | `boolean`        | `false`        |

## API

### createI18n

创建并注册全局单例。

#### 参数

| 参数     | 说明       | 类型         | 默认值 |
| -------- | ---------- | ------------ | ------ |
| `config` | 见**配置** | `I18nConfig` | `{}`   |

#### 返回

| 参数   | 说明       | 类型       |
| ------ | ---------- | ---------- |
| `i18n` | 新建的实例 | `I18nCore` |

### useI18n

返回当前的全局实例，没有创建过则返回 `null`。

#### 返回

| 参数   | 说明              | 类型               |
| ------ | ----------------- | ------------------ |
| `i18n` | 当前实例或 `null` | `I18nCore \| null` |

### I18nCore

| 成员                        | 说明                                                     |
| --------------------------- | -------------------------------------------------------- |
| `t(key, params?)`           | 翻译；依次回退到 fallback 语言、key 本身                 |
| `locale` / `getLocale()`    | 当前语言                                                 |
| `setLocale(locale)`         | 切换语言，持久化（如果开启）并通知订阅者。没变则是空操作 |
| `addMessages(locale, dict)` | 把词典合并进某个语言，语言不存在则创建                   |
| `getMessages(locale?)`      | 某个语言的词典，没有则 `{}`                              |
| `availableLocales`          | 已注册词典的语言列表                                     |
| `onChange(fn)`              | 订阅语言变化，返回取消订阅函数                           |
| `destroy()`                 | 清空所有订阅者                                           |

## SSR

安全。所有 `localStorage` 和 `navigator` 访问都做了守卫，服务端渲染时构造实例会落到 `config.locale` 或 `fallbackLocale`。
