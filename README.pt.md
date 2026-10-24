<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Métodos de design, componentes e ferramentas para criar produtos web, para desenvolvedores e agentes de programação.</p>
<p align="center"><a href="https://ran.chaxus.com/pt/">Documentação</a> · <a href="https://ran.chaxus.com/pt/src/ranui/">Componentes</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <b>Português</b> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

O ran tem três partes que podem ser usadas separadamente: **ranui**, componentes de interface criados como elementos personalizados nativos; **ranuts**, utilitários TypeScript tipados; e **Ran Design**, métodos de layout, interação e revisão que pessoas e agentes de programação podem aplicar em qualquer stack. Cada componente do ranui é uma tag `<r-*>`, então funciona da mesma forma em React, Vue, Svelte ou HTML puro, e inclui peças para interfaces de chat com IA.

## Instalação

Sem etapa de build, carregue o componente de um CDN e escreva a tag:

```html
<script src="https://cdn.jsdelivr.net/npm/ranui/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Salvar</r-button>
```

Com um bundler:

```sh
npm install ranui
```

```js
import 'ranui/button';
import 'ranui/style';
```

O ranui está em fase alfa e as versões podem trazer mudanças incompatíveis; fixe uma versão exata em produção.

## Saiba mais

Veja [ranui](./packages/ranui/README.pt.md) e [ranuts](./packages/ranuts/README.pt.md) para cada pacote, e o [site de documentação](https://ran.chaxus.com/pt/) para exemplos ao vivo. O plugin para agentes de programação e o guia de contribuição estão no [README em inglês](./README.md).

## Licença

[MIT](./LICENSE)
