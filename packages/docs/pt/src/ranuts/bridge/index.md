# Ponte (postMessage)

Uma pequena camada de mensagens entre contextos, montada sobre o `window.postMessage`. Ela deixa dois contextos de navegação — uma página mãe e um `<iframe>`, uma janela pop-up, ou qualquer outro `Window` de que você tenha uma referência — conversarem por uma API de requisição e resposta (no estilo RPC) e por transmissões de mão única.

As mensagens atravessam a fronteira como **objetos estruturados** (usando o algoritmo de clonagem estruturada do próprio `postMessage`), então tipos como `Date`, `Map`, `Set`, `ArrayBuffer` e `File` chegam inteiros, sem serialização na mão. Cada mensagem carrega uma marca de protocolo para poder ser distinguida do tráfego `postMessage` de outras bibliotecas (HMR, DevTools, SDKs de terceiros).

Há três jeitos de usar:

- **`PostMessageBridge`**: a peça de mais baixo nível. Cada instância embrulha um `Window` de destino. Você registra manipuladores com `on`, envia e espera com `send`, e dispara sem esperar resposta com `broadcast`.
- **`BridgeManager` / `bridgeManager` / `Client` / `Platform`**: uma camada acima, que mantém um registro de pontes nomeadas (um singleton), mais duas fachadas finas: `Client` (o lado que chama) e `Platform` (o lado que recebe).
- **`openPortBridge` / `acceptPortBridge` / `createPortBridge`**: uma ponte ponto a ponto montada sobre `MessageChannel` / `MessagePort` (**o recomendado para código novo**). Depois de um aperto de mão único, cada lado fica com uma porta privada, e isso evita por construção a diafonia entre janelas, a falsificação do remetente, os choques de canal dentro de uma mesma janela e o responder a si mesmo, sem precisar filtrar por origem.

> **Compatibilidade**: o formato de transmissão é um objeto estruturado, não mais uma string em Base64. Pontas da mesma versão se entendem direto, e o `Client` (`PostMessageBridge`) compartilha com o `Platform` um mesmo protocolo de envelope. Se você misturar uma página velha com uma nova de outra versão, o protocolo não vai bater.

## API

### `PostMessageBridge`

A classe central. Cada instância mira um único `Window`. Em vez de cada uma pôr o seu, todas compartilham **um só** ouvinte de `message` no `window`, e um distribuidor interno encaminha cada mensagem; assim o número de ouvintes não cresce junto com o de instâncias.

```ts
new PostMessageBridge(targetWindow?: Window, targetOrigin?: string, channel?: string)
```

#### Parâmetros do construtor

| Parâmetro      | Descrição                                                                                                                        | Tipo     | Padrão      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `targetWindow` | O `Window` para onde as mensagens vão (um iframe, um pop-up, `parent`, …)                                                        | `Window` | `window`    |
| `targetOrigin` | A origem para onde se envia e da qual se aceita. Com `'*'` a conferência é desligada                                             | `string` | `'*'`       |
| `channel`      | Identificador de canal. Isola **várias pontes sobre a mesma janela**: as duas pontas precisam usar o mesmo canal para se falarem | `string` | `'default'` |

#### Methods

| Método                         | Descrição                                                                                                                | Assinatura                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| `on(type, handler)`            | Registra um manipulador para um `type` de mensagem. O que ele devolver (ou aquilo com que resolver) volta como resposta. | `<T, R>(type: string, handler: MessageHandler<T, R>) => void` |
| `off(type)`                    | Tira o manipulador registrado para `type`.                                                                               | `(type: string) => void`                                      |
| `send(type, payload)`          | Envia uma mensagem e espera a resposta. Rejeita com o erro do manipulador do outro lado, ou depois de 120 s.             | `<T, R>(type: string, payload: T) => Promise<R>`              |
| `broadcast({ type, payload })` | Disparar e esquecer: envia uma mensagem sem esperar resposta.                                                            | `<T>(data: { type: string; payload: T }) => void`             |
| `destroy()`                    | Sai do distribuidor, apaga todos os manipuladores e rejeita todas as requisições pendentes.                              | `() => void`                                                  |

