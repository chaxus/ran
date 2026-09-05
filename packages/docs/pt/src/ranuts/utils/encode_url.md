# encodeUrl

Codifica uma URL com segurança: deixa intactas as sequências já codificadas e trata pares substitutos soltos.

## API

### encodeUrl

#### Retorna

| Argumento | Descrição        | Tipo     |
| --------- | ---------------- | -------- |
| `string`  | A URL codificada | `string` |

#### Parâmetros

| Parâmetro | Descrição       | Tipo     | Padrão      |
| --------- | --------------- | -------- | ----------- |
| `url`     | URL a codificar | `string` | Obrigatório |

## Exemplo

### Uso básico

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/path with spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### URLs já codificadas

```js
import { encodeUrl } from 'ranuts';

// O que já estava codificado não é codificado de novo
const url = 'https://example.com/path%20with%20spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### Caracteres especiais

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/search?q=hello world&lang=zh-CN';
const encoded = encodeUrl(url);
console.log(encoded); // A URL codificada
```

### Codificações quebradas

```js
import { encodeUrl } from 'ranuts';

// Sequências quebradas (como %foo) são codificadas
const url = 'https://example.com/path%foo';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%25foo'
```

## Notas

1. **Codificação com critério**: mexe só no que não estava codificado; sequências já codificadas (como `%20`) ficam como estão.
2. **Pares substitutos**: pares substitutos soltos são resolvidos sozinhos e trocados pelo caractere de substituição do Unicode.
3. **Sem erros**: não lança exceções; tenta codificar a URL da melhor forma possível.
4. **Quando usar**: é comum para tratar URLs digitadas pelo usuário e para montar URLs seguras.
