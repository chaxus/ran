# appendUrl

Acrescenta ao fim de uma URL um objeto de parâmetros de consulta.

## API

### appendUrl

#### Retorna

| Argumento | Descrição                                      | Tipo     |
| --------- | ---------------------------------------------- | -------- |
| `string`  | A URL completa com os parâmetros acrescentados | `string` |

#### Parâmetros

| Parâmetro | Descrição                            | Tipo                     | Padrão      |
| --------- | ------------------------------------ | ------------------------ | ----------- |
| `url`     | URL de partida                       | `string`                 | Obrigatório |
| `params`  | Objeto com os parâmetros de consulta | `Record<string, string>` | `{}`        |

## Exemplo

### Uso básico

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', limit: '10' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?page=1&limit=10'
```

### URL que já traz parâmetros

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com?sort=name';
const params = { page: '1' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?sort=name&page=1'
```

### URLs relativas ao protocolo

```js
import { appendUrl } from 'ranuts';

// Às URLs que começam com // é acrescentado https:// sozinho
const url = '//example.com';
const params = { id: '123' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?id=123'
```

### Os valores vazios são descartados

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', empty: '' };
const fullUrl = appendUrl(url, params);
// Os valores que são string vazia são descartados
console.log(fullUrl); // 'https://example.com?page=1'
```

## Notas

1. **Protocolo**: se a URL começa com `//`, `https://` é acrescentado na frente.

2. **Combinação**: se a URL já traz parâmetros de consulta, os novos vão atrás.

3. **Valores vazios**: parâmetros cujo valor é string vazia são descartados e não chegam à URL.

4. **Codificação**: os valores são codificados sozinhos para a URL.

5. **Sobrescrita**: se o nome do parâmetro já existe, o valor novo substitui o anterior (é assim que o `URLSearchParams` se comporta).
