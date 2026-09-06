# WebDB

Um invólucro de promessas em volta do IndexedDB. O IndexedDB nativo se apoia em callbacks de eventos e transações: cada leitura ou escrita são cinco passos (abrir → transação → objectStore → requisição → `onsuccess`/`onerror`). O `WebDB` resume tudo isso a `await db.add({ storeName, data })`.

## API

### new WebDB(options)

| Parâmetro | Descrição                                                                                       | Tipo               | Padrão      |
| --------- | ----------------------------------------------------------------------------------------------- | ------------------ | ----------- |
| `dbName`  | Nome do banco de dados                                                                          | `string`           | Obrigatório |
| `version` | Versão do esquema; suba-a sempre que `stores` mudar                                             | `number`           | `1`         |
| `stores`  | Repositórios de objetos e índices, declarados e criados durante uma atualização                 | `IDBStoreSchema[]` | `[]`        |
| `upgrade` | Saída de emergência para migrações que o esquema não consegue exprimir; roda depois de `stores` | `Function`         | —           |

Todos os métodos resolvem ou rejeitam com o mesmo formato, `IDBResult`, então quem chama só precisa olhar `error`.

| Método                                               | Descrição                           |
| ---------------------------------------------------- | ----------------------------------- |
| `openDataBase()`                                     | Abre (e atualiza se preciso)        |
| `closeDataBase()`                                    | Fecha e solta a alça                |
| `refreshDatabase()`                                  | Fecha e abre de novo                |
| `deleteDatabase()`                                   | Apaga o banco de dados              |
| `add({ storeName, data })`                           | Insere; falha se a chave já existir |
| `update({ storeName, data })`                        | Put: insere ou sobrescreve          |
| `readByKey({ storeName, key })`                      | Lê um registro                      |
| `readAll({ storeName, query?, count? })`             | Lê todos os registros               |
| `readByCursor({ storeName, keyRange?, direction? })` | Percorre com um cursor              |
| `count({ storeName, query? })`                       | Conta registros                     |
| `delete({ storeName, key })`                         | Apaga um registro                   |
| `clear({ storeName })`                               | Esvazia um repositório              |

### `db.collection<T>(name)`

Uma alça tipada e tolerante sobre um único repositório. Fixa o nome dele uma vez e devolve valores comuns em vez de `IDBResult`.

| Membro        | Retorna              | Se falhar |
| ------------- | -------------------- | --------- |
| `get(key)`    | `Promise<T \| null>` | `null`    |
| `all()`       | `Promise<T[]>`       | `[]`      |
| `count()`     | `Promise<number>`    | `0`       |
| `add(value)`  | `Promise<boolean>`   | `false`   |
| `put(value)`  | `Promise<boolean>`   | `false`   |
| `remove(key)` | `Promise<boolean>`   | `false`   |
| `clear()`     | `Promise<boolean>`   | `false`   |

```js
const notes = db.collection('books_notes');
await notes.put(note); // false se falhar
const all = await notes.all(); // [] se falhar
```

::: warning Escolha a camada certa
Todos esses métodos **engolem o erro**. É o padrão certo para aquilo que a maioria dos aplicativos guarda no IndexedDB (até onde a pessoa leu, rascunhos, caches), em que uma leitura falha deve degradar o recurso, não derrubar a tela. É o padrão errado quando a escrita _é_ a ação da pessoa (salvar um documento, concluir uma compra): aí chame os métodos acima, os que devolvem `IDBResult`, e cuide da falha.
:::

## Exemplo

```js
import { WebDB } from 'ranuts';

const db = new WebDB({
  dbName: 'read',
  version: 4,
  stores: [
    { name: 'books', options: { keyPath: 'id' }, indexes: [{ name: 'byAuthor', keyPath: 'author' }] },
    { name: 'notes', options: { keyPath: 'id' } },
  ],
});

await db.openDataBase();
await db.add({ storeName: 'books', data: { id: '1', title: 'Walden' } });
const { data } = await db.readByKey({ storeName: 'books', key: '1' });
```

## Notas

1. **Repositórios só podem ser criados dentro de uma transação de atualização**: por isso são declarados de antemão, em vez de criados depois que o banco abre. Criar um repositório ou índice que falta é idempotente, então dá para manter o mesmo array `stores` entre versões sem risco.
2. **Baixar de versão se resolve sozinho.** Abrir com uma versão menor que a que está em disco lança um `VersionError`; o `WebDB` tira dali a versão real, se acerta e abre de novo, em vez de deixar o erro vazar.
3. **Esta conexão nunca bloqueia uma atualização.** Cada abertura registra `onversionchange`, de modo que, quando outra aba ou worker pede uma versão maior, esta conexão se fecha sozinha.
4. **Junte com `singleFlight`** para que chamadas simultâneas dividam uma única abertura: `const ready = singleFlight(() => db.openDataBase())`.
