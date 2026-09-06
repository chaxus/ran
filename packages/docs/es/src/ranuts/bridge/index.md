# Puente (postMessage)

Una capa pequeña de mensajería entre contextos, montada sobre `window.postMessage`. Deja que dos contextos de navegación —una página madre y un `<iframe>`, una ventana emergente, o cualquier otro `Window` del que tengas una referencia— hablen entre sí con una API de petición y respuesta (al estilo RPC) y con difusiones de un solo sentido.

Los mensajes cruzan la frontera como **objetos estructurados** (usando el algoritmo de clonado estructurado propio de `postMessage`), así que tipos como `Date`, `Map`, `Set`, `ArrayBuffer` y `File` llegan intactos sin serializar nada a mano. Cada mensaje lleva una marca de protocolo para poder distinguirlo del tráfico `postMessage` de otras bibliotecas (HMR, DevTools, SDK de terceros).

Hay tres maneras de usarlo:

- **`PostMessageBridge`**: la pieza de más bajo nivel. Cada instancia envuelve un `Window` de destino. Registras manejadores con `on`, envías y esperas con `send`, y lanzas sin esperar respuesta con `broadcast`.
- **`BridgeManager` / `bridgeManager` / `Client` / `Platform`**: una capa por encima que mantiene un registro de puentes con nombre (un singleton), más dos fachadas finas: `Client` (el lado que llama) y `Platform` (el lado que recibe).
- **`openPortBridge` / `acceptPortBridge` / `createPortBridge`**: un puente punto a punto montado sobre `MessageChannel` / `MessagePort` (**lo recomendado para código nuevo**). Tras un apretón de manos único, cada lado se queda con un puerto privado, y eso evita por construcción la diafonía entre ventanas, la suplantación del emisor, los choques de canal dentro de una misma ventana y el responderse a uno mismo, sin necesidad de filtrar por origen.

> **Compatibilidad**: el formato de transmisión es un objeto estructurado, ya no una cadena en Base64. Los extremos de la misma versión se entienden directamente, y `Client` (`PostMessageBridge`) comparte con `Platform` un mismo protocolo de sobre. Si mezclas una página vieja con una nueva de otra versión, el protocolo no cuadrará.

## API

### `PostMessageBridge`

La clase central. Cada instancia apunta a un único `Window`. En vez de que cada una añada el suyo, todas comparten **un solo** escuchador de `message` sobre `window`, y un repartidor interno encamina cada mensaje; así el número de escuchadores no crece con el de instancias.

```ts
new PostMessageBridge(targetWindow?: Window, targetOrigin?: string, channel?: string)
```

#### Parámetros del constructor

| Parámetro      | Descripción                                                                                                                              | Tipo     | Por defecto |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `targetWindow` | El `Window` al que se envían los mensajes (un iframe, una ventana emergente, `parent`, …)                                                | `Window` | `window`    |
| `targetOrigin` | El origen al que se envía y del que se acepta. Con `'*'` se desactiva la comprobación                                                    | `string` | `'*'`       |
| `channel`      | Identificador de canal. Aísla **varios puentes sobre la misma ventana**: los dos extremos tienen que usar el mismo canal para entenderse | `string` | `'default'` |

#### Methods

| Método                         | Descripción                                                                                                                         | Firma                                                         |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `on(type, handler)`            | Registra un manejador para un `type` de mensaje. Lo que devuelva (o aquello con lo que resuelva) se envía de vuelta como respuesta. | `<T, R>(type: string, handler: MessageHandler<T, R>) => void` |
| `off(type)`                    | Quita el manejador registrado para `type`.                                                                                          | `(type: string) => void`                                      |
| `send(type, payload)`          | Envía un mensaje y espera la respuesta. Rechaza con el error del manejador remoto, o al agotarse los 120 s.                         | `<T, R>(type: string, payload: T) => Promise<R>`              |
| `broadcast({ type, payload })` | Lanzar y olvidar: envía un mensaje sin esperar respuesta.                                                                           | `<T>(data: { type: string; payload: T }) => void`             |
| `destroy()`                    | Se da de baja del repartidor, borra todos los manejadores y rechaza todas las peticiones pendientes.                                | `() => void`                                                  |

