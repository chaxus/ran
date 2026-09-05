---
description: 'Roteamento SPA no cliente com componentes declarativos, API de JS, guardas de navegação, View Transitions e transições entre documentos (MPA).'
---

# Router

Roteamento no cliente para aplicações de página única. Oferece componentes HTML declarativos e uma API de JavaScript com guardas de navegação, View Transitions e transições entre documentos (MPA).

> **Use quando** precisar de roteamento SPA no cliente com guardas de navegação, View Transitions e transições entre documentos (MPA). O `createRouter` junto de `<r-router>` / `<r-route>` / `<r-link>` deixa a navegação interna pronta.

## Início rápido

Um mini-aplicativo completo, com guarda de autenticação e transição SPA:

```js
import { createRouter } from 'ranui';

// 1. Cria o roteador com rotas protegidas e transições SPA
const router = createRouter({
  mode: 'history',
  viewTransition: 'spa',
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/about', meta: { title: 'About' } },
    { path: '/dashboard', meta: { title: 'Dashboard', requiresAuth: true } },
    { path: '/login', meta: { title: 'Login' } },
  ],
});

// 2. Guarda de autenticação — redireciona quem não entrou
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !sessionStorage.getItem('token')) {
    next('/login');
  } else {
    next();
  }
});

// 3. Atualiza o título da página e registra a analítica depois de cada navegação
router.afterEach((to) => {
  document.title = to.meta?.title ?? 'App';
});
router.onRouteChange((to) => {
  analytics.track(to.fullPath);
});
```

```html
<!-- Monta o roteador, acrescenta os links, declara as rotas -->
<r-router>
  <nav>
    <r-link href="/">Início</r-link>
    <r-link href="/about">Sobre</r-link>
    <r-link href="/dashboard">Painel</r-link>
  </nav>

  <r-route path="/" exact><h2>Início</h2></r-route>
  <r-route path="/about"><h2>Sobre</h2></r-route>
  <r-route path="/dashboard"><h2>Painel</h2></r-route>
  <r-route path="/login"><h2>Entrar</h2></r-route>
</r-router>
```

```css
/* Transição SPA — fusão cruzada entre rotas */
@keyframes fade-in {
  from {
    opacity: 0;
  }
}
@keyframes fade-out {
  to {
    opacity: 0;
  }
}

::view-transition-old(root) {
  animation: 200ms ease-out fade-out;
}
::view-transition-new(root) {
  animation: 200ms ease-in fade-in;
}
```

## Componentes

### `r-router`

O componente contêiner. Escuta `popstate` e sincroniza todos os `r-route` filhos a cada navegação.

#### Atributos

| Atributo | Tipo                  | Padrão      | Descrição                                         |
| -------- | --------------------- | ----------- | ------------------------------------------------- |
| `mode`   | `'history' \| 'hash'` | `'history'` | Modo da History API                               |
| `base`   | `string`              | `''`        | Prefixo de URL base removido de todos os caminhos |
| `sheet`  | `string`              | `''`        | CSS injetado no shadow DOM                        |

#### Eventos

| Evento        | Detail             | Descrição                                  |
| ------------- | ------------------ | ------------------------------------------ |
| `routechange` | `{ path: string }` | Dispara depois de cada atualização de rota |

### `r-route`

Mostra o conteúdo do slot quando o caminho atual casa com `path`; caso contrário, esconde.

#### Atributos

| Atributo | Tipo      | Padrão  | Descrição                                                                                            |
| -------- | --------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `path`   | `string`  | `'/'`   | Padrão a comparar. Aceita segmentos `:param` e o curinga `*`                                         |
| `exact`  | `boolean` | `false` | Exige correspondência exata (sem casar por prefixo)                                                  |
| `src`    | `string`  | `''`    | Especificador de módulo para montar e desmontar a página com carga sob demanda e separação de código |
| `sheet`  | `string`  | `''`    | CSS injetado no shadow DOM                                                                           |

#### Eventos

| Evento       | Detail             | Descrição                               |
| ------------ | ------------------ | --------------------------------------- |
| `routematch` | `{ path, params }` | Dispara quando esta rota se torna ativa |

#### Exemplos de padrões de caminho

```
/users            casa com /users, /users/42, /users/42/profile
/users (exact)    casa apenas com /users
/users/:id        captura :id → params.id
/*                casa com tudo
```

#### Montagem sob demanda `src`

