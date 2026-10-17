# ranui

Web Components independientes del framework con Shadow DOM, tokens de tema y herramientas SSR.

[![npm](https://img.shields.io/npm/v/ranui.svg)](https://www.npmjs.com/package/ranui) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | **Español** | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> Versión preliminar: las APIs y los formatos pueden cambiar. Fija una versión exacta y consulta la guía de migración antes de actualizar.

## Inicio rápido

```sh
npm install ranui
```

Las importaciones usan ESM. Con un bundler, importa por componente y carga la hoja de estilos compartida una sola vez en la entrada de la aplicación.

```js
import 'ranui/button';
import 'ranui/input';
import 'ranui/style';
```

Añade el elemento personalizado al HTML:

```html
<r-input name="email" type="email" label="Email"></r-input> <r-button type="primary">Save</r-button>
```

## IIFE / CDN

Para una etiqueta script clásica, usa un IIFE independiente. Sustituye VERSION por una versión publicada; no necesitas bundler ni cargador de módulos.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui@VERSION/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Save</r-button>
```

El IIFE completo está en `dist/index.iife.js`. Elige el paquete completo o los paquetes por componente; no combines ambos en una página.

## TypeScript

Cada entrada incluye tipos. Para las declaraciones globales del navegador y JSX opcionales, usa una importación de tipos:

```ts
import type {} from 'ranui/typings';
```

Si TypeScript comprueba las importaciones CSS por efectos secundarios, declara la entrada CSS en `assets.d.ts` de tu aplicación:

```ts
declare module 'ranui/style';
```

## SSR

Usa Node 24+ para este ejemplo de servidor. Las importaciones de componentes registran sus serializadores SSR; el resultado incluye Declarative Shadow DOM.

```ts
import { Button } from 'ranui/button';
import { renderToString } from 'ranui/ssr';

const html = renderToString(new Button());
console.log(html);
```

## Theme

El modo de tema se activa explícitamente. Personaliza mediante tokens y parts públicos; las reglas y APIs completas están enlazadas abajo.

```ts
import { initTheme, setTheme } from 'ranui/theme';

initTheme();
setTheme('system');
```

## Documentación

[ranui](https://ran.chaxus.com/es/src/ranui/)

- [API de componentes](./docs/COMPONENTS.md)
- [Estilos y tokens](./docs/style-tokens-public.md)
- [Diseño e interacción](./docs/DESIGN.md) · [Interaction](./docs/INTERACTION.md)
- [Constructor DOM y señales](https://github.com/chaxus/ran/blob/main/packages/ranview/README.md)
- [Referencia para mantenedores y agentes](./CLAUDE.md)
- [Guía de migración](https://ran.chaxus.com/es/src/ranuts/migration/)

## Contribuir

[Referencia para mantenedores y agentes](./CLAUDE.md) · [CODING](./docs/CODING.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## Licencia

[MIT](./LICENSE)
