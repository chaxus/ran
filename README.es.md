# ran

<p align="center">
  <a href="https://ran.chaxus.com/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
      <img width="120" src="./packages/docs/public/icon.png" alt="ran">
    </picture>
  </a>
</p>

Web Components, constructores DOM y utilidades TypeScript en un mismo espacio de trabajo.

[![CI](https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml)](https://github.com/chaxus/ran/actions/workflows/ci.yml) · [MIT](./LICENSE)

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | **Español** | [Português](./README.pt.md) | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> Versión preliminar: las APIs y los formatos pueden cambiar. Fija una versión exacta y consulta la guía de migración antes de actualizar.

## Paquetes

| Paquete                                       | Uso                                                                                            |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [ranui](packages/ranui/README.es.md)          | Web Components independientes del framework con Shadow DOM, tokens de tema y herramientas SSR. |
| [ranuts](packages/ranuts/README.es.md)        | Utilidades TypeScript para APIs del navegador, datos, flujos y renderizado 2D.                 |
| [@alixex/ranview](packages/ranview/README.md) | Constructores DOM, señales e instantáneas HTML sin la biblioteca de componentes.               |

## Inicio rápido

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

Añade el elemento personalizado al HTML:

```html
<r-button type="primary">Hello</r-button>
```

## Documentación

- [ranui](https://ran.chaxus.com/es/src/ranui/)
- [ranuts](https://ran.chaxus.com/es/src/ranuts/)
- [@alixex/ranview](packages/ranview/README.md)
- [Guía de migración](https://ran.chaxus.com/es/src/ranuts/migration/)

## Desarrollo del repositorio

Usa Node 24+ y pnpm. Ejecuta desde la raíz del repositorio:

```sh
git clone https://github.com/chaxus/ran.git
cd ran
pnpm install --frozen-lockfile
pnpm build
pnpm --filter ranui dev
```

Otros comandos de desarrollo:

```sh
pnpm --filter docs dev
pnpm test
pnpm lint
pnpm verify:docs
pnpm clean
```

`pnpm clean` elimina los archivos generados y conserva el código, las dependencias instaladas y el archivo de bloqueo.

## Otros proyectos y material de aprendizaje

Herramientas de documentación: [docs](packages/docs), [ranpress](packages/ranpress) y [site](packages/site). [im](packages/im) es una aplicación de chat experimental.

Ejemplos nativos: [C/C++](packages/cpro), [procesamiento de imágenes](packages/image-process) y [Rust](packages/rust). Material conservado: [Shader](docs/learning/visual/README.md) y [Koa/Nginx](docs/learning/debug/README.md).

El estado de los proyectos y las comprobaciones CI se declaran en [packages/manifest.json](packages/manifest.json).

## AI / Claude Code

[Referencia para mantenedores y agentes](packages/ranui/CLAUDE.md) · [ranuts](packages/ranuts/CLAUDE.md)

```text
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
/plugin install ranuts@ran
```

## Contribuir

Consulta [AGENTS.md](AGENTS.md) para encontrar responsables y verificaciones. Mantén los ejemplos alineados con las exportaciones públicas y ejecuta las comprobaciones de tu cambio.

[Guía de publicación](docs/RELEASING.md)

## Licencia

[MIT](./LICENSE)
