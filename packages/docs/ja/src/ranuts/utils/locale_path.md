# createLocalePath

多言語サイトのための URL の計算です。純粋な関数で、グローバルな状態も DOM も使いません。ビルド時のスクリプト（サイトマップや `hreflang`）でも、ブラウザーでも同じように使えます。

サブドメイン（`zh.example.com/book/`）ではなく **サブディレクトリ**（`/zh/book/`）を使います。検索エンジンはサブドメインを別のサイトとみなし、その評価はゼロから始まりますが、サブディレクトリなら本体の評価を受け継げます。既定のロケールはルートに置かれ、それ以外のロケールには接頭辞が付きます。

## API

### createLocalePath(config)

| パラメーター    | 説明                                                                                    | 型              | 既定値                 |
| --------------- | --------------------------------------------------------------------------------------- | --------------- | ---------------------- |
| `locales`       | `{ code, prefix? }[]`。接頭辞がなければ「既定のロケールで、ルートに置く」という意味です | `LocaleRoute[]` | 必須                   |
| `defaultLocale` | 既定のロケールのコード                                                                  | `string`        | 接頭辞のない最初のもの |
| `base`          | 配置先のサブパス（`/weread` など）。末尾のスラッシュは無視されます                      | `string`        | `''`                   |

返るもの：

| メンバー                        | 説明                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| `base` / `defaultLocale`        | 正規化された設定。読み取り専用です                                       |
| `localeFromPath(pathname)`      | ロケールを見分けます。知らないパスは既定のロケールになります             |
| `stripLocale(pathname)`         | ロケールの接頭辞を落とします。ルーティングに使う、言語に依らないパスです |
| `href(path, code?)`             | あるロケール向けのリンクを組み立てます                                   |
| `hrefForLocale(pathname, code)` | いまのパスを別のロケールへ向け直します（言語の切り替え）                 |
| `alternates(pathname)`          | すべてのロケールの URL。`<link rel="alternate" hreflang>` 用です         |

## 使用例

```js
import { createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }, { code: 'zh-HK', prefix: 'zh-hant' }],
  base: '/docs',
});

paths.href('/book/walden/'); // '/docs/book/walden/'
paths.href('/book/walden/', 'zh-CN'); // '/docs/zh/book/walden/'
paths.localeFromPath('/docs/zh/book/'); // 'zh-CN'
paths.stripLocale('/docs/zh/book/'); // '/docs/book/'
paths.hrefForLocale('/docs/zh/book/', 'zh-HK'); // '/docs/zh-hant/book/'

// hreflang のタグ
paths.alternates(location.pathname).forEach(({ code, href }) => {
  head.append(link({ rel: 'alternate', hreflang: code, href }));
});
```

## 補足

1. **`href` は何度呼んでも同じ結果になります。** 新しい接頭辞を付ける前に、すでにある接頭辞を落とすので、ロケール付きのパスを渡しても二重にはなりません。`hrefForLocale` の中身も `href` です。
2. **いちばん長い接頭辞が勝ちます。** ですから `zh` が `/zh-hant/...` を飲み込むことはありません。
3. **`base` は先頭からしか落としません。** `replace(base, '')` では、どこにあっても最初の一致を落としてしまうので、パスの途中に base と同じ文字列が入っていると壊れます。
4. **クエリとハッシュはそのまま残ります。** 計算が触るのはパス名だけです。
5. **グローバルな「いまのロケール」は持ちません。** コードを明示して渡すか、既定に任せてください。どのロケールが有効かを決めるのは i18n のランタイムの仕事であって、このモジュールの仕事ではありません。
