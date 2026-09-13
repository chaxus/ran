# ranui

Uma biblioteca experimental de componentes de interface montada sobre Web Components. Cada componente é encapsulado em Shadow DOM, se veste por tokens CSS e aceita SSR e Declarative Shadow DOM.

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | **Português** | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## Antes de começar

Esta é uma **biblioteca experimental de interface** ainda no começo. Dá para usar, mas ela foi pensada sobretudo para aprender e experimentar.

O essencial:

- **No começo**: os recursos ainda estão sendo escritos e lapidados.
- **Experimental**: as APIs podem mudar com frequência.
- **Com o aprendizado em primeiro lugar**: serve principalmente para aprender Web Components e desenvolvimento de interfaces.

## O que ela traz

1. **Serve com qualquer framework:** funciona com React, Vue, Preact, SolidJS, Svelte e com qualquer projeto JavaScript que siga os padrões do W3C.
2. **Parecem nativos:** use elementos personalizados como `<r-button>` e `<r-modal>` do mesmo jeito que os elementos HTML de sempre.
3. **Desenho em módulos:** aceita tanto a importação inteira quanto a de um componente só, o que ajuda na manutenção e no controle do peso do pacote.
4. **Encapsulados em Shadow DOM:** as tripas de cada componente ficam isoladas por padrão, enquanto os tokens CSS, o `::part()` e o atributo `sheet` oferecem as portas previstas para dar estilo.
5. **Com TypeScript:** escrita em TypeScript, com as definições de tipos.
6. **Amiga do SSR:** aceita renderização no servidor por meio de `defineSSR`, `renderToString` e Declarative Shadow DOM.
7. **Acessível:** papéis e estados ARIA, navegação inteira pelo teclado, campos ligados a formulários (`<r-checkbox>`, `<r-input>` e `<r-select>` entram no `FormData` nativo), avisos em regiões vivas e respeito ao `prefers-reduced-motion`.

## Instalação

Com o npm:

```console
npm install ranui --save
```

## Documentação e exemplos

