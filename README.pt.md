<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center"><b>Componentes web para chat com IA e interfaces de produto. Uma tag <code>&lt;r-*&gt;</code> funciona da mesma forma em React, Vue, Svelte ou um arquivo HTML simples.</b></p>

<p align="center">
  <a href="https://www.npmjs.com/package/ranui"><img src="https://img.shields.io/npm/v/ranui?label=ranui" alt="ranui no npm"></a>
  <a href="https://www.npmjs.com/package/ranuts"><img src="https://img.shields.io/npm/v/ranuts?label=ranuts" alt="ranuts no npm"></a>
  <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml"><img src="https://github.com/chaxus/ran/actions/workflows/ci.yml/badge.svg" alt="status do CI"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/chaxus/ran" alt="licença MIT"></a>
</p>

<p align="center"><a href="https://ran.chaxus.com/pt/">Documentação</a> · <a href="https://ran.chaxus.com/pt/ranui/">Componentes</a> · <a href="https://ran.chaxus.com/pt/agents/">Agentes</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <b>Português</b> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

## Em números

|                                                    |       ranui | Shoelace | Web Awesome | Material Web |
| -------------------------------------------------- | ----------: | -------: | ----------: | -----------: |
| Um botão, com todas as dependências e o tema, gzip | **12.4 kB** |  22.5 kB |     41.1 kB |      14.4 kB |
| 1000 botões criados e renderizados                 |   **32 ms** |    52 ms |       60 ms |       102 ms |

| ranui sozinho                                                                            |                  |
| ---------------------------------------------------------------------------------------- | ---------------: |
| Um formulário de cinco controles (button, input, checkbox, select, modal), gzip          |          41.3 kB |
| Renderização no servidor de 140 elementos para Declarative Shadow DOM, Node              |           1.5 ms |
| Primeira pintura com estilos, renderizado no servidor vs só no cliente (Slow 4G, CPU 4×) | 424 ms vs 662 ms |
| [ran.chaxus.com](https://ran.chaxus.com/) no Lighthouse mobile: pontuação, LCP, CLS      |     97, 2.5 s, 0 |

<details>
<summary>Como foi medido</summary>

- **Comparação direta:** ranui 0.5.5, Shoelace 2.20.1, Web Awesome 3.14.0 (gratuito), Material Web 2.5.0, cada um do npm. O tamanho é o ponto de entrada do botão empacotado com `esbuild --bundle --minify --format=esm`, mais a folha de estilos do tema que a documentação de cada biblioteca pede (o Material Web não precisa de nenhuma), comprimido com `gzip -9`. Os botões do Web Awesome e do Shoelace puxam seus componentes de ícone e de spinner. O tempo é a mediana de 10 páginas novas: criar 1000 botões, anexá-los, esperar uma tarefa para que os componentes baseados em Lit terminem de renderizar e ler o layout.
- **Tamanho do formulário:** os cinco componentes importados juntos de um build da `main` (`3f54e43`) e empacotados com esbuild, contando todos os arquivos que o navegador baixou. Importados um a um, somam 74.4 kB, porque compartilham um mesmo runtime.
- **Renderização no servidor:** `renderHTMLToString` de `ranui/ssr-stream` em uma página com 20 formulários, mediana de 15 amostras. A saída tem 947 kB de HTML (125 kB com gzip), porque cada elemento carrega seus próprios estilos.
- **Primeira pintura com estilos:** a mesma página de 20 formulários, com gzip, Chromium limitado a Slow 4G e uma CPU 4× mais lenta, mediana de 10 execuções. Renderizado no servidor, o formulário já aparece com estilos na primeira pintura; só no cliente, ganha estilos quando os componentes carregam. No upgrade, a página renderizada no servidor hoje se desloca com um CLS de 0.125.
- **Lighthouse:** Lighthouse 12.8 com o preset mobile, mediana de três execuções. A página do botão tem a mesma pontuação (97, LCP 2.3 s, CLS 0).

</details>

O ran tem três partes que podem ser usadas separadamente: **ranui**, componentes de interface criados como elementos personalizados nativos; **ranuts**, utilitários TypeScript tipados; e **Ran Design**, métodos de layout, interação e revisão que pessoas e agentes de programação podem aplicar em qualquer stack.

- **Funciona com qualquer framework, ou sem nenhum.** Cada componente é uma tag `<r-*>`, então React, Vue, Svelte e um arquivo HTML simples o usam da mesma forma. Não há adaptador nem runtime de framework, e uma tag script basta.
- **Peças para interfaces de chat com IA.** Uma visualização de conversa que acompanha a saída em streaming, Markdown que renderiza texto ainda incompleto, linhas de raciocínio e de chamadas de ferramentas, anexos e entrada por voz. `ranuts/stream` interpreta a resposta em streaming.
- **Temas, renderização no servidor e tipos incluídos.** Temas claro e escuro por design tokens, utilitários de SSR e declarações TypeScript vêm com o pacote.
- **Instale só o que usar.** Cada pacote e cada componente tem seu próprio ponto de entrada.

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

O ranui está em fase alfa e as versões podem trazer mudanças incompatíveis, então fixe uma versão exata em produção. A [documentação de componentes](https://ran.chaxus.com/pt/ranui/) tem exemplos ao vivo, eventos e estilos de cada elemento.

## Uso com um agente de programação

O plugin **ran** adiciona as skills design, ranui e ranuts ao Claude Code e ao Codex. Não precisa de servidor MCP nem de conta.

```sh
claude plugin marketplace add chaxus/ran && claude plugin install ran@ran
```

```sh
codex plugin marketplace add chaxus/ran && codex plugin add ran@ran
```

Em uma nova sessão, use `/ran:design`, `/ran:ranui` ou `/ran:ranuts` no Claude Code, ou `$design`, `$ranui` ou `$ranuts` no Codex. Para instalar a partir de um clone local, veja o [guia de agentes](https://ran.chaxus.com/pt/agents/); as skills ficam em [plugins/ran](./plugins/ran/).

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
