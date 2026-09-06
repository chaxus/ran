# ranui

Eine experimentelle Bibliothek von Oberflächenbausteinen auf Grundlage von Web Components. Jede Komponente steckt im Shadow DOM, wird über CSS-Tokens gestaltet und kommt mit SSR und Declarative Shadow DOM zurecht.

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | [Português](./README.pt.md) | [한국어](./README.ko.md) | **Deutsch** | [فارسی](./README.fa.md)

## Bitte vorab lesen

Dies ist eine **experimentelle Oberflächenbibliothek** in einem frühen Stadium. Sie lässt sich benutzen, ist aber vor allem zum Lernen und Ausprobieren gedacht.

Das Wichtigste:

- **Frühes Stadium**: An den Funktionen wird noch geschrieben und gefeilt.
- **Experimentell**: Die APIs können sich häufig ändern.
- **Das Lernen zuerst**: Vor allem gedacht, um Web Components und die Arbeit an Oberflächen kennenzulernen.

## Was drin ist

1. **Über Frameworks hinweg:** funktioniert mit React, Vue, Preact, SolidJS, Svelte und jedem JavaScript-Projekt, das sich an die W3C-Standards hält.
2. **Fühlt sich nativ an:** Custom Elements wie `<r-button>` und `<r-modal>` schreibst du wie gewöhnliche HTML-Elemente.
3. **In Module zerlegt:** Sowohl der vollständige Import als auch der einzelner Komponenten ist möglich – besser zu pflegen, und du behältst die Bundle-Größe in der Hand.
4. **Gekapselt im Shadow DOM:** Das Innere einer Komponente ist von Haus aus abgeschottet, während CSS-Tokens, `::part()` und das Attribut `sheet` die vorgesehenen Einstiege zum Gestalten bieten.
5. **Mit TypeScript:** in TypeScript geschrieben, mit Typdefinitionen.
6. **SSR-freundlich:** Serverseitiges Rendern über `defineSSR`, `renderToString` und Declarative Shadow DOM.
7. **Zugänglich:** ARIA-Rollen und -Zustände, vollständige Tastaturbedienung, formulargebundene Eingaben (`<r-checkbox>`, `<r-input>` und `<r-select>` landen im nativen `FormData`), Meldungen in Live-Regionen und Rücksicht auf `prefers-reduced-motion`.

## Installation

Mit npm:

```console
npm install ranui --save
```

## Dokumentation und Beispiele

