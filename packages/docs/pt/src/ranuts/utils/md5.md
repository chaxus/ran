# md5

Função hash MD5: converte uma string no seu valor MD5 (uma string hexadecimal).

## API

### md5

#### Retorna

| Argumento | Descrição | Tipo |
| -------- | ----------------------------------- | -------- |
| `string` | O valor MD5 (string hexadecimal) | `string` |

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| --------- | -------------- | -------- | -------- |
| `str` | String a que se aplica o hash | `string` | Obrigatório |

## Exemplo

### Uso básico

```js
import { md5 } from 'ranuts';

const hash = md5('hello world');
console.log(hash); // '5eb63bbbe01eeed093cb22bb8f5acdc3'
```

### Hash de uma senha

```js
import { md5 } from 'ranuts';

const password = 'myPassword123';
const hashedPassword = md5(password);
console.log(hashedPassword);
```

### Hash do conteúdo de um arquivo

```js
import { md5 } from 'ranuts';

const fileContent = 'aqui vai o conteúdo do arquivo';
const fileHash = md5(fileContent);
console.log('Hash do arquivo:', fileHash);
```

### Quando não se passa uma string

```js
import { md5 } from 'ranuts';

// Se for passado algo que não é string, devolve uma string aleatória
const result = md5(123);
console.log(result); // String aleatória
```

## Notas

1. **Segurança**: MD5 é considerado inseguro e não deve ser usado para guardar senhas nem em nada delicado. Prefira um algoritmo mais sólido, como SHA-256.
2. **Tipo da entrada**: se a entrada não for string, a função devolve uma string aleatória.
3. **Formato da saída**: uma string hexadecimal de 32 caracteres, em minúsculas.
4. **Desempenho**: com muito dado o cálculo pode demorar, então convém fazê-lo num contexto assíncrono.
