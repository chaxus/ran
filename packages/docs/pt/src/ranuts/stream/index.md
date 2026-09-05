# ranuts/stream — Respostas de modelos em streaming

Análise de Server-Sent Events, um vocabulário neutro em relação ao fornecedor para uma resposta de modelo transmitida, e uma dobra desse vocabulário em blocos desenháveis.

```js
import { parseEventStream, mapEventStream, createStreamAccumulator } from 'ranuts/stream';
```

**É um ponto de entrada próprio.** Nada aqui toca no DOM, então uma resposta pode ser dobrada num teste ou num servidor; importá-lo de `ranuts/utils` arrastaria módulos voltados ao DOM junto.

**Nenhum fornecedor mora aqui.** Toda API de chat convencional transmite as mesmas quatro coisas (texto do assistente, texto de raciocínio cobrado à parte, chamadas de ferramenta, uma contagem de tokens), mas cada uma as nomeia e as entrelaça de um jeito. Mapear o evento de um fornecedor para `StreamChunk` é a única etapa específica dele, e essa fica com você: assar um formato de fio aqui dentro deixaria as outras duas camadas inúteis para qualquer outra pessoa.

## Três camadas

| Camada                      | O que faz                                                   |
| --------------------------- | ----------------------------------------------------------- |
| `parseEventStream(source)`  | bytes → `ServerSentEvent`. Só transporte.                   |
| `StreamChunk`               | o vocabulário em que uma resposta chega.                    |
| `createStreamAccumulator()` | dobra os pedaços em blocos que uma visão consegue desenhar. |

`mapEventStream(source, map)` junta as duas primeiras: percorre os eventos e deixa o seu mapeamento devolver zero ou mais pedaços para cada um. Devolver `[]` é como se joga fora um keep-alive ou uma sentinela `[DONE]`.

## O vocabulário

```ts
type StreamChunk =
  | { type: 'block-start'; index: number; blockType: ContentBlockType }
  | { type: 'text-delta'; index: number; text: string }
  | { type: 'reasoning-delta'; index: number; text: string }
  | { type: 'tool-call-delta'; index: number; id: string; name?: string; argumentsDelta: string }
  | { type: 'block-end'; index: number; block: ContentBlock }
  | { type: 'usage'; usage: TokenUsage }
  | { type: 'finish'; reason: FinishReason };
```

- **`index` correlaciona os deltas entrelaçados.** O raciocínio e o texto chegam misturados e várias chamadas de ferramenta abrem ao mesmo tempo, então a ordem de chegada não agrupa nada.
- **`block-end` traz o bloco já montado**, e vence o que os deltas construíram. Quem só quer blocos prontos pode ignorar todo delta.
- **Os argumentos das ferramentas continuam sendo texto JSON cru.** Metade de um documento JSON não é um valor. Analise `arguments` uma vez só, depois do `finish`: analisar `argumentsDelta` no meio do fluxo é justamente onde as chamadas de ferramenta em streaming costumam quebrar.
- **`block-start` é opcional.** Vários fornecedores abrem um bloco com o primeiro delta dele, então o acumulador abre um quando precisa. Não exija esse evento no seu mapeamento também.
- **`finish` encerra.** O `usage` chega antes; depois dele não vem nada.

## Dobrar uma resposta

```js
const accumulator = createStreamAccumulator();

for await (const chunk of mapEventStream(response.body, toStreamChunks)) {
  accumulator.push(chunk);
  render(accumulator.snapshot());
}

const { blocks, usage, finishReason } = accumulator.snapshot();
const calls = accumulator.toolCalls(); // os argumentos ainda são texto — analise aqui
```

`snapshot()` é imutável: um retrato tirado no meio do fluxo guarda os valores que tinha, então uma visão pode segurá-lo sem que um `push` posterior o mude por baixo. `text()` e `reasoning()` concatenam os blocos deles na ordem do índice, e `reset()` limpa a instância para outra resposta.

## Do que o analisador de SSE dá conta

As regras de enquadramento são poucas e quase nunca são implementadas por inteiro. O `parseEventStream` cobre:

- uma fronteira de pedaço **em qualquer lugar**, inclusive dentro de um caractere multibyte e entre as duas metades de um `\r\n`
- campos `data:` repetidos, unidos com `\n`
- exatamente um espaço removido depois dos dois-pontos
- linhas de comentário `:`, que é como os servidores mantêm uma conexão viva
- um BOM no começo
- um bloco final que o servidor nunca fechou com uma linha em branco
- um `ReadableStream` sem `Symbol.asyncIterator`

Ele aceita qualquer `AsyncIterable<Uint8Array>` além de um `ReadableStream`, então um teste pode passar fatias de bytes sem nenhuma rede.

## Um mapeamento na prática

O `packages/im`, neste repositório, é um consumidor que funciona: uma rota SSE compatível com a OpenAI, o mapeamento para `StreamChunk`, e uma visão que segura um retrato em vez de concatenar deltas por conta própria. O teste de ida e volta dele leva os bytes do servidor real através do cliente real em vários tamanhos de pedaço, então as duas metades não podem se afastar.

## Veja também

- [ranuts/conversation](../conversation/): projeta os eventos resultantes em nós desenháveis
- [`<r-conversation>`](../../ranui/conversation/): desenha esses nós
