---
description: 'フレームワークに依存しない国際化エンジン。小さなコアと、任意のグローバルシングルトンだけで、DOM とは結びついていません。'
---

# i18n

フレームワークに依存しない国際化エンジンです。[ルーター](/ja/src/ranui/router/)と同じ設計で、小さなコア（`I18nCore`）に任意のグローバルシングルトン（`createI18n` / `useI18n`）が付き、DOM とは結びついていません。UI への結び付け方はあなたが決められます。

> **こんなときに**：ranui のアプリで実行時にロケールを切り替えたいとき。`createI18n` を一度呼び、あとは `useI18n().t(key, params)` で文字列を読み、`setLocale` で言語を切り替えます。フレームワークにも DOM にも依存しないので、素の JS でも、どのフレームワークでも、SSR でも動きます。

このエンジンは **`ranui/i18n`** という独立したエントリーとして提供されます。import してもカスタム要素は**ひとつも**登録されないので、翻訳だけが必要なページがコンポーネントライブラリを巻き込むことはありません。同じ export はトップレベルの `ranui` バレルからも使えます。

## クイックスタート

起動時に一度だけ i18n のシングルトンを作れば、あとはどこでも翻訳できます。

```js
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // 各ロケールはフラットな辞書です。キーはそのまま引かれ、入れ子にはなりません。
  messages: {
    en: { 'hero.title': 'Hi {name}', 'nav.home': 'Home' },
    zh: { 'hero.title': '你好 {name}', 'nav.home': '首页' },
  },
  fallbackLocale: 'en', // 有効なロケールにキーがないときに使われます
  persist: true, // localStorage の 'ran-locale' キーに選択を覚えます
  detectNavigator: true, // 初期ロケールをブラウザーの言語設定から決めます
});

const i18n = useI18n();

i18n.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
i18n.setLocale('zh'); // 永続化して購読者に通知します
i18n.t('hero.title', { name: 'Ada' }); // → "你好 Ada"
```

`t(key)` はまず `messages[activeLocale][key]` を、次に `messages[fallbackLocale][key]` を探し、どちらにもなければ `key` そのものを返します。文字列中の `{param}` は第 2 引数から埋められます。検索はフラットなマップへのアクセスなので、**キーはそのままの文字列**です。`'hero.title'` はひとつのキーとして書き、入れ子の `{ hero: { title } }` にはしません。

## パラメーター（補間）

はい、メッセージは実行時のパラメーターを取れます。文字列に `{name}` の形のプレースホルダーを置き、値を `t()` の第 2 引数として渡すと、各 `{param}` が対応する値に置き換わります。

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
i18n.t('cart.summary', { count: 3, total: 59.9 }); // → "3 items · $59.9"
i18n.t('greeting', { user: 'Ada' }); // → "Welcome back, Ada!"
```

細かい点：

- プレースホルダーの書式は `{word}`（英数字と `_`）です。値は文字列でも数値でもよく、数値は文字列化されます。
- 対応するキーがないプレースホルダーは**そのまま残ります**（`{oops}` は出力にそのまま出ます）。黙って空欄になるより、渡し忘れに気づきやすくなります。
- 補間はロケールのフォールバックのあとに走るので、実際にどのロケールが文字列を解決したかによらず、同じパラメーターが効きます。
- 複数形や数値・日付の書式は組み込まれていません。`Intl.NumberFormat` / `Intl.PluralRules` で組み立て、整形済みの文字列をパラメーターとして渡してください。

## 波括弧をそのまま出す

単独の `{` や `}`、あるいは `{ color: red }` のように空白を含んだまとまりは、**プレースホルダーではなく**そのまま通り抜けます。だからメッセージの中の CSS、JSON、コード断片は既定で安全です。紛らわしいのは、そのまま見せたい `{word}` だけです。これをエスケープするには、**波括弧を重ねます**（Rust の `format!`、Python の `str.format`、.NET の `String.Format` と同じ流儀です）。

::: v-pre

```js
const i18n = useI18n(); // 以下のメッセージは登録済みとします