> **Guardia contra responderse a uno mismo**: cada instancia lleva un identificador de emisor propio y **no** atenderá una petición que ella misma envió. Para hacer petición y respuesta **dentro de una sola ventana**, usa dos instancias de puente (una registra los manejadores y la otra envía).

### `BridgeManager`

Un registro singleton que es dueño de varias instancias de `PostMessageBridge` con nombre. Consigue la instancia compartida con `BridgeManager.getInstance()` o usa la exportación ya hecha [`bridgeManager`](#bridgemanager-singleton). El constructor es privado.

| Método                         | Descripción                                                                   | Firma                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `BridgeManager.getInstance()`  | Devuelve la instancia singleton compartida.                                   | `() => BridgeManager`                                                          |
| `connectClient(options)`       | Crea y registra un puente nuevo. Lanza si el `id` ya existe.                  | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `getClient(id)`                | Busca un puente registrado por su identificador.                              | `(id: string) => PostMessageBridge \| undefined`                               |
| `removeClient(id)`             | Destruye y da de baja el puente con ese identificador.                        | `(id: string) => void`                                                         |
| `removeAllClient()`            | Destruye y da de baja todos los puentes.                                      | `() => void`                                                                   |
| `broadcast({ type, payload })` | Difunde un mensaje por todos los puentes registrados.                         | `<T>(payload: { type: string; payload: T }) => void`                           |
| `sendTo(id, type, payload)`    | Envía una petición por el puente con ese identificador y espera la respuesta. | `<T, R>(id: string, type: string, payload: T) => Promise<R>`                   |

Si omites `id` en `connectClient`, se genera y devuelve un identificador aleatorio de diez caracteres. `options` acepta además `channel`, que se pasa al `PostMessageBridge` de debajo.

### `bridgeManager` (singleton)

La instancia compartida de `BridgeManager` ya creada, equivalente a `BridgeManager.getInstance()`. Importa esta en vez de construir la tuya.

```ts
import { bridgeManager } from 'ranuts/utils';
```

### `Client`

Una fachada fina sobre `bridgeManager` para el lado **que llama** (el contexto que inicia las peticiones). Es un objeto llano, no una clase.

| Método                        | Descripción                                                                      | Firma                                                                          |
| ----------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `connect(options)`            | Conecta con una ventana de destino (lo delega en `bridgeManager.connectClient`). | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `remove(id)`                  | Quita una conexión por su identificador.                                         | `(id: string) => void`                                                         |
| `removeAll()`                 | Quita todas las conexiones.                                                      | `() => void`                                                                   |
| `broadcast(payload)`          | Difunde a todas las plataformas conectadas.                                      | `(payload: BroadcastPayload) => void`                                          |
| `call({ id, type, payload })` | Envía una petición a la plataforma que hay tras `id` y espera la contestación.   | `<T, R>(payload: CallToPayload<T>) => Promise<R>`                              |
| `broadcastToAll(payload)`     | Envía a la ventana actual con origen `'*'`. No se aconseja, por seguridad.       | `(payload: BroadcastPayload) => void`                                          |

### `Platform`

Una fachada para el lado **que recibe** (normalmente el código que corre dentro de un iframe). Es un objeto llano con un solo método, y comparte el mismo protocolo de sobre que `Client` (`PostMessageBridge`), de modo que los dos extremos se entienden directamente.

| Método                  | Descripción                                                                                                                                                                                                                                                                            | Firma                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Platform.init(events)` | Registra una correspondencia de `type` a manejador. Con cada mensaje que llega ejecuta el manejador que encaje y envía el resultado de vuelta a `event.source`; si el manejador lanza, se devuelve el error (quien llamó recibe un rechazo). Devuelve un `destroy()` para desmontarlo. | `<T, R>(events: Record<string, MessageHandler<T, R>>) => { destroy: () => void }` |

### PortBridge (basado en MessagePort, lo recomendado para código nuevo)

Un puente punto a punto montado sobre `MessageChannel` / `MessagePort`. Un puerto es una **capacidad de canal privado** que da el navegador: solo pueden comunicarse los dos lados que obtuvieron el puerto durante el apretón de manos. Eso evita por construcción la diafonía entre ventanas, la suplantación del emisor, los choques de canal dentro de una misma ventana y el responderse a uno mismo, sin filtrar por origen y sin necesidad de marca de protocolo. Los cuerpos de los mensajes también viajan por clonado estructurado.

| Función                      | Descripción                                                                                                                         | Firma                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `openPortBridge(options)`    | **El que inicia**: crea un `MessageChannel`, entrega un puerto a la ventana de destino y se queda con el otro extremo.              | `(options: OpenPortBridgeOptions) => PortBridge`             |
| `acceptPortBridge(options?)` | **El que recibe**: espera el puerto que le entrega quien inició; resuelve con un puente en cuanto lo recibe.                        | `(options?: AcceptPortBridgeOptions) => Promise<PortBridge>` |
| `createPortBridge(port)`     | Construye un puente sobre **cualquier** `MessagePort` (un Web Worker o SharedWorker, o un puerto con el apretón de manos ya hecho). | `(port: MessagePort) => PortBridge`                          |

El `PortBridge` que devuelve ofrece los mismos `on`, `off`, `send`, `broadcast` y `destroy` que `PostMessageBridge`.

- **`OpenPortBridgeOptions`**: `{ targetWindow: Window; targetOrigin?: string; name?: string }`. `name` distingue varias conexiones de puerto independientes dentro de una misma página y tiene que coincidir en los dos extremos (por defecto `'default'`).
- **`AcceptPortBridgeOptions`**: `{ targetOrigin?: string; name?: string }`.

### `MessageCodec`

Codifica datos a una cadena en Base64 y los decodifica de vuelta, conservando todos los caracteres Unicode (chino, emoji, etc.). Sirve para llevar datos con estructura por **canales que solo admiten cadenas** (URL, cookies, `localStorage`, …).

> Nota: el puente **ya no** usa esto para serializar cada mensaje (usa clonado estructurado). Se sigue exportando como herramienta suelta para los casos de canales de solo texto.

| Método                | Descripción                                                                               | Firma                                  |
| --------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- |
| `encode(data)`        | Serializa a una cadena en Base64 cualquier valor que admita JSON. Devuelve `''` si falla. | `(data: any) => string`                |
| `decode(encodedStr)`  | Interpreta una cadena en Base64 y devuelve el valor. Devuelve `null` si falla.            | `<T>(encodedStr: string) => T \| null` |
| `encodeFile(file)`    | Codifica un `File` (con sus metadatos y sus bytes) a una cadena en Base64.                | `(file: File) => Promise<string>`      |
| `decodeFile(encoded)` | Decodifica una cadena hecha por `encodeFile` y devuelve un `File`.                        | `(encoded: string) => File`            |

### Interfaces

#### `MessageHandler<T, R>`

Un manejador de mensajes. Recibe el `payload` y devuelve la respuesta (puede ser asíncrono).

```ts
interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}
```

#### `MessageData<T>`

La forma que tiene un mensaje al viajar: el sobre.

| Campo        | Descripción                                                                      | Tipo       |
| ------------ | -------------------------------------------------------------------------------- | ---------- |
| `type`       | El tipo de mensaje, o nombre de canal.                                           | `string`   |
| `payload`    | El cuerpo del mensaje.                                                           | `T`        |
| `id`         | El identificador que empareja petición y respuesta; está presente en esos pares. | `string?`  |
| `isResponse` | `true` cuando este mensaje es una respuesta.                                     | `boolean?` |
| `isError`    | `true` cuando la respuesta trae un error.                                        | `boolean?` |
| `channel`    | Identificador de canal; aísla varios puentes sobre una misma ventana.            | `string?`  |
| `senderId`   | Identificador de la instancia emisora; sirve para no responderse a uno mismo.    | `string?`  |

#### `PendingRequest<R>`

Un `send()` en curso a la espera de su respuesta (contabilidad interna).

| Campo     | Descripción                    | Tipo                       |
| --------- | ------------------------------ | -------------------------- |
| `resolve` | Resuelve la promesa pendiente. | `(value: R) => void`       |
| `reject`  | Rechaza la promesa pendiente.  | `(error: unknown) => void` |

#### `BridgeManagerOptions`

Opciones para `connectClient` y `Client.connect`.

| Campo          | Descripción                                                                              | Tipo      | Por defecto                           |
| -------------- | ---------------------------------------------------------------------------------------- | --------- | ------------------------------------- |
| `id`           | Identificador explícito del puente. Si se omite, se genera solo.                         | `string?` | una cadena aleatoria de 10 caracteres |
| `targetOrigin` | El origen que se pasa a `PostMessageBridge`.                                             | `string?` | `'*'`                                 |
| `targetWindow` | El `Window` de destino que se pasa al puente.                                            | `Window?` | `window`                              |
| `channel`      | Identificador de canal; ponlo a mano para aislar conexiones dentro de una misma ventana. | `string?` | `'default'`                           |

#### `BroadcastPayload`

Un mensaje de difusión de un solo sentido.

| Campo     | Descripción            | Tipo      |
| --------- | ---------------------- | --------- |
| `type`    | El tipo de mensaje.    | `string`  |
| `payload` | El cuerpo del mensaje. | `unknown` |

#### `CallToPayload<T>`

El argumento de `Client.call`.

| Campo     | Descripción                                          | Tipo     |
| --------- | ---------------------------------------------------- | -------- |
| `id`      | El identificador del puente o plataforma de destino. | `string` |
| `type`    | El tipo de mensaje.                                  | `string` |
| `payload` | El cuerpo de la petición.                            | `T`      |

## Ejemplo

### Bajo nivel: `PostMessageBridge` entre una página y un iframe

**Página madre**, hablando con el `contentWindow` del iframe:

```js
import { PostMessageBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

// Espera a que el iframe cargue y crea entonces un puente hacia él.
iframe.addEventListener('load', async () => {
  const bridge = new PostMessageBridge(iframe.contentWindow, '*');

  // Petición y respuesta: envía 'getUser' y espera la contestación.
  const user = await bridge.send('getUser', { id: 42 });
  console.log(user); // => { id: 42, name: 'Ada' }

  // Difusión sin esperar respuesta.
  bridge.broadcast({ type: 'theme:change', payload: { mode: 'dark' } });
});
```

**Dentro del iframe**, registrando manejadores:

```js
import { PostMessageBridge } from 'ranuts/utils';

// Apunta a la ventana madre.
const bridge = new PostMessageBridge(window.parent, '*');

bridge.on('getUser', async ({ id }) => {
  // Lo que devuelvas aquí es la respuesta al send() de quien llamó.
  return { id, name: 'Ada' };
});

bridge.on('theme:change', ({ mode }) => {
  document.documentElement.dataset.theme = mode;
});
```

### Alto nivel: `Client` (la madre) y `Platform` (el iframe)

**Dentro del iframe**, exponiendo un juego de métodos con `Platform`:

```js
import { Platform } from 'ranuts/utils';

const { destroy } = Platform.init({
  add: ({ a, b }) => a + b,
  getTime: async () => Date.now(),
});

// Más tarde, para dejar de escuchar:
// destroy();
```

**Página madre**, conectándose y llamando por identificador:

```js
import { Client } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  // Registra una conexión con nombre hacia la ventana del iframe.
  const { id } = Client.connect({
    id: 'calculator',
    targetWindow: iframe.contentWindow,
    targetOrigin: '*',
  });

  // Llama a un método expuesto por Platform.init y espera su resultado.
  const sum = await Client.call({ id, type: 'add', payload: { a: 2, b: 3 } });
  console.log(sum); // => 5

  // Difunde a todas las plataformas conectadas.
  Client.broadcast({ type: 'ping', payload: Date.now() });

  // Desmonta cuando termines.
  Client.remove(id);
});
```

### Punto a punto: `openPortBridge` y `acceptPortBridge` (lo recomendado)

**Página madre** (la que inicia), creando un canal y entregando un extremo al iframe:

```js
import { openPortBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  const bridge = openPortBridge({
    targetWindow: iframe.contentWindow,
    targetOrigin: 'https://app.example.com',
  });

  const pong = await bridge.send('ping', { n: 1 });
  console.log(pong); // => 2
});
```

**Dentro del iframe** (el que recibe), esperando el puerto que le entregan:

```js
import { acceptPortBridge } from 'ranuts/utils';

