# clearBr

Tira de uma string os espaços, as tags HTML e as quebras de linha.

## API

### clearBr

#### Retorna

| Argumento | Descrição         | Tipo     |
| --------- | ----------------- | -------- |
| `string`  | A string já limpa | `string` |

#### Parâmetros

| Parâmetro | Descrição       | Tipo     | Padrão |
| --------- | --------------- | -------- | ------ |
| `str`     | String a limpar | `string` | `''`   |

## Exemplo

### Uso básico

```js
import { clearBr } from 'ranuts';

const text = '  <p>Hello\nWorld</p>  ';
const cleaned = clearBr(text);
console.log(cleaned); // 'HelloWorld'
```

### Limpar conteúdo HTML

```js
import { clearBr } from 'ranuts';

const html = '<div>Isto é conteúdo de <strong>teste</strong></div>\nquebra de linha';
const cleaned = clearBr(html);
console.log(cleaned); // 'Istoéconteúdodetestequebradelinha'
```

### String vazia

```js
import { clearBr } from 'ranuts';

console.log(clearBr('')); // '' (string vazia)
console.log(clearBr()); // '' (string vazia)
```

## Notas

1. **O que limpa**: tira todos os espaços, as tags HTML e as quebras de linha (`\r\n`).
2. **String vazia**: se a entrada for uma string vazia, devolve uma string vazia direto.
3. **Quando usar**: comum para extrair o texto puro, sem as marcas de formatação.