[Veja os componentes e seus exemplos de uso](https://ran.chaxus.com/pt/src/ranui/)

### Componentes e referência da API

De cada elemento, os atributos, as propriedades, os **eventos (com o formato do `detail`)**, os slots e os nomes de `::part()` são gerados a partir do código: não é preciso sair caçando as exportações.

- A API de cada elemento: [docs/COMPONENTS.md](./docs/COMPONENTS.md)
- O padrão de design (cor, espaçamento, tipografia, movimento, acessibilidade): [docs/DESIGN.md](./docs/DESIGN.md)

Depois de mudar a API de um componente, gere de novo com:

```bash
pnpm doc:api
```

A CI roda `pnpm run verify:docs` a partir da raiz do repositório, e falha assim que uma referência gerada deixa de bater com o código.

### Skill para IA e Claude Code

Há uma skill pronta para que assistentes de IA (Claude Code) leiam e usem o ranui sem precisar cavar o código. Ela é publicada no marketplace de plugins `ran`:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
```

Depois de instalada, o Claude a usa sozinho quando você mexe com o ranui (ou você a invoca com `/ranui:ranui`). Ela cobre o mapa de importações, o inventário de elementos, a API do builder e da reatividade, a acessibilidade e exemplos de uso, e aponta para a referência da API que vai dentro do pacote ([docs/COMPONENTS.md](./docs/COMPONENTS.md)).

### Documentação de estilos

O sistema de estilos gira todo em torno dos tokens CSS e do `::part()`.

- Guia para sobrescrever estilos: [docs/style-override.md](./docs/style-override.md)
- Lista completa de tokens e parts, gerada sozinha: [docs/style-tokens-parts.md](./docs/style-tokens-parts.md)
- A API pública de estilos, gerada sozinha: [docs/style-tokens-public.md](./docs/style-tokens-public.md)
- Configuração do filtro de tokens públicos: [docs/style-token-filter.json](./docs/style-token-filter.json)

Atualize a documentação de estilos com:

```bash
pnpm doc:style
```

### Temas

O ranui traz um único sistema de tokens, baseado no [sistema de design Geist](https://vercel.com/geist), a linguagem de design aberta da Vercel, em que a cor é uma **escada de estados**: cada escala vai de 100 a 1000 e cada degrau tem uma função só (fundo → hover → borda → preenchimento sólido → texto). O ranui adota essa escada junto com a **Geist Sans e a Geist Mono**, então o modo escuro apenas redefine a escala base e todos os tokens semânticos viram sozinhos. São três modos — `light`, `dark` e `system` — e nenhum pacote de temas. Troque o modo ou sobrescreva qualquer token em tempo de execução (seguro no SSR):

```ts
import { initTheme, setTheme, setThemeToken, setThemeTokens } from 'ranui/theme';
import 'ranui/style';

initTheme(); // ao carregar, recupera a escolha guardada
setTheme('system'); // 'light' | 'dark' | 'system'
setThemeToken('--ran-color-primary', '#6c47ff');
setThemeTokens({ '--ran-radius-md': '10px' });
```

A entrada `ranui/theme` traz só o motor de temas: não registra nenhum elemento personalizado, então não engorda o seu pacote se tudo o que você quer são os tokens e o modo escuro. Essas mesmas APIs também são reexportadas pelo barril `ranui`.

O modo escuro só redefine a escala base de cor; os tokens semânticos (`--ran-color-*`) apontam para ela e viram sozinhos. Veja [docs/THEME_STYLE_SYSTEM_DESIGN.md](./docs/THEME_STYLE_SYSTEM_DESIGN.md) e [docs/DESIGN.md](./docs/DESIGN.md).

### Internacionalização

O motor de i18n, que não depende de framework nenhum, vem na sua própria entrada `ranui/i18n`; como o `ranui/theme`, ele não registra nenhum elemento personalizado:

```ts
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // cada idioma é um dicionário plano: as chaves são usadas tal e qual, sem aninhar
  messages: { en: { 'hero.title': 'Hi {name}' }, zh: { 'hero.title': '你好 {name}' } },
  fallbackLocale: 'en',
  persist: true, // lembra a escolha no localStorage
  detectNavigatou então: true, // pega o idioma inicial do navegador
});

useI18n()!.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
useI18n()!.setLocale('zh'); // guarda e avisa quem estiver inscrito
```

O `t()` recorre primeiro ao idioma de reserva e depois à própria chave; os marcadores `{param}` são substituídos. O núcleo é seguro no SSR.

## Importações

Importe componente a componente para o pacote pesar menos:

```js
import 'ranui/button';
```

Os subcaminhos que não são componentes trazem os utilitários à parte, então dá para puxar só o motor de que você precisa sem registrar todos os elementos:

```js
import { initTheme } from 'ranui/theme'; // só os temas
import { createI18n } from 'ranui/i18n'; // só a i18n
```

Se os estilos não aparecerem, importe a folha na mão:

```js
import 'ranui/style';
```

Se a resolução de tipos falhar, importe na mão uma das entradas de tipos:

```ts
import 'ranui/typings';
// or
import 'ranui/dist/index.d.ts';
// or
import 'ranui/type';
// or
import 'ranui/dist/typings';
```

Basta uma que funcione.

A importação inteira também é aceita:

```ts
import 'ranui';
```

Módulo ES:

```js
import 'ranui';
```

ou então:

```js
import 'ranui/button';
```

UMD, IIFE, CJS:

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
```

### Sem empacotador (páginas estáticas ou CDN)

Escolha a distribuição conforme quantos componentes a página usa:

