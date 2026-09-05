# SyncHook

Clase de hooks de eventos síncronos, para montar el patrón de publicación y suscripción.

## API

### SyncHook

#### Métodos principales

| Método     | Descripción                                                        | Valor devuelto  |
| ---------- | ------------------------------------------------------------------ | --------------- |
| `tap`      | Suscribirse a un evento                                            | `this`          |
| `call`     | Disparar un evento                                                 | `this`          |
| `callSync` | Disparar un evento de forma síncrona (admite callbacks asíncronos) | `Promise<this>` |
| `once`     | Suscribirse a un evento una sola vez                               | `this`          |
| `off`      | Cancelar la suscripción                                            | `this`          |

## Ejemplo

### Uso básico

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

// Suscribirse al evento
hook.tap('event1', () => {
  console.log('Se disparó el evento 1');
});

// Disparar el evento
hook.call('event1'); // 'Se disparó el evento 1'
```

### Pasar argumentos

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('greet', (name) => {
  console.log(`¡Hola, ${name}!`);
});

hook.call('greet', 'World'); // '¡Hola, World!'
```

### Suscribirse una sola vez

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.once('onceEvent', () => {
  console.log('Esto solo ocurre una vez');
});

hook.call('onceEvent'); // 'Esto solo ocurre una vez'
hook.call('onceEvent'); // No pasa nada
```

### Cancelar la suscripción

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

const callback = () => {
  console.log('Callback');
};

hook.tap('event', callback);
hook.call('event'); // 'Callback'

hook.off('event', callback);
hook.call('event'); // No pasa nada
```

### Callbacks asíncronos

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('asyncEvent', async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('Callback asíncrono');
});

await hook.callSync('asyncEvent'); // 'Callback asíncrono'
```

## Notas

1. **Ejecución síncrona**: el método `call` ejecuta todos los callbacks de forma síncrona.
2. **Con async**: el método `callSync` admite callbacks asíncronos y espera a que terminen todos.
3. **Gestión de eventos**: por dentro usa `Map` y `Set` para llevar la cuenta de eventos y callbacks.
4. **Cuándo usarlo**: es habitual en sistemas de eventos, sistemas de plugins y middleware.
