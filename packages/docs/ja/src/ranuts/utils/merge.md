# merge

オブジェクトを併合します。ふたつめのオブジェクトのプロパティを、ひとつめへ写します。

## API

### merge

#### 戻り値

| 引数     | 説明                                                       | 型       |
| -------- | ---------------------------------------------------------- | -------- |
| `Object` | 併合されたオブジェクト（ひとつめのオブジェクトを返します） | `Object` |

#### パラメーター

| パラメーター | 説明                                                  | 型       | 既定値 |
| ------------ | ----------------------------------------------------- | -------- | ------ |
| `a`          | 対象のオブジェクト（書き換えられます）                | `Object` | 必須   |
| `b`          | もとになるオブジェクト（プロパティが a へ写されます） | `Object` | 任意   |

## 使用例

### 基本的な使い方

```js
import { merge } from 'ranuts';

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const result = merge(obj1, obj2);
console.log(result); // { a: 1, b: 3, c: 4 }
console.log(obj1); // { a: 1, b: 3, c: 4 }（もとのオブジェクトが書き換えられています）
console.log(result === obj1); // true（もとのオブジェクトが返ります）
```

### 設定のオブジェクトを併合する

```js
import { merge } from 'ranuts';

const defaultConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
};

const userConfig = {
  port: 8080,
  ssl: true,
};

const config = merge(defaultConfig, userConfig);
console.log(config);
// { host: 'localhost', port: 8080, timeout: 5000, ssl: true }
```

### 引数をひとつだけ渡す

```js
import { merge } from 'ranuts';

const obj = { a: 1 };
const result = merge(obj);
console.log(result); // { a: 1 }（そのまま返ります）
```

## 補足

1. **もとのオブジェクトを書き換えます**：新しいオブジェクトを作るのではなく、ひとつめのオブジェクトを直に書き換えます。
2. **浅い併合**：一段ぶんだけを併合し、入れ子になったオブジェクトを深く併合することはありません。
3. **上書き**：同じキーが両方にあれば、ふたつめのオブジェクトの値がひとつめの値を上書きします。
4. **戻り値**：ひとつめのオブジェクト（書き換えられたもの）を返します。

## mergeExports

名前は似ていますが、まったく別の道具です。素の値を写すのではなく、ゲッターの一覧から **遅延評価される、凍結された** エクスポートのオブジェクトを組み立てます。それぞれのゲッターは、最初に触れられたときに多くても一度だけ走り、以後はその結果が覚えられます。`ranuts/utils` が別に公開している、あの `once` の仕組みを使っています。入れ子になった素のオブジェクトは、再帰的に併合され（そして凍結され）ます。ゲッターでも入れ子のオブジェクトでもないものを渡すと例外になります。

```js
import { mergeExports } from 'ranuts/utils';

const lazyModule = mergeExports(
  {},
  {
    get expensive() {
      console.log('computing...');
      return heavyComputation();
    },
    nested: {
      get value() {
        return 42;
      },
    },
  },
);

lazyModule.expensive; // 'computing...' を出力し、それから結果を返します
lazyModule.expensive; // 覚えた結果を返します。もう出力はしません
```

#### Notes

1. **汎用の併合ではありません。** 素の値には `merge` を使ってください。`mergeExports` は、一部のプロパティの計算が重く、実際に読まれたときにだけ走らせたい、そんなモジュール型のオブジェクトを組み立てるためのものです。
2. **返るものは凍結されています**（`Object.freeze`）。定義されるプロパティはどれも `configurable: false` なので、返ったオブジェクトを代入し直すことも、プロパティを足すこともできません。
3. **それ以外は例外になります。** ゲッターでも素の入れ子のオブジェクトでもない値（配列、関数、直に代入されたプリミティブ）を渡すと、`Exposed values must be either
a getter or a nested object` が投げられます。