Num aplicativo maior, de muitas páginas, o `r-route` pode separar o código de cada página em vez de sempre entregar de antemão o conteúdo do slot. Coloque em `src` um especificador de módulo; ao casar, o `r-route` faz um `import()` dinâmico e chama a exportação padrão dele — uma função do tipo `(host: HTMLElement) => void | (() => void)` — dentro de um escopo reativo, passando um elemento anfitrião onde desenhar. Sair da rota descarta esse escopo inteiro de uma vez (todo efeito, vínculo e `onCleanup` que a página registrou) e então remove o conteúdo desenhado; voltar à rota remonta a partir do módulo em cache, sem baixá-lo de novo.

```html
<r-route path="/settings" src="/pages/settings.js"></r-route>
```

```js
// pages/settings.js
export default function renderSettings(host) {
  host.textContent = 'Settings page';
  return () => {
    /* limpeza opcional, executada ao sair da rota */
  };
}
```

Este modo é só de cliente: durante SSR/SSG, uma rota sob demanda resolve apenas o estado de mostrar ou esconder, não o módulo da página.

### `r-link`

Um link de navegação. Evita o recarregamento completo da página para caminhos de mesma origem, chama `RouterCore.push/replace` se houver um roteador ativo e, caso contrário, despacha um evento `ran-navigate` árvore do DOM acima.

URLs externas (`http://`, `//`, `mailto:`, `tel:`) passam como links `<a>` comuns.

#### Atributos

| Atributo  | Tipo      | Padrão  | Descrição                                                 |
| --------- | --------- | ------- | --------------------------------------------------------- |
| `href`    | `string`  | `''`    | Caminho de destino                                        |
| `replace` | `boolean` | `false` | Substitui a entrada atual do histórico em vez de empilhar |
| `sheet`   | `string`  | `''`    | CSS injetado no shadow DOM                                |

```html
<r-link href="/about">Sobre</r-link>
<r-link href="/settings" replace>Configurações</r-link>
<r-link href="https://github.com">GitHub ↗</r-link>
```

#### Slots

Nem `r-router`, nem `r-route`, nem `r-link` expõem slot nomeado. Cada um desenha só o `<slot>` padrão (sem nome): `r-router` e `r-route` projetam as rotas filhas ou o conteúdo da rota como estão, e `r-link` projeta o que você puser dentro como conteúdo visível do link. Nenhum dos três define `::part()` também, então este grupo de componentes não tem seção de parts CSS.

## API de JavaScript

### `createRouter(config?)`

Cria e registra uma instância global de `RouterCore`. Chame uma vez na inicialização do aplicativo, antes de montar qualquer elemento `r-router`.

```js
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history', // 'history' (padrão) | 'hash'
  base: '/app', // remove o prefixo '/app' de todos os caminhos internos
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both' | false
});
```

#### Opções

| Opção            | Tipo                            | Padrão      | Descrição                                            |
| ---------------- | ------------------------------- | ----------- | ---------------------------------------------------- |
| `mode`           | `'history' \| 'hash'`           | `'history'` | Estratégia de URL                                    |
| `base`           | `string`                        | `''`        | Prefixo do caminho base                              |
| `routes`         | `RouteConfig[]`                 | `[]`        | Definições de rota com path, exact e meta            |
| `viewTransition` | `boolean \| ViewTransitionMode` | `false`     | Liga as View Transitions (`true` equivale a `'spa'`) |

### `RouterCore`

Todos os métodos de gancho devolvem uma **função para cancelar a inscrição**.

| Nome                     | Assinatura / Tipo                                       | Descrição                                                     |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------- |
| `push(path)`             | `(path: string) => Promise<void>`                       | Navega e acrescenta uma entrada ao histórico                  |
| `replace(path)`          | `(path: string) => Promise<void>`                       | Navega e substitui a entrada atual                            |
| `back()`                 | `() => void`                                            | `history.back()`                                              |
| `forward()`              | `() => void`                                            | `history.forward()`                                           |
| `go(delta)`              | `(delta: number) => void`                               | `history.go(delta)`                                           |
| `beforeEach(guard)`      | `(guard: NavigationGuard) => () => void`                | Registra uma guarda; roda antes de a navegação ser confirmada |
| `afterEach(handler)`     | `(handler: RouteChangeHandler) => () => void`           | Gancho pós-navegação; roda depois de o DOM ser atualizado     |
| `onRouteChange(handler)` | `(handler: RouteChangeHandler) => () => void`           | Assina toda mudança de rota                                   |
| `onPageSwap(handler)`    | `(handler: (e: PageSwapEvent) => void) => () => void`   | Evento `pageswap` entre documentos (só no modo MPA)           |
| `onPageReveal(handler)`  | `(handler: (e: PageRevealEvent) => void) => () => void` | Evento `pagereveal` entre documentos (só no modo MPA)         |
| `destroy()`              | `() => void`                                            | Remove todos os ouvintes e o CSS injetado                     |
| `currentRoute`           | `RouteLocation \| null`                                 | Objeto com a localização da rota atual                        |
| `mode`                   | `'history' \| 'hash'`                                   | Modo do histórico                                             |
| `base`                   | `string`                                                | Prefixo da URL base                                           |
| `routes`                 | `RouteConfig[]`                                         | Configurações de rota registradas                             |

