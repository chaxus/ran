# SyncHook

Classe de hooks de eventos síncronos, para montar o padrão de publicação e assinatura.

## API

### SyncHook

#### Métodos principais

| Método     | Descrição                                                           | Valor devolvido |
| ---------- | ------------------------------------------------------------------- | --------------- |
| `tap`      | Assinar um evento                                                   | `this`          |
| `call`     | Disparar um evento                                                  | `this`          |
| `callSync` | Disparar um evento de forma síncrona (aceita callbacks assíncronos) | `Promise<this>` |
| `once`     | Assinar um evento uma única vez                                     | `this`          |
| `off`      | Cancelar a assinatura                                               | `this`          |

## Exemplo

### Uso básico

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

// Assinar o evento
hook.tap('event1', () => {
  console.log('O evento 1 disparou');
});

// Disparar o evento
hook.call('event1'); // 'O evento 1 disparou'
```

### Passar argumentos

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('greet', (name) => {
  console.log(`Olá, ${name}!`);
});

hook.call('greet', 'World'); // 'Olá, World!'
```

### Assinar uma única vez

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.once('onceEvent', () => {
  console.log('Isto acontece uma vez só');
});

hook.call('onceEvent'); // 'Isto acontece uma vez só'
hook.call('onceEvent'); // Não acontece nada
```

### Cancelar a assinatura

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

const callback = () => {
  console.log('Callback');
};

hook.tap('event', callback);
hook.call('event'); // 'Callback'

hook.off('event', callback);
hook.call('event'); // Não acontece nada
```

### Callbacks assíncronos

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('asyncEvent', async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('Callback assíncrono');
});

await hook.callSync('asyncEvent'); // 'Callback assíncrono'
```

## Notas

1. **Execução síncrona**: o método `call` executa todos os callbacks de forma síncrona.
2. **Com async**: o método `callSync` aceita callbacks assíncronos e espera todos terminarem.
3. **Gestão de eventos**: por dentro usa `Map` e `Set` para controlar eventos e callbacks.
4. **Quando usar**: é comum em sistemas de eventos, sistemas de plugins e middleware.
