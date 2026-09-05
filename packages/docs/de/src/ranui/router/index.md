---
description: 'Clientseitiges SPA-Routing mit deklarativen Komponenten, JS-API, Navigationswächtern, View Transitions und dokumentübergreifenden (MPA) Übergängen.'
---

# Router

Clientseitiges Routing für Single-Page-Anwendungen. Es bietet deklarative HTML-Komponenten und eine JavaScript-API mit Navigationswächtern, View Transitions und dokumentübergreifenden (MPA) Übergängen.

> **Einsetzen, wenn** du clientseitiges SPA-Routing mit Navigationswächtern, View Transitions und dokumentübergreifenden (MPA) Übergängen brauchst. `createRouter` zusammen mit `<r-router>` / `<r-route>` / `<r-link>` verdrahtet die Navigation innerhalb der Anwendung.

## Schnellstart

Eine vollständige kleine Anwendung mit Authentifizierungswächter und SPA-Übergang:

```js
import { createRouter } from 'ranui';

// 1. Router mit geschützten Routen und SPA-Übergängen anlegen
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

// 2. Authentifizierungswächter — nicht angemeldete Nutzende umleiten
router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !sessionStorage.getItem('token')) {
    next('/login');
  } else {
    next();
  }
});

// 3. Nach jeder Navigation den Seitentitel setzen und die Analyse melden
router.afterEach((to) => {
  document.title = to.meta?.title ?? 'App';
});
router.onRouteChange((to) => {
  analytics.track(to.fullPath);
});
```

```html
<!-- Router einhängen, Navigationslinks ergänzen, Routen deklarieren -->
<r-router>
  <nav>
    <r-link href="/">Start</r-link>
    <r-link href="/about">Über</r-link>
    <r-link href="/dashboard">Übersicht</r-link>
  </nav>

  <r-route path="/" exact><h2>Start</h2></r-route>
  <r-route path="/about"><h2>Über</h2></r-route>
  <r-route path="/dashboard"><h2>Übersicht</h2></r-route>
  <r-route path="/login"><h2>Anmelden</h2></r-route>
</r-router>
```

```css
/* SPA-Übergang — Überblendung zwischen Routen */
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

## Komponenten

### `r-router`

Die Container-Komponente. Sie horcht auf `popstate` und gleicht bei jeder Navigation alle enthaltenen `r-route`-Elemente ab.

#### Attribute

| Attribut | Typ                   | Standard    | Beschreibung                                             |
| -------- | --------------------- | ----------- | -------------------------------------------------------- |
| `mode`   | `'history' \| 'hash'` | `'history'` | Modus der History-API                                    |
| `base`   | `string`              | `''`        | Basis-Präfix der URL, das von allen Pfaden entfernt wird |
| `sheet`  | `string`              | `''`        | CSS, das in das Shadow DOM eingefügt wird                |

#### Ereignisse

| Ereignis      | Detail             | Beschreibung                                       |
| ------------- | ------------------ | -------------------------------------------------- |
| `routechange` | `{ path: string }` | Wird nach jeder Aktualisierung der Route ausgelöst |

### `r-route`

Zeigt den Inhalt seines Slots, wenn der aktuelle Pfad zu `path` passt; sonst blendet es ihn aus.

#### Attribute

| Attribut | Typ       | Standard | Beschreibung                                                                  |
| -------- | --------- | -------- | ----------------------------------------------------------------------------- |
| `path`   | `string`  | `'/'`    | Muster zum Abgleich. Unterstützt `:param`-Segmente und den Platzhalter `*`    |
| `exact`  | `boolean` | `false`  | Verlangt eine genaue Übereinstimmung (kein Präfix-Abgleich)                   |
| `src`    | `string`  | `''`     | Modulbezeichner, um die Seite verzögert und codegetrennt ein- und auszuhängen |
| `sheet`  | `string`  | `''`     | CSS, das in das Shadow DOM eingefügt wird                                     |

#### Ereignisse

| Ereignis     | Detail             | Beschreibung                                |
| ------------ | ------------------ | ------------------------------------------- |
| `routematch` | `{ path, params }` | Wird ausgelöst, wenn diese Route aktiv wird |

#### Beispiele für Pfadmuster

```
/users            passt auf /users, /users/42, /users/42/profile
/users (exact)    passt nur auf /users
/users/:id        fängt :id ein → params.id
/*                passt auf alles
```

#### Verzögertes Ein- und Aushängen `src`

In einer größeren Anwendung mit vielen Seiten kann `r-route` den Code je Seite auftrennen, statt den Slot-Inhalt immer vorab auszuliefern. Setze `src` auf einen Modulbezeichner; bei einem Treffer importiert `r-route` ihn dynamisch per `import()` und ruft dessen Default-Export auf — eine Funktion vom Typ `(host: HTMLElement) => void | (() => void)` — innerhalb eines reaktiven Bereichs, und übergibt ihr ein Host-Element zum Zeichnen. Die Route zu verlassen verwirft diesen ganzen Bereich in einem Zug (jeden Effekt, jede Bindung und jedes `onCleanup`, das die Seite angemeldet hat) und entfernt danach den gezeichneten Inhalt; kehrt man zurück, wird aus dem zwischengespeicherten Modul neu eingehängt, ohne es erneut zu laden.

```html
<r-route path="/settings" src="/pages/settings.js"></r-route>
```

```js
// pages/settings.js
export default function renderSettings(host) {
  host.textContent = 'Settings page';
  return () => {
    /* optionales Aufräumen, läuft beim Verlassen der Route */
  };
}
```

Dieser Modus ist rein clientseitig: Beim SSR/SSG löst eine verzögerte Route nur auf, ob sie sichtbar ist — nicht das Seitenmodul selbst.

### `r-link`

Ein Navigationslink. Er verhindert das vollständige Neuladen bei Pfaden derselben Herkunft, ruft `RouterCore.push/replace`, wenn ein Router aktiv ist, und sendet sonst ein `ran-navigate`-Ereignis den DOM-Baum hinauf.

Externe URLs (`http://`, `//`, `mailto:`, `tel:`) gehen als gewöhnliche `<a>`-Links durch.

