# ranuts/conversation — Do registro de eventos aos nós desenháveis

Projeta um registro de eventos somente de acréscimo nos nós que uma visão de conversa desenha.

```js
import { createConversationEngine } from 'ranuts/conversation';
```

**É um ponto de entrada próprio** e não toca no DOM: a projeção é testável, e renderizável no servidor, por si só. O [`<r-conversation>`](../../ranui/conversation/) é quem a consome no DOM.

## Por que não ramificar pelo tipo de evento

O jeito comum de desenhar uma conversa é uma visão que ramifica pelo tipo de evento e muta uma árvore de componentes. Isso põe a ordem, a identidade e a reconciliação de atualizações parciais **dentro da visão**, então cada novo tipo de conteúdo (uma chamada de ferramenta, um pedido de aprovação, uma linha de estado) precisa ser costurado à mão, e a visão ganha um ramo por tipo.

Aqui cada tipo é uma **máquina de estados registrada por conta própria**. Uma definição diz quais eventos são dela, dobra-os no próprio estado e nunca fica sabendo que os outros existem. Acrescentar um tipo é acrescentar uma definição, não editar um renderizador.

## Uma definição

```ts
const message = {
  kind: 'message',
  // Quais eventos são meus, e a que nó eles pertencem.
  match: (event) =>
    event.type === 'message/start'
      ? { id: event.id, role: 'start' }
      : event.type === 'message/delta'
        ? { id: event.id, role: 'update' }
        : null,
  // Dobre-os no meu próprio estado.
  start: (event, reader) => ({ text: '', after: reader.previous('message')?.id }),
  update: (state, event) => ({ ...state, text: state.text + event.text }),
  // Com que frequência quem assina deve ver o resultado.
  publication: (event) => (event.type === 'message/delta' ? 'animation-frame' : 'immediate'),
};

const engine = createConversationEngine({ definitions: [message, toolCall] });
engine.subscribe((nodes) => render(nodes));
engine.push(event);
```

`definitions` é declarado sobre um estado `unknown`, então definições com tipos de estado diferentes se registram lado a lado sem nenhuma conversão no ponto de chamada, enquanto cada uma continua plenamente tipada onde foi escrita.

## Semântica

- **Toda definição vê todo evento.** O motor não para na primeira que reivindica, então um único evento do registro pode mover dois nós.
- **A ordem é fixada no `start`.** Um nó que continua se atualizando fica onde abriu, então uma mensagem que chega por streaming não pula para o fim da lista a cada delta.
- **Um `update` para um id sem nó aberto é descartado.** Esse é o resultado correto quando o evento de início ficou de fora de uma janela paginada; montar um nó só a partir de uma atualização parcial desenharia algo que nunca existiu.
- **Um `start` repetido reabre o nó no lugar.** A definição decidiu que este é um nó novo, então o estado antigo é descartado em vez de fundido, e a posição é mantida.
- **`reader.previous(kind)` só olha para trás.** Uma definição que pudesse ver nós iniciados depois dela daria uma resposta diferente conforme o momento em que rodasse, e repetir o mesmo registro não reproduziria a mesma visão.

## Cadência de publicação

`publication` controla com que frequência quem assina vê as atualizações, e é o único ajuste que você precisa mexer por desempenho:

| Cadência          | Serve para                                                                                         |
| ----------------- | -------------------------------------------------------------------------------------------------- |
| `animation-frame` | deltas por token: todos os que caírem entre duas pinturas se juntam numa única notificação         |
| `immediate`       | fatos discretos: o resultado de uma ferramenta, uma aprovação; esperar um quadro só soma latência  |
| `none`            | estado que uma publicação posterior vai carregar de qualquer jeito; registrado sem acordar a visão |

**A cadência sobe e nunca afrouxa.** Uma publicação `immediate` enquanto há um quadro pendente dispara agora e cancela o quadro, em vez de notificar duas vezes. Omitir `publication` significa `immediate`.

A opção `scheduler` substitui o agendamento por quadros, e é assim que a cadência é testada sem uma pintura. O padrão usa `requestAnimationFrame` num navegador e uma microtarefa em qualquer outro lugar.

## Nós

```ts
interface ConversationNode<State> {
  key: string; // `kind:id`, estável por toda a vida do nó
  kind: string;
  id: string;
  seq: number; // o ordinal do evento de início — a chave de ordenação
  state: State;
}
```

`nodes()` devolve o mesmo array até o próximo evento aceito, e cada nó é congelado, então uma visão pode segurar um deles atravessando uma publicação sem que ele mude por baixo.

## Veja também

- [ranuts/stream](../stream/): produz os eventos
- [`<r-conversation>`](../../ranui/conversation/): desenha os nós
- `createBottomFollower` em [ranuts/utils](../utils/): mantém a visão presa ao fim
