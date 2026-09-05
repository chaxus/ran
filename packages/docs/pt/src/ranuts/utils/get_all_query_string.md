# getAllQueryString

Tira todos os parâmetros de consulta de uma URL e os converte em objeto.

## API

### getAllQueryString

#### Retorna

| Argumento | Descrição                            | Tipo                     |
| --------- | ------------------------------------ | ------------------------ |
| `Object`  | Objeto com os parâmetros de consulta | `Record<string, string>` |

#### Parâmetros

| Parâmetro | Descrição                                               | Tipo     | Padrão   |
| --------- | ------------------------------------------------------- | -------- | -------- |
| `url`     | URL a analisar (opcional; por padrão a da página atual) | `string` | Opcional |

## Exemplo

### Uso básico

```js
import { getAllQueryString } from 'ranuts';

// Suponha que a URL atual seja https://example.com?name=John&age=30
const params = getAllQueryString();
console.log(params); // { name: 'John', age: '30' }
```

### Analisar uma URL específica

```js
import { getAllQueryString } from 'ranuts';

const url = 'https://example.com?page=1&limit=10&sort=name';
const params = getAllQueryString(url);
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### Ler um parâmetro específico

```js
import { getAllQueryString } from 'ranuts';

const params = getAllQueryString();
const page = params.page || '1';
const limit = params.limit || '10';
console.log(`Página: ${page}, limite: ${limit}`);
```

### Parâmetros codificados

```js
import { getAllQueryString } from 'ranuts';

// URL: https://example.com?search=hello%20world
const params = getAllQueryString();
console.log(params.search); // 'hello world' (decodificado sozinho)
```

## Notas

1. **Uma flag sozinha mantém seu lugar.** `?embed` e `?embed=` dão os dois `{ embed: '' }`. Antes da 0.3, qualquer parâmetro sem valor era descartado, o que fazia `?readonly` e `?embed` (a forma habitual de escrever uma flag booleana) ficarem indistinguíveis do parâmetro ausente. Leia essas flags com [`queryFlag`](/pt/src/ranuts/utils/query_flag).

2. **O fragmento nunca vaza para o último valor.** `?lang=en#section` dá `{ lang: 'en' }`.

3. **Só o primeiro `=` divide**, então um valor pode conter outro: `?next=/a?b=1` dá `{ next: '/a?b=1' }`.

4. **Decodificação**: chaves e valores são decodificados de porcentagem, e o `+` vira espaço, igual ao `URLSearchParams`. Um escape malformado como `%zz` é mantido como está, em vez de o parâmetro ser descartado, para que um valor ruim não esconda os outros.

5. **No servidor**: devolve `{}` quando não há `window` nem uma `url` foi passada. Passe uma URL para usá-lo num script de build.

6. **URL padrão**: sem `url`, usa `window.location.href`.

7. **Parâmetros repetidos**: só o último valor é guardado.
