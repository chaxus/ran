# TOTP

Time-based One-Time Password generator implementing RFC 6238 standard. Used to generate dynamic verification codes, commonly used in two-factor authentication (2FA) scenarios.

## API

### TOTP.generate

Generate a time-based one-time password.

#### Return

| Argument  | Description                                 | Type                               |
| --------- | ------------------------------------------- | ---------------------------------- |
| `Object`  | Returns an object containing OTP and expiry | `{ otp: string, expires: number }` |
| `otp`     | Generated one-time password string          | `string`                           |
| `expires` | Timestamp (milliseconds) when OTP expires   | `number`                           |

#### Parameters

| Parameter | Description                      | Type      | Default   |
| --------- | -------------------------------- | --------- | --------- |
| `key`     | Base32 encoded secret key string | `string`  | Required  |
| `options` | Optional configuration           | `Options` | See below |

#### Options

| Parameter   | Description                                 | Type                                                                                                                  | Default      |
| ----------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| `digits`    | Number of digits in OTP                     | `number`                                                                                                              | `6`          |
| `algorithm` | Hash algorithm                              | `'SHA-1' \| 'SHA-224' \| 'SHA-256' \| 'SHA-384' \| 'SHA-512' \| 'SHA3-224' \| 'SHA3-256' \| 'SHA3-384' \| 'SHA3-512'` | `'SHA-1'`    |
| `period`    | Time window period (seconds)                | `number`                                                                                                              | `30`         |
| `timestamp` | Timestamp (milliseconds) for generating OTP | `number`                                                                                                              | `Date.now()` |

## Example

### Basic Usage

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP'; // Base32 encoded secret key
const result = TOTP.generate(secret);

console.log(result.otp); // e.g.: '341128'
console.log(result.expires); // e.g.: 1465324730000 (timestamp)
```

### Custom Digits

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { digits: 8 });

console.log(result.otp); // e.g.: '43341128' (8 digits)
```

### Custom Time Period

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { period: 60 }); // 60 second period

console.log(result.otp);
console.log(result.expires);
```

### Using Different Hash Algorithm

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { algorithm: 'SHA-512' });

console.log(result.otp);
```

### Generate OTP with Specific Timestamp

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const timestamp = 1465324707000; // Timestamp for 2016-06-08
const result = TOTP.generate(secret, { timestamp });

console.log(result.otp); // OTP generated based on specified timestamp
```

### Combining Multiple Options

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

## Notes

1. **Key Format**: The key must be a Base32 encoded string. If the key contains invalid characters, it will throw an error `'Invalid base32 character in key'`.

2. **Time Synchronization**: TOTP relies on time synchronization. Ensure that client and server times are synchronized, otherwise verification may fail.

3. **Expiry Time**: `expires` returns the timestamp when the current time window ends. During verification, a time window tolerance is usually allowed (e.g., ±1 period).

4. **Security**: Keys should be stored securely and not hardcoded in code. It is recommended to use environment variables or a secure key management system.
