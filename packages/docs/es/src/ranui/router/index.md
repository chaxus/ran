---
description: 'Enrutado SPA en el cliente con componentes declarativos, API de JS, guardas de navegación, View Transitions y transiciones entre documentos (MPA).'
---

# Router

Enrutado en el cliente para aplicaciones de una sola página. Ofrece componentes HTML declarativos y una API de JavaScript con guardas de navegación, View Transitions y transiciones entre documentos (MPA).

> **Úsalo cuando** necesites enrutado SPA en el cliente con guardas de navegación, View Transitions y transiciones entre documentos (MPA). `createRouter` junto con `<r-router>` / `<r-route>` / `<r-link>` deja lista la navegación dentro de la aplicación.

## Inicio rápido

Una miniaplicación completa, con guarda de autenticación y transición SPA:

```js
import { createRouter } from 'ranui';

// 1. Crea el router con rutas protegidas y transiciones SPA
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

// 2. Guarda de autenticación: redirige a quien no ha iniciado sesión
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !sessionStorage.getItem('token')) {
    next('/login');
  } else {
    next();
  }
});

// 3. Actualiza el título de la página y registra la analítica tras cada navegación
router.afterEach((to) => {
  document.title = to.meta?.title ?? 'App';
});
router.onRouteChange((to) => {
  analytics.track(to.fullPath);
});
```

```html
<!-- Monta el router, añade los enlaces, declara las rutas -->
<r-router>
  <nav>
    <r-link href="/">Inicio</r-link>
    <r-link href="/about">Acerca de</r-link>
    <r-link href="/dashboard">Panel</r-link>
  </nav>

  <r-route path="/" exact><h2>Inicio</h2></r-route>
  <r-route path="/about"><h2>Acerca de</h2></r-route>
  <r-route path="/dashboard"><h2>Panel</h2></r-route>
  <r-route path="/login"><h2>Iniciar sesión</h2></r-route>
</r-router>
```

```css
/* Transición SPA: fundido cruzado entre rutas */
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

El componente contenedor. Escucha `popstate` y sincroniza todos los `r-route` hijos en cada navegación.

#### Atributos

| Atributo | Tipo                  | Por defecto | Descripción                                         |
| -------- | --------------------- | ----------- | --------------------------------------------------- |
| `mode`   | `'history' \| 'hash'` | `'history'` | Modo de la History API                              |
| `base`   | `string`              | `''`        | Prefijo de URL base que se quita de todas las rutas |
| `sheet`  | `string`              | `''`        | CSS inyectado en el shadow DOM                      |

#### Eventos

| Evento        | Detalle            | Descripción                                |
| ------------- | ------------------ | ------------------------------------------ |
| `routechange` | `{ path: string }` | Se dispara tras cada actualización de ruta |

### `r-route`

Muestra el contenido de su slot cuando la ruta actual coincide con `path`; en caso contrario lo oculta.

#### Atributos

| Atributo | Tipo      | Por defecto | Descripción                                                                                       |
| -------- | --------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `path`   | `string`  | `'/'`       | Patrón a comparar. Admite segmentos `:param` y el comodín `*`                                     |
| `exact`  | `boolean` | `false`     | Exige coincidencia exacta (sin coincidencia por prefijo)                                          |
| `src`    | `string`  | `''`        | Especificador de módulo para montar y desmontar la página con carga diferida y división de código |
| `sheet`  | `string`  | `''`        | CSS inyectado en el shadow DOM                                                                    |

#### Eventos

| Evento       | Detalle            | Descripción                                     |
| ------------ | ------------------ | ----------------------------------------------- |
| `routematch` | `{ path, params }` | Se dispara cuando esta ruta pasa a estar activa |

#### Ejemplos de patrones de ruta

```
/users            coincide con /users, /users/42, /users/42/profile
/users (exact)    coincide solo con /users
/users/:id        captura :id → params.id
/*                coincide con todo
```

#### Montaje diferido `src`

En una aplicación grande de varias páginas, `r-route` puede dividir el código por página en vez de entregar siempre por delante el contenido de su slot. Pon en `src` un especificador de módulo; al coincidir, `r-route` lo importa dinámicamente con `import()` y llama a su exportación por defecto —una función de tipo `(host: HTMLElement) => void | (() => void)`— dentro de un ámbito reactivo, pasándole un elemento anfitrión donde dibujar. Al dejar la ruta se desecha ese ámbito entero de una sola vez (todos los efectos, enlaces y `onCleanup` que la página registró) y luego se retira el contenido dibujado; al volver, se vuelve a montar desde el módulo en caché, sin descargarlo otra vez.

```html
<r-route path="/settings" src="/pages/settings.js"></r-route>
```

```js
// pages/settings.js
export default function renderSettings(host) {
  host.textContent = 'Settings page';
  return () => {
    /* limpieza opcional, se ejecuta al dejar la ruta */
  };
}
```

Este modo es solo de cliente: durante el SSR/SSG, una ruta diferida solo resuelve si se muestra o se oculta, no el módulo de la página.

### `r-link`

Un enlace de navegación. Evita la recarga completa de la página para rutas del mismo origen, llama a `RouterCore.push/replace` si hay un router activo y, si no, despacha un evento `ran-navigate` hacia arriba en el árbol del DOM.

Las URL externas (`http://`, `//`, `mailto:`, `tel:`) pasan como enlaces `<a>` normales.

