# i18n

フレームワークに依存しない国際化エンジンです。小さなリアクティブなコア（`I18nCore`）に、任意のグローバルシングルトン（`createI18n` / `useI18n`）が付きます。ここにあるものは DOM に一切触れないので、UI への結び付け方はあなたが決められます。

```ts
import { createI18n, useI18n } from 'ranuts/i18n';
```

`ranuts/utils` からも再 export されています。i18n だけが必要なときは `ranuts/i18n` から import してください。こちらのエントリーにはエンジンとふたつのヘルパーしか入っておらず、間口の広い `utils` バレルがついでに引き込むものは含まれません。

## 使い方

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

辞書は**フラット**です。`t()` は `messages[locale][key]` を直接引くので、キーは `'hero.title'` のような素の文字列であって、入れ子のオブジェクトではありません。

## 初期ロケール

コンストラクターで一度だけ、次の順に決まります。

1. `localStorage` に永続化された選択（`persist` が有効で、かつそのロケールに辞書がある場合のみ）
2. `config.locale`
3. ブラウザーの言語（`detectNavigator` が有効な場合のみ）
4. `fallbackLocale`

3 番目は [`resolveLocale`](/ja/src/ranuts/utils/resolve_locale) を通ります。`navigator.language` だけでなく、順序付きの `navigator.languages` を丸ごと読むので、第 1 希望があなたの辞書にない読者にも、いきなりフォールバックへ落ちるのではなく第 2 希望が届きます。

## 補間

`t(key, params)` は `{param}` のプレースホルダーを、左から右への一巡で置き換えます。Rust の `format!`、Python の `str.format`、.NET の `String.Format` と同じ書式文字列の流儀です。

::: v-pre

| 入力                                | 出力                                                                       |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `{{`                                | 波括弧そのものの `{`                                                       |
| `}}`                                | 波括弧そのものの `}`                                                       |
| `{name}`                            | `params.name` を文字列化したもの                                           |
| `{name}` で該当のパラメーターがない | そのまま残ります。だから渡し忘れが、黙って空欄になるのではなく目に見えます |

:::

単独の `{` / `}` や、`{ x }` のように空白を含んだまとまりは**プレースホルダーではなく**、そのまま出力されます。だからメッセージの中の CSS、JSON、コード断片は無傷で通り抜けます。値を波括弧そのもので包みたいときは、外側の対を重ねてください：<code v-pre>{{{name}}}</code>。

## 型付きの辞書

辞書の形を型引数として渡すと、すべての `t()` 呼び出しがコンパイル時に検査されます。それがないと、名前を変えたキーや打ち間違えたキーは「キーそのものを描画する」へ静かに劣化します。文章があるべき場所に `agentModelFirstDownlaod` が見えていても、そのときまで何も失敗しません。

```ts
interface Messages {
  save: string;
  cancel: string;
}

const i18n = createI18n<Messages>({
  messages: {
    en: { save: 'Save', cancel: 'Cancel' },
    'zh-CN': { save: '保存' }, // 翻訳の途中 — それで構いません
  },
  fallbackLocale: 'en',
});

i18n.t('save'); // ok
i18n.t('saev'); // コンパイルエラー

useI18n<Messages>()?.t('cancel'); // 検査を続けるには同じ型を渡し直します
```

これを「あるだけ」ではなく実際に使えるものにしている点が 3 つあります。

1. **各ロケールは `Partial` です。** 翻訳の途中であることが普通の状態で、まだ埋まっていない分はフォールバックのロケールが受け持ちます。
2. **型は型引数から来るのであって、データからは来ません。** `messages` は `NoInfer` で包まれているので、キーの集合が違うロケールどうしから TypeScript が_共通部分_を推論してしまうことがありません。そうでなければ、フォールバックだけが定義しているキーがすべての呼び出し箇所で拒否され、翻訳が未完成なだけでビルドが壊れてしまいます。実行時にフォールバックすればよいだけなのに。
3. **`type` だけでなく `interface` でも動きます。** 制約は `Record<string, string>` ではなく `StringValues<T>`（`{ [K in keyof T]: string }`）です。TypeScript が暗黙のインデックスシグネチャを与えるのは型エイリアスだけなので、素直なやり方で制約すると、利用者全員に辞書を `type` へ書き換えさせることになってしまいます。

型引数を省けば、型なしのふるまいがそのまま残ります。既定の `MessageDict` は `Record<string, string>` で、その `keyof` は `string` です。

## 設定

| フィールド        | 説明                                                             | 型               | 既定値         |
| ----------------- | ---------------------------------------------------------------- | ---------------- | -------------- |
| `locale`          | 初期ロケール。`persist` が有効なら、永続化された選択が優先します | `string`         | `-`            |
| `fallbackLocale`  | 有効なロケールにキーがないときに使うロケール                     | `string`         | `'en'`         |
| `messages`        | ロケール → キー → 文字列                                         | `LocaleMessages` | `{}`           |
| `persist`         | 有効なロケールを `localStorage` に保存します                     | `boolean`        | `false`        |
| `storageKey`      | `persist` が有効なときに使う `localStorage` のキー               | `string`         | `'ran-locale'` |
| `detectNavigator` | 初期ロケールをブラウザーの言語設定から決めます                   | `boolean`        | `false`        |

## API

### createI18n

グローバルシングルトンを作って登録します。

#### パラメーター

| パラメーター | 説明            | 型           | 既定値 |
| ------------ | --------------- | ------------ | ------ |
| `config`     | **設定** を参照 | `I18nConfig` | `{}`   |

#### 戻り値

| 引数   | 説明               | 型         |
| ------ | ------------------ | ---------- |
| `i18n` | 新しいインスタンス | `I18nCore` |

### useI18n

有効なグローバルインスタンスを返します。作られていなければ `null` です。

#### 戻り値

| 引数   | 説明                              | 型                 |
| ------ | --------------------------------- | ------------------ |
| `i18n` | 有効なインスタンス、または `null` | `I18nCore \| null` |

### I18nCore

| メンバー                    | 説明                                                                             |
| --------------------------- | -------------------------------------------------------------------------------- |
| `t(key, params?)`           | 翻訳します。フォールバックロケール、次にキー自体へ落ちます                       |
| `locale` / `getLocale()`    | 有効なロケール                                                                   |
| `setLocale(locale)`         | ロケールを切り替え、（有効なら）永続化して通知します。変化がなければ何もしません |
| `addMessages(locale, dict)` | 辞書をロケールにマージします。なければ作ります                                   |
| `getMessages(locale?)`      | そのロケールの辞書、なければ `{}`                                                |
| `availableLocales`          | 辞書が登録されているロケール                                                     |
| `onChange(fn)`              | ロケールの変更を購読します。購読解除の関数を返します                             |
| `destroy()`                 | すべての購読者を取り除きます                                                     |

## SSR

安全です。`localStorage` と `navigator` へのアクセスはすべて守られているので、サーバーでの描画中にインスタンスを作ると `config.locale` か `fallbackLocale` へ落ちます。
