# ranui

Una biblioteca experimental de componentes de interfaz montada sobre Web Components. Cada componente va encapsulado en Shadow DOM, se viste con tokens CSS y admite SSR y Declarative Shadow DOM.

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | **Español** | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## Antes de empezar

Esta es una **biblioteca experimental de interfaz** en sus primeras etapas. Se puede usar, pero está pensada sobre todo para aprender y experimentar.

Lo esencial:

- **En sus primeras etapas**: las funcionalidades todavía se están escribiendo y puliendo.
- **Experimental**: las API pueden cambiar a menudo.
- **Con el aprendizaje por delante**: sirve sobre todo para aprender Web Components y desarrollo de interfaces.

## Qué ofrece

1. **Sirve con cualquier framework:** funciona con React, Vue, Preact, SolidJS, Svelte y con cualquier proyecto JavaScript que siga los estándares del W3C.
2. **Se sienten nativos:** usa elementos personalizados como `<r-button>` y `<r-modal>` igual que los elementos HTML de siempre.
3. **Diseño por módulos:** admite tanto la importación completa como la de un componente suelto, para mantenerlo mejor y controlar el peso del paquete.
4. **Encapsulados en Shadow DOM:** las tripas de cada componente quedan aisladas por defecto, mientras que los tokens CSS, `::part()` y el atributo `sheet` ofrecen los puntos de entrada previstos para darles estilo.
5. **Con TypeScript:** escrita en TypeScript, con sus definiciones de tipos.
6. **Amable con el SSR:** admite renderizado en el servidor mediante `defineSSR`, `renderToString` y Declarative Shadow DOM.
7. **Accesible:** roles y estados ARIA, navegación completa con el teclado, campos asociados a formularios (`<r-checkbox>`, `<r-input>` y `<r-select>` entran en el `FormData` nativo), avisos en regiones vivas y respeto por `prefers-reduced-motion`.

## Instalación

Con npm:

```console
npm install ranui --save
```

## Documentación y ejemplos

[Mira los componentes y sus ejemplos de uso](https://ran.chaxus.com/es/src/ranui/)

### Componentes y referencia de la API

De cada elemento, sus atributos, propiedades, **eventos (con la forma del `detail`)**, slots y nombres de `::part()` se generan a partir del código: no hace falta ir buscando las exportaciones a mano.

- API de cada elemento: [docs/COMPONENTS.md](./docs/COMPONENTS.md)
- El estándar de diseño (color, espaciado, tipografía, movimiento, accesibilidad): [docs/DESIGN.md](./docs/DESIGN.md)

Después de cambiar la API de un componente, regenera con:

```bash
pnpm doc:api
```

La CI ejecuta `pnpm run verify:docs` desde la raíz del repositorio, y falla en cuanto una referencia generada deja de coincidir con su código.

### Skill para IA y Claude Code

Hay una skill ya hecha para que los asistentes de IA (Claude Code) lean y usen ranui sin tener que escarbar en el código. Se publica desde el marketplace de plugins `ran`:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
```

Una vez instalada, Claude la usa sola cuando trabajas con ranui (o la invocas tú con `/ranui:ranui`). Cubre el mapa de importaciones, el inventario de elementos, la API del builder y de la reactividad, la accesibilidad y ejemplos de uso, y lleva a la referencia de la API que viaja dentro del paquete ([docs/COMPONENTS.md](./docs/COMPONENTS.md)).

### Documentación de estilos

El sistema de estilos gira todo en torno a los tokens CSS y a `::part()`.

- Guía para sobrescribir estilos: [docs/style-override.md](./docs/style-override.md)
- Lista completa de tokens y parts, generada sola: [docs/style-tokens-parts.md](./docs/style-tokens-parts.md)
- La API pública de estilos, generada sola: [docs/style-tokens-public.md](./docs/style-tokens-public.md)
- Configuración del filtro de tokens públicos: [docs/style-token-filter.json](./docs/style-token-filter.json)

Actualiza la documentación de estilos con:

```bash
pnpm doc:style
```

### Temas

ranui trae un único sistema de tokens basado en el [sistema de diseño Geist](https://vercel.com/geist), el lenguaje de diseño abierto de Vercel, donde el color es una **escalera de estados**: cada escala va de 100 a 1000 y cada peldaño tiene un solo cometido (fondo → hover → borde → relleno sólido → texto). ranui adopta esa escalera junto con **Geist Sans y Geist Mono**, así que el modo oscuro se limita a redefinir la escala base y todos los tokens semánticos cambian solos. Tres modos —`light`, `dark` y `system`— y ningún paquete de temas. Cambia de modo o sobrescribe cualquier token en caliente (a salvo en SSR):

```ts
import { initTheme, setTheme, setThemeToken, setThemeTokens } from 'ranui/theme';
import 'ranui/style';

initTheme(); // al cargar, recupera la elección guardada
setTheme('system'); // 'light' | 'dark' | 'system'
setThemeToken('--ran-color-primary', '#6c47ff');
setThemeTokens({ '--ran-radius-md': '10px' });
```

La entrada `ranui/theme` trae solo el motor de temas: no registra ningún elemento personalizado, así que no engorda tu paquete si lo único que quieres son los tokens y el modo oscuro. Esas mismas API se reexportan también desde el barril `ranui`.

El modo oscuro solo redefine la escala base de color; los tokens semánticos (`--ran-color-*`) apuntan a ella y cambian solos. Véanse [docs/THEME_STYLE_SYSTEM_DESIGN.md](./docs/THEME_STYLE_SYSTEM_DESIGN.md) y [docs/DESIGN.md](./docs/DESIGN.md).

### Internacionalización

El motor de i18n, que no depende de ningún framework, viene en su propia entrada `ranui/i18n`; como `ranui/theme`, no registra ningún elemento personalizado:

```ts
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // cada idioma es un diccionario llano: las claves se usan tal cual, sin anidar
  messages: { en: { 'hero.title': 'Hi {name}' }, zh: { 'hero.title': '你好 {name}' } },
  fallbackLocale: 'en',
  persist: true, // recuerda la elección en localStorage
  detectNavigato bien: true, // toma el idioma inicial del navegador
});

