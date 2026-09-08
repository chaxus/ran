---
description: 'ranui の Message API は、操作結果の全体的なフィードバック（info、success、warning、error、toast）を手続き的に、軽いオーバーレイとして表示します。'
---

# Message

操作結果を伝える全体的なフィードバックのコンポーネントです。`message` API から手続き的に呼び出し、閉じられるトーストとして描画されます。

> **使いどころ**：操作結果を伝える、一時的で自動的に消えるトーストが欲しいとき。マークアップを置くのではなく、手続き的な `message.info` / `success` / `warning` / `error` / `toast` を呼び出します。

## クイックスタート

<ran-demo>
  <r-button type="primary" onclick="message.info('これはヒントです')">メッセージを出す</r-button>
</ran-demo>

```html
<r-button type="primary" onclick="message.info('これはヒントです')">メッセージを出す</r-button>
```

Message は普通 JavaScript から呼び出します。グローバルの `message` オブジェクトは、コンポーネントのモジュールが読み込まれた時点で `window` に登録されます（`window.ranui.message` からも使えます）。

```js
message.info('これはヒントです');
message.success('プロジェクトを削除しました');
```

## API リファレンス

### グローバルなメソッド

どのメソッドもトーストを一つ追加し、`duration` ミリ秒（既定は `3000`）のあとで自動的に閉じます。五つとも同じシグネチャです。

| メソッド            | 説明                                               |
| ------------------- | -------------------------------------------------- |
| `message.info()`    | 中立的な情報のトースト（青の情報アイコン）         |
| `message.success()` | 成功のトースト（緑のチェックアイコン）             |
| `message.warning()` | 警告のトースト（琥珀色のアイコン）。強めに読み上げ |
| `message.error()`   | エラーのトースト（赤のアイコン）。強めに読み上げ   |
| `message.toast()`   | アイコンのない、素の暗いトースト                   |

### メソッドのシグネチャ

どのメソッドも `string`（内容）か、オプションのオブジェクトを受け取ります。

```js
// 1. 文字列を渡す —— 内容だけ。3000ms 後に消えます
message.info('これはヒントです');

// 2. オプションのオブジェクトを渡す
message.info({
  content: 'これはヒントです',
  duration: 2000,
  close: () => console.log('closed'),
});
```

### オプション

| オプション     | 型                          | 既定値          | 説明                                                                 |
| -------------- | --------------------------- | --------------- | -------------------------------------------------------------------- |
| `content`      | `string`                    | —               | 表示する文言（オブジェクトを渡すときは必須）                         |
| `duration`     | `number`                    | `3000`          | 自動で閉じるまでのミリ秒                                             |
| `close`        | `() => void`                | —               | トーストが取り除かれたあとに呼ばれるコールバック                     |
| `top`          | `number \| string`          | `8`             | トーストの積み重ねの、コンテナ上端からのずれ（数値は px として扱う） |
| `zIndex`       | `number \| string`          | `1200`          | トーストのコンテナの重なり順                                         |
| `getContainer` | `() => HTMLElement \| null` | `document.body` | トーストの積み重ねを差し込む要素を返します                           |

> `null`、`undefined`、あるいは引数なしを渡しても何も起きません。何も表示されません。

### 要素の属性 `r-message`

トーストは一つ一つが `<r-message>` というカスタム要素です。グローバルな API がこれらの属性を設定しますが、直接使うこともできます。

| 属性      | 型       | 既定値 | 説明                                                                                                       |
| --------- | -------- | ------ | ---------------------------------------------------------------------------------------------------------- |
| `type`    | `string` | —      | `info`、`success`、`warning`、`error`、`toast` のいずれか。アイコンと色、ARIA のライブ領域の役割を選びます |
| `content` | `string` | —      | トーストの中に描かれる文言                                                                                 |
| `sheet`   | `string` | `''`   | コンポーネントの shadow DOM に注入する CSS                                                                 |

## メッセージの種類 `type`

