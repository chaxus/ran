---
description: 'Desenha um log de eventos somente-anexação como uma conversa, cuidando da projeção, do acompanhamento do rodapé e da reconciliação de linhas, com cada tipo de conteúdo registrado como uma view independente.'
---

# Conversation

Desenha um log de eventos somente-anexação como uma conversa. O elemento cuida das três coisas
tediosas e fáceis de errar, e de mais nada: projetar eventos em nós, manter a vista presa ao rodapé
sem atropelar a rolagem do próprio leitor, e reconciliar as linhas com a lista de nós.

> **Use quando** estiver desenhando uma transcrição em streaming (um chat, uma sessão de agente, um
> log) e quiser que cada tipo de conteúdo (mensagem, chamada de ferramenta, linha de status) seja um
> registro independente, e não mais um ramo num renderizador que só cresce.

Como uma mensagem ou uma chamada de ferramenta _se parece_ é assunto de uma view registrada, não do
elemento. A projeção dele é [ranuts/conversation](../../ranuts/conversation/) e a rolagem é o
`createBottomFollower`, de [ranuts/utils](../../ranuts/utils/).

## Início rápido

```html
<r-conversation empty="Ainda não há mensagens" style="height: 400px"></r-conversation>
```

```ts
const chat = document.createElement('r-conversation');

chat.register({
  kind: 'message',
  // Quais eventos são meus e a qual nó pertencem.
  match: (e) =>
    e.type === 'message/start'
      ? { id: e.id, role: 'start' }
      : e.type === 'message/delta'
        ? { id: e.id, role: 'update' }
        : null,
  // Como eles se dobram no meu próprio estado.
  start: () => ({ text: '' }),
  update: (state, e) => ({ text: state.text + e.text }),
  // Deltas por token juntam-se num repintar por quadro; fatos discretos não esperam.
  publication: (e) => (e.type === 'message/delta' ? 'animation-frame' : 'immediate'),
  // Como esse estado chega à tela.
  mount: () => document.createElement('r-markdown'),
  patch: (el, node) => {
    el.content = node.state.text;
  },
});

chat.push({ type: 'message/start', id: 'm1' });
chat.push({ type: 'message/delta', id: 'm1', text: 'Hello' });

container.append(chat);
```

O `<r-markdown>` é a linha pensada para prosa: no `mode="streaming"` padrão ele já fecha `**bold`,
crases, links e fórmulas `$$` que chegaram pela metade, então uma view nunca precisa fazer isso.

## Regras que mordem se forem quebradas

- **Registre todas as views antes do primeiro `push`.** A projeção é construída uma única vez a
  partir do conjunto registrado, então um registro posterior perderia em silêncio todo evento já
  dobrado. O elemento lança um erro em vez de fazer isso.
- **`update` dobra o estado; `patch` o escreve no DOM.** Têm nomes diferentes porque são trabalhos
  diferentes: `patch` não dobra nada e roda uma vez por quadro numa linha em streaming, então
  mantenha-o barato.
- **`mount` é opcional.** Uma view sem ele contribui com estado que outras views leem por
  `reader.previous`, e não desenha nada.
- **As linhas mantêm a posição em que foram abertas.** Uma mensagem em streaming não pula para o fim
  da lista a cada delta.

## Acompanhamento do rodapé

Ligado por padrão. A vista fica presa ao rodapé conforme o conteúdo chega, para no instante em que o
leitor rola para cima, e volta a prender quando ele rola de volta para baixo, sem atropelar a rolagem
manual em momento algum, porque o seguidor distingue as próprias escritas de rolagem das do leitor
em vez de escutar dispositivos de entrada.

```ts
chat.addEventListener('pinnedchange', (e) => {
  jumpButton.hidden = e.detail.pinned;
});
```

`follow="false"` deixa o leitor no controle desde o início; `scrollToBottom()` retoma. Para paginar
conteúdo antigo, chame `captureAnchor()` antes de acrescentá-lo ao topo e `restoreAnchor()` depois,
para que o leitor continue olhando o que estava olhando.

## Referência da API

### Propriedades

| Propriedade | Tipo      | Padrão | Descrição                                                              |
| ----------- | --------- | ------ | ---------------------------------------------------------------------- |
| `follow`    | `boolean` | `true` | Segue o conteúdo novo até o leitor se afastar do rodapé.               |
| `empty`     | `string`  | `''`   | Texto exibido enquanto a projeção não produziu linhas. Vazio = oculto. |
| `pinned`    | `boolean` | `true` | Somente leitura. Se a vista está seguindo o conteúdo novo agora.       |
| `sheet`     | `string`  | `''`   | CSS injetado no shadow DOM do elemento.                                |

### Métodos

| Método                | Descrição                                                           |
| --------------------- | ------------------------------------------------------------------- |
| `register(view)`      | Registra um tipo de conteúdo. Lança um erro após o primeiro `push`. |
| `push(event)`         | Projeta um evento e desenha o que ele mudou.                        |
| `reset()`             | Descarta todos os nós e linhas, mantendo as views registradas.      |
| `scrollToBottom()`    | Rola até o rodapé e retoma o acompanhamento.                        |
| `captureAnchor(key?)` | Lembra a posição de uma linha antes de acrescentar conteúdo antigo. |
| `restoreAnchor()`     | Devolve a linha capturada ao lugar em que estava.                   |

### Eventos

| Evento         | Detail                | Disparado quando                               |
| -------------- | --------------------- | ---------------------------------------------- |
| `pinnedchange` | `{ pinned: boolean }` | O acompanhamento do rodapé é ganho ou perdido. |

### Slots

| Slot     | Descrição                                                                          |
| -------- | ---------------------------------------------------------------------------------- |
| `footer` | Área fixa abaixo das linhas: um compositor mora aqui, e a altura dele é observada. |

### Partes

`conversation` (a área de rolagem), `list`, `row`, `footer`, `empty`.

Cada linha carrega também `data-kind` e `data-key`, então quem consome pode estilizá-la ou encontrá-la
sem vasculhar a árvore do shadow.

## Estilos

O `<r-conversation>` expõe **14 propriedades personalizadas de CSS** próprias, além dos tokens
semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um
contêiner ou o próprio elemento:

```css
r-conversation {
  --ran-conversation-background: var(--ran-color-bg-subtle);
}
```

Partes: `conversation` · `empty` · `footer` · `list` · `older`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#conversation); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Veja também

- [ranuts/stream](../../ranuts/stream/): transforma o SSE de um provedor nos eventos enviados aqui
- [ranuts/conversation](../../ranuts/conversation/): a projeção, cadência incluída
- [Markdown](../markdown/): a linha para prosa, ciente do streaming
