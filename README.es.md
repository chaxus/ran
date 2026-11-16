<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center"><b>Componentes web para chat con IA e interfaces de producto. Una etiqueta <code>&lt;r-*&gt;</code> funciona igual en React, Vue, Svelte o un archivo HTML simple.</b></p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="ranui en npm"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="ranuts en npm"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="estado de CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="licencia MIT"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/es/">Documentación</a> · <a href="https://ran.chaxus.com/es/ranui/">Componentes</a> · <a href="https://ran.chaxus.com/es/agents/">Agentes</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <b>Español</b> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## En cifras

|                                                      |       ranui | Shoelace | Web Awesome | Material Web |
| ---------------------------------------------------- | ----------: | -------: | ----------: | -----------: |
| Un botón, con todas sus dependencias y el tema, gzip | **12.4 kB** |  22.5 kB |     41.1 kB |      14.4 kB |
| 1000 botones creados y renderizados                  |   **32 ms** |    52 ms |       60 ms |       102 ms |

| ranui por sí solo                                                                           |                  |
| ------------------------------------------------------------------------------------------- | ---------------: |
| Un formulario de cinco controles (button, input, checkbox, select, modal), gzip             |          41.3 kB |
| Renderizado en servidor de 140 elementos a Declarative Shadow DOM, Node                     |           1.5 ms |
| Primer pintado con estilos, renderizado en servidor frente a solo cliente (Slow 4G, CPU 4×) | 424 ms vs 662 ms |
| [ran.chaxus.com](https://ran.chaxus.com/) en Lighthouse móvil: puntuación, LCP, CLS         |     97, 2.5 s, 0 |

<details>
<summary>Cómo se midió</summary>

- **Comparativa directa:** ranui 0.5.5, Shoelace 2.20.1, Web Awesome 3.14.0 (gratuito), Material Web 2.5.0, cada uno desde npm. El tamaño es el punto de entrada del botón empaquetado con `esbuild --bundle --minify --format=esm`, más la hoja de estilos del tema que pide la documentación de cada biblioteca (Material Web no necesita ninguna), comprimido con `gzip -9`. Los botones de Web Awesome y Shoelace arrastran sus componentes de icono y de spinner. El tiempo es la mediana de 10 páginas nuevas: crear 1000 botones, añadirlos, esperar una tarea para que los componentes basados en Lit terminen de renderizar y leer el layout.
- **Tamaño del formulario:** los cinco componentes importados juntos desde un build de `main` (`3f54e43`) y empaquetados con esbuild, contando todos los archivos que descargó el navegador. Importados uno a uno suman 74.4 kB, porque comparten un mismo runtime.
- **Renderizado en servidor:** `renderHTMLToString` de `ranui/ssr-stream` sobre una página de 20 formularios, mediana de 15 muestras. La salida son 947 kB de HTML (125 kB con gzip), porque cada elemento lleva sus propios estilos.
- **Primer pintado con estilos:** la misma página de 20 formularios, con gzip, Chromium limitado a Slow 4G y una CPU 4× más lenta, mediana de 10 ejecuciones. Con renderizado en servidor, el formulario aparece con estilos en el primer pintado; solo en cliente, recibe estilos cuando cargan los componentes. Al hacer el upgrade de los componentes, la página renderizada en servidor se desplaza actualmente con un CLS de 0.125.
- **Lighthouse:** Lighthouse 12.8 con el perfil móvil, mediana de tres ejecuciones. La página del botón obtiene lo mismo (97, LCP 2.3 s, CLS 0).

</details>

ran tiene tres partes que se pueden usar por separado: **ranui**, componentes de interfaz creados como elementos personalizados nativos; **ranuts**, utilidades de TypeScript con tipos; y **Ran Design**, métodos de maquetación, interacción y revisión que personas y agentes de programación pueden aplicar en cualquier stack.

- **Funciona con cualquier framework, o sin ninguno.** Cada componente es una etiqueta `<r-*>`, así que React, Vue, Svelte y un archivo HTML simple lo usan igual. No hay adaptador ni runtime de framework, y basta con una etiqueta script.
- **Piezas para interfaces de chat con IA.** Una vista de conversación que sigue la salida en streaming, Markdown que renderiza texto a medio escribir, filas de razonamiento y de llamadas a herramientas, adjuntos y entrada por voz. `ranuts/stream` interpreta la respuesta en streaming.
- **Temas, renderizado en servidor y tipos incluidos.** Temas claro y oscuro mediante design tokens, utilidades de SSR y declaraciones de TypeScript vienen con el paquete.
- **Instala solo lo que uses.** Cada paquete y cada componente tiene su propio punto de entrada.

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