#### Attribute

| Attribut  | Typ       | Standard | Beschreibung                                                      |
| --------- | --------- | -------- | ----------------------------------------------------------------- |
| `href`    | `string`  | `''`     | Zielpfad                                                          |
| `replace` | `boolean` | `false`  | Ersetzt den aktuellen Verlaufseintrag, statt einen neuen zu legen |
| `sheet`   | `string`  | `''`     | CSS, das in das Shadow DOM eingefügt wird                         |

```html
<r-link href="/about">Über</r-link>
<r-link href="/settings" replace>Einstellungen</r-link>
<r-link href="https://github.com">GitHub ↗</r-link>
```

#### Slots

Weder `r-router` noch `r-route` noch `r-link` bieten einen benannten Slot. Jedes zeichnet nur den voreingestellten (namenlosen) `<slot>`: `r-router` und `r-route` reichen ihre Kindrouten beziehungsweise den Routeninhalt unverändert durch, und `r-link` reicht das, was du hineinschreibst, als sichtbaren Inhalt des Links durch. Keines der drei definiert ein `::part()`, deshalb hat diese Komponentengruppe keinen Abschnitt zu CSS-Parts.

## JavaScript-API

### `createRouter(config?)`

Erzeugt und registriert eine globale `RouterCore`-Instanz. Rufe sie beim Start der Anwendung einmal auf, bevor du ein `r-router`-Element einhängst.

```js
import { createRouter } from 'ranui';

const router = createRouter({
  mode: 'history', // 'history' (Standard) | 'hash'
  base: '/app', // entfernt das Präfix '/app' aus allen internen Pfaden
  routes: [
    { path: '/', exact: true, meta: { title: 'Home' } },
    { path: '/users/:id', meta: { requiresAuth: true } },
  ],
  viewTransition: 'spa', // 'spa' | 'mpa' | 'both' | false
});
```

#### Optionen

| Option           | Typ                             | Standard    | Beschreibung                                              |
| ---------------- | ------------------------------- | ----------- | --------------------------------------------------------- |
| `mode`           | `'history' \| 'hash'`           | `'history'` | Strategie für die URL                                     |
| `base`           | `string`                        | `''`        | Präfix des Basispfads                                     |
| `routes`         | `RouteConfig[]`                 | `[]`        | Routendefinitionen mit path, exact und meta               |
| `viewTransition` | `boolean \| ViewTransitionMode` | `false`     | Schaltet View Transitions ein (`true` entspricht `'spa'`) |

### `RouterCore`

Alle Hook-Methoden geben eine **Funktion zum Abbestellen** zurück.