const bridge = await acceptPortBridge({ targetOrigin: 'https://parent.example.com' });

bridge.on('ping', ({ n }) => n + 1);
```

### Usar el singleton `bridgeManager` directamente

```js
import { bridgeManager } from 'ranuts/utils';

const { bridge, id } = bridgeManager.connectClient({
  targetWindow: someIframe.contentWindow,
});

const result = await bridgeManager.sendTo(id, 'ping', { at: Date.now() });

bridgeManager.removeClient(id);
```

### Codificar por separado con `MessageCodec` (canales de solo texto)

```js
import { MessageCodec } from 'ranuts/utils';

const encoded = MessageCodec.encode({ msg: 'héllo 👋', n: 1 });
// -> una cadena en Base64, segura para URL, cookies y localStorage

const decoded = MessageCodec.decode(encoded);
console.log(decoded); // => { msg: 'héllo 👋', n: 1 }
```

## Notas

1. **Serialización**: el puente se comunica con objetos estructurados (clonado estructurado), así que `Date`, `Map`, `Set`, `ArrayBuffer`, `File`, etc. se conservan sin `MessageCodec`. Si un `payload` no se puede clonar (una función, un nodo del DOM), `send` rechaza al momento.
2. **Marca de protocolo**: solo se procesan los mensajes que llevan la marca de protocolo interna; el tráfico `postMessage` de otras bibliotecas se pasa por alto.
3. **Comprobación del origen**: cuando `targetOrigin` es `'*'` (lo de por defecto), los mensajes que llegan no se filtran por origen. En producción pasa un origen explícito (por ejemplo `'https://app.example.com'`) para que solo se acepte ese.
4. **Propagación de errores**: cuando un manejador remoto lanza, `send`, `sendTo` y `Client.call` rechazan con ese error, en vez de resolver con el texto del error como si fuera un resultado válido.
5. **Tiempo límite**: `send` y `sendTo` rechazan con `Error('Request timeout')` si no llega respuesta en 120 segundos.
6. **Aislamiento por canal**: para tener varios puentes sobre la misma ventana, pasa el mismo `channel` a los dos extremos y así no se pisan.
7. **Identificadores únicos**: `connectClient` lanza `Bridge <id> already exists` si reutilizas un identificador. Omite `id` para que se genere solo.
8. **Limpieza**: todas las instancias de `PostMessageBridge` comparten un único escuchador global de `message` (se retira solo cuando se destruye el último puente). Llama a `destroy()` (o a `Client.remove` / `removeClient`) cuando ya no necesites una conexión, para rechazar las peticiones pendientes y soltar los recursos.
9. **Fuera del navegador**: sin `window` (Node o SSR), construir un `PostMessageBridge` no lanza; `send` rechaza con un error claro, y `broadcast` y `destroy` quedan sin efecto.
10. **Prefiere PortBridge**: para código nuevo usa `openPortBridge` y `acceptPortBridge`. Un canal punto a punto evita por construcción la diafonía, la suplantación y el responderse a uno mismo.
11. **`broadcastToAll`**: `Client.broadcastToAll` envía a la ventana actual con origen `'*'` y por seguridad no se aconseja. Es mejor un `call` o un `broadcast` dirigidos.
12. **`BRIDGE_MARKER` y `DEFAULT_CHANNEL`**: los dos valores en crudo que hay detrás de los puntos 2 y 6 también se exportan, por si estás inspeccionando el tráfico `postMessage` directamente (un escuchador en las devtools, una prueba) en vez de pasar por `PostMessageBridge`. `BRIDGE_MARKER` es la cadena de marca de protocolo que lleva todo mensaje del puente; `DEFAULT_CHANNEL` es el identificador de canal literal `'default'` que se usa cuando no se pasa ninguno.
