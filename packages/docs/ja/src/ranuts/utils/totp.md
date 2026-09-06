# TOTP

RFC 6238 に沿った、時刻に基づくワンタイムパスワードの生成器です。動的な確認コードを作るもので、二要素認証（2FA）でよく使われます。

## API

### TOTP.generate

時刻に基づくワンタイムパスワードを生成します。

#### 戻り値

| 引数      | 説明                                       | 型                                 |
| --------- | ------------------------------------------ | ---------------------------------- |
| `Object`  | OTP と有効期限を含むオブジェクト           | `{ otp: string, expires: number }` |
| `otp`     | 生成されたワンタイムパスワードの文字列     | `string`                           |
| `expires` | OTP が切れる時刻のタイムスタンプ（ミリ秒） | `number`                           |

#### パラメーター

| パラメーター | 説明                                | 型        | 既定値   |
| ------------ | ----------------------------------- | --------- | -------- |
| `key`        | Base32 で符号化された秘密鍵の文字列 | `string`  | 必須     |
| `options`    | 任意の設定                          | `Options` | 下を参照 |

#### オプション

| パラメーター | 説明                                         | 型                                                                                                                    | 既定値       |
| ------------ | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| `digits`     | OTP の桁数                                   | `number`                                                                                                              | `6`          |
| `algorithm`  | ハッシュのアルゴリズム                       | `'SHA-1' \| 'SHA-224' \| 'SHA-256' \| 'SHA-384' \| 'SHA-512' \| 'SHA3-224' \| 'SHA3-256' \| 'SHA3-384' \| 'SHA3-512'` | `'SHA-1'`    |
| `period`     | 時間の窓の長さ（秒）                         | `number`                                                                                                              | `30`         |
| `timestamp`  | OTP を生成する基準のタイムスタンプ（ミリ秒） | `number`                                                                                                              | `Date.now()` |

## 使用例

### 基本的な使い方

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP'; // Base32 で符号化された秘密鍵
const result = TOTP.generate(secret);

console.log(result.otp); // 例：'341128'
console.log(result.expires); // 例：1465324730000（タイムスタンプ）
```

### 桁数を変える

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { digits: 8 });

console.log(result.otp); // 例：'43341128'（8 桁）
```

### 時間の窓を変える

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { period: 60 }); // 60 秒の窓

console.log(result.otp);
console.log(result.expires);
```

### 別のハッシュアルゴリズムを使う

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { algorithm: 'SHA-512' });

console.log(result.otp);
```

### 特定の時刻で OTP を生成する

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const timestamp = 1465324707000; // 2016-06-08 のタイムスタンプ
const result = TOTP.generate(secret, { timestamp });

console.log(result.otp); // 指定した時刻に基づいて生成された OTP
```

### 複数のオプションを組み合わせる

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, {
  digits: 8,
  algorithm: 'SHA-256',
  period: 60,
});

console.log(result.otp);
console.log(result.expires);
```

## 補足

1. **鍵の形式**：鍵は Base32 で符号化された文字列でなければなりません。使えない文字が混じっていると `'Invalid base32 character in key'` というエラーが投げられます。

2. **時刻の同期**：TOTP は時刻の同期に頼っています。クライアントとサーバーの時刻が合っていることを確かめてください。ずれていると検証に失敗することがあります。

3. **有効期限**：`expires` は、いまの時間の窓が終わる時刻のタイムスタンプです。検証の際は、窓ひとつぶんの余裕（±1 期間など）を認めるのがふつうです。

4. **安全性**：鍵は安全に保管し、コードに直に書かないでください。環境変数か、安全な鍵の管理の仕組みを使うことをおすすめします。
