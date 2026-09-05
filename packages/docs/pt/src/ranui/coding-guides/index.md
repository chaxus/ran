---
description: 'Regras de engenharia para construir com o ranui: pontos de entrada, o contrato de atributos/propriedades/eventos, estilos através da fronteira do shadow DOM, posse do estado, SSR, testes e os antipadrões a evitar.'
---

# Diretrizes de código

Como _construir_ com o ranui: qual é o contrato dos componentes, onde a fronteira do Shadow DOM muda as regras a que você está acostumado e quais erros vale conhecer antes de cometê-los.

A metade visual disso são as [diretrizes de design](/pt/src/ranui/design-guides/); os tokens são o [design system](/pt/src/ranui/design-system/).

> **Use quando** estiver ligando componentes do ranui a uma aplicação: escolhendo importações, amarrando eventos, estilizando algo que um seletor não alcança, renderizando num servidor ou escrevendo testes.

## Princípios

1. **O elemento é a API.** Atributos, propriedades, eventos, slots e `::part()` são todo o contrato. Qualquer outra coisa que se veja de fora é detalhe de implementação e vai mudar de lugar.
2. **O estado tem um dono só.** Ou a sua aplicação é dona do valor e o empurra para dentro, ou o componente é dono e avisa quando muda. Espelhar nos dois sentidos é como os valores se desencontram.
3. **Estilize através da fronteira do Shadow DOM com propriedades personalizadas, `::part()`, `sheet` e slots.** Seletores comuns não a atravessam; nenhuma dose de especificidade muda isso.
4. **Importe o que você usa.** Cada componente tem a própria entrada; o barril é conveniência, não exigência.
5. **Prefira a plataforma.** São elementos personalizados: `addEventListener`, `setAttribute` e `hidden` funcionam como especificado, e as abstrações de framework por cima são opcionais.

## Pontos de entrada

Cada entrada registra exatamente o que o nome dela diz, nada mais, então uma página que só quer tematização nunca paga pela biblioteca de componentes.

| Importação                      | Contém                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `ranui`                         | Todos os componentes (registra todos os `<r-*>` como efeito colateral)       |
| `ranui/<component>`             | Um componente: `ranui/button`, `ranui/select`, `ranui/modal`, …              |
| `ranui/theme`                   | `initTheme` / `setTheme` / `getTheme` e sobrescrita de tokens; sem elementos |
| `ranui/i18n`                    | O motor de tradução; sem elementos                                           |
| `ranui/fonts`                   | Geist Sans + Geist Mono hospedadas por você (só o CSS de `@font-face`)       |
| `ranui/style`                   | A folha de estilos, se a sua configuração não a pegar sozinha                |
| `ranui/builder`                 | O construtor de DOM encadeável com que os componentes são escritos           |
| `ranui/ssr`, `ranui/ssr-stream` | Renderização no servidor                                                     |
| `ranui/testing`                 | Auxiliares para alcançar um shadow root fechado a partir de um teste         |
| `ranui/typings`                 | Tipos ambientais (declarações de elementos para JSX / TS)                    |

```js
import 'ranui/button'; // um elemento
import 'ranui'; // todos eles
```

**Importe pelo efeito colateral.** `import 'ranui/button'` registra o `<r-button>`; raramente você precisa da classe exportada. A exceção é a renderização no servidor, onde você mesmo a instancia.

## O contrato dos componentes

Os atributos, propriedades, eventos (com o formato do `detail`), slots e parts exatos de cada elemento são gerados do código-fonte para o [`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md). As regras abaixo são o que aquela tabela _não_ diz.

### Atributos são strings; propriedades têm tipo

Atributos HTML são minúsculos e do tipo string; a propriedade correspondente é camelCase e recebe um valor de verdade. São o mesmo estado, alcançado de duas maneiras:

```html
<r-select showsearch dropdownclass="wide"></r-select>
```

```js
select.showSearch = true; // propriedade — camelCase
select.setAttribute('showsearch', ''); // atributo — minúsculo
```

- **Atributos booleanos valem pela presença**, como o `disabled` de um `<button>` nativo: `disabled=""` e `disabled="false"` estão os dois _desabilitados_. Remova o atributo (ou coloque a propriedade em `false`) para desligar.
- **Valores ricos passam por propriedades.** Arrays, objetos e `File` não sobrevivem a um atributo: o `attachments` do `r-attachments`, por exemplo, é uma propriedade.
- **Nomes de atributo na marcação não distinguem maiúsculas**, e é por isso que o HTML acima diz `showsearch` enquanto a propriedade é `showSearch`. Em JSX, escreva a forma de atributo.

### Escute no próprio elemento

Os componentes do ranui despacham `CustomEvent`, e a carga vem sempre em `detail`:

```js
select.addEventListener('change', (event) => {
  const { value, label } = event.detail;
});
```

**Se um evento borbulha ou não é decisão de cada componente, então amarre ao elemento, não a um contêiner.** O núcleo de formulários e camadas (`r-input`, `r-checkbox`, `r-select`, `r-modal`) despacha eventos que não borbulham sobre si mesmo, de propósito: um `change` de um select dentro do seu formulário não deveria parecer um `change` do formulário. Outros borbulham (e são `composed`, então cruzam fronteiras de shadow): `r-theme-switch`, `r-voice-button`, `r-attachments`, `r-conversation`, `r-tool-card`, `r-markdown`, `r-math`, `r-mermaid`, `r-router`, `r-route`, `r-link`, `r-colorpicker`.

Um ouvinte no elemento funciona nos dois casos; a delegação num ancestral funciona só com o segundo grupo e falha _em silêncio_ com o primeiro. Confira o código ou o [`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md) antes de confiar na delegação.

