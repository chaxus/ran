# TOTP

Gerador de senhas de uso único baseadas no tempo, conforme a norma RFC 6238. Serve para produzir códigos de verificação que mudam, algo comum na autenticação de dois fatores (2FA).

## API

### TOTP.generate

Gera uma senha de uso único baseada no tempo.

#### Retorna

| Argumento | Descrição                                    | Tipo                               |
| --------- | -------------------------------------------- | ---------------------------------- |
| `Object`  | Um objeto com a OTP e o prazo de validade    | `{ otp: string, expires: number }` |
| `otp`     | A senha de uso único gerada                  | `string`                           |
| `expires` | Carimbo de tempo (em ms) em que a OTP expira | `number`                           |

#### Parâmetros

| Parâmetro | Descrição                                         | Tipo      | Padrão      |
| --------- | ------------------------------------------------- | --------- | ----------- |
| `key`     | A chave secreta, como string codificada em Base32 | `string`  | Obrigatório |
| `options` | Configuração opcional                             | `Options` | Veja abaixo |

#### Opções

| Parâmetro   | Descrição                                       | Tipo                                                                                                                  | Padrão       |
| ----------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| `digits`    | Quantidade de dígitos da OTP                    | `number`                                                                                                              | `6`          |
| `algorithm` | Algoritmo de hash                               | `'SHA-1' \| 'SHA-224' \| 'SHA-256' \| 'SHA-384' \| 'SHA-512' \| 'SHA3-224' \| 'SHA3-256' \| 'SHA3-384' \| 'SHA3-512'` | `'SHA-1'`    |
| `period`    | Duração da janela de tempo (segundos)           | `number`                                                                                                              | `30`         |
| `timestamp` | Carimbo de tempo (em ms) com que a OTP é gerada | `number`                                                                                                              | `Date.now()` |

## Exemplo

### Uso básico

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP'; // chave secreta codificada em Base32
const result = TOTP.generate(secret);

console.log(result.otp); // por exemplo: '341128'
console.log(result.expires); // por exemplo: 1465324730000 (carimbo de tempo)
```

### Mudar a quantidade de dígitos

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { digits: 8 });

console.log(result.otp); // por exemplo: '43341128' (8 dígitos)
```

### Mudar a janela de tempo

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { period: 60 }); // janela de 60 segundos

console.log(result.otp);
console.log(result.expires);
```

### Usar outro algoritmo de hash

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { algorithm: 'SHA-512' });

console.log(result.otp);
```

### Gerar a OTP com um carimbo de tempo específico

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const timestamp = 1465324707000; // carimbo de tempo de 2016-06-08
const result = TOTP.generate(secret, { timestamp });

console.log(result.otp); // OTP gerada a partir desse carimbo de tempo
```

### Combinar várias opções

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

## Notas

1. **Formato da chave**: a chave precisa ser uma string codificada em Base32. Se contiver caracteres que não valem, é lançado o erro `'Invalid base32 character in key'`.

2. **Relógios em sincronia**: o TOTP depende de os relógios andarem juntos. Garanta que a hora do cliente e a do servidor batem, ou a verificação pode falhar.

3. **Validade**: `expires` devolve o carimbo de tempo em que a janela atual termina. Na verificação costuma-se admitir uma folga de uma janela (±1 período, por exemplo).

4. **Segurança**: as chaves devem ser guardadas com cuidado e nunca escritas no código. Convém usar variáveis de ambiente ou um sistema seguro de gestão de chaves.
