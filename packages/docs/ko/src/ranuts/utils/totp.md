# TOTP

RFC 6238 표준을 따르는, 시간 기반 일회용 비밀번호 생성기입니다. 바뀌는 인증 코드를 만드는 데 쓰며, 이중 인증(2FA)에서 흔히 씁니다.

## API

### TOTP.generate

시간에 바탕을 둔 일회용 비밀번호를 만듭니다.

#### 반환값

| 인자      | 설명                                     | 타입                               |
| --------- | ---------------------------------------- | ---------------------------------- |
| `Object`  | OTP와 만료 시각이 든 객체                | `{ otp: string, expires: number }` |
| `otp`     | 만들어진 일회용 비밀번호 문자열          | `string`                           |
| `expires` | OTP가 만료되는 시각의 타임스탬프(밀리초) | `number`                           |

#### 매개변수

| 매개변수  | 설명                             | 타입      | 기본값    |
| --------- | -------------------------------- | --------- | --------- |
| `key`     | Base32로 부호화된 비밀 키 문자열 | `string`  | 필수      |
| `options` | 선택 설정                        | `Options` | 아래 참고 |

#### 옵션

| 매개변수    | 설명                                 | 타입                                                                                                                  | 기본값       |
| ----------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| `digits`    | OTP의 자릿수                         | `number`                                                                                                              | `6`          |
| `algorithm` | 해시 알고리즘                        | `'SHA-1' \| 'SHA-224' \| 'SHA-256' \| 'SHA-384' \| 'SHA-512' \| 'SHA3-224' \| 'SHA3-256' \| 'SHA3-384' \| 'SHA3-512'` | `'SHA-1'`    |
| `period`    | 시간 창의 길이(초)                   | `number`                                                                                                              | `30`         |
| `timestamp` | OTP를 만드는 기준 타임스탬프(밀리초) | `number`                                                                                                              | `Date.now()` |

## 예시

### 기본 사용법

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP'; // Base32로 부호화된 비밀 키
const result = TOTP.generate(secret);

console.log(result.otp); // 예: '341128'
console.log(result.expires); // 예: 1465324730000 (타임스탬프)
```

### 자릿수 바꾸기

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { digits: 8 });

console.log(result.otp); // 예: '43341128' (8자리)
```

### 시간 창 바꾸기

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { period: 60 }); // 60초짜리 창

console.log(result.otp);
console.log(result.expires);
```

### 다른 해시 알고리즘 쓰기

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { algorithm: 'SHA-512' });

console.log(result.otp);
```

### 특정 시각으로 OTP 만들기

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const timestamp = 1465324707000; // 2016-06-08의 타임스탬프
const result = TOTP.generate(secret, { timestamp });

console.log(result.otp); // 지정한 시각으로 만들어진 OTP
```

### 여러 옵션 함께 쓰기

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

## 참고

1. **키 형식**: 키는 Base32로 부호화된 문자열이어야 합니다. 쓸 수 없는 글자가 섞여 있으면 `'Invalid base32 character in key'` 오류를 던집니다.

2. **시각 맞춤**: TOTP는 시각이 맞아떨어지는 데 기댑니다. 클라이언트와 서버의 시각이 어긋나지 않았는지 확인하세요. 어긋나면 검증이 실패할 수 있습니다.

3. **만료 시각**: `expires`는 지금 시간 창이 끝나는 시각의 타임스탬프입니다. 검증할 때는 보통 창 하나쯤의 여유(±1 주기 따위)를 둡니다.

4. **보안**: 키는 안전하게 보관하고 코드에 박아 넣지 마세요. 환경 변수나 안전한 키 관리 체계를 쓰기를 권합니다.
