# TOTP

基于时间的一次性密码（Time-based One-Time Password）生成器，实现了 RFC 6238 标准。用于生成动态验证码，常用于双因素认证（2FA）场景。

## API

### TOTP.generate

生成基于时间的一次性密码。

#### Return

| 参数      | 说明                          | 类型                               |
| --------- | ----------------------------- | ---------------------------------- |
| `Object`  | 返回包含 OTP 和过期时间的对象 | `{ otp: string, expires: number }` |
| `otp`     | 生成的一次性密码字符串        | `string`                           |
| `expires` | OTP 过期的时间戳（毫秒）      | `number`                           |

#### Parameters

| 参数      | 说明                    | 类型      | 默认值     |
| --------- | ----------------------- | --------- | ---------- |
| `key`     | Base32 编码的密钥字符串 | `string`  | 无         |
| `options` | 可选的配置项            | `Options` | 见下方说明 |

#### Options

| 参数        | 说明                          | 类型                                                                                                                  | 默认值       |
| ----------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| `digits`    | OTP 的位数                    | `number`                                                                                                              | `6`          |
| `algorithm` | 哈希算法                      | `'SHA-1' \| 'SHA-224' \| 'SHA-256' \| 'SHA-384' \| 'SHA-512' \| 'SHA3-224' \| 'SHA3-256' \| 'SHA3-384' \| 'SHA3-512'` | `'SHA-1'`    |
| `period`    | 时间窗口周期（秒）            | `number`                                                                                                              | `30`         |
| `timestamp` | 用于生成 OTP 的时间戳（毫秒） | `number`                                                                                                              | `Date.now()` |

## Example

### 基础用法

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP'; // Base32 编码的密钥
const result = TOTP.generate(secret);

console.log(result.otp); // 例如: '341128'
console.log(result.expires); // 例如: 1465324730000 (时间戳)
```

### 自定义位数

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { digits: 8 });

console.log(result.otp); // 例如: '43341128' (8 位数字)
```

### 自定义时间周期

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { period: 60 }); // 60 秒周期

console.log(result.otp);
console.log(result.expires);
```

### 使用不同的哈希算法

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { algorithm: 'SHA-512' });

console.log(result.otp);
```

### 指定时间戳生成 OTP

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const timestamp = 1465324707000; // 2016-06-08 的时间戳
const result = TOTP.generate(secret, { timestamp });

console.log(result.otp); // 基于指定时间戳生成的 OTP
```

### 组合使用多个选项

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

## 注意事项

1. **密钥格式**：密钥必须是 Base32 编码的字符串。如果密钥包含无效字符，会抛出错误 `'Invalid base32 character in key'`。

2. **时间同步**：TOTP 依赖于时间同步。确保客户端和服务器的时间同步，否则验证可能失败。

3. **过期时间**：`expires` 返回的是当前时间窗口结束的时间戳。在验证时，通常允许一定的时间窗口容差（如 ±1 个周期）。

4. **安全性**：密钥应该安全存储，不要硬编码在代码中。建议使用环境变量或安全的密钥管理系统。
