# Utilidades para o localStorage

Acesso ao localStorage que não pode lançar, mais uma visão com prefixo e serialização JSON por cima.

O `localStorage` não é apenas ausente na renderização no servidor: ele também lança ao ser _acessado_ dentro de um iframe de terceiros com os cookies bloqueados, e ao _escrever_ no modo privado do Safari ou ao bater na cota. Aqui toda leitura e toda escrita vão protegidas, porque uma falha de armazenamento deve degradar uma preferência, nunca quebrar a página.

## API

### localStorageSetItem

Guarda um valor no localStorage.

#### Parâmetros

| Parâmetro | Descrição     | Tipo     | Padrão      |
| --------- | ------------- | -------- | ----------- |
| `name`    | Nome da chave | `string` | Obrigatório |
| `value`   | O valor       | `string` | Obrigatório |

#### Retorna

Sem valor de retorno (`void`)

### localStorageGetItem

Lê um valor do localStorage.

#### Parâmetros

| Parâmetro | Descrição     | Tipo     | Padrão      |
| --------- | ------------- | -------- | ----------- |
| `name`    | Nome da chave | `string` | Obrigatório |

#### Retorna

| Argumento | Descrição                                     | Tipo     |
| --------- | --------------------------------------------- | -------- |
| `string`  | O valor guardado; string vazia se não existir | `string` |

### localStorageRemoveItem

Tira uma chave.

| Parâmetro | Descrição     | Tipo     | Padrão      |
| --------- | ------------- | -------- | ----------- |
| `name`    | Nome da chave | `string` | Obrigatório |

### createStore(prefix?)

Uma visão sobre o localStorage, com prefixo e serialização JSON.

#### Retorna

| Método               | Descrição                                                                               |
| -------------------- | --------------------------------------------------------------------------------------- |
| `get(key, fallback)` | O valor guardado, ou `fallback` se faltar, não estiver disponível ou estiver corrompido |
| `set(key, value)`    | Serializa e guarda; `false` se nada chegou a ser escrito                                |
| `remove(key)`        | Tira a chave                                                                            |
| `keyOf(key)`         | A chave completa (`prefix + key`), útil para escutar o evento `storage`                 |

## Exemplo

### Uso básico

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// Guardar o valor
localStorageSetItem('username', 'john');

// Ler o valor
const username = localStorageGetItem('username');
console.log(username); // 'john'
```

### Guardar um objeto

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

const user = { name: 'John', age: 30 };
localStorageSetItem('user', JSON.stringify(user));

const storedUser = JSON.parse(localStorageGetItem('user'));
console.log(storedUser); // { name: 'John', age: 30 }
```

### Segurança no servidor

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// No servidor não lança erro: falha em silêncio
localStorageSetItem('key', 'value'); // No servidor: não faz nada
const value = localStorageGetItem('key'); // No servidor: devolve ''
```

### Conferir se existe

```js
import { localStorageGetItem } from 'ranuts';

const value = localStorageGetItem('myKey');
if (value) {
  console.log('O valor existe:', value);
} else {
  console.log('O valor não existe');
}
```

### Armazenamento JSON com espaço de nomes

```js
import { createStore } from 'ranuts';

const history = createStore('agent_history_');

history.set('default', messages); // escreve agent_history_default
const restored = history.get('default', []); // [] se faltar ou estiver corrompido
history.remove('default');
```

### Vários recursos, uma mesma origem

```js
import { createStore } from 'ranuts';

// Os prefixos impedem que recursos sem relação entre si colidam.
const keys = createStore('agent_api_key_');
const prefs = createStore('editor_prefs_');

keys.set('anthropic', token);
prefs.set('theme', 'dark');
```

## Notas

1. **Aqui nada lança.** Falta de armazenamento, um quadro de terceiros bloqueado, o modo privado, a cota: tudo isso degrada em silêncio. O `localStorageGetItem` devolve `''`, as funções que escrevem não fazem nada e `createStore().set()` relata `false`.

2. **A proteção fica na chamada, não no carregamento do módulo.** A busca pelo armazenamento acontece dentro de cada chamada, então isto funciona depois de renderizar no servidor e hidratar, e pode ser substituído nos testes.

3. **O `createStore` não valida nada.** O que estiver guardado volta tipado como `T`; confira você mesmo se aquilo atravessa uma fronteira de versão. O valor de reserva cobre só a ausência e a falha ao analisar: um valor escrito por uma versão mais antiga do seu código não consegue lançar um `SyntaxError` em quem chama, mas ainda pode ter o formato errado.

4. **`set` devolve `false`** diante de uma estrutura circular, de um `BigInt`, ou de uma escrita que não vingou. Ele relê o valor para confirmar.

5. **Limite de tipos**: as utilidades cruas só lidam com strings. Use `createStore` em vez de escrever à mão `JSON.stringify` e `JSON.parse` com um try/catch em cada lugar.

6. **Valor devolvido**: quando o valor não existe, o `localStorageGetItem` devolve `''`, e não `null`.