```js
router.push('/users/42');
router.replace('/login');
router.back();
router.go(-2);
```

### `useRouter()`

Devolve a instância ativa de `RouterCore`, ou `null` se `createRouter` ainda não tiver sido chamado.

```js
import { useRouter } from 'ranui';

const router = useRouter();
router?.push('/about');
```

## Guardas de navegação

As guardas rodam na ordem em que foram registradas, antes de a navegação ser confirmada. Chame `next()` para permitir, `next(false)` para cancelar ou `next('/path')` para redirecionar.

```js
const unsubscribe = router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

// Para tirar a guarda mais tarde:
unsubscribe();
```

### Ganchos pós-navegação

`afterEach` e `onRouteChange` disparam os dois depois que o DOM é atualizado. Use `afterEach` para efeitos colaterais que dependam da navegação já concluída, e `onRouteChange` para assinaturas leves.

```js
router.afterEach((to, from) => {
  document.title = to.meta?.title ?? 'App';
});

router.onRouteChange((to, from) => {
  analytics.track(to.fullPath);
});
```

## View Transitions

Ligue transições animadas entre rotas usando a [View Transitions API](https://developer.mozilla.org/pt-BR/docs/Web/API/View_Transition_API) do navegador.

### Comparação

Escolha um modo antes de escrever qualquer CSS:

| Modo     | Chrome      | O que dispara                                             | Precisa de JS? |
| -------- | ----------- | --------------------------------------------------------- | -------------- |
| `'spa'`  | 111+        | `router.push()` ou um clique em `r-link`                  | Sim            |
| `'mpa'`  | 126+        | Qualquer link `<a>`, envio de formulário, `location.href` | Não            |
| `'both'` | 111+ / 126+ | Tudo acima                                                | Opcional       |

### SPA — transições dentro do mesmo documento

```js
const router = createRouter({ viewTransition: 'spa' }); // ou true
```

Cada chamada a `router.push()` / `router.replace()` embrulha a atualização do DOM em `document.startViewTransition()`. Degrada com elegância para uma atualização síncrona quando a API não existe (Chrome 111+).

Acrescente o CSS que define a animação:

```css
/* Fusão cruzada padrão */
@keyframes fade-in {
  from {
    opacity: 0;
  }
}
@keyframes fade-out {
  to {
    opacity: 0;
  }
}

::view-transition-old(root) {
  animation: 200ms ease-out fade-out;
}
::view-transition-new(root) {
  animation: 200ms ease-in fade-in;
}
```

### MPA — transições entre documentos

```js
const router = createRouter({ viewTransition: 'mpa' });
```

Injeta `@view-transition { navigation: auto }` no `<head>`, ligando transições automáticas em toda navegação de página inteira de mesma origem (Chrome 126+). Nenhum JavaScript é preciso em cada página.

Para aplicativos que não usam o roteador de jeito nenhum:

```js
import { enableMpaViewTransitions } from 'ranui';

const cleanup = enableMpaViewTransitions();
// cleanup() remove o <style> injetado, se preciso
```

**Eventos de ciclo de vida no MPA:**

```js
// pageswap dispara no documento que está saindo, antes de descarregar
router.onPageSwap((e) => {
  const type = e.activation?.navigationType; // 'push' | 'replace' | 'traverse'
  if (type === 'traverse') e.viewTransition?.skipTransition();
});

// pagereveal dispara no documento que entra, antes do primeiro desenho
router.onPageReveal((e) => {
  console.log('new page ready');
});
```

### SPA e MPA combinados

```js
const router = createRouter({ viewTransition: 'both' });
```

As navegações SPA usam `startViewTransition()`. As de página inteira usam a regra CSS `@view-transition`. Transições conduzidas por JS quando dá, com o CSS como reserva quando não dá.

## `view-transition-name` — transições de elemento compartilhado

`view-transition-name` anima um elemento específico entre duas páginas, em vez da janela inteira. O navegador captura a posição e o tamanho do elemento dos dois lados e anima entre eles. É o efeito do cartão que se abre na [demonstração de perfis do Chrome](https://view-transitions.chrome.dev/profiles/mpa/).

### Uso básico

Dê o mesmo nome ao "mesmo" elemento na página de origem e na de destino:

```html
<!-- Página de listagem -->
<div class="card" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <span>Jane Doe</span>
</div>
```

```html
<!-- Página de detalhe -->
<div class="profile-header" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <h1>Jane Doe</h1>
</div>
```

O navegador anima o cartão da posição dele na lista para a posição no detalhe, transformando um no outro.

### Nomes dinâmicos numa lista

`view-transition-name` precisa ser único dentro de cada página. Use o ID do item como parte do nome:

```css
/* Abordagem em CSS — uma regra por cartão */
.card[data-id='1'] {
  view-transition-name: card-1;
}
.card[data-id='42'] {
  view-transition-name: card-42;
}
```

```js
// Abordagem em JS — define o nome logo antes de navegar
function navigateToProfile(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  card.style.viewTransitionName = `profile-${id}`;
  router.push(`/profiles/${id}`);
}
```

Na página de destino, defina o nome correspondente antes do primeiro desenho:

```js
// Defina de imediato (de forma síncrona) para o navegador capturar
const id = router.currentRoute?.params.id;
document.querySelector('.profile-header').style.viewTransitionName = `profile-${id}`;
```

### Deslizamentos com direção

Combine uma guarda `beforeEach` com uma propriedade personalizada de CSS para produzir animações diferentes conforme o sentido da navegação:

```js
const pages = ['/', '/step-1', '/step-2', '/step-3'];

router.beforeEach((to, from, next) => {
  const toIdx = pages.indexOf(to.path);
  const fromIdx = pages.indexOf(from?.path ?? '');
  document.documentElement.dataset.navDir = toIdx >= fromIdx ? 'forward' : 'back';
  next();
});
```

```css
@keyframes slide-from-right {
  from {
    translate: 100% 0;
  }
}
@keyframes slide-from-left {
  from {
    translate: -100% 0;
  }
}
@keyframes slide-to-right {
  to {
    translate: 100% 0;
  }
}
@keyframes slide-to-left {
  to {
    translate: -100% 0;
  }
}

[data-nav-dir='forward']::view-transition-old(root) {
  animation: 300ms ease slide-to-left;
}
[data-nav-dir='forward']::view-transition-new(root) {
  animation: 300ms ease slide-from-right;
}
[data-nav-dir='back']::view-transition-old(root) {
  animation: 300ms ease slide-to-right;
}
[data-nav-dir='back']::view-transition-new(root) {
  animation: 300ms ease slide-from-left;
}
```

Para deixar um elemento de fora de uma transição, use `view-transition-name: none`. Para animar várias partes de forma independente, dê a cada uma um nome único; tudo que não tiver nome se funde pela transição da raiz.

## SSR / SSG

Todas as APIs de navegador (`window`, `history`, `document`) são protegidas por verificações `typeof`, então dá para chamar `createRouter` com segurança num ambiente SSR de Node ou Deno. Em contexto SSR, `push` e `replace` executam as guardas e atualizam `currentRoute`, mas pulam `history.pushState` / `history.replaceState`. Ouvintes de `popstate` nunca são registrados no servidor. Hidrate normalmente no cliente: chame `createRouter` de novo com a mesma configuração.

## Referência de tipos

```ts
interface RouteLocation {
  path: string; // ex.: '/users/42'
  params: Record<string, string>; // ex.: { id: '42' }
  query: Record<string, string>; // ex.: { tab: 'profile' }
  fullPath: string; // ex.: '/users/42?tab=profile'
}

type ViewTransitionMode = 'spa' | 'mpa' | 'both';

interface RouterConfig {
  mode?: 'history' | 'hash';
  base?: string;
  routes?: RouteConfig[];
  viewTransition?: boolean | ViewTransitionMode;
}

interface RouteConfig {
  path: string;
  exact?: boolean;
  meta?: Record<string, unknown>;
  children?: RouteConfig[];
}

type NavigationGuard = (
  to: RouteLocation,
  from: RouteLocation | null,
  next: (redirect?: string | false) => void,
) => void;

type RouteChangeHandler = (to: RouteLocation, from: RouteLocation | null) => void;
```