**Eventos `before*` são canceláveis.** O `r-modal` despacha `beforeopen` / `beforeclose` antes de agir; `event.preventDefault()` veta a transição. Os pares `open` / `close` / `afteropen` / `afterclose` relatam o que já aconteceu e não podem ser cancelados.

```js
modal.addEventListener('beforeclose', (event) => {
  if (hasUnsavedChanges) event.preventDefault();
});
```

### Slots e parts

O conteúdo entra pelos slots (padrão e nomeados) e fica no seu documento, então o CSS da **sua** página o estiliza normalmente. Só fica fora de alcance o que o componente monta por dentro, e é para isso que existe o `::part()`.

## Estilos através da fronteira do shadow {#styling-across-the-shadow-boundary}

Todo componente do ranui é desenhado num shadow root **fechado**. O CSS da página não vaza para dentro, e os seletores não alcançam através dela. Há exatamente quatro caminhos de entrada, em ordem de preferência:

| Mecanismo                       | Serve para                                    | Exemplo                                               |
| ------------------------------- | --------------------------------------------- | ----------------------------------------------------- |
| **Propriedades personalizadas** | Tudo que o componente expõe como token        | `r-button { --ran-btn-background: #7c3aed; }`         |
| **`::part()`**                  | Um ajuste estrutural que os tokens não cobrem | `r-card::part(footer) { justify-content: flex-end; }` |
| **O atributo `sheet`**          | CSS programático ou dinâmico injetado dentro  | `el.sheet = '.ran-btn { letter-spacing: .02em }'`     |
| **Conteúdo de slot**            | Marcação que já é sua de qualquer jeito       | `<span slot="extra">…</span>`                         |

As propriedades personalizadas são a via preferida porque **são herdadas através** da fronteira: definir um token no `:root`, num invólucro ou no elemento funciona igual, e são os mesmos tokens que o tema usa. Parts e `sheet` prendem você à estrutura interna, então guarde-os para lacunas reais e conte com revisitá-los a cada atualização.

O que não funciona, em nenhuma especificidade: `r-select .some-inner-class { … }`, `!important` ou um `querySelector` para dentro do componente. Um root fechado significa que `element.shadowRoot` é `null` tanto para o seu CSS quanto para os seus scripts e para os localizadores do seu executor de testes.

## Ser dono do estado

Decida, valor a valor, quem é o dono:

- **O componente é dono** (não controlado): defina um valor inicial e depois leia o valor do `detail` do evento quando ele mudar. O mais simples, e o padrão para formulários.
- **A sua aplicação é dona** (controlado): defina a propriedade a cada render e trate o evento como um _pedido_ de mudar o seu estado, não como uma mudança que já aconteceu no seu modelo.

O que quebra é fazer as duas coisas: guardar uma cópia do valor do componente no seu estado, escrevê-la de volta a cada evento e redefinir a propriedade a partir desse estado. Os dois se desencontram sob digitação rápida, e escrever durante um evento pode entrar em laço. Escolha uma direção.

```js
// Controlado: o estado é a fonte da verdade, o evento é um pedido
input.value = state.query;
input.addEventListener('input', (event) => {
  state.query = event.detail.value;
  render(); // que define input.value de novo — mas a partir de um dono só
});
```

## Integração com frameworks {#framework-integration}

São elementos personalizados padrão, então nada específico de framework é exigido, mas três detalhes mordem:

- **React** (antes da 19) define toda prop de JSX como **atributo**, então valores ricos não chegam e props no estilo `onChange` não se ligam a eventos personalizados. Use um `ref` e defina propriedades ou chame `addEventListener` dentro de um efeito. O React 19 define propriedades quando elas existem e ainda assim não liga eventos personalizados pelo nome, então mantenha o `ref` para os ouvintes.
- **Vue** compila tags desconhecidas como componentes, a menos que seja avisado; acrescente `r-` a `compilerOptions.isCustomElement` na configuração de build. Depois disso, `:prop` liga uma propriedade e `@change` liga um ouvinte de evento de verdade, ambos corretamente.
- **Angular** precisa de `CUSTOM_ELEMENTS_SCHEMA`; Svelte e Solid passam atributos e ouvintes `on:`/`on` direto e não precisam de nada.

