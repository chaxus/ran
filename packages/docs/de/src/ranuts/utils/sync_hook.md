# SyncHook

Klasse für synchrone Ereignis-Hooks, mit der sich das Publish-Subscribe-Muster umsetzen lässt.

## API

### SyncHook

#### Wichtigste Methoden

| Methode    | Beschreibung                                                    | Rückgabewert    |
| ---------- | --------------------------------------------------------------- | --------------- |
| `tap`      | Ein Ereignis abonnieren                                         | `this`          |
| `call`     | Ein Ereignis auslösen                                           | `this`          |
| `callSync` | Ein Ereignis synchron auslösen (auch mit asynchronen Callbacks) | `Promise<this>` |
| `once`     | Ein Ereignis nur ein einziges Mal abonnieren                    | `this`          |
| `off`      | Das Abo beenden                                                 | `this`          |

## Beispiel

### Grundlegende Verwendung

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

// Das Ereignis abonnieren
hook.tap('event1', () => {
  console.log('Ereignis 1 wurde ausgelöst');
});

// Das Ereignis auslösen
hook.call('event1'); // 'Ereignis 1 wurde ausgelöst'
```

### Argumente übergeben

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('greet', (name) => {
  console.log(`Hallo, ${name}!`);
});

hook.call('greet', 'World'); // 'Hallo, World!'
```

### Nur einmal abonnieren

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.once('onceEvent', () => {
  console.log('Das passiert nur ein einziges Mal');
});

hook.call('onceEvent'); // 'Das passiert nur ein einziges Mal'
hook.call('onceEvent'); // Passiert nichts
```

### Das Abo beenden

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

const callback = () => {
  console.log('Callback');
};

hook.tap('event', callback);
hook.call('event'); // 'Callback'

hook.off('event', callback);
hook.call('event'); // Passiert nichts
```

### Asynchrone Callbacks

```js
import { SyncHook } from 'ranuts';

const hook = new SyncHook();

hook.tap('asyncEvent', async () => {
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.log('Asynchroner Callback');
});

await hook.callSync('asyncEvent'); // 'Asynchroner Callback'
```

## Hinweise

1. **Synchrone Ausführung**: Die Methode `call` führt alle Callbacks synchron aus.
2. **Mit async**: Die Methode `callSync` nimmt auch asynchrone Callbacks und wartet, bis alle fertig sind.
3. **Verwaltung**: Intern halten `Map` und `Set` Ereignisse und Callbacks zusammen.
4. **Einsatz**: üblich in Ereignissystemen, Plugin-Systemen und Middleware.
