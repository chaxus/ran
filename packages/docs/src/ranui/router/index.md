# Router

Client-side routing for Single Page Applications. Provides declarative HTML components and a JavaScript API with navigation guards, View Transitions, and cross-document (MPA) support.

## Quick Start

A complete mini-app with authentication guard and SPA transition:

```js
import { createRouter } from 'ranui';

// 1. Create the router with auth-protected routes and SPA transitions
const router = createRouter({
  mode: 'history',
  viewTransition: 'spa',
  routes: [
    { path: '/',        exact: true, meta: { title: 'Home' } },
    { path: '/about',               meta: { title: 'About' } },
    { path: '/dashboard',           meta: { title: 'Dashboard', requiresAuth: true } },
    { path: '/login',               meta: { title: 'Login' } },
  ],
});

// 2. Auth guard — redirect unauthenticated users
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !sessionStorage.getItem('token')) {
    next('/login');
  } else {
    next();
  }
});

// 3. Update page title and track analytics after each navigation
router.afterEach((to) => {
  document.title = to.meta?.title ?? 'App';
});
router.onRouteChange((to) => {
  analytics.track(to.fullPath);
});
```

```html
<!-- Mount the router, add navigation links, declare routes -->
<r-router>
  <nav>
    <r-link href="/">Home</r-link>
    <r-link href="/about">About</r-link>
    <r-link href="/dashboard">Dashboard</r-link>
  </nav>

  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/dashboard"><h2>Dashboard</h2></r-route>
  <r-route path="/login"><h2>Login</h2></r-route>
</r-router>
```

```css
/* SPA transition — cross-fade between routes */
@keyframes fade-in  { from { opacity: 0; } }
@keyframes fade-out { to   { opacity: 0; } }

::view-transition-old(root) { animation: 200ms ease-out fade-out; }
::view-transition-new(root) { animation: 200ms ease-in  fade-in; }
```

## Components

### `r-router`

Container component. Listens to `popstate` and syncs all child `r-route` elements on every navigation.

#### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'history' \| 'hash'` | `'history'` | History API mode |
| `base` | `string` | `''` | Base URL prefix stripped from all paths |
| `sheet` | `string` | `''` | CSS injected into the shadow DOM |

#### Events

| Event | Detail | Description |
| --- | --- | --- |
| `routechange` | `{ path: string }` | Fires after every route update |

### `r-route`

Shows its slotted content when the current path matches `path`; hides it otherwise.

#### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `path` | `string` | `'/'` | Pattern to match. Supports `:param` segments and `*` wildcard |
| `exact` | `boolean` | `false` | Require an exact match (no prefix matching) |
| `sheet` | `string` | `''` | CSS injected into the shadow DOM |

#### Events

| Event | Detail | Description |
| --- | --- | --- |
| `routematch` | `{ path, params }` | Fires when this route becomes active |

#### Path pattern examples

```
/users            matches /users, /users/42, /users/42/profile
/users (exact)    matches only /users
/users/:id        captures :id → params.id
/*                matches everything
```

### `r-link`

A navigation link. Prevents full-page reload for same-origin paths, calls `RouterCore.push/replace` if a router is active, otherwise dispatches a `ran-navigate` event up the DOM tree.

External URLs (`http://`, `//`, `mailto:`, `tel:`) pass through as normal `<a>` links.

#### Attributes

| Attribute | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | `''` | Target path |
| `replace` | `boolean` | `false` | Replace the current history entry instead of pushing |
| `sheet` | `string` | `''` | CSS injected into the shadow DOM |

```html
<r-link href="/about">About</r-link>
<r-link href="/settings" replace>Settings</r-link>
<r-link href="https://github.com">GitHub ↗</r-link>
```

## JavaScript API

### `createRouter(config?)`

Creates and registers a global `RouterCore` instance. Call once at app startup before mounting any `r-router` element.

```js
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history',       // 'history' (default) | 'hash'
  base: '/app',          // strip '/app' prefix from all internal paths
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both' | false
});
```

#### Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'history' \| 'hash'` | `'history'` | URL strategy |
| `base` | `string` | `''` | Base path prefix |
| `routes` | `RouteConfig[]` | `[]` | Route definitions with path, exact, and meta |
| `viewTransition` | `boolean \| ViewTransitionMode` | `false` | Enable View Transitions (`true` equals `'spa'`) |

### `RouterCore`

All hook methods return an **unsubscribe function**.

| Name | Signature / Type | Description |
| --- | --- | --- |
| `push(path)` | `(path: string) => Promise<void>` | Navigate and add a new history entry |
| `replace(path)` | `(path: string) => Promise<void>` | Navigate and replace the current entry |
| `back()` | `() => void` | `history.back()` |
| `forward()` | `() => void` | `history.forward()` |
| `go(delta)` | `(delta: number) => void` | `history.go(delta)` |
| `beforeEach(guard)` | `(guard: NavigationGuard) => () => void` | Register a navigation guard; runs before navigation commits |
| `afterEach(handler)` | `(handler: RouteChangeHandler) => () => void` | Post-navigation hook; runs after DOM is updated |
| `onRouteChange(handler)` | `(handler: RouteChangeHandler) => () => void` | Subscribe to every route change |
| `onPageSwap(handler)` | `(handler: (e: PageSwapEvent) => void) => () => void` | Cross-document `pageswap` event — MPA mode only |
| `onPageReveal(handler)` | `(handler: (e: PageRevealEvent) => void) => () => void` | Cross-document `pagereveal` event — MPA mode only |
| `destroy()` | `() => void` | Remove all listeners and injected CSS |
| `currentRoute` | `RouteLocation \| null` | Current route location object |
| `mode` | `'history' \| 'hash'` | History mode |
| `base` | `string` | Base URL prefix |
| `routes` | `RouteConfig[]` | Registered route configs |

```js
router.push('/users/42');
router.replace('/login');
router.back();
router.go(-2);
```

### `useRouter()`

Returns the active `RouterCore` instance, or `null` if `createRouter` has not been called.

```js
import { useRouter } from 'ranui';

const router = useRouter();
router?.push('/about');
```

## Navigation Guards

Guards run in registration order before navigation commits. Call `next()` to allow, `next(false)` to cancel, or `next('/path')` to redirect.

```js
const unsubscribe = router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

// Remove the guard later:
unsubscribe();
```

### Post-navigation hooks

`afterEach` and `onRouteChange` both fire after the DOM updates. Use `afterEach` for side effects that depend on the completed navigation, and `onRouteChange` for lightweight subscriptions.

```js
router.afterEach((to, from) => {
  document.title = to.meta?.title ?? 'App';
});

router.onRouteChange((to, from) => {
  analytics.track(to.fullPath);
});
```

## View Transitions

Enable animated route transitions using the browser's [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API).

### Comparison

Pick a mode before writing any CSS:

| Mode | Chrome | Trigger | JS needed |
| --- | --- | --- | --- |
| `'spa'` | 111+ | `router.push()` / `r-link` click | Yes |
| `'mpa'` | 126+ | Any `<a>` link, form submit, `location.href` | No |
| `'both'` | 111+ / 126+ | All of the above | Optional |

### SPA — same-document transitions

```js
const router = createRouter({ viewTransition: 'spa' }); // or true
```

Each call to `router.push()` / `router.replace()` wraps the DOM update in `document.startViewTransition()`. Gracefully degrades to a synchronous update when the API is not supported (Chrome 111+).

Add CSS to define the animation:

```css
/* Default cross-fade */
@keyframes fade-in  { from { opacity: 0; } }
@keyframes fade-out { to   { opacity: 0; } }

::view-transition-old(root) { animation: 200ms ease-out fade-out; }
::view-transition-new(root) { animation: 200ms ease-in  fade-in; }
```

### MPA — cross-document transitions

```js
const router = createRouter({ viewTransition: 'mpa' });
```

