# EventManager / createDoubleTapDetector

`AbortController` を土台にした、ライフサイクルに閉じたイベントの登録簿です。あわせて、ポインターの種類を問わない、タッチのジェスチャー向けの小さなダブルタップの検出器も入っています。

これが解くのは、リスナーを _外すほう_ の問題です。`removeEventListener` が効くのは、登録したときと **まったく同じ** 関数の参照とオプションを渡したときだけです。渡す途中でハンドラーをアロー関数で包んでしまえば、もう二度と外せません。マウントとアンマウントを繰り返すコンポーネントは、そのたびにリスナーをひとつずつ漏らしていきます。`AbortController` は、そのすべてを `abort()` ひと呼びに変えます。

## 使い方

### Web Component の中で

```ts
import { EventManager } from 'ranuts/utils';

class MyElement extends HTMLElement {
  private _events = new EventManager();

  connectedCallback() {
    this._events.on(this._input, 'input', this.handleInput).on(this, 'click', this.handleClick, { capture: true });
  }

  disconnectedCallback() {
    this._events.abort(); // すべてのリスナーを外し、次の接続に備えて仕切り直します
  }
}
```

### ふつうのページのコードで

```ts
function initSection(container: HTMLElement) {
  const scope = new EventManager();

  scope.on(input, 'input', handleSearch).delegate(container, '[data-action]', 'click', (ev, target) => {
    handleAction(target.getAttribute('data-action'));
  });

  return () => scope.abort(); // その区画を片づけるときに呼びます
}
```

## API

### on

このマネージャーに閉じたリスナーを登録します。つないで書けます。

#### パラメーター

| パラメーター | 説明                                                      | 型                                       | 既定値 |
| ------------ | --------------------------------------------------------- | ---------------------------------------- | ------ |
| `target`     | イベントの相手                                            | `EventTarget`                            | 必須   |
| `type`       | イベントの名前                                            | `string`                                 | 必須   |
| `handler`    | ハンドラーの関数                                          | `EventListener`                          | 必須   |
| `options`    | `addEventListener` のオプションから `signal` を除いたもの | `Omit<AddEventListenerOptions,'signal'>` | `-`    |

#### 戻り値

| 引数   | 説明                                         | 型             |
| ------ | -------------------------------------------- | -------------- |
| `this` | このマネージャー。つないで書くためのものです | `EventManager` |

### delegate

イベントの委譲です。`parent` に **ひとつだけ** リスナーを付け、`selector` に当てはまる子孫からイベントが起きたときにかぎり `handler` を呼びます。つないで書けます。

ハンドラーは、もとのイベントと、当てはまった要素を受け取ります。

```ts
scope.delegate(list, '.item', 'click', (ev, item) => {
  console.log(item.getAttribute('data-id'));
});
```

#### パラメーター

| パラメーター | 説明                                                      | 型                                       | 既定値 |
| ------------ | --------------------------------------------------------- | ---------------------------------------- | ------ |
| `parent`     | ただひとつのリスナーを結び付ける要素                      | `HTMLElement`                            | 必須   |
| `selector`   | 子孫が当てはまるべきセレクター                            | `string`                                 | 必須   |
| `type`       | イベントの名前                                            | `string`                                 | 必須   |
| `handler`    | `(event, matchedElement) => void`                         | `Function`                               | 必須   |
| `options`    | `addEventListener` のオプションから `signal` を除いたもの | `Omit<AddEventListenerOptions,'signal'>` | `-`    |

#### 戻り値

| 引数   | 説明                                         | 型             |
| ------ | -------------------------------------------- | -------------- |
| `this` | このマネージャー。つないで書くためのものです | `EventManager` |

### abort

登録したリスナーをすべて外し、内側の `AbortController` を作り直します。何度呼んでも大丈夫です。そのあとの `on()` や `delegate()` は、まっさらなところから始まります。

#### 戻り値

戻り値はありません（`void`）

### signal

土台の `AbortSignal` です。自分で `addEventListener` に渡したいときのために公開しています。

| 引数     | 説明                           | 型            |
| -------- | ------------------------------ | ------------- |
| `signal` | このマネージャーの中断シグナル | `AbortSignal` |

## createDoubleTapDetector

生の `(x, y, 時刻)` の標本からダブルタップを見分けます。ポインターの種類を問わないので、Pointer、Touch、Mouse のどのイベントから渡しても同じように働きます。タッチのジェスチャー（ダブルタップで頭出し、拡大、いいね）のために作られました。この手の場面では、時刻と距離のしきい値の判定を呼び出しのたびに書き直すと、気づきにくい形で間違えやすいのです。片方の軸しか比べていない、あるいは当たったあとに仕切り直すのを忘れて、素早い 3 回のタップが重なり合ったダブルタップ 2 回として数えられてしまう、といった具合に。

```ts
import { createDoubleTapDetector } from 'ranuts/utils';

const detector = createDoubleTapDetector();
el.addEventListener('pointerup', (e) => {
  if (detector.check(e.clientX, e.clientY)) seek();
});
```

### `createDoubleTapDetector(options?)`

#### パラメーター（`DoubleTapDetectorOptions`）

| オプション      | 説明                                                     | 型       | 既定値 |
| --------------- | -------------------------------------------------------- | -------- | ------ |
| `windowMs`      | 2 回のタップのあいだの、許される最大の間隔（ミリ秒）     | `number` | `300`  |
| `maxDistancePx` | 2 回のタップのあいだの、平面上で許される最大の距離（px） | `number` | `60`   |

#### `DoubleTapDetector`

| メンバー | 説明                                                                                                                                                                                                                               | 型                                                |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `check`  | `(x, y)` でのタップを記録し、それが直前のタップとダブルタップを成すかどうかを報せます。ダブルタップと見なした時点で追跡を仕切り直すので、素早い 3 回目のタップは同じダブルタップの一部として数えられず、新しい組の始まりになります | `(x: number, y: number, now?: number) => boolean` |
| `reset`  | 最後に記録したタップを忘れます。タップ以外のジェスチャー（ドラッグなど）が始まったときに呼んでください                                                                                                                             | `() => void`                                      |
