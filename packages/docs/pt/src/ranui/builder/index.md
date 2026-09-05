---
description: 'O ranui/builder é um construtor de DOM encadeável e sem framework, com reatividade de grão fino no estilo SwiftUI/Solid: construa uma vez e depois atualize só o nó a que um sinal está ligado.'
---

# Builder

O `ranui/builder` constrói o DOM de forma declarativa, com reatividade de grão fino e sem DOM virtual. É com ele que os próprios componentes são escritos, publicado como entrada independente para que um aplicativo o use no próprio layout e nas amarrações.

> **Use quando** quiser visões reativas sem framework (uma página, uma rota, um widget) ou quando estiver escrevendo um elemento personalizado e quiser o mesmo estilo de construção que o ranui usa por dentro.

> **O princípio: construir uma vez, atualizar no lugar.** Uma função de visão roda **uma única vez**. Uma mudança de estado atualiza apenas o nó ligado àquele sinal; não há redesenho de uma árvore. Escolha a primitiva que combina com a forma: valor → um getter ligado; condição → `Show` / `Switch`; lista → `For` / `Index`.

```js
import {
  View,
  Div,
  Span,
  ButtonBuilder, // fábricas de elementos
  signal,
  computed,
  createEffect,
  batch,
  untrack, // reatividade
  createRoot,
  onCleanup,
  getOwner,
  runWithOwner, // propriedade
  EventManager, // eventos presos ao ciclo de vida
} from 'ranui/builder';
```

O construtor **não** registra nenhum elemento personalizado. Para usar `<r-button>` e companhia, importe também a entrada do componente: `import 'ranui/button'`.

## Elementos

As fábricas devolvem um `ElementBuilder` encadeável; `build()` devolve o nó do DOM.

```js
const header = Div()
  .class('panel-header')
  .attr('part', 'header')
  .role('heading')
  .children(Span().class('title').text('Deploys'), Slot().attr('name', 'extra'))
  .build();
```

`Div()`, `Span()`, `ButtonBuilder()`, `InputBuilder()`, `Label()`, `Ul()`, `Li()`, `Section()`, `Article()`, `Nav()`, `Header()`, `Footer()`, `Main()`, `Style()`, `Slot()`, mais `View('any-tag')` para qualquer outra coisa, inclusive elementos personalizados.

### API encadeável

| Grupo               | Métodos                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| Identidade e classe | `id(v)`, `class(v)`, `addClass(...v)`, `removeClass(...v)`                                                    |
| Atributos           | `attr(name, v)`, `attrs({…})`, `boolAttr(name, on, enabledValue?)`, `part(v)`, `data(key, v)`                 |
| Estilo              | `style(prop, v)` / `style({…})`, `cssVar(name, v)`                                                            |
| Acessibilidade      | `aria(key, v)`, `role(v)`, `tabIndex(n)`, `label(v)`, `labelledBy(id)`, `describedBy(id)`, `ariaHidden(b?)`   |
| Conteúdo            | `text(v)`, `children(…nodes)`, `replaceChildren(…nodes)`                                                      |
| Refs e shadow       | `ref(holder)`, `shadow(opts?)` → `ShadowBuilder`                                                              |
| Eventos             | `on(type, handler, options?)`, `listen(manager, type, handler)`, `delegate(manager, selector, type, handler)` |
| Terminais           | `build()`, `serialize()` (string HTML para SSR)                                                               |

`children()` aceita elementos, strings, outros construtores, arrays, `null` / `undefined` (que são pulados) e getters (regiões vivas, veja abaixo).

### Refs

`createRef<T>()` mais `.ref(holder)` capturam o elemento construído. Tipar a ref com a classe do elemento de um componente lhe dá os métodos imperativos dele sem nenhuma conversão:

```ts
import { Popover } from 'ranui';
import { View, createRef } from 'ranui/builder';

const ref = createRef<Popover>();
View<Popover>('r-popover').attr('trigger', 'click').ref(ref).children(/* … */).build();
ref.current?.closePopover();
```

## Reatividade

```js
const [count, setCount] = signal(0);
count(); // leitura — rastreada dentro de efeitos e memos
setCount(1); // escrita; setCount((n) => n + 1) também funciona
// uma escrita com valor inalterado não faz nada (Object.is; troque com signal(v, { equals }))

const double = computed(() => count() * 2); // preguiçoso e memoizado

const dispose = createEffect(() => {
  console.log(count()); // roda agora, e a cada mudança de dependência
  return () => {
    /* limpeza opcional, antes da próxima execução e ao descartar */
  };
});

batch(() => {
  setCount(1);
  setName('x');
}); // uma só descarga, efeitos sem repetição
untrack(() => count()); // ler sem se inscrever
```

- **`computed` é preguiçoso**: um memo que ninguém lê nunca recalcula, e só avisa de novo quando o _valor_ dele muda, então efeitos atrás de um memo estável não rodam outra vez.
- **Efeitos se rastreiam sozinhos**: só continuam inscritos os sinais lidos na última execução, então uma condição nunca deixa para trás uma inscrição velha.
- **Um efeito cíclico lança erro** em vez de girar sem fim: um efeito que escreve um sinal que ele lê é um defeito, e o runtime lança em vez de deixá-lo correr para sempre.

### Ligações reativas

`text`, `attr`, `class`, `boolAttr`, `style`, `part`, `data`, `aria`, `role` e `label` todos aceitam um **getter**, então a ligação se atualiza sozinha sem nenhum efeito explícito:

