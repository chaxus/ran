# ran

<p align="center">
  <a href="https://ran.chaxus.com/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
      <img width="120" src="./packages/docs/public/icon.png" alt="ran">
    </picture>
  </a>
</p>

Web Components, construtores DOM e utilitários TypeScript no mesmo workspace.

[![CI](https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml)](https://github.com/chaxus/ran/actions/workflows/ci.yml) · [MIT](./LICENSE)

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | **Português** | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

> Em fase alpha: APIs e formatos podem mudar. Fixe uma versão exata e leia o guia de migração antes de atualizar.

## Pacotes

| Pacote                                        | Uso                                                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [ranui](packages/ranui/README.pt.md)          | Web Components independentes de framework com Shadow DOM, tokens de tema e ferramentas SSR. |
| [ranuts](packages/ranuts/README.pt.md)        | Utilitários TypeScript para APIs do navegador, dados, streams e renderização 2D.            |
| [@alixex/ranview](packages/ranview/README.md) | Construtores DOM, sinais e snapshots HTML sem a biblioteca de componentes.                  |

## Início rápido

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

Coloque o elemento personalizado no HTML:

```html
<r-button type="primary">Hello</r-button>
```

## Documentação

- [ranui](https://ran.chaxus.com/pt/src/ranui/)
- [ranuts](https://ran.chaxus.com/pt/src/ranuts/)
- [@alixex/ranview](packages/ranview/README.md)
- [Guia de migração](https://ran.chaxus.com/pt/src/ranuts/migration/)

## Desenvolvimento do repositório

Use Node 24+ e pnpm. Execute na raiz do repositório:

```sh
git clone https://github.com/chaxus/ran.git
cd ran
pnpm install --frozen-lockfile
pnpm build
pnpm --filter ranui dev
```

Outros comandos de desenvolvimento:

```sh
pnpm --filter docs dev
pnpm test
pnpm lint
pnpm verify:docs
pnpm clean
```

`pnpm clean` remove arquivos gerados e preserva o código, as dependências instaladas e o arquivo de lock.

## Outros projetos e material de estudo

Ferramentas de documentação: [docs](packages/docs), [ranpress](packages/ranpress) e [site](packages/site). [im](packages/im) é um aplicativo de chat experimental.

Exemplos nativos: [C/C++](packages/cpro), [processamento de imagens](packages/image-process) e [Rust](packages/rust). Material preservado: [Shader](docs/learning/visual/README.md) e [Koa/Nginx](docs/learning/debug/README.md).

O estado do workspace e as verificações CI estão em [packages/manifest.json](packages/manifest.json).

## AI / Claude Code

[Referência para mantenedores e agentes](packages/ranui/CLAUDE.md) · [ranuts](packages/ranuts/CLAUDE.md)

```text
/plugin marketplace add chaxus/ran
/plugin install ranui@ran
/plugin install ranuts@ran
```

## Contribuir

Consulte [AGENTS.md](AGENTS.md) para responsabilidades e verificações. Mantenha exemplos alinhados às exportações públicas e execute as verificações do seu ajuste.

## Licença

[MIT](./LICENSE)