useI18n()!.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
useI18n()!.setLocale('zh'); // lo guarda y avisa a quien esté suscrito
```

`t()` recurre primero al idioma de reserva y después a la propia clave; los marcadores `{param}` se sustituyen. El núcleo es seguro en SSR.

## Importaciones

Importa componente a componente para que el paquete pese menos:

```js
import 'ranui/button';
```

Las subrutas que no son componentes traen las utilidades por separado, así que puedes tomar solo el motor que necesitas sin registrar todos los elementos:

```js
import { initTheme } from 'ranui/theme'; // solo los temas
import { createI18n } from 'ranui/i18n'; // solo la i18n
```

Si faltan los estilos, importa la hoja a mano:

```js
import 'ranui/style';
```

Si la resolución de tipos falla, importa a mano una de las entradas de tipos:

```ts
import 'ranui/typings';
// or
import 'ranui/dist/index.d.ts';
// or
import 'ranui/type';
// or
import 'ranui/dist/typings';
```

Basta con que funcione una.

También se admite la importación completa:

```ts
import 'ranui';
```

Módulo ES:

```js
import 'ranui';
```

o bien:

```js
import 'ranui/button';
```

UMD, IIFE, CJS:

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
```

### Sin empaquetador (páginas estáticas o CDN)

Elige la distribución según cuántos componentes use la página:

| Situación                                  | La mejor opción                                  | Por qué                                                                       |
| ------------------------------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------- |
| Uno o dos componentes, una etiqueta script | IIFE por componente: `dist/iife/<name>.iife.js`  | Se basta a sí mismo y no necesita sintaxis de módulos                         |
| Varios componentes                         | Módulos ES por componente: `dist/<name>.js`      | El grafo de módulos del navegador quita los duplicados del runtime compartido |
| Todo                                       | El paquete completo: `dist/index.iife.js`        | Un solo archivo, con todos los componentes registrados                        |
| Un proyecto con empaquetador               | Importaciones desde npm: `import 'ranui/<name>'` | Se poda lo no usado y el runtime es uno solo                                  |

IIFE por componente: una etiqueta y ningún paso de compilación.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/select.iife.js" defer></script>
```

Cada IIFE lleva dentro sus dependencias internas (por ejemplo, `select` incluye `icon`); el registro de elementos está protegido, así que cargar varios archivos que comparten dependencias no da problemas, pero cada archivo carga su propia copia del runtime compartido. Cuando una página necesita varios componentes, mejor los módulos ES, que sí lo comparten:

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/button.js';
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/select.js';
</script>
```

## Uso

Los componentes de RanUI son Web Components, así que se usan sin envoltorios propios de ningún framework.

Casi siempre se escriben como los elementos HTML de toda la vida.

Ejemplos:

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

### Posición y contenedor de los mensajes

`window.message` admite un desplazamiento propio desde arriba, un z-index y el contenedor donde montarse:

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