| Situação                               | A melhor opção                                  | Por quê                                                                           |
| -------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------- |
| Um ou dois componentes, uma tag script | IIFE por componente: `dist/iife/<name>.iife.js` | Se basta sozinho e não precisa de sintaxe de módulos                              |
| Vários componentes                     | Módulos ES por componente: `dist/<name>.js`     | O grafo de módulos do navegador tira as cópias repetidas do runtime compartilhado |
| Tudo                                   | O pacote inteiro: `dist/index.iife.js`          | Um arquivo só, com todos os componentes registrados                               |
| Um projeto com empacotador             | Importações do npm: `import 'ranui/<name>'`     | O que não se usa é podado e o runtime é um só                                     |

IIFE por componente: uma tag e nenhum passo de compilação.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/select.iife.js" defer></script>
```

Cada IIFE carrega dentro de si as próprias dependências internas (o `select`, por exemplo, inclui o `icon`); o registro dos elementos é protegido, então carregar vários arquivos que dividem dependências não dá problema, mas cada arquivo traz a sua própria cópia do runtime compartilhado. Quando a página precisa de vários componentes, prefira os módulos ES, que dividem esse runtime:

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/button.js';
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/select.js';
</script>
```

## Uso

Os componentes do RanUI são Web Components, então dá para usá-los sem invólucros de nenhum framework.

Na maior parte das vezes, escreva-os como os elementos HTML de sempre.

Exemplos:

- html
- js
- jsx
- vue
- tsx

### html

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>

<body>
  <r-button>Button</r-button>
</body>
```

### js

```js
import 'ranui';

const Button = document.createElement('r-button');
Button.textContent = 'this is button text';
document.body.appendChild(Button);
```

### jsx

```jsx
import 'ranui';

const App = () => {
  return (
    <>
      <r-button>Button</r-button>
    </>
  );
};
```

### vue

```vue
<template>
  <r-button></r-button>
</template>
<script>
import 'ranui';
</script>
```

### tsx

```tsx
import 'ranui/button';

const Button = () => {
  return (
    <div>
      <r-button type="primary">button</r-button>
    </div>
  );
};
```

### Posição e contêiner das mensagens

O `window.message` aceita um deslocamento próprio a partir do topo, um z-index e o contêiner onde se montar:

```ts
import 'ranui/message';

const customRoot = document.getElementById('custom-message-root');

window.message?.success({
  content: 'Saved',
  duration: 2000,
  top: 24,
  zIndex: 3000,
  getContainer: () => customRoot,
});
```

O `top` aceita `number` ou `string`; `24` vira `24px`, enquanto `'2rem'` guarda a unidade.

O `zIndex` aceita `number` ou `string`.

O `getContainer` precisa devolver um `HTMLElement`; se for omitido, as mensagens se montam no `document.body`.

### Peças reativas

`signal`, `createEffect`, `computed`, `batch`, `untrack` e uma camada de posse (`createRoot`, `onCleanup`, `getOwner`, `runWithOwner`) vêm ao lado do builder do DOM, para montar pedaços reativos de página sem framework. O desenho se espelha no `@Observable` do SwiftUI com as garantias do Solid.js: os efeitos limpam sozinhos as inscrições velhas antes de rodar de novo; o `batch()` junta várias escritas num único repinte; o `computed` é **preguiçoso e memoriza por valor** (um memo que ninguém lê nunca é calculado, e ele só acorda quem depende dele quando o valor muda de verdade); e cada efeito, memo e ligação pertence ao seu escopo, de modo que descartar um `createRoot` desmonta numa só chamada tudo o que nasceu dentro dele: a unidade com que se fecha uma página ou uma rota. Os encadeáveis do `ElementBuilder` (`text`, `attr`, `class`, …) também aceitam um getter de sinal, e a ligação se atualiza sozinha. Guia completo: [`ranview`](../ranview/README.md).

```ts
import { signal, createEffect, computed, batch, EventManager, Div, ButtonBuilder } from 'ranui/builder';