> **Trava contra responder a si mesmo**: cada instância carrega um identificador de remetente próprio e **não** vai atender uma requisição que ela mesma enviou. Para fazer requisição e resposta **dentro de uma só janela**, use duas instâncias de ponte (uma registra os manipuladores e a outra envia).

### `BridgeManager`

Um registro singleton que é dono de várias instâncias nomeadas de `PostMessageBridge`. Pegue a instância compartilhada com `BridgeManager.getInstance()` ou use a exportação já pronta [`bridgeManager`](#bridgemanager-singleton). O construtor é privado.

| Método                         | Descrição                                                                   | Assinatura                                                                     |
| ------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `BridgeManager.getInstance()`  | Devolve a instância singleton compartilhada.                                | `() => BridgeManager`                                                          |
| `connectClient(options)`       | Cria e registra uma ponte nova. Lança se o `id` já existir.                 | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `getClient(id)`                | Procura uma ponte registrada pelo identificador.                            | `(id: string) => PostMessageBridge \| undefined`                               |
| `removeClient(id)`             | Destrói e tira do registro a ponte com esse identificador.                  | `(id: string) => void`                                                         |
| `removeAllClient()`            | Destrói e tira do registro todas as pontes.                                 | `() => void`                                                                   |
| `broadcast({ type, payload })` | Transmite uma mensagem por todas as pontes registradas.                     | `<T>(payload: { type: string; payload: T }) => void`                           |
| `sendTo(id, type, payload)`    | Envia uma requisição pela ponte com esse identificador e espera a resposta. | `<T, R>(id: string, type: string, payload: T) => Promise<R>`                   |

Se você omitir o `id` no `connectClient`, um identificador aleatório de dez caracteres é gerado e devolvido. O `options` aceita ainda `channel`, que é repassado ao `PostMessageBridge` de baixo.

### `bridgeManager` (singleton)

A instância compartilhada de `BridgeManager` já criada, equivalente a `BridgeManager.getInstance()`. Importe esta em vez de construir a sua.

```ts
import { bridgeManager } from 'ranuts/utils';
```

### `Client`

Uma fachada fina sobre o `bridgeManager` para o lado **que chama** (o contexto que inicia as requisições). É um objeto comum, não uma classe.

| Método                        | Descrição                                                                       | Assinatura                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `connect(options)`            | Conecta a uma janela de destino (delega ao `bridgeManager.connectClient`).      | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `remove(id)`                  | Tira uma conexão pelo identificador.                                            | `(id: string) => void`                                                         |
| `removeAll()`                 | Tira todas as conexões.                                                         | `() => void`                                                                   |
| `broadcast(payload)`          | Transmite para todas as plataformas conectadas.                                 | `(payload: BroadcastPayload) => void`                                          |
| `call({ id, type, payload })` | Envia uma requisição à plataforma que está por trás de `id` e espera o retorno. | `<T, R>(payload: CallToPayload<T>) => Promise<R>`                              |
| `broadcastToAll(payload)`     | Envia para a janela atual com origem `'*'`. Por segurança, não é recomendado.   | `(payload: BroadcastPayload) => void`                                          |

### `Platform`

Uma fachada para o lado **que recebe** (em geral o código que roda dentro de um iframe). É um objeto comum com um único método e compartilha o mesmo protocolo de envelope do `Client` (`PostMessageBridge`), de modo que as duas pontas se entendem direto.

| Método                  | Descrição                                                                                                                                                                                                                                                                 | Assinatura                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Platform.init(events)` | Registra uma correspondência de `type` para manipulador. A cada mensagem que chega, roda o manipulador que casar e devolve o resultado ao `event.source`; se o manipulador lançar, o erro volta (quem chamou recebe uma rejeição). Devolve um `destroy()` para desmontar. | `<T, R>(events: Record<string, MessageHandler<T, R>>) => { destroy: () => void }` |

### PortBridge (baseado em MessagePort, o recomendado para código novo)

Uma ponte ponto a ponto montada sobre `MessageChannel` / `MessagePort`. Uma porta é uma **capacidade de canal privado** que o navegador oferece: só os dois lados que ficaram com a porta durante o aperto de mão conseguem se comunicar. Isso evita por construção a diafonia entre janelas, a falsificação do remetente, os choques de canal dentro de uma mesma janela e o responder a si mesmo, sem filtro de origem e sem precisar de marca de protocolo. O corpo das mensagens também viaja por clonagem estruturada.

| Função                       | Descrição                                                                                                                        | Assinatura                                                   |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `openPortBridge(options)`    | **Quem inicia**: cria um `MessageChannel`, entrega uma porta à janela de destino e fica com a outra ponta.                       | `(options: OpenPortBridgeOptions) => PortBridge`             |
| `acceptPortBridge(options?)` | **Quem recebe**: espera a porta entregue por quem iniciou; resolve com uma ponte assim que a recebe.                             | `(options?: AcceptPortBridgeOptions) => Promise<PortBridge>` |
| `createPortBridge(port)`     | Monta uma ponte sobre **qualquer** `MessagePort` (um Web Worker ou SharedWorker, ou uma porta que já passou pelo aperto de mão). | `(port: MessagePort) => PortBridge`                          |

O `PortBridge` devolvido oferece os mesmos `on`, `off`, `send`, `broadcast` e `destroy` que o `PostMessageBridge`.

- **`OpenPortBridgeOptions`**: `{ targetWindow: Window; targetOrigin?: string; name?: string }`. O `name` distingue várias conexões de porta independentes numa mesma página e precisa bater nas duas pontas (padrão `'default'`).
- **`AcceptPortBridgeOptions`**: `{ targetOrigin?: string; name?: string }`.

### `MessageCodec`

Codifica dados numa string Base64 e decodifica de volta, preservando todos os caracteres Unicode (chinês, emoji etc.). Serve para levar dados com estrutura por **canais que só aceitam texto** (URLs, cookies, `localStorage`, …).

> Nota: a ponte **não usa mais** isto para serializar cada mensagem (usa clonagem estruturada). Continua exportado como ferramenta avulsa para os casos de canais só de texto.

| Método                | Descrição                                                                              | Assinatura                             |
| --------------------- | -------------------------------------------------------------------------------------- | -------------------------------------- |
| `encode(data)`        | Serializa numa string Base64 qualquer valor que caiba em JSON. Devolve `''` se falhar. | `(data: any) => string`                |
| `decode(encodedStr)`  | Interpreta uma string Base64 de volta a um valor. Devolve `null` se falhar.            | `<T>(encodedStr: string) => T \| null` |
| `encodeFile(file)`    | Codifica um `File` (com metadados e bytes) numa string Base64.                         | `(file: File) => Promise<string>`      |
| `decodeFile(encoded)` | Decodifica uma string feita pelo `encodeFile` de volta num `File`.                     | `(encoded: string) => File`            |

### Interfaces

#### `MessageHandler<T, R>`

Um manipulador de mensagens. Recebe o `payload` e devolve a resposta (pode ser assíncrono).

```ts
interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}
```

#### `MessageData<T>`

O formato de uma mensagem em trânsito: o envelope.

| Campo        | Descrição                                                                  | Tipo       |
| ------------ | -------------------------------------------------------------------------- | ---------- |
| `type`       | O tipo da mensagem, ou nome do canal.                                      | `string`   |
| `payload`    | O corpo da mensagem.                                                       | `T`        |
| `id`         | O identificador que casa requisição e resposta; aparece nesses pares.      | `string?`  |
| `isResponse` | `true` quando esta mensagem é uma resposta.                                | `boolean?` |
| `isError`    | `true` quando a resposta traz um erro.                                     | `boolean?` |
| `channel`    | Identificador de canal; isola várias pontes numa mesma janela.             | `string?`  |
| `senderId`   | Identificador da instância remetente; serve para não responder a si mesma. | `string?`  |

#### `PendingRequest<R>`

Um `send()` em curso à espera da resposta (contabilidade interna).

| Campo     | Descrição                    | Tipo                       |
| --------- | ---------------------------- | -------------------------- |
| `resolve` | Resolve a promessa pendente. | `(value: R) => void`       |
| `reject`  | Rejeita a promessa pendente. | `(error: unknown) => void` |

#### `BridgeManagerOptions`

Opções do `connectClient` e do `Client.connect`.

| Campo          | Descrição                                                                              | Tipo      | Padrão                                |
| -------------- | -------------------------------------------------------------------------------------- | --------- | ------------------------------------- |
| `id`           | Identificador explícito da ponte. Se for omitido, é gerado sozinho.                    | `string?` | uma string aleatória de 10 caracteres |
| `targetOrigin` | A origem repassada ao `PostMessageBridge`.                                             | `string?` | `'*'`                                 |
| `targetWindow` | O `Window` de destino repassado à ponte.                                               | `Window?` | `window`                              |
| `channel`      | Identificador de canal; defina na mão para isolar conexões dentro de uma mesma janela. | `string?` | `'default'`                           |

#### `BroadcastPayload`

Uma mensagem de transmissão de mão única.

| Campo     | Descrição            | Tipo      |
| --------- | -------------------- | --------- |
| `type`    | O tipo da mensagem.  | `string`  |
| `payload` | O corpo da mensagem. | `unknown` |

#### `CallToPayload<T>`

O argumento do `Client.call`.

| Campo     | Descrição                                          | Tipo     |
| --------- | -------------------------------------------------- | -------- |
| `id`      | O identificador da ponte ou plataforma de destino. | `string` |
| `type`    | O tipo da mensagem.                                | `string` |
| `payload` | O corpo da requisição.                             | `T`      |

## Exemplo

### Baixo nível: `PostMessageBridge` entre uma página e um iframe

**Página mãe**, conversando com o `contentWindow` do iframe:

```js
import { PostMessageBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

// Espera o iframe carregar e então cria uma ponte até ele.
iframe.addEventListener('load', async () => {
  const bridge = new PostMessageBridge(iframe.contentWindow, '*');

  // Requisição e resposta: envia 'getUser' e espera o retorno.
  const user = await bridge.send('getUser', { id: 42 });
  console.log(user); // => { id: 42, name: 'Ada' }

  // Transmissão sem esperar resposta.
  bridge.broadcast({ type: 'theme:change', payload: { mode: 'dark' } });
});
```

**Dentro do iframe**, registrando manipuladores:

```js
import { PostMessageBridge } from 'ranuts/utils';

// Mira a janela mãe.
const bridge = new PostMessageBridge(window.parent, '*');

bridge.on('getUser', async ({ id }) => {
  // O que você devolver aqui vira a resposta ao send() de quem chamou.
  return { id, name: 'Ada' };
});

bridge.on('theme:change', ({ mode }) => {
  document.documentElement.dataset.theme = mode;
});
```

### Alto nível: `Client` (a mãe) e `Platform` (o iframe)

**Dentro do iframe**, expondo um conjunto de métodos com o `Platform`:

```js
import { Platform } from 'ranuts/utils';

const { destroy } = Platform.init({
  add: ({ a, b }) => a + b,
  getTime: async () => Date.now(),
});

// Mais tarde, para parar de escutar:
// destroy();
```

**Página mãe**, conectando e chamando pelo identificador:

```js
import { Client } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  // Registra uma conexão nomeada até a janela do iframe.
  const { id } = Client.connect({
    id: 'calculator',
    targetWindow: iframe.contentWindow,
    targetOrigin: '*',
  });

  // Chama um método exposto pelo Platform.init e espera o resultado.
  const sum = await Client.call({ id, type: 'add', payload: { a: 2, b: 3 } });
  console.log(sum); // => 5

  // Transmite para todas as plataformas conectadas.
  Client.broadcast({ type: 'ping', payload: Date.now() });

  // Desmonta quando terminar.
  Client.remove(id);
});
```

### Ponto a ponto: `openPortBridge` e `acceptPortBridge` (o recomendado)

**Página mãe** (a que inicia), criando um canal e entregando uma ponta ao iframe:

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

**Dentro do iframe** (o que recebe), esperando a porta que lhe é entregue:

```js
import { acceptPortBridge } from 'ranuts/utils';