| Name                     | Signatur / Typ                                          | Beschreibung                                                    |
| ------------------------ | ------------------------------------------------------- | --------------------------------------------------------------- |
| `push(path)`             | `(path: string) => Promise<void>`                       | Navigiert und legt einen neuen Verlaufseintrag an               |
| `replace(path)`          | `(path: string) => Promise<void>`                       | Navigiert und ersetzt den aktuellen Eintrag                     |
| `back()`                 | `() => void`                                            | `history.back()`                                                |
| `forward()`              | `() => void`                                            | `history.forward()`                                             |
| `go(delta)`              | `(delta: number) => void`                               | `history.go(delta)`                                             |
| `beforeEach(guard)`      | `(guard: NavigationGuard) => () => void`                | Meldet einen Wächter an; läuft, bevor die Navigation greift     |
| `afterEach(handler)`     | `(handler: RouteChangeHandler) => () => void`           | Hook danach; läuft, nachdem das DOM aktualisiert wurde          |
| `onRouteChange(handler)` | `(handler: RouteChangeHandler) => () => void`           | Abonniert jeden Routenwechsel                                   |
| `onPageSwap(handler)`    | `(handler: (e: PageSwapEvent) => void) => () => void`   | Dokumentübergreifendes `pageswap`-Ereignis (nur im MPA-Modus)   |
| `onPageReveal(handler)`  | `(handler: (e: PageRevealEvent) => void) => () => void` | Dokumentübergreifendes `pagereveal`-Ereignis (nur im MPA-Modus) |
| `destroy()`              | `() => void`                                            | Entfernt alle Listener und das eingefügte CSS                   |
| `currentRoute`           | `RouteLocation \| null`                                 | Objekt mit der aktuellen Routenposition                         |
| `mode`                   | `'history' \| 'hash'`                                   | Verlaufsmodus                                                   |
| `base`                   | `string`                                                | Basis-Präfix der URL                                            |
| `routes`                 | `RouteConfig[]`                                         | Angemeldete Routenkonfigurationen                               |

```js
router.push('/users/42');
router.replace('/login');
router.back();
router.go(-2);
```

### `useRouter()`

Gibt die aktive `RouterCore`-Instanz zurück, oder `null`, wenn `createRouter` noch nicht aufgerufen wurde.

```js
import { useRouter } from 'ranui';

const router = useRouter();
router?.push('/about');
```

## Navigationswächter

Wächter laufen in der Reihenfolge ihrer Anmeldung, bevor die Navigation greift. Rufe `next()` zum Zulassen, `next(false)` zum Abbrechen oder `next('/path')` zum Umleiten.

```js
const unsubscribe = router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    next('/login');
  } else {
    next();
  }
});

// Den Wächter später entfernen:
unsubscribe();
```

### Hooks nach der Navigation

`afterEach` und `onRouteChange` feuern beide, nachdem das DOM aktualisiert wurde. Nimm `afterEach` für Seiteneffekte, die von der abgeschlossenen Navigation abhängen, und `onRouteChange` für leichte Abonnements.

```js
router.afterEach((to, from) => {
  document.title = to.meta?.title ?? 'App';
});

router.onRouteChange((to, from) => {
  analytics.track(to.fullPath);
});
```

## View Transitions

