# 実行時間を測る

パフォーマンスを調べるために、関数の実行時間を測りたいことがあります。そのために `startTask` と `taskEnd` を用意しました。あわせて、ほかの 3 つの測り方も紹介します。

1. `new Date().getTime()`,
2. `console.time()` , `console.timeEnd()`,
3. `performance.now()`

## I. `startTask` と `taskEnd`

### 1. startTask

処理を始める前に呼びます。

#### 戻り値

| パラメーター | 説明         | 型              |
| ------------ | ------------ | --------------- |
| taskId       | 処理の識別子 | `unique symbol` |

### 2. taskEnd

処理が終わったときに呼びます。`startTask` が返した識別子が必要です。

#### オプション

| パラメーター | 説明         | 型              | 既定値 |
| ------------ | ------------ | --------------- | ------ |
| taskId       | 処理の識別子 | `unique symbol` | 必須   |

#### 戻り値

| パラメーター | 説明               | 型       |
| ------------ | ------------------ | -------- |
| `time`       | 処理にかかった時間 | `number` |

### 3. 使用例

```js
const taskId = startTask();

// 何かをする

const time = taskEnd(taskId);

console.log('処理にかかった時間:', time);
```

## II. new Date().getTime()

`new Date().getTime()` は、1970 年 1 月 1 日 00:00:00 UTC（協定世界時）から、その日付オブジェクトが表す時刻までのミリ秒数を数値で返します。これで JS の実行時間を測ろうとすると、問題がふたつあります。

1. ミリ秒の精度では足りない場合があります。
2. `new Date()` が解釈する時刻は、ブラウザーや端末によって食い違うことがあります。[MDN のドキュメント](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Date)
   > ブラウザーごとの違いや食い違いのため、Date コンストラクターで日付の文字列を解釈すること（および、それと等価な Date.parse を使うこと）は強く推奨されません。RFC 2822 形式の日付は慣例的にしか対応されていません。ISO 8601 形式については、日付だけの文字列（たとえば "1970-01-01"）は地方時ではなく UTC として扱われ、ほかの形式の文字列の扱いとは異なります。

## III. `console.time()`, `console.timeEnd()`

処理にかかる時間を追うためのタイマーを始めます。タイマーにはそれぞれ一意な名前が必要で、ひとつのページで同時に動かせるのは最大 10,000 個です。タイマーの名前を引数にして `console.timeEnd()` を呼ぶと、そのタイマーの経過時間がミリ秒でブラウザーに出力されます。`new Date().getTime()` に比べて精度が高く、0.001 ミリ秒まで（たとえば 0.134ms）読み取れます。

## IV. `performance.now()`

`performance.now()` はマイクロ秒までの精度で時刻を返し、システムの時刻に左右されません（システムの時計は手で直されることもあれば、NTP などのソフトウェアに書き換えられることもあります）。また、`performance.timing.navigationStart + performance.now()` はおおよそ `Date.now()` に等しくなります。ですから JS の実行時間を測るなら、`performance.now()` のほうがおすすめです。

> 注意：タイミング攻撃やフィンガープリンティングから守るため、ブラウザーの設定によっては `performance.now()` の精度が落とされることがあります。`Firefox` では `privacy.reduceTimerPrecision` が既定で有効になっており、既定値は `1ms` です。`privacy.resistFingerprinting` を有効にすると、精度は 100ms か `privacy.resistFingerprinting.reduceTimerPrecision.microseconds` の値のうち、大きいほうになります。