[Die Komponenten und ihre Beispiele ansehen](https://ran.chaxus.com/de/src/ranui/)

### Komponenten und API-Referenz

Für jedes Element werden Attribute, Eigenschaften, **Ereignisse (samt dem Aufbau von `detail`)**, Slots und `::part()`-Namen aus dem Quelltext erzeugt – du musst die Exporte nicht selbst durchsuchen:

- Die API je Element: [docs/COMPONENTS.md](./docs/COMPONENTS.md)
- Der Gestaltungsstandard (Farbe, Abstände, Typografie, Bewegung, Zugänglichkeit): [docs/DESIGN.md](./docs/DESIGN.md)

Nach einer Änderung an der API einer Komponente neu erzeugen mit:

```bash
pnpm doc:api
```

Die CI führt im Wurzelverzeichnis `pnpm run verify:docs` aus und schlägt fehl, sobald eine erzeugte Referenz nicht mehr zu ihrem Quelltext passt.

### Skill für KI und Claude Code

Eine fertige Skill lässt KI-Assistenten (Claude Code) ranui lesen und benutzen, ohne im Quelltext zu graben. Veröffentlicht wird sie über den Plugin-Marktplatz `ran`:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
```

Einmal installiert, greift Claude von selbst darauf zu, sobald du mit ranui arbeitest (oder du rufst sie ausdrücklich mit `/ranui:ranui` auf). Die Skill deckt die Import-Übersicht, das Verzeichnis der Elemente, die API von Builder und Reaktivität, die Zugänglichkeit und Anwendungsbeispiele ab und verweist auf die API-Referenz, die im Paket mitkommt ([docs/COMPONENTS.md](./docs/COMPONENTS.md)).

### Dokumentation zur Gestaltung

Die Gestaltung läuft einheitlich über CSS-Tokens und `::part()`.

- Anleitung zum Überschreiben von Stilen: [docs/style-override.md](./docs/style-override.md)
- Vollständige Liste der Tokens und Parts, selbst erzeugt: [docs/style-tokens-parts.md](./docs/style-tokens-parts.md)
- Die öffentliche Gestaltungs-API für Anwender, selbst erzeugt: [docs/style-tokens-public.md](./docs/style-tokens-public.md)
- Konfiguration des Filters für öffentliche Tokens: [docs/style-token-filter.json](./docs/style-token-filter.json)

Die Gestaltungsdokumentation aktualisierst du mit:

```bash
pnpm doc:style
```

### Themen

ranui bringt ein einziges Token-System mit, aufgebaut auf dem [Geist-Designsystem](https://vercel.com/geist) – Vercels offener Designsprache, in der Farbe eine **Leiter von Zuständen** ist: Jede Skala läuft von 100 bis 1000, und jede Stufe hat genau eine Aufgabe (Hintergrund → Hover → Rahmen → vollflächige Füllung → Text). ranui übernimmt diese Leiter samt **Geist Sans und Geist Mono**, deshalb definiert der dunkle Modus bloß die Grundskala neu, und alle semantischen Tokens kippen von selbst mit. Drei Modi – `light`, `dark`, `system` – und keine Themenpakete. Den Modus umschalten oder jeden Token zur Laufzeit überschreiben (auch im SSR sicher):

```ts
import { initTheme, setTheme, setThemeToken, setThemeTokens } from 'ranui/theme';
import 'ranui/style';

initTheme(); // beim Laden die gespeicherte Wahl wiederherstellen
setTheme('system'); // 'light' | 'dark' | 'system'
setThemeToken('--ran-color-primary', '#6c47ff');
setThemeTokens({ '--ran-radius-md': '10px' });
```

Der Einstiegspunkt `ranui/theme` bringt nur die Themen-Maschine mit – es werden keine Custom Elements eingetragen, es bleibt also aus deinem Bundle heraus, wenn du bloß Tokens und den dunklen Modus willst. Dieselben APIs werden auch aus dem Sammelmodul `ranui` erneut exportiert.

Der dunkle Modus definiert allein die Grundskala der Farben neu; die semantischen Tokens (`--ran-color-*`) verweisen darauf und kippen von selbst mit. Siehe [docs/THEME_STYLE_SYSTEM_DESIGN.md](./docs/THEME_STYLE_SYSTEM_DESIGN.md) und [docs/DESIGN.md](./docs/DESIGN.md).

### Mehrsprachigkeit

Eine i18n-Maschine, die von keinem Framework abhängt, kommt als eigener Einstiegspunkt `ranui/i18n`; wie `ranui/theme` trägt sie keine Custom Elements ein:

```ts
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // jede Sprache ist ein flaches Wörterbuch – die Schlüssel gelten wörtlich, nichts wird verschachtelt
  messages: { en: { 'hero.title': 'Hi {name}' }, zh: { 'hero.title': '你好 {name}' } },
  fallbackLocale: 'en',
  persist: true, // die Wahl im localStorage merken
  detectNavigatoder: true, // die erste Sprache vom Browser übernehmen
});

