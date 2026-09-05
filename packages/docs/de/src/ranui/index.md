---
description: 'ranui ist eine Web-Components-UI-Bibliothek auf Basis nativer Custom Elements (<r-*>) — mit TypeScript-Typen, hellem und dunklem Theme, Shadow DOM, SSR und PWA-Unterstützung.'
---

# ranui

Eine UI-Bibliothek auf Basis **nativer Custom Elements**. Jede Komponente ist ein `<r-*>`-Tag und
funktioniert deshalb in React, Vue, Svelte, Solid, Astro oder einer schlichten HTML-Datei gleich.
Es gibt keinen Adapter und keine Framework-Version, die zusammenpassen müsste. TypeScript-Typen,
helles und dunkles Theme über Design-Tokens, Kapselung per Shadow DOM und Server-Rendering sind
enthalten.

<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://unpkg.com/ranui/dist/index.js"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran/tree/main/packages/ranui"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

- **npm**: <a href="https://www.npmjs.com/package/ranui">`ranui`</a> ·
  **Quelltext**: <a href="https://github.com/chaxus/ran/tree/main/packages/ranui">`packages/ranui`</a>
- ranui ist **Alpha**: Versionen bringen Breaking Changes mit. Pinne eine exakte Version und lies vor
  dem Upgrade das [Änderungsprotokoll](/de/src/ranui/changelog).

## Installation

```bash
npm install ranui
```

```html
<!-- oder von einem CDN, ohne Build-Schritt -->
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>
```

## Verwendung

Der Import registriert die Elemente; danach schreibst du einfach Tags.

```js
import 'ranui'; // alle Komponenten
import 'ranui/button'; // oder nur eine
```

```html
<r-button type="primary">Projekt ausrollen</r-button>
```