#### Atributos

| Atributo  | Tipo      | Por defecto | Descripción                                                  |
| --------- | --------- | ----------- | ------------------------------------------------------------ |
| `href`    | `string`  | `''`        | Ruta de destino                                              |
| `replace` | `boolean` | `false`     | Reemplaza la entrada actual del historial en vez de apilarla |
| `sheet`   | `string`  | `''`        | CSS inyectado en el shadow DOM                               |

```html
<r-link href="/about">Acerca de</r-link>
<r-link href="/settings" replace>Ajustes</r-link>
<r-link href="https://github.com">GitHub ↗</r-link>
```

#### Slots

Ni `r-router`, ni `r-route`, ni `r-link` exponen un slot con nombre. Cada uno dibuja solo el `<slot>` por defecto (sin nombre): `r-router` y `r-route` proyectan tal cual sus rutas hijas o el contenido de la ruta, y `r-link` proyecta lo que pongas dentro como contenido visible del enlace. Ninguno de los tres define un `::part()`, así que este grupo de componentes no tiene sección de parts CSS.

## API de JavaScript

### `createRouter(config?)`

Crea y registra una instancia global de `RouterCore`. Llámalo una vez al arrancar la aplicación, antes de montar cualquier elemento `r-router`.

```js
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history', // 'history' (por defecto) | 'hash'
  base: '/app', // quita el prefijo '/app' de todas las rutas internas
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both' | false
});
```

#### Opciones

| Opción           | Tipo                            | Por defecto | Descripción                                             |
| ---------------- | ------------------------------- | ----------- | ------------------------------------------------------- |
| `mode`           | `'history' \| 'hash'`           | `'history'` | Estrategia de URL                                       |
| `base`           | `string`                        | `''`        | Prefijo de la ruta base                                 |
| `routes`         | `RouteConfig[]`                 | `[]`        | Definiciones de ruta con path, exact y meta             |
| `viewTransition` | `boolean \| ViewTransitionMode` | `false`     | Activa las View Transitions (`true` equivale a `'spa'`) |

### `RouterCore`

Todos los métodos de enganche devuelven una **función para darse de baja**.