<ran-demo>
  <r-button onclick="message.info('これはヒントです')">情報の通知</r-button>
  <r-button onclick="message.success('これはヒントです')">成功の通知</r-button>
  <r-button onclick="message.warning('これはヒントです')">警告の通知</r-button>
  <r-button onclick="message.error('これはヒントです')">エラーの通知</r-button>
  <r-button onclick="message.toast('これはヒントです')">toast の通知</r-button>
</ran-demo>

```html
<r-button onclick="message.info('これはヒントです')">情報の通知</r-button>
<r-button onclick="message.success('これはヒントです')">成功の通知</r-button>
<r-button onclick="message.warning('これはヒントです')">警告の通知</r-button>
<r-button onclick="message.error('これはヒントです')">エラーの通知</r-button>
<r-button onclick="message.toast('これはヒントです')">toast の通知</r-button>
```

## 表示時間の指定 `duration`

<ran-demo>
  <r-button onclick="message.info({ content: '6 秒とどまります', duration: 6000 })">6 秒のトースト</r-button>
  <r-button onclick="message.info({ content: '1 秒とどまります', duration: 1000 })">1 秒のトースト</r-button>
</ran-demo>

```html
<r-button onclick="message.info({ content: '6 秒とどまります', duration: 6000 })">6 秒のトースト</r-button>
<r-button onclick="message.info({ content: '1 秒とどまります', duration: 1000 })">1 秒のトースト</r-button>
```

## 閉じたあとのコールバック `close`

`close` のコールバックは、トーストが DOM から取り除かれたあとに走ります。

<ran-demo>
  <r-button onclick="message.success({ content: '保存しました', close: () => message.info('トーストが閉じました') })">連鎖するメッセージ</r-button>
</ran-demo>

```html
<r-button onclick="message.success({ content: '保存しました', close: () => message.info('トーストが閉じました') })"
  >連鎖するメッセージ</r-button
>
```

```js
message.success({
  content: '保存しました',
  close: () => {
    // トーストが閉じられたら一度だけ走ります
    console.log('toast closed');
  },
});
```

## 位置の指定 `top` / `zIndex` / `getContainer`

<ran-demo>
  <r-button onclick="message.info({ content: '下へずらしました', top: 120 })">上端からずらす</r-button>
</ran-demo>

```js
message.info({
  content: '下へずらしました',
  top: 120, // コンテナ上端からの距離
  zIndex: 1300, // 重なり順
  getContainer: () => document.querySelector('#app'), // 差し込む先
});
```

## スタイリング

トーストの積み重ねは body へポータルされたコンテナの中にあります。各 `<r-message>` は内容を shadow DOM の中に描き、その面は CSS 変数でテーマを当てられます（どれも妥当なフォールバックつきです）。

| CSS 変数                              | 既定値                         | 説明                     |
| ------------------------------------- | ------------------------------ | ------------------------ |
| `--ran-message-content-background`    | `var(--ran-color-bg-elevated)` | トーストの面の背景       |
| `--ran-message-content-border-radius` | `var(--ran-radius-md)`         | トーストの角の丸み       |
| `--ran-message-content-box-shadow`    | `var(--ran-shadow-menu)`       | トーストの浮き上がり     |
| `--ran-message-text-color`            | `var(--ran-color-text)`        | トーストの文字色         |
| `--ran-message-z-index`               | `var(--ran-z-message, 1200)`   | 積み重ねの z-index       |
| `--ran-message-top`                   | `8px`                          | 積み重ねの上端からのずれ |

## ベストプラクティス

- **何が変わったかを書く**：トーストの文言は「プロジェクトを削除しました」「変更を保存しました」のように結果として書き、曖昧な「成功」にしないでください。
- **成功 / 情報**：作業を止めない確認には `message.success` / `message.info` を使います。
- **エラー / 警告**：`message.error` / `message.warning` を使います。これらは ARIA の強めのライブ領域に昇格するので、スクリーンリーダーが読み上げを割り込ませます。
- **短く保つ**：トーストは自動で消えます。長い文言や操作が必要な内容はダイアログに回してください。
- **時間の調整は控えめに**：長い文言では `duration` を上げてかまいませんが、一時的なフィードバックを居座らせないでください。
