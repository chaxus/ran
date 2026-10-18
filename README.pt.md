<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Web Components, construtores DOM e utilitários TypeScript.</p>
<p align="center"><a href="https://ran.chaxus.com/pt/">Documentação</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <b>Português</b> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## Pacotes

| Pacote                                          | Uso                                                  |
| ----------------------------------------------- | ---------------------------------------------------- |
| [ranui](https://ran.chaxus.com/pt/src/ranui/)   | Componentes de UI independentes de framework.        |
| [ranuts](https://ran.chaxus.com/pt/src/ranuts/) | Utilitários para navegador e processamento de dados. |
| [@alixex/ranview](packages/ranview/README.md)   | Construtores DOM e sinais reativos.                  |

## Início rápido

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

```html
<r-button type="primary">Hello</r-button>
```

## Desenvolvimento

Node 24+ · pnpm 11.6.0

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm -F docs dev
pnpm test
```

[Contribuir](./AGENTS.md) · [MIT](./LICENSE)