| Nombre                   | Firma / Tipo                                            | Descripción                                                      |
| ------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------- |
| `push(path)`             | `(path: string) => Promise<void>`                       | Navega y añade una entrada al historial                          |
| `replace(path)`          | `(path: string) => Promise<void>`                       | Navega y reemplaza la entrada actual                             |
| `back()`                 | `() => void`                                            | `history.back()`                                                 |
| `forward()`              | `() => void`                                            | `history.forward()`                                              |
| `go(delta)`              | `(delta: number) => void`                               | `history.go(delta)`                                              |
| `beforeEach(guard)`      | `(guard: NavigationGuard) => () => void`                | Registra una guarda; se ejecuta antes de confirmar la navegación |
| `afterEach(handler)`     | `(handler: RouteChangeHandler) => () => void`           | Enganche posterior; se ejecuta después de actualizar el DOM      |
| `onRouteChange(handler)` | `(handler: RouteChangeHandler) => () => void`           | Se suscribe a cada cambio de ruta                                |
| `onPageSwap(handler)`    | `(handler: (e: PageSwapEvent) => void) => () => void`   | Evento `pageswap` entre documentos (solo en modo MPA)            |
| `onPageReveal(handler)`  | `(handler: (e: PageRevealEvent) => void) => () => void` | Evento `pagereveal` entre documentos (solo en modo MPA)          |
| `destroy()`              | `() => void`                                            | Retira todos los escuchadores y el CSS inyectado                 |
| `currentRoute`           | `RouteLocation \| null`                                 | Objeto con la ubicación de la ruta actual                        |
| `mode`                   | `'history' \| 'hash'`                                   | Modo del historial                                               |
| `base`                   | `string`                                                | Prefijo de la URL base                                           |
| `routes`                 | `RouteConfig[]`                                         | Configuraciones de ruta registradas                              |

```js
router.push('/users/42');
router.replace('/login');
router.back();
router.go(-2);
```

### `useRouter()`

Devuelve la instancia activa de `RouterCore`, o `null` si aún no se ha llamado a `createRouter`.

```js
import { useRouter } from 'ranui';

const router = useRouter();
router?.push('/about');
```

## Guardas de navegación

Las guardas se ejecutan en el orden en que se registraron, antes de confirmar la navegación. Llama a `next()` para permitirla, `next(false)` para cancelarla o `next('/path')` para redirigir.

```js
const unsubscribe = router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

// Para retirar la guarda más adelante:
unsubscribe();
```

### Enganches posteriores a la navegación

`afterEach` y `onRouteChange` se disparan los dos después de que el DOM se actualiza. Usa `afterEach` para efectos secundarios que dependan de la navegación ya completada, y `onRouteChange` para suscripciones ligeras.

```js
router.afterEach((to, from) => {
  document.title = to.meta?.title ?? 'App';
});

router.onRouteChange((to, from) => {
  analytics.track(to.fullPath);
});
```

## View Transitions

