<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Métodos de diseño, componentes y herramientas para crear productos web, para desarrolladores y agentes de programación.</p>
<p align="center"><a href="https://ran.chaxus.com/es/">Documentación</a> · <a href="https://ran.chaxus.com/es/src/ranui/">Componentes</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <b>Español</b> · <a href="./README.pt.md">Português</a> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran tiene tres partes que se pueden usar por separado: **ranui**, componentes de interfaz creados como elementos personalizados nativos; **ranuts**, utilidades de TypeScript con tipos; y **Ran Design**, métodos de maquetación, interacción y revisión que personas y agentes de programación pueden aplicar en cualquier stack. Cada componente de ranui es una etiqueta `<r-*>`, así que funciona igual en React, Vue, Svelte o HTML sin framework, e incluye piezas para interfaces de chat con IA.

## Instalación

Sin paso de compilación, carga el componente desde un CDN y escribe la etiqueta:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Guardar</r-button>
```

Con un empaquetador:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

ranui está en fase alfa y sus versiones pueden incluir cambios incompatibles; fija una versión exacta en producción.

## Más información

Consulta [ranui](./packages/ranui/README.es.md) y [ranuts](./packages/ranuts/README.es.md) para cada paquete, y el [sitio de documentación](https://ran.chaxus.com/es/) para ejemplos en vivo. El plugin para agentes de programación y la guía para contribuir están en el [README en inglés](./README.md).

## Licencia

[MIT](./LICENSE)