function initCounter(container: HTMLElement) {
  const [count, setCount] = signal(0);
  const [step, setStep] = signal(1);
  const doubled = computed(() => count() * 2);
  const scope = new EventManager();

  const label = Div().build();
  const view = Div()
    .children(
      label,
      ButtonBuilder()
        .text('+')
        .listen(scope, 'click', () => setCount((n) => n + step())),
      ButtonBuilder()
        .text('reset')
        .listen(
          scope,
          'click',
          () =>
            batch(() => {
              setCount(0);
              setStep(1);
            }), // duas escritas, um repinte só
        ),
    )
    .build();

  const dispose = createEffect(() => {
    label.textContent = `${count()} (×2 = ${doubled()})`;
  });

  container.appendChild(view);
  return () => {
    dispose();
    scope.abort();
  }; // desmontagem
}
```

A API completa está na [documentação dos utilitários](./utils/README.md).

### Roteamento

O RanUI traz roteamento no cliente, com componentes declarativos e uma API de JavaScript.

**Componentes declarativos:**

```html
<r-router>
  <nav>
    <r-link href="/">Home</r-link>
    <r-link href="/about">About</r-link>
  </nav>

  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/users/:id"><h2>User detail</h2></r-route>
</r-router>
```

**API de JavaScript com guarda de navegação:**

```ts
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history',
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both'
});

router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) next('/login');
  else next();
});

router.push('/users/42');
```

Em sites MPA puros, onde não é preciso um roteador em JS, chame `enableMpaViewTransitions()` para injetar `@view-transition { navigation: auto }`. As animações em que um elemento se transforma de uma página para outra se escrevem com a propriedade CSS padrão `view-transition-name`.

```ts
import { enableMpaViewTransitions } from 'ranui';
enableMpaViewTransitions();
```

A API completa — guardas, `onPageSwap` e `onPageReveal`, e os nomes de transição por elemento — está na [documentação do roteador](https://ran.chaxus.com/pt/src/ranui/router/).

### SSR e builder

Para o SSR e para montar a interface de forma declarativa, o RanUI usa por dentro o `builder`, o registro de SSR e o Declarative Shadow DOM. Os componentes reaproveitam um Shadow Root já existente por meio do `ensureShadowRoot` e montam a sua árvore no construtor. A árvore que o servidor desenha serve para o primeiro quadro e depois é trocada: os componentes prendem um shadow root **fechado**, e o `attachShadow` apaga os filhos de um declarativo, então o cliente sempre remonta.

Exemplo de renderização SSR no nível do código:

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const button = new Button();
button.setAttribute('effect', 'true');

// Devolve uma string HTML que contém Declarative Shadow DOM.
const html = renderToString(button);
```

Os detalhes estão na [documentação dos utilitários](./utils/README.md).

## Convenções para escrever componentes

Ao acrescentar ou manter componentes, siga as convenções do pacote:

- Estenda o `RanElement`; não estenda diretamente o `HTMLElement` do navegador.
- Crie ou reaproveite os Shadow Roots com o `ensureShadowRoot`; não chame `attachShadow` na mão.
- Monte a subárvore do Shadow DOM no construtor e em nenhum outro lugar.
- Guarde os elementos com `.ref()` enquanto os cria e recupere-os com o `shadowPart`; nunca use `querySelector` para algo que o próprio componente construiu.
- Inclua `sheet` em `observedAttributes` e aplique as sobrescritas de estilo do componente por meio do `syncSheetAttribute`.
- Proteja o `attributeChangedCallback` com `if (old === next) return;`.
- Registre os componentes com `defineSSR('r-name', Component)`, e não chamando `customElements.define` diretamente.
- Acrescente no `index.ts` tanto as exportações de tipos quanto as importações com efeito colateral; acrescente também as entradas avulsas no `vite.config.ts` e no `package.json`.
- Para os ouvintes presos ao ciclo de vida no `connectedCallback`, use o `EventManager` de `@/utils/builder`; chame `manager.abort()` no `disconnectedCallback` em vez de ficar rastreando cada `removeEventListener`.

## Como contribuir

Toda contribuição é bem-vinda, você venha aprender ou programar. É um projeto experimental, então conte com mudanças frequentes.

## Quem contribuiu

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Diversos

[Licença (MIT)](/LICENSE)