Quem usa TypeScript pode fazer `import 'ranui/typings'` para as declarações de elementos intrínsecos do JSX.

## Renderização no servidor {#server-rendering}

Os componentes do ranui se serializam em **shadow DOM declarativo**, então um servidor pode emitir a marcação real e a primeira pintura fica correta antes de qualquer JavaScript rodar:

```js
import 'ranui'; // preenche o registro de SSR
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

`renderToStream(html)` é a mesma coisa como gerador assíncrono, para respostas em streaming; `renderToString(instance)` em `ranui/ssr` serializa uma instância de componente que você mesmo construiu. Tags desconhecidas passam intactas, então é seguro rodar sobre uma página inteira.

Duas coisas a saber:

- **O cliente reconstrói, não reaproveita.** Como os roots são fechados, o navegador não consegue reaproveitar a árvore renderizada no servidor para o componente, então, ao atualizar, cada elemento constrói uma idêntica do zero. Você ganha a primeira pintura vinda do servidor; não ganha reaproveitamento na hidratação, e não deve pôr estado na marcação shadow do servidor esperando que o cliente a leia.
- **Nada medido está disponível no servidor.** Tudo que depende de `getBoundingClientRect` ou de `offsetWidth` se resolve depois da montagem, no navegador.

## Desempenho

- **Importe por componente** em páginas que usam um punhado; o barril é para aplicações que usam quase toda a biblioteca.
- **As variantes carregam sob demanda.** O `r-icon` e o `r-loading` buscam uma variante pelo nome em tempo de execução, então o custo base não cresce com a quantidade de ícones que você não usa.
- **Defina propriedades, não reconstrua elementos.** Substituir um elemento personalizado roda o construtor dele de novo; definir uma propriedade atualiza no lugar.
- **Agrupe as escritas de atributos.** Cada escrita pode disparar o `attributeChangedCallback`; monte o estado antes de inserir sempre que der.

## Testes

**Shadow roots fechados também barram os localizadores dos testes.** O `getByRole`, o `getByText` e o `querySelector` do Playwright param todos na fronteira e não acham _nada_, então uma especificação escrita com eles passa enquanto afirma coisas sobre elementos que nunca viu. Duas suítes deste repositório foram escritas assim antes de alguém perceber. O `ranui/testing` é a costura, com nome e documentada:

```js
import { insideShadow, settlePainted } from 'ranui/testing';

const label = await insideShadow(page, 'r-button', (root) => root.querySelector('[part=content]')?.textContent);
```

Fora isso, teste o contrato, não as entranhas: defina um atributo ou uma propriedade e afirme sobre o evento e sobre o que a pessoa consegue perceber. Afirmações contra nomes de classe internos quebram a cada refatoração e não dizem nada sobre o componente funcionar ou não.

## Antipadrões

| Antipadrão                                                 | Por que falha                                                                             |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Delegar `change` num contêiner para `r-input` / `r-select` | Esses eventos não borbulham; o ouvinte nunca dispara. Amarre ao elemento.                 |
| `document.querySelector('r-select').shadowRoot`            | Root fechado: sempre `null`. Use a API pública, as parts ou o `ranui/testing`.            |
| Estilizar as entranhas com `r-card .inner { … }`           | Seletores não cruzam a fronteira em nenhuma especificidade. Use tokens ou `::part()`.     |
| `!important` para vencer um componente                     | Não há conflito de cascata a vencer: a regra nunca se aplica. Mesma correção de cima.     |
| Espelhar o valor de um componente no seu estado e de volta | Dois donos, um valor; eles se desencontram e podem entrar em laço.                        |
| Recriar elementos para atualizá-los                        | Roda o construtor de novo, perde o foco e o estado interno. Defina propriedades.          |
| Escrever uma cor à mão ao lado de um componente tematizado | Quebra no instante em que o tema vira. Use tokens semânticos.                             |
| `z-index` geral num invólucro "caso" uma camada abra       | Eleva conteúdo estático acima da sua própria moldura para sempre. Restrinja com `:has()`. |
| Esperar pelo `shadowRoot` num teste                        | Como acima: afirme pelo `ranui/testing` ou sobre comportamento observável.                |

## Contribuir com o ranui

O repositório carrega padrões próprios, mais rígidos, para o código da biblioteca:

- [`docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md): o padrão de design executável; nove regras são cobradas pelo `pnpm -F ranui verify:design`.
- [`docs/CODING.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md): a arquitetura dos componentes, a posse do estado e as regras de teste para o código da biblioteca.
- [`docs/BUILDER.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md): o construtor de DOM encadeável e as primitivas reativas dele.
- `CLAUDE.md` na raiz do pacote: o arquivo de orientação, que viaja no tarball do npm e que tanto pessoas quanto agentes de código leem primeiro.

Antes de abrir um pull request: `pnpm -F ranui test:all`, `pnpm -F ranui verify:design` e `pnpm verify:docs` (as tabelas de API e de tokens são geradas; a CI falha se estiverem desatualizadas).
