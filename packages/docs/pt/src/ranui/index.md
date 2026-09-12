---
description: 'O ranui é uma biblioteca de UI em Web Components construída sobre custom elements nativos (<r-*>), com tipos TypeScript, tema claro/escuro, Shadow DOM, SSR e suporte a PWA.'
---

# ranui

Uma biblioteca de UI construída sobre **custom elements nativos**. Cada componente é uma tag
`<r-*>`, então funciona igual no React, no Vue, no Svelte, no Solid, no Astro ou num arquivo HTML
puro. Não há adaptador nem versão de framework para casar. Tipos TypeScript, tema claro e escuro
por design tokens, encapsulamento com Shadow DOM e renderização no servidor já vêm incluídos.


<PackageFacts package="ranui" />

- O ranui está em **alfa**: as versões trazem mudanças incompatíveis. Fixe uma versão exata e leia o
  [registro de alterações](/pt/src/ranui/changelog) antes de atualizar.

## Instalação

```bash
npm install ranui
```

```html
<!-- ou de uma CDN, sem etapa de build -->
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>
```

## Como usar

Importar registra os elementos; depois disso você escreve tags.

```js
import 'ranui'; // todos os componentes
import 'ranui/button'; // ou apenas um
```

```html
<r-button type="primary">Publicar projeto</r-button>
```

