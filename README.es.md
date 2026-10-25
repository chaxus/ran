<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Métodos de diseño, componentes y herramientas para crear productos web, para desarrolladores y agentes de programación.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="ranui en npm"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="ranuts en npm"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="estado de CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="licencia MIT"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/es/">Documentación</a> · <a href="https://ran.chaxus.com/es/ranui/">Componentes</a> · <a href="https://ran.chaxus.com/es/agents/">Agentes</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <b>Español</b> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran tiene tres partes que se pueden usar por separado: **ranui**, componentes de interfaz creados como elementos personalizados nativos; **ranuts**, utilidades de TypeScript con tipos; y **Ran Design**, métodos de maquetación, interacción y revisión que personas y agentes de programación pueden aplicar en cualquier stack.

- **Funciona con cualquier framework, o sin ninguno.** Cada componente es una etiqueta `<r-*>`, así que React, Vue, Svelte y un archivo HTML simple lo usan igual. No hay adaptador ni runtime de framework, y basta con una etiqueta script.
- **Piezas para interfaces de chat con IA.** Una vista de conversación que sigue la salida en streaming, Markdown que renderiza texto a medio escribir, filas de razonamiento y de llamadas a herramientas, adjuntos y entrada por voz. `ranuts/stream` interpreta la respuesta en streaming.
- **Temas, renderizado en servidor y tipos incluidos.** Temas claro y oscuro mediante design tokens, utilidades de SSR y declaraciones de TypeScript vienen con el paquete.
- **Instala solo lo que uses.** Cada paquete y cada componente tiene su propio punto de entrada.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/readme-home-dark.webp">
    <img width="800" src="./.github/assets/readme-home.webp" alt="La página de inicio de ran.chaxus.com: el marcado de ranui a la izquierda de un panel en vivo que muestra los mismos botones, barra de progreso, indicador de carga y casilla">
  </picture>
</p>

## Paquetes

| Paquete                                  | Para qué sirve                                                                                                                                                              |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.es.md)   | Formularios, diálogos, tablas, Markdown, reproductores multimedia y vistas de chat con IA como elementos personalizados, con temas y utilidades de renderizado en servidor. |
| [ranuts](./packages/ranuts/README.es.md) | Utilidades para cadenas, color, tiempo, archivos, almacenamiento y el DOM, además de análisis de SSE y estado de respuestas en streaming.                                   |
| [Ran Design](./design/README.md)         | Métodos de composición, interacción, movimiento y revisión basada en evidencias. Se distribuye como plugin para agentes y no requiere ranui.                                |

La capa de construcción y reactividad de ranui se publica por separado como [@alixex/ranview](./packages/ranview/README.md).

## Inicio rápido

Sin paso de compilación, carga un componente desde un CDN y escribe la etiqueta:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Guardar</r-button>
```

Con un empaquetador, instala el paquete e importa los componentes que uses:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui está en fase alfa y sus versiones pueden incluir cambios incompatibles, así que fija una versión exacta en producción. La [documentación de componentes](https://ran.chaxus.com/es/ranui/) tiene ejemplos en vivo, eventos y estilos de cada elemento.

## Uso con un agente de programación

El plugin **ran** añade las skills design, ranui y ranuts a Claude Code y Codex. No necesita servidor MCP ni cuenta.

```sh
claude plugin marketplace add chaxus/ran && claude plugin install ran@ran
```

```sh
codex plugin marketplace add chaxus/ran && codex plugin add ran@ran
```

En una sesión nueva, usa `/ran:design`, `/ran:ranui` o `/ran:ranuts` en Claude Code, o `$design`, `$ranui` o `$ranuts` en Codex. Para instalarlo desde una copia local, consulta la [guía de agentes](https://ran.chaxus.com/es/agents/); las skills están en [plugins/ran](./plugins/ran/).

## Contribuir

Usa Node 24 o superior y la versión de pnpm fijada en `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

Lee [AGENTS.md](./AGENTS.md) antes de contribuir y la [guía de publicación](./docs/RELEASING.md) al preparar paquetes.

## Licencia

[MIT](./LICENSE)
