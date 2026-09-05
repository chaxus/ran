# randomString

Gera uma string aleatória precedida de um carimbo de tempo, para ser difícil de repetir.

## API

### randomString

#### Retorna

| Argumento | Descrição                                                        | Tipo     |
| --------- | ---------------------------------------------------------------- | -------- |
| `string`  | String aleatória (formato: carimbo de tempo-caracteres ao acaso) | `string` |

#### Parâmetros

| Parâmetro | Descrição                                           | Tipo     | Padrão |
| --------- | --------------------------------------------------- | -------- | ------ |
| `len`     | Tamanho da parte aleatória (sem o carimbo de tempo) | `number` | `8`    |

## Exemplo

### Uso básico

```js
import { randomString } from 'ranuts';

const str = randomString();
console.log(str); // por exemplo: '1703123456789-abc12345'
```

### Indicar o tamanho

```js
import { randomString } from 'ranuts';

const str = randomString(12);
console.log(str); // por exemplo: '1703123456789-abcdefghijkl'
```

### Gerar um identificador único

```js
import { randomString } from 'ranuts';

const uniqueId = randomString(16);
console.log('Identificador único:', uniqueId);
```

### Nome de arquivo temporário

```js
import { randomString } from 'ranuts';

const tempFileName = `temp_${randomString(10)}.txt`;
console.log(tempFileName); // por exemplo: 'temp_1703123456789-xyz1234567.txt'
```

## Notas

1. **Difícil de repetir**: como leva o carimbo de tempo, a string gerada dificilmente coincide com outra.
2. **Alfabeto**: usa `ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678`, sem os caracteres que se confundem com facilidade (0, O, 1, I, l e afins).
3. **Formato**: devolve `{carimbo de tempo}-{caracteres ao acaso}`.
4. **Tamanho**: o argumento `len` rege só a parte aleatória; nem o carimbo nem o hífen contam.

## getRandomString

Uma alternativa mais leve: sem carimbo de tempo e sem alfabeto restrito, apenas `Math.random().toString(36)` cortado em `len` caracteres (base 36, ou seja `0-9a-z`). Não resiste a colisões como o `randomString`; use para um id de DOM descartável ou um parâmetro que quebre o cache, onde a unicidade não precisa sobreviver a uma colisão de carimbos.

```js
import { getRandomString } from 'ranuts/utils';

getRandomString(); // por exemplo 'k3j9x2p1' (8 caracteres)
getRandomString(4); // por exemplo 'a1b2'
```