useI18n()!.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
useI18n()!.setLocale('zh'); // speichert und benachrichtigt die Abonnenten
```

`t()` weicht erst auf die Rückfallsprache aus und dann auf den Schlüssel selbst; Platzhalter der Form `{param}` werden eingesetzt. Der Kern ist SSR-sicher.

## Importe

Importier einzelne Komponenten, damit das Bundle klein bleibt:

```js
import 'ranui/button';
```

Unterpfade, die keine Komponenten sind, liefern die Hilfsmittel für sich allein; du holst dir also nur die Maschine, die du brauchst, ohne jedes Element einzutragen:

```js
import { initTheme } from 'ranui/theme'; // nur die Themen
import { createI18n } from 'ranui/i18n'; // nur die Mehrsprachigkeit
```

Fehlen die Stile, importier das Stylesheet von Hand:

```js
import 'ranui/style';
```

Scheitert die Auflösung der Typen, importier von Hand einen der Typ-Einstiegspunkte:

```ts
import 'ranui/typings';
// or
import 'ranui/dist/index.d.ts';
// or
import 'ranui/type';
// or
import 'ranui/dist/typings';
```

Es genügt einer, der funktioniert.

Der vollständige Import ist ebenfalls möglich:

```ts
import 'ranui';
```

ES-Modul:

```js
import 'ranui';
```

oder:

```js
import 'ranui/button';
```

UMD, IIFE, CJS:

```html
<script src="./ranui/dist/umd/index.umd.cjs"></script>
```

### Ohne Bundler (statische Seiten oder CDN)

Wähl die Auslieferungsform danach, wie viele Komponenten die Seite benutzt:

| Fall                                      | Beste Wahl                                     | Warum                                                                         |
| ----------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| Eine bis zwei Komponenten, ein script-Tag | IIFE je Komponente: `dist/iife/<name>.iife.js` | Kommt allein zurecht und braucht keine Modulsyntax                            |
| Mehrere Komponenten                       | ES-Module je Komponente: `dist/<name>.js`      | Der Modulgraph des Browsers räumt doppelte Teile der gemeinsamen Laufzeit weg |
| Alles                                     | Das vollständige Bundle: `dist/index.iife.js`  | Eine Datei, in der jede Komponente eingetragen wird                           |
| Ein Projekt mit Bundler                   | Importe aus npm: `import 'ranui/<name>'`       | Ungenutztes fällt weg, und die Laufzeit gibt es nur einmal                    |

IIFE je Komponente – ein Tag, kein Build-Schritt:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/select.iife.js" defer></script>
```

Jede IIFE nimmt ihre inneren Abhängigkeiten mit hinein (`select` enthält etwa `icon`); das Eintragen der Elemente ist abgesichert, mehrere Dateien mit gemeinsamen Abhängigkeiten zu laden ist also unbedenklich – nur trägt jede Datei ihre eigene Kopie der gemeinsamen Laufzeit. Braucht eine Seite mehrere Komponenten, nimm lieber die ES-Module, die sich diese Laufzeit teilen:

```html
<script type="module">
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/button.js';
  import 'https://cdn.jsdelivr.net/npm/ranui/dist/select.js';
</script>
```

## Verwendung

Die Komponenten von RanUI sind Web Components, es braucht also keine Hüllen für einzelne Frameworks.

Meistens schreibst du sie einfach wie gewöhnliche HTML-Elemente.

Beispiele:

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

### Position und Behälter der Meldungen

Bei `window.message` lassen sich der Abstand von oben, die Stapelreihenfolge und der Behälter festlegen, in den eingehängt wird:

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

`top` nimmt `number` wie `string`; `24` wird zu `24px`, während `'2rem'` seine Einheit behält.

`zIndex` nimmt ebenfalls `number` und `string`.

`getContainer` muss ein `HTMLElement` zurückgeben; ohne Angabe hängen sich die Meldungen an `document.body`.

### Reaktive Bausteine

