# randomString

Genera una cadena aleatoria precedida de una marca de tiempo, para que sea difícil que se repita.

## API

### randomString

#### Devuelve

| Argumento | Descripción                                                    | Tipo     |
| --------- | -------------------------------------------------------------- | -------- |
| `string`  | Cadena aleatoria (formato: marca de tiempo-caracteres al azar) | `string` |

#### Parámetros

| Parámetro | Descripción                                             | Tipo     | Por defecto |
| --------- | ------------------------------------------------------- | -------- | ----------- |
| `len`     | Longitud de la parte aleatoria (sin la marca de tiempo) | `number` | `8`         |

## Ejemplo

### Uso básico

```js
import { randomString } from 'ranuts';

const str = randomString();
console.log(str); // por ejemplo: '1703123456789-abc12345'
```

### Indicar la longitud

```js
import { randomString } from 'ranuts';

const str = randomString(12);
console.log(str); // por ejemplo: '1703123456789-abcdefghijkl'
```

### Generar un identificador único

```js
import { randomString } from 'ranuts';

const uniqueId = randomString(16);
console.log('Identificador único:', uniqueId);
```

### Nombre de archivo temporal

```js
import { randomString } from 'ranuts';

const tempFileName = `temp_${randomString(10)}.txt`;
console.log(tempFileName); // por ejemplo: 'temp_1703123456789-xyz1234567.txt'
```

## Notas

1. **Difícil de repetir**: como lleva la marca de tiempo, la cadena resultante es muy poco propensa a coincidir con otra.
2. **Alfabeto**: usa `ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678`, sin los caracteres que se confunden con facilidad (0, O, 1, I, l y demás).
3. **Formato**: devuelve `{marca de tiempo}-{caracteres al azar}`.
4. **Longitud**: el argumento `len` solo rige la parte aleatoria; ni la marca de tiempo ni el guion cuentan.

## getRandomString

Una alternativa más ligera: sin marca de tiempo y sin alfabeto restringido, solo `Math.random().toString(36)` recortado a `len` caracteres (base 36, es decir `0-9a-z`). No resiste las colisiones como `randomString`; úsala para un id de DOM de usar y tirar o un parámetro que rompa la caché, donde la unicidad no tiene que sobrevivir a una colisión de marcas de tiempo.

```js
import { getRandomString } from 'ranuts/utils';

getRandomString(); // por ejemplo 'k3j9x2p1' (8 caracteres)
getRandomString(4); // por ejemplo 'a1b2'
```
