# compose

Junta várias funções intermediárias numa só, que as roda em cadeia; cada uma recebe o contexto e um `next` que segue a cadeia. É o jeito comum de montar sistemas de middleware, ao estilo do Koa.

## API

### compose

#### Retorna

| Argumento  | Descrição                          | Tipo                    |
| ---------- | ---------------------------------- | ----------------------- |
| `Function` | A função intermediária já composta | `ComposedMiddleware<T>` |

#### Parâmetros

| Parâmetro    | Descrição                       | Tipo                   | Padrão      |
| ------------ | ------------------------------- | ---------------------- | ----------- |
| `middleware` | Array de funções intermediárias | `Array<Middleware<T>>` | Obrigatório |

#### O tipo do middleware

```typescript
type Middleware<T> = (context: T, next: Next) => any;
type Next = () => Promise<never> | Promise<void>;
```

## Exemplo

### Uso básico

```js
import { compose } from 'ranuts';

const middleware1 = async (ctx, next) => {
  console.log('Middleware 1: entra');
  await next();
  console.log('Middleware 1: sai');
};

const middleware2 = async (ctx, next) => {
  console.log('Middleware 2: entra');
  await next();
  console.log('Middleware 2: sai');
};

const middleware3 = async (ctx, next) => {
  console.log('Middleware 3: executa');
  ctx.data = 'Processado';
};

const composed = compose([middleware1, middleware2, middleware3]);
const context = {};

await composed(context);
// Saída:
// Middleware 1: entra
// Middleware 2: entra
// Middleware 3: executa
// Middleware 2: sai
// Middleware 1: sai

console.log(context.data); // 'Processado'
```

### Middleware para atender uma requisição

```js
import { compose } from 'ranuts';

// Middleware de registro
const logger = async (req, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  await next();
};

// Middleware de autenticação
const auth = async (req, next) => {
  if (!req.headers.authorization) {
    throw new Error('Não autorizado');
  }
  await next();
};

// Middleware que atende a requisição
const handler = async (req, next) => {
  req.response = { message: 'Hello World' };
};

const app = compose([logger, auth, handler]);

const request = {
  method: 'GET',
  url: '/api/users',
  headers: { authorization: 'Bearer token123' },
};

await app(request);
console.log(request.response); // { message: 'Hello World' }
```

### Tratamento de erros

```js
import { compose } from 'ranuts';

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.error('Error:', error.message);
    ctx.error = error;
  }
};

const handler = async (ctx, next) => {
  throw new Error('O processamento falhou');
};

const composed = compose([errorHandler, handler]);
const context = {};

await composed(context);
console.log(context.error); // Error: O processamento falhou
```

## Notas

1. **Ordem de execução**: os middleware rodam na ordem do array, e o seguinte entra depois da chamada a `next()`.
2. **Com async**: todos os middleware devem ser funções assíncronas ou devolver promessas.
3. **A chamada a `next()`**: é preciso chamar `next()` dentro do middleware para seguir ao próximo.
4. **Chamadas repetidas**: não dá para chamar `next()` mais de uma vez; se chamar, um erro é lançado.
5. **O contexto**: os dados passam de um middleware a outro pelo objeto `context`.