`top` acepta `number` o `string`; `24` se convierte en `24px`, mientras que `'2rem'` conserva su unidad.

`zIndex` acepta `number` o `string`.

`getContainer` tiene que devolver un `HTMLElement`; si se omite, los mensajes se montan en `document.body`.

### Piezas reactivas

`signal`, `createEffect`, `computed`, `batch`, `untrack` y una capa de pertenencia (`createRoot`, `onCleanup`, `getOwner`, `runWithOwner`) vienen junto al builder del DOM, para armar trozos de página reactivos sin framework. El diseño se mira en el `@Observable` de SwiftUI con las garantías de Solid.js: los efectos limpian solos las suscripciones viejas antes de volver a correr; `batch()` junta varias escrituras en un único repintado; `computed` es **perezoso y memoriza por valor** (un memo que nadie lee no se calcula nunca, y solo despierta a quienes dependen de él cuando su valor cambia de verdad); y cada efecto, memo y enlace pertenece a su ámbito, de modo que desechar un `createRoot` desmonta de una sola llamada todo lo que nació dentro: la unidad con la que se cierra una página o una ruta. Los encadenables de `ElementBuilder` (`text`, `attr`, `class`, …) aceptan además un getter de señal, y el enlace se actualiza solo. Guía completa: [`docs/BUILDER.md`](docs/BUILDER.md).

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
            }), // dos escrituras, un solo repintado
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
  }; // desmontaje
}
```

La API completa está en la [documentación de utilidades](./utils/README.md).

### Enrutado

RanUI trae enrutado en el cliente, con componentes declarativos y una API de JavaScript.

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

**API de JavaScript con guardia de navegación:**

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

En sitios MPA puros, donde no hace falta un enrutador en JS, llama a `enableMpaViewTransitions()` para inyectar `@view-transition { navigation: auto }`. Las animaciones en que un elemento se transforma de una página a otra se escriben con la propiedad CSS estándar `view-transition-name`.

```ts
import { enableMpaViewTransitions } from 'ranui';
enableMpaViewTransitions();
```

La API completa —guardias, `onPageSwap` y `onPageReveal`, y los nombres de transición por elemento— está en la [documentación del enrutador](https://ran.chaxus.com/es/src/ranui/router/).

### SSR y builder

Para el SSR y para armar la interfaz de forma declarativa, RanUI usa por dentro `builder`, el registro de SSR y Declarative Shadow DOM. Los componentes reaprovechan un Shadow Root ya existente mediante `ensureShadowRoot` y arman su árbol en el constructor. El árbol que pinta el servidor sirve para el primer fotograma y luego se sustituye: los componentes enganchan un shadow root **cerrado**, y `attachShadow` borra los hijos de uno declarativo, así que el cliente siempre lo rehace.

Ejemplo de renderizado SSR al nivel del código:

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const button = new Button();
button.setAttribute('effect', 'true');

// Devuelve una cadena HTML que contiene Declarative Shadow DOM.
const html = renderToString(button);
```

Los detalles están en la [documentación de utilidades](./utils/README.md).

## Convenciones para escribir componentes

Al añadir o mantener componentes, sigue las convenciones del paquete:

- Extiende `RanElement`; no extiendas directamente el `HTMLElement` del navegador.
- Crea o reaprovecha los Shadow Roots con `ensureShadowRoot`; no llames a `attachShadow` a pelo.
- Arma el subárbol del Shadow DOM en el constructor y en ningún otro sitio.
- Guarda los elementos con `.ref()` según los vas creando y recupéralos con `shadowPart`; nunca uses `querySelector` para algo que el propio componente construyó.
- Incluye `sheet` en `observedAttributes` y aplica las sobrescrituras de estilo del componente a través de `syncSheetAttribute`.
- Protege `attributeChangedCallback` con `if (old === next) return;`.
- Registra los componentes con `defineSSR('r-name', Component)`, no llamando directamente a `customElements.define`.
- Añade en `index.ts` tanto las exportaciones de tipos como las importaciones con efecto secundario; añade además las entradas sueltas en `vite.config.ts` y en `package.json`.
- Para los escuchadores atados al ciclo de vida en `connectedCallback`, usa el `EventManager` de `@/utils/builder`; llama a `manager.abort()` en `disconnectedCallback` en vez de ir siguiendo la pista a cada `removeEventListener`.

## Cómo contribuir

Toda contribución es bienvenida, vengas a aprender o a programar. Es un proyecto experimental, así que cuenta con que cambie a menudo.

## Quienes han contribuido

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Varios

[Licencia (MIT)](/LICENSE)