Es ist in jedem Framework dasselbe Tag: Unterschiedlich ist nur, wie jedes Werte übergibt und Events
bindet — das behandeln die [Coding-Richtlinien](/de/src/ranui/coding-guides/#framework-integration)
vollständig:

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
// Komplexe Werte und Event-Listener laufen über eine ref — siehe die Coding-Richtlinien.
```

```vue [Vue]
<template>
  <r-button type="primary" @click="deploy">Deploy</r-button>
</template>

<script setup>
import 'ranui';
</script>
<!-- Ergänze `r-` in compilerOptions.isCustomElement deiner Build-Konfiguration. -->
```

```js [Plain JS]
import 'ranui';

const button = document.createElement('r-button');
button.textContent = 'Deploy';
document.body.appendChild(button);
```

:::

## Einstiegspunkte

Jeder Einstiegspunkt registriert genau das, was sein Name sagt — eine Seite, die nur Theming will,
zahlt also nie für die Komponentenbibliothek.

| Import                                                | Enthält                                                                 |
| ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `ranui`                                               | Alle Komponenten                                                        |
| `ranui/<component>`                                   | Eine Komponente: `ranui/button`, `ranui/select`, …                      |
| [`ranui/theme`](/de/src/ranui/theme/)                 | Helles/dunkles Theme und Token-Überschreibungen; keine Elemente         |
| [`ranui/i18n`](/de/src/ranui/i18n/)                   | Die Übersetzungs-Engine; keine Elemente                                 |
| `ranui/fonts`                                         | Selbst gehostete Geist Sans + Geist Mono                                |
| `ranui/style`                                         | Das Stylesheet, falls dein Setup es nicht selbst einbindet              |
| [`ranui/builder`](/de/src/ranui/builder/)             | Der flüssige DOM-Builder mit feingranularer Reaktivität                 |
| [`ranui/ssr`](/de/src/ranui/ssr/), `ranui/ssr-stream` | Server-Rendering                                                        |
| `ranui/testing`                                       | Helfer, um aus einem Test in einen geschlossenen Shadow Root zu greifen |
| `ranui/typings`                                       | Ambiente JSX-/TS-Elementtypen                                           |

## Komponenten

40 Elemente. Alle, samt Attributen, Eigenschaften, Events, Slots und `::part()`-Namen, stehen in der
[Element-API-Referenz](/de/src/ranui/api).

**Allgemein**: [Button](/de/src/ranui/button/) · [Icon](/de/src/ranui/icon/) ·
[Loading](/de/src/ranui/loading/)

**Dateneingabe**: [Input](/de/src/ranui/input/) · [CheckBox](/de/src/ranui/checkbox/) ·
[Select](/de/src/ranui/select/) · [ColorPicker](/de/src/ranui/colorpicker/) ·
[Attachments](/de/src/ranui/attachments/) · [VoiceButton](/de/src/ranui/voice-button/) ·
[Forms](/de/src/ranui/form/)

**Datendarstellung**: [Card](/de/src/ranui/card/) · [Section](/de/src/ranui/section/) ·
[Tabs](/de/src/ranui/tab/) · [Image](/de/src/ranui/image/) · [Progress](/de/src/ranui/progress/) ·
[Radar](/de/src/ranui/radar/) · [Player](/de/src/ranui/player/) · [Preview](/de/src/ranui/preview/) ·
[Glass](/de/src/ranui/glass/) · [Scratch](/de/src/ranui/scratch/) ·
[StateDot](/de/src/ranui/state-dot/) · [DisclosureRow](/de/src/ranui/disclosure-row/)

**Inhaltsdarstellung**: [Markdown](/de/src/ranui/markdown/) · [Math](/de/src/ranui/math/) ·
[Mermaid](/de/src/ranui/mermaid/)

**KI & Chat**: [Conversation](/de/src/ranui/conversation/) ·
[Reasoning](/de/src/ranui/reasoning/) · [ToolCard](/de/src/ranui/tool-card/) ·
[TokenMeter](/de/src/ranui/token-meter/)

**Overlays & Rückmeldung**: [Modal](/de/src/ranui/modal/) · [Popover](/de/src/ranui/popover/) ·
[Dropdown](/de/src/ranui/dropdown/) · [Message](/de/src/ranui/message/) ·
[Skeleton](/de/src/ranui/skeleton/)

**Navigation**: [Router](/de/src/ranui/router/) · [Route](/de/src/ranui/route/) ·
[Link](/de/src/ranui/link/)

**Grundlagen**: [Theming](/de/src/ranui/theme/) · [ThemeSwitch](/de/src/ranui/theme-switch/) ·
[i18n](/de/src/ranui/i18n/)

Fünf Elemente haben keine eigene Seite, weil sie nur innerhalb eines anderen existieren:
`<r-option>` (Select), `<r-tabs>` (Tabs), `<r-img>` (Image), `<r-dropdown-item>` (Dropdown) und
`<r-content>` (Popover). In der API-Referenz stehen sie wie alles andere.

### Live

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

## Styling

Komponenten rendern in einen **geschlossenen** Shadow Root: Seiten-CSS dringt nicht hinein, und
Selektoren greifen nicht hindurch. Es gibt vier Wege, in bevorzugter Reihenfolge.

**1. Design-Tokens (CSS-Custom-Properties)**: Sie werden über die Grenze vererbt — eines auf `:root`,
auf einem Wrapper oder auf dem Element selbst zu setzen funktioniert also gleichermaßen:

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

**2. `::part()`** für strukturelle Feinheiten, die die Tokens nicht abdecken ·
**3. das Attribut `sheet`**, um CSS in den Shadow Root zu injizieren ·
**4. Slot-Inhalt**, der in deinem Dokument bleibt und dein Seiten-CSS übernimmt.

Die Tokennamen sind das [Designsystem](/de/src/ranui/design-system/); die Regeln zur Auswahl sind die
[Designrichtlinien](/de/src/ranui/design-guides/); die Mechanik steht in den
[Coding-Richtlinien](/de/src/ranui/coding-guides/#styling-across-the-shadow-boundary).

## Events

Komponenten lösen `CustomEvent`s aus, die Nutzlast steckt in `detail`. Binde am Element: Ob ein Event
bubbelt, entscheidet jede Komponente für sich, und die API-Referenz nennt es für jede:

```html
<r-select id="env"></r-select>

<script>
  document.getElementById('env').addEventListener('change', (event) => {
    console.log(event.detail.value);
  });
</script>
```

Die Attributform `onchange="…"` und die Eigenschaftsform `el.onchange = …` funktionieren ebenfalls,
da dies gewöhnliche DOM-Elemente sind — sie erlauben aber nur einen Handler und keine Capture-Phase,
`addEventListener` ist also die erste Wahl.

## Wie es weitergeht

| Wenn du … willst                             | Lies                                               |
| -------------------------------------------- | -------------------------------------------------- |
| die genaue API eines Elements nachschlagen   | [Element-API](/de/src/ranui/api)                   |
| wissen, welches Token du nimmst und warum    | [Designsystem](/de/src/ranui/design-system/)       |
| einen Screen bauen, der wie ein System wirkt | [Designrichtlinien](/de/src/ranui/design-guides/)  |
| ranui sauber in eine App einbinden           | [Coding-Richtlinien](/de/src/ranui/coding-guides/) |
| Hell/Dunkel ergänzen oder alles umgestalten  | [Theming](/de/src/ranui/theme/)                    |
| die Oberfläche übersetzen                    | [i18n](/de/src/ranui/i18n/)                        |
| auf einem Server rendern                     | [Server-Rendering](/de/src/ranui/ssr/)             |
| reaktive Views ohne Framework bauen          | [Builder](/de/src/ranui/builder/)                  |
| vor dem Upgrade sehen, was sich geändert hat | [Änderungsprotokoll](/de/src/ranui/changelog)      |

## Browserunterstützung

Die Bibliothek läuft in jedem modernen Browser: Sie setzt auf Custom Elements v1, Shadow DOM v1 und
CSS-Custom-Properties. **Internet Explorer wird nicht unterstützt.**

![](../../../assets/ranui/customElements.png)

## Mitwirkende

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Weiterführendes

Standards, auf denen diese Bibliothek aufbaut: [W3C](https://www.w3.org/) ·
[ECMA](https://www.ecma-international.org/) · [RFCs](https://www.rfc-editor.org/) ·
[Can I use](https://caniuse.com/)

Design-Referenzen, die man offen lassen sollte: [Checklist Design](https://www.checklist.design/) ·
[Laws of UX](https://lawsofux.com/) · [Geist](https://vercel.com/geist) ·
[Ant Design](https://ant.design/index-cn) · [Element UI](https://element.eleme.cn/#/zh-CN) ·
[Animista](https://animista.net/) · [WebGradients](https://webgradients.com/)