É a mesma tag em todos os frameworks: o que muda é como cada um passa valores e liga eventos, algo
que as [diretrizes de código](/pt/src/ranui/coding-guides/#framework-integration) cobrem por inteiro:

::: code-group

```html [HTML]
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>

<body>
  <r-button>Button</r-button>
</body>
```

```jsx [React]
import 'ranui';

export const App = () => <r-button type="primary">Deploy</r-button>;
// Valores complexos e listeners passam por um ref — veja as diretrizes de código.
```

```vue [Vue]
<template>
  <r-button type="primary" @click="deploy">Deploy</r-button>
</template>

<!-- Acrescente `r-` a compilerOptions.isCustomElement na configuração de build. -->
```

```js [Plain JS]
import 'ranui';

const button = document.createElement('r-button');
button.textContent = 'Deploy';
document.body.appendChild(button);
```

:::

## Pontos de entrada

Cada entrada registra exatamente o que o nome diz, então uma página que só quer temas nunca paga
pela biblioteca de componentes.

| Import                                                | Contém                                                               |
| ----------------------------------------------------- | -------------------------------------------------------------------- |
| `ranui`                                               | Todos os componentes                                                 |
| `ranui/<component>`                                   | Um componente: `ranui/button`, `ranui/select`, …                     |
| [`ranui/theme`](/pt/src/ranui/theme/)                 | Tema claro/escuro e sobrescrita de tokens; sem elementos             |
| [`ranui/i18n`](/pt/src/ranui/i18n/)                   | O motor de tradução; sem elementos                                   |
| `ranui/fonts`                                         | Geist Sans + Geist Mono auto-hospedadas                              |
| `ranui/style`                                         | A folha de estilos, se a sua configuração não a pegar sozinha        |
| [`ranui/builder`](/pt/src/ranui/builder/)             | O construtor de DOM fluente com reatividade de granulação fina       |
| [`ranui/ssr`](/pt/src/ranui/ssr/), `ranui/ssr-stream` | Renderização no servidor                                             |
| `ranui/testing`                                       | Auxiliares para alcançar um shadow root fechado a partir de um teste |
| `ranui/typings`                                       | Tipos ambientais de elementos para JSX / TS                          |

## Componentes

40 elementos. Todos eles, com seus atributos, propriedades, eventos, slots e nomes de `::part()`,
estão na [referência da API de elementos](/pt/src/ranui/api).

**Comuns**: [Button](/pt/src/ranui/button/) · [Icon](/pt/src/ranui/icon/) ·
[Loading](/pt/src/ranui/loading/)

**Entrada de dados**: [Input](/pt/src/ranui/input/) · [CheckBox](/pt/src/ranui/checkbox/) ·
[Select](/pt/src/ranui/select/) · [ColorPicker](/pt/src/ranui/colorpicker/) ·
[Attachments](/pt/src/ranui/attachments/) · [VoiceButton](/pt/src/ranui/voice-button/) ·
[Forms](/pt/src/ranui/form/)

**Apresentação de dados**: [Card](/pt/src/ranui/card/) · [Section](/pt/src/ranui/section/) ·
[Tabs](/pt/src/ranui/tab/) · [Image](/pt/src/ranui/image/) · [Progress](/pt/src/ranui/progress/) ·
[Radar](/pt/src/ranui/radar/) · [Player](/pt/src/ranui/player/) · [Preview](/pt/src/ranui/preview/) ·
[Glass](/pt/src/ranui/glass/) · [Scratch](/pt/src/ranui/scratch/) ·
[StateDot](/pt/src/ranui/state-dot/) · [DisclosureRow](/pt/src/ranui/disclosure-row/)

**Renderização de conteúdo**: [Markdown](/pt/src/ranui/markdown/) · [Math](/pt/src/ranui/math/) ·
[Mermaid](/pt/src/ranui/mermaid/)

**IA e chat**: [Conversation](/pt/src/ranui/conversation/) ·
[Reasoning](/pt/src/ranui/reasoning/) · [ToolCard](/pt/src/ranui/tool-card/) ·
[TokenMeter](/pt/src/ranui/token-meter/)

**Camadas e avisos**: [Modal](/pt/src/ranui/modal/) · [Popover](/pt/src/ranui/popover/) ·
[Dropdown](/pt/src/ranui/dropdown/) · [Message](/pt/src/ranui/message/) ·
[Skeleton](/pt/src/ranui/skeleton/)

**Navegação**: [Router](/pt/src/ranui/router/) · [Route](/pt/src/ranui/route/) ·
[Link](/pt/src/ranui/link/)

**Fundamentos**: [Temas](/pt/src/ranui/theme/) · [ThemeSwitch](/pt/src/ranui/theme-switch/) ·
[i18n](/pt/src/ranui/i18n/)

Cinco elementos não têm página própria porque só existem dentro de outro: `<r-option>`
(Select), `<r-tabs>` (Tabs), `<r-img>` (Image), `<r-dropdown-item>` (Dropdown) e
`<r-content>` (Popover). Eles estão na referência da API como todo o resto.

### Ao vivo

<div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-bottom:12px">
  <r-button type="primary">Primary</r-button>
  <r-button type="warning">Warning</r-button>
  <r-button type="text">Text</r-button>
  <r-button>Default</r-button>
  <r-icon name="lock" size="28"></r-icon>
  <r-icon name="user" size="28"></r-icon>
  <r-icon name="loading" size="28" color="#1E90FF" spin></r-icon>
</div>

<div style="width:100%;margin-bottom:12px">
  <r-progress percent="0.7" type="drag"></r-progress>
</div>

<r-markdown copy content="**Streaming** Markdown with `code`, tables, mermaid and math."></r-markdown>

## Estilos

Os componentes são desenhados num shadow root **fechado**: o CSS da página não entra e os seletores
não alcançam para dentro. Há quatro caminhos, em ordem de preferência.

**1. Design tokens (propriedades personalizadas de CSS)**: eles são herdados através da fronteira,
então defini-los no `:root`, num contêiner ou no próprio elemento funciona igual:

```html
<r-progress
  percent="0.7"
  type="drag"
  style="--ran-progress-track-background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f)"
></r-progress>
```

<div style="width:100%;margin:12px 0">
  <r-progress percent="0.7" type="drag" style="--ran-progress-track-background:linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);"></r-progress>
</div>

**2. `::part()`** para ajustes estruturais que os tokens não cobrem ·
**3. o atributo `sheet`** para injetar CSS no shadow root ·
**4. conteúdo em slots**, que fica no seu documento e recebe o CSS da sua página.

Os nomes dos tokens são o [design system](/pt/src/ranui/design-system/); as regras para escolher
entre eles são as [diretrizes de design](/pt/src/ranui/design-guides/); a mecânica está nas
[diretrizes de código](/pt/src/ranui/coding-guides/#styling-across-the-shadow-boundary).

## Eventos

Os componentes despacham `CustomEvent` com a carga em `detail`. Ligue o listener no elemento: se um
evento borbulha é uma decisão por componente, e a referência da API informa isso para cada um:

```html
<r-select id="env"></r-select>

<script>
  document.getElementById('env').addEventListener('change', (event) => {
    console.log(event.detail.value);
  });
</script>
```

A forma de atributo `onchange="…"` e a de propriedade `el.onchange = …` também funcionam, já que
estes são elementos do DOM comuns, mas aceitam apenas um manipulador e não têm fase de captura,
então `addEventListener` é o caminho a seguir.

## Para onde ir em seguida

| Se você quiser…                               | Leia                                                 |
| --------------------------------------------- | ---------------------------------------------------- |
| Consultar a API exata de um elemento          | [API de elementos](/pt/src/ranui/api)                |
| Saber qual token usar, e por quê              | [Design system](/pt/src/ranui/design-system/)        |
| Montar uma tela que pareça um sistema só      | [Diretrizes de design](/pt/src/ranui/design-guides/) |
| Integrar o ranui a um aplicativo corretamente | [Diretrizes de código](/pt/src/ranui/coding-guides/) |
| Acrescentar claro/escuro, ou reestilizar tudo | [Temas](/pt/src/ranui/theme/)                        |
| Traduzir a interface                          | [i18n](/pt/src/ranui/i18n/)                          |
| Renderizar num servidor                       | [Renderização no servidor](/pt/src/ranui/ssr/)       |
| Montar views reativas sem framework           | [Builder](/pt/src/ranui/builder/)                    |
| Ver o que mudou antes de atualizar            | [Registro de alterações](/pt/src/ranui/changelog)    |

## Suporte a navegadores

A biblioteca funciona em todos os navegadores modernos: ela é construída sobre Custom Elements v1,
Shadow DOM v1 e propriedades personalizadas de CSS. **O Internet Explorer não é suportado.**

![](../../../assets/ranui/customElements.png)

## Contribuidores

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Leitura adicional

Padrões sobre os quais esta biblioteca se apoia: [W3C](https://www.w3.org/) ·
[ECMA](https://www.ecma-international.org/) · [RFCs](https://www.rfc-editor.org/) ·
[Can I use](https://caniuse.com/)

Referências de design que vale manter à mão: [Checklist Design](https://www.checklist.design/) ·
[Laws of UX](https://lawsofux.com/) · [Geist](https://vercel.com/geist) ·
[Ant Design](https://ant.design/index-cn) · [Element UI](https://element.eleme.cn/#/zh-CN) ·
[Animista](https://animista.net/) · [WebGradients](https://webgradients.com/)