Activa transiciones animadas entre rutas usando la [View Transitions API](https://developer.mozilla.org/es/docs/Web/API/View_Transition_API) del navegador.

### Comparación

Elige un modo antes de escribir nada de CSS:

| Modo     | Chrome      | Qué la dispara                                               | ¿Hace falta JS? |
| -------- | ----------- | ------------------------------------------------------------ | --------------- |
| `'spa'`  | 111+        | `router.push()` o un clic en `r-link`                        | Sí              |
| `'mpa'`  | 126+        | Cualquier enlace `<a>`, envío de formulario, `location.href` | No              |
| `'both'` | 111+ / 126+ | Todo lo anterior                                             | Opcional        |

### SPA — transiciones dentro del mismo documento

```js
const router = createRouter({ viewTransition: 'spa' }); // o true
```

Cada llamada a `router.push()` / `router.replace()` envuelve la actualización del DOM en `document.startViewTransition()`. Degrada con elegancia a una actualización síncrona cuando la API no está disponible (Chrome 111+).

Añade el CSS que define la animación:

```css
/* Fundido cruzado por defecto */
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

### MPA — transiciones entre documentos

```js
const router = createRouter({ viewTransition: 'mpa' });
```

Inyecta `@view-transition { navigation: auto }` en el `<head>`, lo que activa transiciones automáticas en cada navegación de página completa del mismo origen (Chrome 126+). No hace falta JavaScript en cada página.

Para aplicaciones que no usan el router en absoluto:

```js
import { enableMpaViewTransitions } from 'ranui';

const cleanup = enableMpaViewTransitions();
// cleanup() retira el <style> inyectado si hace falta
```

**Eventos del ciclo de vida en MPA:**

```js
// pageswap se dispara en el documento que se va, antes de descargarlo
router.onPageSwap((e) => {
  const type = e.activation?.navigationType; // 'push' | 'replace' | 'traverse'
  if (type === 'traverse') e.viewTransition?.skipTransition();
});

// pagereveal se dispara en el documento entrante, antes del primer dibujado
router.onPageReveal((e) => {
  console.log('new page ready');
});
```

### SPA y MPA combinados

```js
const router = createRouter({ viewTransition: 'both' });
```

Las navegaciones SPA usan `startViewTransition()`. Las de página completa usan la regla CSS `@view-transition`. Transiciones guiadas por JS cuando se puede, y el CSS como respaldo cuando no.

## `view-transition-name` — transiciones de elemento compartido

`view-transition-name` anima un elemento concreto entre dos páginas en vez de toda la ventana. El navegador captura la posición y el tamaño del elemento a ambos lados y anima entre ellos. Es el efecto de la tarjeta que se despliega en la [demo de perfiles de Chrome](https://view-transitions.chrome.dev/profiles/mpa/).

### Uso básico

Asigna el mismo nombre al «mismo» elemento en la página de origen y en la de destino:

```html
<!-- Página de listado -->
<div class="card" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <span>Jane Doe</span>
</div>
```

```html
<!-- Página de detalle -->
<div class="profile-header" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <h1>Jane Doe</h1>
</div>
```

El navegador anima la tarjeta de su posición en el listado a su posición en el detalle con una transición que la transforma.

### Nombres dinámicos en una lista

`view-transition-name` debe ser único dentro de cada página. Usa el ID del elemento como parte del nombre:

```css
/* Enfoque en CSS: una regla por tarjeta */
.card[data-id='1'] {
  view-transition-name: card-1;
}
.card[data-id='42'] {
  view-transition-name: card-42;
}
```

```js
// Enfoque en JS: fija el nombre justo antes de navegar
function navigateToProfile(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  card.style.viewTransitionName = `profile-${id}`;
  router.push(`/profiles/${id}`);
}
```

En la página de destino, pon el nombre correspondiente antes del primer dibujado:

```js
// Fíjalo de inmediato (de forma síncrona) para que el navegador lo capture
const id = router.currentRoute?.params.id;
document.querySelector('.profile-header').style.viewTransitionName = `profile-${id}`;
```

### Deslizamientos con dirección

Combina una guarda `beforeEach` con una propiedad personalizada de CSS para producir animaciones distintas según el sentido de la navegación:

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

Para dejar un elemento fuera de una transición, usa `view-transition-name: none`. Para animar varias partes por separado, dale a cada una un nombre único; todo lo que no tenga nombre se funde con la transición raíz.

## SSR / SSG

Todas las API del navegador (`window`, `history`, `document`) están protegidas con comprobaciones `typeof`, así que `createRouter` se puede llamar sin riesgo en un entorno SSR de Node o Deno. En contexto SSR, `push` y `replace` ejecutan las guardas y actualizan `currentRoute`, pero se saltan `history.pushState` / `history.replaceState`. Los escuchadores de `popstate` nunca se registran en el servidor. Hidrata con normalidad en el cliente: vuelve a llamar a `createRouter` con la misma configuración.

## Referencia de tipos

```ts
interface RouteLocation {
  path: string; // p. ej. '/users/42'
  params: Record<string, string>; // p. ej. { id: '42' }
  query: Record<string, string>; // p. ej. { tab: 'profile' }
  fullPath: string; // p. ej. '/users/42?tab=profile'
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
