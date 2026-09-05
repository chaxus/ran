---
description: 'ranui es una biblioteca de UI en Web Components construida sobre custom elements nativos (<r-*>), con tipos TypeScript, tema claro/oscuro, Shadow DOM, SSR y soporte para PWA.'
---

# ranui

Una biblioteca de UI construida sobre **custom elements nativos**. Cada componente es una etiqueta
`<r-*>`, así que funciona igual en React, Vue, Svelte, Solid, Astro o en un archivo HTML a secas.
No hay adaptador ni versión de framework que hacer coincidir. Incluye tipos TypeScript, tema claro
y oscuro mediante design tokens, encapsulación con Shadow DOM y renderizado en servidor.

<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui.svg" alt="npm-v"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/dt/ranui.svg" alt="npm-d"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://unpkg.com/ranui/dist/index.js"><img src="https://img.badgesize.io/https:/unpkg.com/ranui/dist/index.js?label=brotli&compression=brotli" alt="brotli"></a>
<a style="display:inline-block;margin-left: 4px;" href="https://github.com/chaxus/ran/tree/main/packages/ranui"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

- **npm**: <a href="https://www.npmjs.com/package/ranui">`ranui`</a> ·
  **código**: <a href="https://github.com/chaxus/ran/tree/main/packages/ranui">`packages/ranui`</a>
- ranui está en **alfa**: las versiones traen cambios incompatibles. Fija una versión exacta y lee el
  [registro de cambios](/es/src/ranui/changelog) antes de actualizar.

## Instalación

```bash
npm install ranui
```

```html
<!-- o desde una CDN, sin paso de compilación -->
<script src="https://unpkg.com/ranui/dist/umd/index.umd.cjs"></script>
```

## Cómo se usa

Importar registra los elementos; a partir de ahí escribes etiquetas.

```js
import 'ranui'; // todos los componentes
import 'ranui/button'; // o solo uno
```

```html
<r-button type="primary">Desplegar proyecto</r-button>
```