Schalte animierte Routenwechsel über die [View Transitions API](https://developer.mozilla.org/de/docs/Web/API/View_Transition_API) des Browsers frei.

### Vergleich

Wähle den Modus, bevor du CSS schreibst:

| Modus    | Chrome      | Was ihn auslöst                                    | JS nötig |
| -------- | ----------- | -------------------------------------------------- | -------- |
| `'spa'`  | 111+        | `router.push()` oder ein Klick auf `r-link`        | Ja       |
| `'mpa'`  | 126+        | Jeder `<a>`-Link, Formularversand, `location.href` | Nein     |
| `'both'` | 111+ / 126+ | Alles davon                                        | Optional |

### SPA — Übergänge im selben Dokument

```js
const router = createRouter({ viewTransition: 'spa' }); // oder true
```

Jeder Aufruf von `router.push()` / `router.replace()` umschließt die DOM-Aktualisierung mit `document.startViewTransition()`. Wo die API fehlt, fällt das sauber auf eine synchrone Aktualisierung zurück (Chrome 111+).

Ergänze das CSS, das die Animation beschreibt:

```css
/* Voreingestellte Überblendung */
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

### MPA — dokumentübergreifende Übergänge

```js
const router = createRouter({ viewTransition: 'mpa' });
```

Fügt `@view-transition { navigation: auto }` in den `<head>` ein und schaltet damit automatische Übergänge bei jeder vollständigen Seitennavigation derselben Herkunft frei (Chrome 126+). Auf den einzelnen Seiten ist kein JavaScript nötig.

Für Anwendungen, die den Router gar nicht nutzen:

```js
import { enableMpaViewTransitions } from 'ranui';

const cleanup = enableMpaViewTransitions();
// cleanup() entfernt bei Bedarf das eingefügte <style>
```

**Lebenszyklus-Ereignisse im MPA-Modus:**

```js
// pageswap feuert im ausgehenden Dokument vor dem Entladen
router.onPageSwap((e) => {
  const type = e.activation?.navigationType; // 'push' | 'replace' | 'traverse'
  if (type === 'traverse') e.viewTransition?.skipTransition();
});

// pagereveal feuert im eingehenden Dokument vor dem ersten Zeichnen
router.onPageReveal((e) => {
  console.log('new page ready');
});
```

### SPA und MPA zusammen

```js
const router = createRouter({ viewTransition: 'both' });
```

SPA-Navigationen nutzen `startViewTransition()`. Vollständige Seitennavigationen nutzen die CSS-Regel `@view-transition`. Von JS gesteuerte Übergänge, wo möglich, sonst der CSS-Rückfall.

## `view-transition-name` — Übergänge geteilter Elemente

`view-transition-name` animiert ein bestimmtes Element zwischen zwei Seiten statt des ganzen Viewports. Der Browser erfasst Position und Größe des Elements auf beiden Seiten und animiert dazwischen. Das ist der Effekt der aufklappenden Karte in der [Chrome-Profiles-Demo](https://view-transitions.chrome.dev/profiles/mpa/).

### Grundlegende Verwendung

Vergib denselben Namen an das „gleiche“ Element auf Ausgangs- und Zielseite:

```html
<!-- Listenseite -->
<div class="card" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <span>Jane Doe</span>
</div>
```

```html
<!-- Detailseite -->
<div class="profile-header" style="view-transition-name: profile-42">
  <img src="avatar.jpg" />
  <h1>Jane Doe</h1>
</div>
```

Der Browser animiert die Karte von ihrer Position in der Liste zu ihrer Position in der Detailansicht und formt sie dabei um.

### Dynamische Namen in einer Liste

`view-transition-name` muss pro Seite eindeutig sein. Nimm die ID des Eintrags als Teil des Namens:

```css
/* CSS-Weg — eine Regel je Karte */
.card[data-id='1'] {
  view-transition-name: card-1;
}
.card[data-id='42'] {
  view-transition-name: card-42;
}
```

```js
// JS-Weg — den Namen unmittelbar vor der Navigation setzen
function navigateToProfile(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);
  card.style.viewTransitionName = `profile-${id}`;
  router.push(`/profiles/${id}`);
}
```

Setze auf der Zielseite den passenden Namen vor dem ersten Zeichnen:

```js
// Sofort (synchron) setzen, damit der Browser ihn erfasst
const id = router.currentRoute?.params.id;
document.querySelector('.profile-header').style.viewTransitionName = `profile-${id}`;
```

### Gerichtete Schiebeübergänge

Kombiniere einen `beforeEach`-Wächter mit einer CSS-Custom-Property, um je Navigationsrichtung eine andere Animation zu erzeugen:

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

Um ein Element von einem Übergang auszunehmen, nimm `view-transition-name: none`. Sollen mehrere Teile unabhängig animieren, gib jedem einen eigenen Namen; alles ohne Namen blendet über den Wurzelübergang mit.

## SSR / SSG

Alle Browser-APIs (`window`, `history`, `document`) sind mit `typeof`-Prüfungen abgesichert, `createRouter` lässt sich also gefahrlos in einer SSR-Umgebung unter Node oder Deno aufrufen. Im SSR-Kontext führen `push` und `replace` die Wächter aus und aktualisieren `currentRoute`, überspringen aber `history.pushState` / `history.replaceState`. `popstate`-Listener werden serverseitig nie angemeldet. Auf dem Client hydrierst du ganz normal: Rufe `createRouter` erneut mit derselben Konfiguration auf.

## Typreferenz

```ts
interface RouteLocation {
  path: string; // z. B. '/users/42'
  params: Record<string, string>; // z. B. { id: '42' }
  query: Record<string, string>; // z. B. { tab: 'profile' }
  fullPath: string; // z. B. '/users/42?tab=profile'
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
