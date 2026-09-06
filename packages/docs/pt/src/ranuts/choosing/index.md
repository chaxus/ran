---
description: 'Qual utilitário do ranuts escolher: debounce ou throttle, once ou singleFlight, localStorage ou IndexedDB, uma ponte ou um cliente de worker, e quando a plataforma já traz aquilo.'
---

# Escolhendo um utilitário

A [referência da API](/pt/src/ranuts/api) lista todas as exportações. Esta página responde ao que ela não consegue: **de duas coisas parecidas, qual eu quero e por quê**.

> **Use quando** você já souber mais ou menos o que precisa («que isso rode menos vezes», «só uma vez», «guardar isso», «conversar com um worker»), mas não qual exportação faz aquilo.

## Primeiro: a plataforma já não tem isso?

O ranuts não quer substituir a biblioteca padrão. Recorra primeiro à plataforma e use um utilitário quando ele realmente acrescentar algo:

| Em vez de…                 | A plataforma já tem…        | Use a do ranuts quando…                                                                                                                                                          |
| -------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloneDeep(value)`         | `structuredClone(value)`    | O valor traz funções ou qualquer coisa que o `structuredClone` recuse: ele lança um `DataCloneError`, ao passo que o `cloneDeep` copia o que dá e mantém o resto por referência. |
| `getAllQueryString(url)`   | `new URL(url).searchParams` | Você quer um objeto simples numa única chamada, em vez de um iterador.                                                                                                           |
| `localStorageGetItem(key)` | `localStorage.getItem(key)` | O código também roda onde não há armazenamento ou ele está bloqueado: os invólucros devolvem `''` em vez de lançar (modo privado do Safari, SSR, um iframe em caixa de areia).   |
| `escapeHtml(str)`          | `textContent = str`         | Você está montando uma string, não um nó.                                                                                                                                        |

## Fazer algo com menos frequência

«chamar isso menos» pode querer dizer quatro coisas diferentes:

| O que você quer…                                                                         | Use                | Comportamento                                                                                 |
| ---------------------------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------- |
| Só a **última** chamada de uma rajada (uma caixa de busca, um redimensionamento)         | `debounce(fn, ms)` | Roda `ms` depois que a rajada para. Durante a rajada não roda nada.                           |
| Um **ritmo constante** durante a rajada (a posição da rolagem, uma leitura de progresso) | `throttle(fn, ms)` | A primeira chamada roda na hora; depois, no máximo uma a cada `ms`.                           |
| Que rode **exatamente uma vez** na vida (uma inicialização, um aviso único)              | `once(fn)`         | A primeira chamada avalia; todas as seguintes devolvem esse mesmo resultado.                  |
| Que quem chama ao mesmo tempo **divida uma única requisição em curso**                   | `singleFlight(fn)` | A versão assíncrona do once: enquanto uma chamada está pendente, as outras pegam carona nela. |

**`memoize` é o antigo nome de `once`** e faz exatamente a mesma coisa: ele não guarda um resultado por argumento, que é o que o nome sugere. Em código novo, escreva `once`.

A diferença que importa: com `debounce` num manipulador de teclas, nada roda enquanto a pessoa digita; com `throttle`, algo roda o tempo todo, só que não a cada tecla. Uma sugestão de busca quer `debounce`; um contador de «caracteres restantes» quer `throttle`.

## Conduzir trabalho assíncrono com rédeas

| O que você quer…                                                                    | Use                                          |
| ----------------------------------------------------------------------------------- | -------------------------------------------- |
| Rodar muitas tarefas, mas só _n_ por vez                                            | `new QuestQueue({ simultaneous: n })`        |
| Desistir de uma promessa que demora demais                                          | `withTimeout(promise, ms)`                   |
| …e seguir com um valor padrão em vez de lançar                                      | `withTimeoutFallback(promise, ms, fallback)` |
| Uma promessa que você resolve de um lugar completamente diferente                   | `deferred()`                                 |
| Encadear passos assíncronos ao estilo do Koa, cada um capaz de embrulhar o seguinte | `compose(middleware)`                        |

`Promise.all` é o certo quando você quer _todas_ de uma vez; `QuestQueue` é o certo quando «todas de uma vez» abriria sessenta conexões. O `withTimeout` rejeita: acompanhe-o de um `catch`, ou use a variante com valor de reserva quando estourar o tempo não for erro para você.

## Guardar alguma coisa

| Duração e tamanho                                                   | Use                                                                          |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Uma string pequena que sobreviva às recargas                        | `localStorageSetItem` / `localStorageGetItem` / `localStorageRemoveItem`     |
| Dados com estrutura, muitos registros, ou mais do que uns poucos MB | `new WebDB({ dbName, stores })`: um invólucro de promessas sobre o IndexedDB |
| Um valor passado **desta página para a próxima**                    | `createHandoff({ dbName, storeName, key })`                                  |

Os invólucros `localStorage*` existem porque as chamadas nativas **lançam** onde o armazenamento não está disponível (o modo privado do Safari, um iframe em caixa de areia, um navegador com os dados do site bloqueados), e cair na leitura é uma falha pior do que ficar sem uma preferência. Eles devolvem `''` e seguem em frente.

O `createHandoff` é para o caso em que nenhum dos outros serve: um valor que precisa sobreviver a exatamente uma navegação e depois sumir.

## Conversar entre contextos

| Entre…                                                | Use                                                                                      |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Uma página e um Web Worker, com requisição e resposta | `new WorkerClient({ create })`: casa cada resposta com sua requisição pelo identificador |
| Duas pontas quaisquer de `MessagePort`                | `createPortBridge(port)`                                                                 |
| Duas janelas ou iframes que precisam se achar         | `acceptPortBridge()` de um lado e o aperto de mão do outro                               |

O `WorkerClient` é o que você procura quando o worker responde perguntas: sem identificadores de requisição, duas chamadas sobrepostas não têm como saber de quem é a resposta que chegou. A ponte é o nível de baixo: use-a quando o tráfego não for de requisição e resposta, ou quando o transporte já existir.

## Trabalhar com objetos

| O que você quer…                       | Use                    | Nota                                                                |
| -------------------------------------- | ---------------------- | ------------------------------------------------------------------- |
| Uma cópia que mais ninguém compartilhe | `cloneDeep(value)`     | Dá conta de referências circulares e dos tipos nativos mais comuns. |
| Saber se dois valores são iguais       | `isEqual(a, b)`        | Comparação em profundidade, não identidade de referência.           |
| Juntar dois objetos                    | `merge(a, b)`          | Fusão rasa: as chaves de `b` ganham, e `a` é alterado.              |
| Tirar algumas chaves                   | `filterObj(obj, keys)` | Devolve uma cópia sem as chaves listadas.                           |

## Idioma e texto

- **`resolveLocale({ supported, … })`** decide qual dos _seus_ idiomas usar, seguindo a cadeia de sempre (uma escolha explícita, o armazenamento, `navigator.languages`, um valor de reserva). Ele responde «qual idioma», não «o que esta string diz».
- **`createI18n` / `useI18n`** ([`ranuts/i18n`](/pt/src/ranuts/i18n/)) é o motor de tradução: dicionários planos de mensagens, interpolação com `{param}` e troca em tempo de execução.
- **`segmentByRanges`** e **`paginateText`** servem para diagramar texto: o primeiro, deslocamentos e destaques; o segundo, cortar o texto em páginas que caibam numa caixa.

Use o `resolveLocale` mesmo que não use o motor de i18n: a decisão que ele toma — respeitar a ordem inteira de `navigator.languages` do leitor, e não só o primeiro item — é justamente a parte fácil de errar.

## Transmitir a resposta de um modelo

Três camadas, e cada uma serve sozinha:

1. **[`ranuts/stream`](/pt/src/ranuts/stream/)**: interpreta o SSE e depois dobra os incrementos num instantâneo com `createStreamAccumulator()`. É neutro quanto ao provedor: incrementos de texto, de raciocínio e de chamadas de ferramenta acabam com o mesmo formato, venham de quem vierem.
2. **[`ranuts/conversation`](/pt/src/ranuts/conversation/)**: projeta um registro de eventos só de acréscimo em nós desenháveis com `createConversationEngine()`. Ele decide _o que_ é cada linha; não desenha nada.
3. **[`<r-conversation>`](/pt/src/ranui/conversation/)** no ranui: o elemento que desenha esses nós, mantém a vista grudada no fim e reconcilia as linhas.

Pare na camada 1 se você só pinta texto; acrescente a 2 quando a transcrição tiver uma estrutura que valha a pena projetar; acrescente a 3 quando quiser a rolagem e a reconciliação já resolvidas.

## De qual entrada importar

Cada subcaminho é um barril independente do qual dá para podar o que não se usa. Importe daquele que é dono do símbolo, nunca de um caminho interno do código.

| Importação            | Contém                                                                       | Onde roda          |
| --------------------- | ---------------------------------------------------------------------------- | ------------------ |
| `ranuts`              | Barril raiz: os utilitários mais a superfície visual                         | navegador + node   |
| `ranuts/utils`        | DOM/BOM, string, objeto, número, cor, tempo, armazenamento, …                | navegador + node\* |
| `ranuts/node`         | Servidor HTTP, roteador, WebSocket, fs, fluxos, middleware                   | **só node**        |
| `ranuts/visual`       | O motor de desenho 2D (Canvas / WebGL / WebGPU)                              | **só navegador**   |
| `ranuts/i18n`         | O motor de tradução, sem DOM                                                 | navegador + node   |
| `ranuts/sw`           | Estratégias de cache e a metade do protocolo de pré-cache que vive no worker | **service worker** |
| `ranuts/vnode`        | DOM virtual ao estilo do Snabbdom                                            | navegador          |
| `ranuts/stream`       | Leitura de SSE, dobra do fluxo do modelo, orçamento de tokens                | navegador + node   |
| `ranuts/conversation` | Do registro de eventos a nós de conversa desenháveis                         | navegador + node   |

\* O `ranuts/utils` é largo: a maior parte olha para o navegador, mas os auxiliares puros (string, objeto, número, `compose`, `cloneDeep`, …) rodam em qualquer lugar. **Não importe `ranuts/node` em código de navegador.** Ele arrasta `fs`, `http` e `child_process`.

## Ainda em dúvida?

Procure na [referência da API](/pt/src/ranuts/api): todas as exportações estão lá com sua assinatura e uma linha de descrição, geradas a partir do código. Se, depois de ler as duas linhas, duas delas ainda parecerem intercambiáveis, isso é um defeito de documentação que vale [relatar](https://github.com/chaxus/ran/issues).