Es la misma etiqueta en todos los frameworks: lo que cambia es cómo cada uno pasa valores y enlaza
eventos, algo que la [guía de código](/es/src/ranui/coding-guides/#framework-integration) cubre por
completo:

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
// Los valores complejos y los listeners van por un ref — consulta la guía de código.
```

```vue [Vue]
<template>
  <r-button type="primary" @click="deploy">Deploy</r-button>
</template>

<script setup>
import 'ranui';
</script>
<!-- Añade `r-` a compilerOptions.isCustomElement en la configuración de build. -->
```

```js [Plain JS]
import 'ranui';

const button = document.createElement('r-button');
button.textContent = 'Deploy';
document.body.appendChild(button);
```

:::

## Puntos de entrada

Cada entrada registra exactamente lo que dice su nombre, así que una página que solo quiere temas
nunca paga por la biblioteca de componentes.

| Import                                                | Contiene                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| `ranui`                                               | Todos los componentes                                         |
| `ranui/<component>`                                   | Un componente: `ranui/button`, `ranui/select`, …              |
| [`ranui/theme`](/es/src/ranui/theme/)                 | Tema claro/oscuro y sobrescritura de tokens; sin elementos    |
| [`ranui/i18n`](/es/src/ranui/i18n/)                   | El motor de traducción; sin elementos                         |
| `ranui/fonts`                                         | Geist Sans + Geist Mono autoalojadas                          |
| `ranui/style`                                         | La hoja de estilos, si tu configuración no la recoge sola     |
| [`ranui/builder`](/es/src/ranui/builder/)             | El constructor de DOM fluido con reactividad de grano fino    |
| [`ranui/ssr`](/es/src/ranui/ssr/), `ranui/ssr-stream` | Renderizado en servidor                                       |
| `ranui/testing`                                       | Ayudas para entrar en un shadow root cerrado desde una prueba |
| `ranui/typings`                                       | Tipos ambientales de elementos para JSX / TS                  |

## Componentes

40 elementos. Todos ellos, con sus atributos, propiedades, eventos, slots y nombres de `::part()`,
están en la [referencia de la API de elementos](/es/src/ranui/api).

**Comunes**: [Button](/es/src/ranui/button/) · [Icon](/es/src/ranui/icon/) ·
[Loading](/es/src/ranui/loading/)

**Entrada de datos**: [Input](/es/src/ranui/input/) · [CheckBox](/es/src/ranui/checkbox/) ·
[Select](/es/src/ranui/select/) · [ColorPicker](/es/src/ranui/colorpicker/) ·
[Attachments](/es/src/ranui/attachments/) · [VoiceButton](/es/src/ranui/voice-button/) ·
[Forms](/es/src/ranui/form/)

**Presentación de datos**: [Card](/es/src/ranui/card/) · [Section](/es/src/ranui/section/) ·
[Tabs](/es/src/ranui/tab/) · [Image](/es/src/ranui/image/) · [Progress](/es/src/ranui/progress/) ·
[Radar](/es/src/ranui/radar/) · [Player](/es/src/ranui/player/) · [Preview](/es/src/ranui/preview/) ·
[Glass](/es/src/ranui/glass/) · [Scratch](/es/src/ranui/scratch/) ·
[StateDot](/es/src/ranui/state-dot/) · [DisclosureRow](/es/src/ranui/disclosure-row/)

**Renderizado de contenido**: [Markdown](/es/src/ranui/markdown/) · [Math](/es/src/ranui/math/) ·
[Mermaid](/es/src/ranui/mermaid/)

**IA y chat**: [Conversation](/es/src/ranui/conversation/) ·
[Reasoning](/es/src/ranui/reasoning/) · [ToolCard](/es/src/ranui/tool-card/) ·
[TokenMeter](/es/src/ranui/token-meter/)

**Capas y avisos**: [Modal](/es/src/ranui/modal/) · [Popover](/es/src/ranui/popover/) ·
[Dropdown](/es/src/ranui/dropdown/) · [Message](/es/src/ranui/message/) ·
[Skeleton](/es/src/ranui/skeleton/)

**Navegación**: [Router](/es/src/ranui/router/) · [Route](/es/src/ranui/route/) ·
[Link](/es/src/ranui/link/)

**Fundamentos**: [Temas](/es/src/ranui/theme/) · [ThemeSwitch](/es/src/ranui/theme-switch/) ·
[i18n](/es/src/ranui/i18n/)

Cinco elementos no tienen página propia porque solo existen dentro de otro: `<r-option>`
(Select), `<r-tabs>` (Tabs), `<r-img>` (Image), `<r-dropdown-item>` (Dropdown) y
`<r-content>` (Popover). Están en la referencia de la API como todo lo demás.

### En vivo

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

Los componentes se dibujan en un shadow root **cerrado**: el CSS de la página no se cuela dentro y
los selectores no alcanzan hacia adentro. Hay cuatro vías, por orden de preferencia.

**1. Design tokens (propiedades personalizadas de CSS)**: se heredan a través del límite, así que
definirlos en `:root`, en un contenedor o en el propio elemento funciona igual:

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

**2. `::part()`** para retoques estructurales que los tokens no cubren ·
**3. el atributo `sheet`** para inyectar CSS en el shadow root ·
**4. contenido en slots**, que se queda en tu documento y toma el CSS de tu página.

Los nombres de los tokens son el [sistema de diseño](/es/src/ranui/design-system/); las reglas para
elegir entre ellos son la [guía de diseño](/es/src/ranui/design-guides/); la mecánica está en la
[guía de código](/es/src/ranui/coding-guides/#styling-across-the-shadow-boundary).

## Eventos

Los componentes despachan `CustomEvent` con la carga en `detail`. Enlaza en el elemento: que un
evento burbujee es una decisión por componente, y la referencia de la API lo indica para cada uno:

```html
<r-select id="env"></r-select>

<script>
  document.getElementById('env').addEventListener('change', (event) => {
    console.log(event.detail.value);
  });
</script>
```

La forma de atributo `onchange="…"` y la de propiedad `el.onchange = …` también funcionan, ya que
son elementos del DOM normales, pero solo admiten un manejador y no tienen fase de captura, así que
`addEventListener` es la vía a la que recurrir.

## Adónde ir después

| Si quieres…                                        | Lee                                               |
| -------------------------------------------------- | ------------------------------------------------- |
| Consultar la API exacta de un elemento             | [API de elementos](/es/src/ranui/api)             |
| Saber qué token usar, y por qué                    | [Sistema de diseño](/es/src/ranui/design-system/) |
| Construir una pantalla que parezca un solo sistema | [Guía de diseño](/es/src/ranui/design-guides/)    |
| Integrar ranui en una aplicación correctamente     | [Guía de código](/es/src/ranui/coding-guides/)    |
| Añadir claro/oscuro, o rehacer todo el estilo      | [Temas](/es/src/ranui/theme/)                     |
| Traducir la interfaz                               | [i18n](/es/src/ranui/i18n/)                       |
| Renderizar en un servidor                          | [Renderizado en servidor](/es/src/ranui/ssr/)     |
| Construir vistas reactivas sin framework           | [Builder](/es/src/ranui/builder/)                 |
| Ver qué cambió antes de actualizar                 | [Registro de cambios](/es/src/ranui/changelog)    |

## Compatibilidad con navegadores

La biblioteca funciona en todos los navegadores modernos: está construida sobre Custom Elements v1,
Shadow DOM v1 y propiedades personalizadas de CSS. **Internet Explorer no está soportado.**

![](../../../assets/ranui/customElements.png)

## Colaboradores

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Para seguir leyendo

Estándares sobre los que se apoya esta biblioteca: [W3C](https://www.w3.org/) ·
[ECMA](https://www.ecma-international.org/) · [RFC](https://www.rfc-editor.org/) ·
[Can I use](https://caniuse.com/)

Referencias de diseño que conviene tener a mano: [Checklist Design](https://www.checklist.design/) ·
[Laws of UX](https://lawsofux.com/) · [Geist](https://vercel.com/geist) ·
[Ant Design](https://ant.design/index-cn) · [Element UI](https://element.eleme.cn/#/zh-CN) ·
[Animista](https://animista.net/) · [WebGradients](https://webgradients.com/)
