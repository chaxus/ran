# querystring

Converte um objeto em uma string de consulta para URL.

## API

### querystring

#### Retorna

| Argumento | Descrição | Tipo |
| -------- | ---------------- | -------- |
| `string` | A string de consulta | `string` |

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| --------- | ----------------- | -------- | ------- |
| `data` | Objeto que será convertido | `Object` | `{}` |

## Exemplo

### Uso básico

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: 30,
  city: 'New York',
};

const query = querystring(params);
console.log(query); // 'name=John&age=30&city=New%20York'
```

### Montar uma URL

```js
import { querystring } from 'ranuts';

const baseUrl = 'https://api.example.com/users';
const params = {
  page: 1,
  limit: 10,
  sort: 'name',
};

const url = `${baseUrl}?${querystring(params)}`;
console.log(url);
// 'https://api.example.com/users?page=1&limit=10&sort=name'
```

### Caracteres especiais

```js
import { querystring } from 'ranuts';

const params = {
  search: 'hello world',
  category: 'web development',
};

const query = querystring(params);
console.log(query); // 'search=hello%20world&category=web%20development'
```

### undefined e null são descartados

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: undefined,
  city: null,
  active: true,
};

const query = querystring(params);
console.log(query); // 'name=John&active=true'
// Os valores undefined e null são descartados
```

## Notas

1. **Codificação**: os valores são codificados sozinhos para a URL.
2. **Valores vazios**: os `undefined` e `null` são descartados e não aparecem na string.
3. **Precisa ser objeto**: se for passado outra coisa, um `TypeError` é lançado.
4. **Passo anterior**: tanto as chaves quanto os valores passam por `decodeURIComponent` antes de serem codificados.