`signal`, `createEffect`, `computed`, `batch`, `untrack` und eine Schicht für Besitzverhältnisse (`createRoot`, `onCleanup`, `getOwner`, `runWithOwner`) kommen zusammen mit dem DOM-Builder – für reaktive Seitenteile ohne Framework. Der Entwurf lehnt sich an SwiftUIs `@Observable` an, mit Zusicherungen nach Art von Solid.js: Effekte räumen vor jedem erneuten Lauf ihre veralteten Abonnements selbst auf; `batch()` fasst mehrere Schreibvorgänge zu einem einzigen Durchlauf zusammen; `computed` ist **träge und merkt sich den Wert** (ein ungelesenes Memo rechnet nie, und es weckt seine Abhängigen erst, wenn sich sein Wert wirklich ändert); und jeder Effekt, jedes Memo und jede Bindung gehört seinem Geltungsbereich, sodass das Verwerfen eines `createRoot` mit einem Aufruf alles abbaut, was darin entstanden ist – die Einheit, mit der eine Seite oder Route abgeräumt wird. Die verkettbaren Methoden von `ElementBuilder` (`text`, `attr`, `class`, …) nehmen zudem einen Signal-Getter an, dann aktualisiert sich die Bindung von selbst. Ausführlich: [`docs/BUILDER.md`](docs/BUILDER.md).

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
            }), // zwei Schreibvorgänge, ein einziger Durchlauf
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
  }; // Abbau
}
```

Die vollständige API steht in der [Dokumentation der Hilfsmittel](./utils/README.md).

### Routing

RanUI bringt Routing im Browser mit – über deklarative Komponenten und über eine JavaScript-API.

**Deklarative Komponenten:**

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

**JavaScript-API mit Navigationswächter:**

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

Bei reinen MPA-Seiten, die keinen JS-Router brauchen, ruf `enableMpaViewTransitions()` auf, um `@view-transition { navigation: auto }` einzufügen. Animationen, bei denen ein Element von einer Seite zur nächsten seine Form wandelt, schreibst du über die Standard-CSS-Eigenschaft `view-transition-name`.

```ts
import { enableMpaViewTransitions } from 'ranui';
enableMpaViewTransitions();
```

Die vollständige API – Wächter, `onPageSwap` und `onPageReveal` sowie die Übergangsnamen je Element – steht in der [Dokumentation des Routers](https://ran.chaxus.com/de/src/ranui/router/).

### SSR und Builder

Fürs SSR und fürs deklarative Zusammensetzen der Oberfläche benutzt RanUI intern den `builder`, das SSR-Verzeichnis und Declarative Shadow DOM. Komponenten greifen über `ensureShadowRoot` auf eine schon vorhandene Shadow Root zurück und bauen ihren Baum im Konstruktor. Der vom Server gezeichnete Baum malt das erste Bild und wird dann ersetzt: Komponenten hängen eine **geschlossene** Shadow Root an, und `attachShadow` löscht die Kinder einer deklarativen – auf dem Client wird also immer neu gebaut.

Beispiel für SSR-Rendern auf Quelltextebene:

```ts
import { Button } from '@/components/button';
import { renderToString } from '@/utils/ssr';

const button = new Button();
button.setAttribute('effect', 'true');

// Liefert eine HTML-Zeichenkette, die Declarative Shadow DOM enthält.
const html = renderToString(button);
```

Einzelheiten stehen in der [Dokumentation der Hilfsmittel](./utils/README.md).

## Konventionen beim Schreiben von Komponenten

Wenn du Komponenten hinzufügst oder pflegst, halt dich an die Konventionen des Pakets:

- Erweitere `RanElement`; erweitere nicht unmittelbar das `HTMLElement` des Browsers.
- Erzeuge oder verwende Shadow Roots über `ensureShadowRoot` wieder; ruf `attachShadow` nicht selbst auf.
- Bau den Teilbaum des Shadow DOM im Konstruktor und sonst nirgends.
- Greif Elemente beim Bauen mit `.ref()` ab und les sie über `shadowPart` zurück; benutz niemals `querySelector` für etwas, das die Komponente selbst gebaut hat.
- Nimm `sheet` in `observedAttributes` auf und übertrag Stilüberschreibungen auf Komponentenebene über `syncSheetAttribute`.
- Sichere `attributeChangedCallback` mit `if (old === next) return;` ab.
- Trag Komponenten mit `defineSSR('r-name', Component)` ein, nicht unmittelbar über `customElements.define`.
- Ergänze in `index.ts` sowohl die Typexporte als auch die Importe mit Seiteneffekt; trag außerdem eigene Einträge in `vite.config.ts` und `package.json` nach.
- Nimm für lebenszyklusgebundene Listener in `connectedCallback` den `EventManager` aus `@/utils/builder`; ruf in `disconnectedCallback` `manager.abort()` auf, statt einzelnen `removeEventListener`-Aufrufen hinterherzulaufen.

## Mitmachen

Beiträge sind willkommen, ob du zum Lernen kommst oder zum Entwickeln. Das Projekt ist experimentell, rechne also mit häufigen Änderungen.

## Wer mitgemacht hat

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Sonstiges

[Lizenz (MIT)](/LICENSE)
