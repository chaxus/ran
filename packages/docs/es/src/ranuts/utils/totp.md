# TOTP

Generador de contraseñas de un solo uso basadas en el tiempo, según la norma RFC 6238. Sirve para producir códigos de verificación cambiantes, lo habitual en la autenticación de dos factores (2FA).

## API

### TOTP.generate

Genera una contraseña de un solo uso basada en el tiempo.

#### Devuelve

| Argumento | Descripción                                  | Tipo                               |
| --------- | -------------------------------------------- | ---------------------------------- |
| `Object`  | Un objeto con la OTP y su caducidad          | `{ otp: string, expires: number }` |
| `otp`     | La contraseña de un solo uso generada        | `string`                           |
| `expires` | Marca de tiempo (en ms) en que la OTP caduca | `number`                           |

#### Parámetros

| Parámetro | Descripción                                        | Tipo      | Por defecto |
| --------- | -------------------------------------------------- | --------- | ----------- |
| `key`     | La clave secreta, como cadena codificada en Base32 | `string`  | Obligatorio |
| `options` | Configuración opcional                             | `Options` | Véase abajo |

#### Opciones

| Parámetro   | Descripción                                         | Tipo                                                                                                                  | Por defecto  |
| ----------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| `digits`    | Número de dígitos de la OTP                         | `number`                                                                                                              | `6`          |
| `algorithm` | Algoritmo de hash                                   | `'SHA-1' \| 'SHA-224' \| 'SHA-256' \| 'SHA-384' \| 'SHA-512' \| 'SHA3-224' \| 'SHA3-256' \| 'SHA3-384' \| 'SHA3-512'` | `'SHA-1'`    |
| `period`    | Duración de la ventana de tiempo (segundos)         | `number`                                                                                                              | `30`         |
| `timestamp` | Marca de tiempo (en ms) con la que se genera la OTP | `number`                                                                                                              | `Date.now()` |

## Ejemplo

### Uso básico

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP'; // clave secreta codificada en Base32
const result = TOTP.generate(secret);

console.log(result.otp); // por ejemplo: '341128'
console.log(result.expires); // por ejemplo: 1465324730000 (marca de tiempo)
```

### Cambiar el número de dígitos

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { digits: 8 });

console.log(result.otp); // por ejemplo: '43341128' (8 dígitos)
```

### Cambiar la ventana de tiempo

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { period: 60 }); // ventana de 60 segundos

console.log(result.otp);
console.log(result.expires);
```

### Usar otro algoritmo de hash

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const result = TOTP.generate(secret, { algorithm: 'SHA-512' });

console.log(result.otp);
```

### Generar la OTP con una marca de tiempo concreta

```js
import { TOTP } from 'ranuts';

const secret = 'JBSWY3DPEHPK3PXP';
const timestamp = 1465324707000; // marca de tiempo del 2016-06-08
const result = TOTP.generate(secret, { timestamp });

console.log(result.otp); // OTP generada a partir de esa marca de tiempo
```

### Combinar varias opciones

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

1. **Formato de la clave**: la clave ha de ser una cadena codificada en Base32. Si contiene caracteres que no valen, se lanza el error `'Invalid base32 character in key'`.

2. **Sincronía de los relojes**: TOTP depende de que los relojes vayan a la par. Asegúrate de que la hora del cliente y la del servidor coinciden, o la verificación puede fallar.

3. **Caducidad**: `expires` devuelve la marca de tiempo en que termina la ventana actual. Al verificar suele admitirse una holgura de una ventana (±1 periodo, por ejemplo).

4. **Seguridad**: las claves deben guardarse a buen recaudo y nunca escribirse a fuego en el código. Conviene usar variables de entorno o un sistema seguro de gestión de claves.
