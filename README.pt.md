<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Métodos de design, componentes e ferramentas para criar produtos web, para desenvolvedores e agentes de programação.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="ranui no npm"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="ranuts no npm"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="status do CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="licença MIT"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/pt/">Documentação</a> · <a href="https://ran.chaxus.com/pt/src/ranui/">Componentes</a> · <a href="https://ran.chaxus.com/pt/src/agents/">Agentes</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <b>Português</b> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

O ran tem três partes que podem ser usadas separadamente: **ranui**, componentes de interface criados como elementos personalizados nativos; **ranuts**, utilitários TypeScript tipados; e **Ran Design**, métodos de layout, interação e revisão que pessoas e agentes de programação podem aplicar em qualquer stack.

- **Funciona com qualquer framework, ou sem nenhum.** Cada componente é uma tag `<r-*>`, então React, Vue, Svelte e um arquivo HTML simples o usam da mesma forma. Não há adaptador nem runtime de framework, e uma tag script basta.
- **Peças para interfaces de chat com IA.** Uma visualização de conversa que acompanha a saída em streaming, Markdown que renderiza texto ainda incompleto, linhas de raciocínio e de chamadas de ferramentas, anexos e entrada por voz. `ranuts/stream` interpreta a resposta em streaming.
- **Temas, renderização no servidor e tipos incluídos.** Temas claro e escuro por design tokens, utilitários de SSR e declarações TypeScript vêm com o pacote.
- **Instale só o que usar.** Cada pacote e cada componente tem seu próprio ponto de entrada.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/readme-home-dark.webp">
    <img width="800" src="./.github/assets/readme-home.webp" alt="A página inicial de ran.chaxus.com: a marcação do ranui à esquerda de um painel ao vivo que mostra os mesmos botões, barra de progresso, indicador de carregamento e caixa de seleção">
  </picture>
</p>

## Pacotes

| Pacote                                   | Para que serve                                                                                                                                                        |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.pt.md)   | Formulários, diálogos, tabelas, Markdown, players de mídia e telas de chat com IA como elementos personalizados, com temas e utilitários de renderização no servidor. |
| [ranuts](./packages/ranuts/README.pt.md) | Utilitários para strings, cor, tempo, arquivos, armazenamento e o DOM, além de análise de SSE e estado de respostas em streaming.                                     |
| [Ran Design](./design/README.md)         | Métodos de composição, interação, movimento e revisão baseada em evidências. Distribuído como plugin para agentes e não exige o ranui.                                |

A camada de construção e reatividade do ranui é publicada separadamente como [@alixex/ranview](./packages/ranview/README.md).

## Início rápido

Sem etapa de build, carregue um componente de um CDN e escreva a tag:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Salvar</r-button>
```

Com um bundler, instale o pacote e importe os componentes que usar:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

O ranui está em fase alfa e as versões podem trazer mudanças incompatíveis, então fixe uma versão exata em produção. A [documentação de componentes](https://ran.chaxus.com/pt/src/ranui/) tem exemplos ao vivo, eventos e estilos de cada elemento.

## Uso com um agente de programação

O plugin **ran** adiciona as skills design, ranui e ranuts ao Claude Code e ao Codex. Não precisa de servidor MCP nem de conta.

```sh
claude plugin marketplace add chaxus/ran && claude plugin install ran@ran
```

```sh
codex plugin marketplace add chaxus/ran && codex plugin add ran@ran
```

Em uma nova sessão, use `/ran:design`, `/ran:ranui` ou `/ran:ranuts` no Claude Code, ou `$design`, `$ranui` ou `$ranuts` no Codex. Para instalar a partir de um clone local, veja o [guia de agentes](https://ran.chaxus.com/pt/src/agents/); as skills ficam em [plugins/ran](./plugins/ran/).

## Como contribuir

Use Node 24 ou superior e a versão do pnpm fixada no `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

Leia o [AGENTS.md](./AGENTS.md) antes de contribuir e o [guia de publicação](./docs/RELEASING.md) ao preparar pacotes.

## Licença

[MIT](./LICENSE)