```js
const [active, setActive] = signal(true);

Div()
  .class(() => (active() ? 'row active' : 'row'))
  .boolAttr('disabled', () => !active())
  .build();
```

Só as formas de valor único são reativas: `style(prop, getter)` é; as formas de mapa `style({…})` e `attrs({…})` são aplicadas uma vez só.

### Condições e listas

| Forma                                     | Use                                  | Comportamento                                                    |
| ----------------------------------------- | ------------------------------------ | ---------------------------------------------------------------- |
| Um ramo                                   | `Show({ when, children, fallback })` | Reconstrói só quando a _veracidade_ de `when` vira.              |
| Vários ramos                              | `Switch` + `Match`                   | Reconstrói só quando o ramo escolhido muda.                      |
| Uma lista com ids estáveis                | `For({ each, key, render })`         | Casa os itens por `key` e **reaproveita os nós deles**.          |
| Uma lista em que a posição é a identidade | `Index({ each, render })`            | Reaproveita o nó de cada posição; o próprio item é um sinal.     |
| Conteúdo que muda de forma inteira        | um getter solto como filho           | Grosseiro: derruba e reconstrói a região inteira a cada leitura. |

```js
Ul().children(
  For({
    each: () => rows(), // array de origem reativo
    key: (row) => row.id, // estável e único
    render: (row, index) => Li().text(() => `${index()}. ${row.title}`),
  }),
);
```

Quatro regras decidem se o `For` de fato reaproveita alguma coisa:

- **A `key` precisa ser única.** Uma repetida é ignorada (só o primeiro item é desenhado) e avisada em desenvolvimento. Não use o índice do array como chave: isso acaba com o reaproveitamento ao reordenar.
- **Atualize com um array novo.** `each` lê um sinal, então mutar o mesmo array no lugar e redefini-lo é pulado por igualdade, e a lista nunca se atualiza.
- **`render` roda uma vez por item**, não a cada mudança da lista. Conduza as atualizações de cada linha com sinais; `index` é um getter, então continua correto depois de uma reordenação.
- **Remover um item descarta o escopo daquela linha**: os efeitos e as limpezas dela vão junto.

Prefira `Show` / `For` a um getter solto como filho: o getter reconstrói a região inteira a cada mudança que lê, mesmo uma que não altera o resultado, então o foco, a posição de rolagem, os valores dos campos e as transições ali dentro se perdem.

## Propriedade

Todo efeito, memo e ligação reativa pertence ao escopo que o criou. Descartar o escopo descarta tudo que está sob ele.

```js
import { createRoot, onCleanup } from 'ranui/builder';

const dispose = createRoot((dispose) => {
  const el = Div().text(message).build(); // esta ligação pertence à raiz
  onCleanup(() => console.log('torn down'));
  mount(el);
  return dispose;
});

dispose(); // remove o efeito da ligação e roda as limpezas
```

**Construa a interface reativa dentro de um `createRoot`.** Uma ligação criada sem dono ainda funciona, mas nunca se descarta sozinha.

### Desmontagem por página

Dê a cada página ou rota a própria raiz e descarte-a ao navegar: todo efeito, ligação, temporizador e ouvinte que aquela página criou some numa chamada só:

```js
let disposePage = null;

function showPage(render, host) {
  disposePage?.();
  disposePage = createRoot((dispose) => {
    render(host);
    return dispose;
  });
}
```

O [`<r-route>`](/pt/src/ranui/route/) já traz isso: com `src`, o módulo da página é importado ao casar, a exportação padrão dele roda dentro de um `createRoot`, e essa raiz é descartada ao sair. `getOwner()` / `runWithOwner()` deixam um roteador levar um escopo através de um `await`.

::: warning Dentro de um Web Component, não use ligações com getter
O `constructor` e o `connectedCallback` de um componente **não** são escopos reativos, então uma ligação com getter ou um `createEffect` criados ali ficam órfãos e nunca são descartados; continuam disparando sobre um nó desconectado e, se o sinal viver mais que o elemento, prendem o elemento na memória. Construa com valores simples e conduza as atualizações com `createEffect` explícitos, guardando as funções de descarte deles para chamar no `disconnectedCallback` e rearmá-las ao reconectar. Veja as [diretrizes de código](/pt/src/ranui/coding-guides/).
:::

## Ouvintes dentro de um elemento personalizado

O `EventManager` se apoia num `AbortController`, então uma chamada remove todos os ouvintes:

```js
const events = new EventManager();

connectedCallback() {
  events
    .on(this.input, 'input', this.onInput)
    .delegate(this, '[data-action]', 'click', (event, el) => this.run(el.dataset.action));
}

disconnectedCallback() {
  events.abort(); // remove todos eles, e se reinicia para a próxima conexão
}
```

## Renderização no servidor

Os construtores funcionam sob [SSR](/pt/src/ranui/ssr/): `build()` devolve um nó simulado e `serialize()` devolve HTML. Ligações reativas, `For` e `Show` desenham **uma vez só** no servidor, como um retrato estático; não há reconciliação até o código rodar num navegador.

## Referência completa

Esta página é o subconjunto de trabalho. A referência completa (toda fábrica, todo operador, as regras do espaço de nomes SVG e os detalhes de `Switch` / `Match`) está no [BUILDER.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md) do repositório, que também viaja dentro do pacote npm.