const bridge = await acceptPortBridge({ targetOrigin: 'https://parent.example.com' });

bridge.on('ping', ({ n }) => n + 1);
```

### Usar o singleton `bridgeManager` direto

```js
import { bridgeManager } from 'ranuts/utils';

const { bridge, id } = bridgeManager.connectClient({
  targetWindow: someIframe.contentWindow,
});

const result = await bridgeManager.sendTo(id, 'ping', { at: Date.now() });

bridgeManager.removeClient(id);
```

### Codificar por conta própria com o `MessageCodec` (canais só de texto)

```js
import { MessageCodec } from 'ranuts/utils';

const encoded = MessageCodec.encode({ msg: 'héllo 👋', n: 1 });
// -> uma string Base64, segura para URLs, cookies e localStorage

const decoded = MessageCodec.decode(encoded);
console.log(decoded); // => { msg: 'héllo 👋', n: 1 }
```

## Notas

1. **Serialização**: a ponte conversa com objetos estruturados (clonagem estruturada), então `Date`, `Map`, `Set`, `ArrayBuffer`, `File` etc. se preservam sem o `MessageCodec`. Se um `payload` não puder ser clonado (uma função, um nó do DOM), o `send` rejeita na hora.
2. **Marca de protocolo**: só as mensagens que trazem a marca de protocolo interna são processadas; o tráfego `postMessage` de outras bibliotecas é ignorado.
3. **Conferência da origem**: quando `targetOrigin` é `'*'` (o padrão), as mensagens que chegam não são filtradas por origem. Em produção, passe uma origem explícita (por exemplo `'https://app.example.com'`) para que só ela seja aceita.
4. **Propagação de erro**: quando um manipulador remoto lança, o `send`, o `sendTo` e o `Client.call` rejeitam com aquele erro, em vez de resolver com o texto do erro como se fosse um resultado válido.
5. **Tempo limite**: o `send` e o `sendTo` rejeitam com `Error('Request timeout')` se nenhuma resposta chegar em 120 segundos.
6. **Isolamento por canal**: para rodar várias pontes sobre a mesma janela, passe o mesmo `channel` nas duas pontas para elas não se atropelarem.
7. **Identificadores únicos**: o `connectClient` lança `Bridge <id> already exists` se você reaproveitar um identificador. Omita o `id` para receber um gerado sozinho.
8. **Limpeza**: todas as instâncias de `PostMessageBridge` compartilham um único ouvinte global de `message` (retirado sozinho depois que a última ponte é destruída). Chame `destroy()` (ou `Client.remove` / `removeClient`) quando uma conexão não for mais necessária, para rejeitar as requisições pendentes e soltar os recursos.
9. **Fora do navegador**: sem `window` (Node ou SSR), construir um `PostMessageBridge` não lança; o `send` rejeita com um erro claro, e `broadcast` e `destroy` viram operações vazias.
10. **Prefira o PortBridge**: em código novo, use `openPortBridge` e `acceptPortBridge`. Um canal ponto a ponto evita por construção a diafonia, a falsificação e o responder a si mesmo.
11. **`broadcastToAll`**: o `Client.broadcastToAll` envia para a janela atual com origem `'*'` e, por segurança, não é aconselhado. Prefira um `call` ou um `broadcast` direcionados.
12. **`BRIDGE_MARKER` e `DEFAULT_CHANNEL`**: os dois valores crus por trás dos pontos 2 e 6 também são exportados, caso você esteja examinando o tráfego `postMessage` direto (um ouvinte nas devtools, um teste) em vez de passar pelo `PostMessageBridge`. O `BRIDGE_MARKER` é a string de marca de protocolo que toda mensagem da ponte carrega; o `DEFAULT_CHANNEL` é o identificador de canal literal `'default'` usado quando nenhum é passado.