Injects `@view-transition { navigation: auto }` into `<head>`, enabling automatic transitions on every same-origin full-page navigation (Chrome 126+). No JavaScript is needed on each page.

For apps that don't use the router at all:

```js
import { enableMpaViewTransitions } from 'ranui';

const cleanup = enableMpaViewTransitions();
// cleanup() removes the injected <style> if needed
```

**MPA lifecycle events:**

```js
// pageswap fires on the outgoing document before unload
router.onPageSwap((e) => {
  const type = e.activation?.navigationType; // 'push' | 'replace' | 'traverse'
  if (type === 'traverse') e.viewTransition?.skipTransition();
});

// pagereveal fires on the incoming document before first render
router.onPageReveal((e) => {
  console.log('new page ready');
});
```

### SPA + MPA combined

```js
const router = createRouter({ viewTransition: 'both' });
```

SPA navigations use `startViewTransition()`. Full-page navigations use the CSS `@view-transition` rule. JS-driven transitions when available, CSS fallback otherwise.

## `view-transition-name` — Shared Element Transitions

`view-transition-name` animates a specific element between two pages rather than the whole viewport. The browser captures the element's position and size on both sides and animates between them — this is the card-flyout effect in the [Chrome Profiles demo](https://view-transitions.chrome.dev/profiles/mpa/).

### Basic usage

Assign the same name to the "same" element on the origin and destination page:

```html
<!-- List page -->
<div class="card" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <span>Jane Doe</span>
</div>
```

```html
<!-- Detail page -->
<div class="profile-header" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <h1>Jane Doe</h1>
</div>
```

The browser automatically animates the card from its list position to its detail position with a morph transition.

### Dynamic names in a list

`view-transition-name` must be unique per page. Use the item ID as part of the name:

```css
/* CSS approach — one rule per card */
.card[data-id="1"]  { view-transition-name: card-1; }
.card[data-id="42"] { view-transition-name: card-42; }
```

```js
// JS approach — set the name dynamically before navigating
function navigateToProfile(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  card.style.viewTransitionName = `profile-${id}`;
  router.push(`/profiles/${id}`);
}
```

On the destination page, set the matching name before first paint:

```js
// Set immediately (synchronously) so the browser captures it
const id = router.currentRoute?.params.id;
document.querySelector('.profile-header').style.viewTransitionName = `profile-${id}`;
```

### Directional slide transitions

Combine a `beforeEach` guard with a CSS custom property to produce different animations per navigation direction:

```js
const pages = ['/', '/step-1', '/step-2', '/step-3'];

router.beforeEach((to, from, next) => {
  const toIdx   = pages.indexOf(to.path);
  const fromIdx = pages.indexOf(from?.path ?? '');
  document.documentElement.dataset.navDir =
    toIdx >= fromIdx ? 'forward' : 'back';
  next();
});
```

```css
@keyframes slide-from-right { from { translate: 100% 0; } }
@keyframes slide-from-left  { from { translate: -100% 0; } }
@keyframes slide-to-right   { to   { translate: 100% 0; } }
@keyframes slide-to-left    { to   { translate: -100% 0; } }

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

To exclude an element from a transition use `view-transition-name: none`. To animate multiple parts independently, assign each a unique name — everything without a name fades via the root transition.

## SSR / SSG

All browser APIs (`window`, `history`, `document`) are guarded with `typeof` checks, so `createRouter` is safe to call in a Node/Deno SSR environment. In SSR context, `push` and `replace` run navigation guards and update `currentRoute` but skip `history.pushState` / `history.replaceState`. `popstate` listeners are never registered server-side. Hydrate normally on the client — call `createRouter` again with the same config.

## Type Reference

```ts
interface RouteLocation {
  path: string;                    // e.g. '/users/42'
  params: Record<string, string>;  // e.g. { id: '42' }
  query: Record<string, string>;   // e.g. { tab: 'profile' }
  fullPath: string;                // e.g. '/users/42?tab=profile'
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