i18n.t('use {{ and }} for literal braces'); // → "use { and } for literal braces"
i18n.t('the {{count}} token'); // → "the {count} token"（補間されません）
i18n.t('{{{name}}}', { name: 'Ada' }); // → "{Ada}"（値が波括弧で包まれます）
```

| メッセージ中 | 出力                                               |
| ------------ | -------------------------------------------------- |
| `{{`         | `{`                                                |
| `}}`         | `}`                                                |
| `{name}`     | `name` パラメーター、なければ `{name}`             |
| `{ name }`   | `{ name }`（空白があるのでプレースホルダーでない） |
| `{`          | `{`（単独の波括弧）                                |

エスケープは補間と同じ左から右への一巡で処理され、パラメーターを渡すかどうかに関わらず働きます。つまり `{{` と `}}` は常に波括弧そのものを意味します。

> 重ねる書き方は Rust の `format!`、Python の `str.format`、.NET の `String.Format` と同じ流儀なので、新しいエスケープ文字を覚える必要はありません。本格的な複数形・性・数の文法が必要なら、`Intl.*` で整形してその結果をパラメーターとして渡してください。

:::

## ロケールの変更に反応する

`onChange` は `setLocale` のたびに発火します。すでに描いた文字列を描き直すのに使ってください。

```js
const i18n = useI18n();

const unsubscribe = i18n.onChange((locale) => {
  document.documentElement.lang = locale;
  repaintStrings(); // t() の呼び出しをやり直す
});

// あとで、ビューがアンマウントされるとき
unsubscribe();
```

## メッセージをあとから足す

あるロケールの辞書を必要になってから読み込み（言語ごとにコード分割するなど）、統合できます。

```js
const i18n = useI18n();

const { default: fr } = await import('./locales/fr.js');
i18n.addMessages('fr', fr); // 既存の 'fr' 辞書にマージされます
i18n.setLocale('fr');
```

## コンポーネントの文字列をローカライズする

コンポーネント自身がこのエンジンから読むことは**ありません**。これは意図的です。グローバルシングルトンから直接読むコンポーネントは、あらゆる利用者をひとつのインスタンスとひとつのキー命名規則に縛りつけ、ボタンをひとつ import しただけのページにまで翻訳レイヤーを引きずり込みます。代わりに、**利用者に見えるすべての文字列は入力**です。属性、プロパティ、オプション、あるいはスロットの内容として渡ります。つまり ranui のローカライズとは、もともと文字列が入る場所に `t()` の結果を渡すことです。

```js
const i18n = useI18n(); // 以下のメッセージは登録済みとします

modal.setAttribute('title', i18n.t('dialog.deleteProject.title'));
themeSwitch.setAttribute('label-dark', i18n.t('theme.dark'));
```

ほとんどのコンポーネントは自前の文字列を持ちません。文字列はあなたがすでに書いているスロットと属性から届きます。ごく一部だけ、他に出どころのない文字列（主にアクセシブルな名前）に英語の既定値を持っています。

| コンポーネント                                    | 組み込みの英語                                                                                                               | 上書きに使うもの                                     |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `Modal.confirm` / `Modal.open`                    | タイトル `Confirm`、ボタン `OK` / `Cancel`                                                                                   | `title`、`okText`、`cancelText` のオプション         |
| `Modal.info` / `.success` / `.warning` / `.error` | タイトル `Info` / `Success` / `Warning` / `Error`                                                                            | `title` オプション                                   |
| `<r-theme-switch>`                                | aria-label の `Theme`、`System theme`、`Light theme`、`Dark theme`                                                           | `label`、`label-system`、`label-light`、`label-dark` |
| `<r-voice-button>`                                | aria-label の `Start voice input` / `Stop voice input`、ヒントの `Release to keep · slide up to cancel`、`Release to cancel` | `label`、`active-label`、`hold-hint`、`cancel-hint`  |
| `<r-reasoning>`                                   | ヘッダーのラベル `Reasoning`                                                                                                 | `label`                                              |
| `<r-token-meter>`                                 | ラベル `Context`                                                                                                             | `label`                                              |
| `<r-colorpicker>`                                 | aria-label の `Choose color`、`Hue`、`Alpha opacity`                                                                         | `label`、`hue-label`、`alpha-label`                  |

実用的なやり方は、ロケールが変わるたびに一か所からまとめて適用し直すことです。そうすれば起動時と切り替え後で同じコードが走ります。

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

`document.documentElement.lang` も一緒に合わせるのを忘れないでください。ブラウザーもスクリーンリーダーも `:lang()` セレクターも、それを見ています。

## API

`createI18n(config)` はグローバルシングルトンを作って登録します（呼ぶのは一度だけ）。`useI18n()` はそれを返し、`createI18n` がまだ走っていなければ `null` を返します。

### `I18nConfig`

| フィールド        | 型               | 既定値         | 説明                                                                                                                                                                          |
| ----------------- | ---------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`        | `LocaleMessages` | `{}`           | `locale → { key → string }`。各辞書はフラットです。                                                                                                                           |
| `locale`          | `string`         | フォールバック | 初期ロケール（永続化された選択があればそちらが優先されます）。                                                                                                                |
| `fallbackLocale`  | `string`         | `'en'`         | 有効なロケールにキーがないときに参照されるロケール。                                                                                                                          |
| `persist`         | `boolean`        | `false`        | 有効なロケールを `localStorage` に保存します。                                                                                                                                |
| `storageKey`      | `string`         | `'ran-locale'` | `persist` が有効なときに使う localStorage のキー。                                                                                                                            |
| `detectNavigator` | `boolean`        | `false`        | 初期ロケールをブラウザーの言語設定から決めます。順序付きの `navigator.languages` を丸ごと読むので、第 1 希望の辞書がない読者にも、フォールバックではなく第 2 希望が届きます。 |

### `I18nCore` のメソッド

| メソッド                    | 戻り値        | 説明                                                           |
| --------------------------- | ------------- | -------------------------------------------------------------- |
| `t(key, params?)`           | `string`      | 翻訳します。フォールバックロケール、次にキー自体へ落ちます。   |
| `setLocale(locale)`         | `void`        | ロケールを切り替え、（有効なら）永続化して購読者に通知します。 |
| `getLocale()`               | `string`      | 有効なロケール。                                               |
| `onChange(handler)`         | `() => void`  | ロケールの変更を購読します。購読解除の関数を返します。         |
| `addMessages(locale, dict)` | `void`        | ロケールにメッセージを追加でマージします。                     |
| `getMessages(locale?)`      | `MessageDict` | ロケールの辞書を読みます（既定は有効なロケール）。             |
| `availableLocales`          | `string[]`    | 辞書が登録されているロケール。                                 |
| `destroy()`                 | `void`        | すべての購読者を取り除きます。                                 |

**型**

```ts
type MessageDict = Record<string, string>; // フラット：'hero.title' → 'Hi {name}'
type LocaleMessages = Record<string, MessageDict>; // locale → MessageDict
type TranslateParams = Record<string, string | number>;
```

## SSR

コアは SSR で安全です。`localStorage` と `navigator` へのアクセスは守られているので、サーバーでの描画中に `createI18n` や `t` を呼んでも例外にはなりません。永続化と言語検出はサーバー上では何もせず、コードがブラウザーで走ったときに効き始めます。
