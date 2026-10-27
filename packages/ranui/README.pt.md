# ranui

Web Components independentes de framework com Shadow DOM, tokens de tema e ferramentas SSR.

[![npm](https://img.shields.io/npm/v/ranui.svg)](https://www.npmjs.com/package/ranui) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | **Português** | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## Início rápido

```sh
npm install ranui@0.5.0
```

As importações usam ESM. Com um bundler, importe por componente e carregue a folha de estilos compartilhada uma vez na entrada da aplicação.

```js
import 'ranui/button';
import 'ranui/input';
import 'ranui/style';
```

Coloque o elemento personalizado no HTML:

```html
<r-input name="email" type="email" label="Email"></r-input> <r-button type="primary">Save</r-button>
```

## IIFE / CDN

Para uma tag script clássica, use o IIFE independente publicado; não é necessário bundler ou carregador de módulos.

```html
<script src="https://cdn.jsdelivr.net/npm/ranui@0.5.0/dist/iife/button.iife.js" defer></script>
<r-button type="primary">Save</r-button>
```

O IIFE completo está em `dist/index.iife.js`. Escolha o pacote completo ou os pacotes por componente; não misture os dois na mesma página.

## TypeScript

Cada entrada inclui tipos. Para declarações globais do navegador e JSX opcionais, use uma importação apenas de tipos:

```ts
import type {} from 'ranui/typings';
```

Se o TypeScript verificar importações CSS por efeitos colaterais, declare a entrada CSS no `assets.d.ts` da aplicação:

```ts
declare module 'ranui/style';
```

## SSR

Use Node 24+ neste exemplo de servidor. As importações de componentes registram seus serializadores SSR; o resultado inclui Declarative Shadow DOM.

```ts
import { Button } from 'ranui/button';
import { renderToString } from 'ranui/ssr';

const html = renderToString(new Button());
console.log(html);
```

## Theme

O modo de tema é ativado explicitamente. Personalize com tokens e parts públicos; as regras e APIs completas estão nos links abaixo.

```ts
import { initTheme, setTheme } from 'ranui/theme';

initTheme();
setTheme('system');
```

## Documentação

[ranui](https://ran.chaxus.com/pt/ranui/)

- [API de componentes](./docs/COMPONENTS.md)
- [Estilos e tokens](./docs/style-tokens-public.md)
- [Design e interação](./docs/DESIGN.md)
- [Construtor DOM e sinais](https://github.com/chaxus/ran/blob/main/packages/ranview/README.md)
- [Referência para mantenedores e agentes](./CLAUDE.md)

## Contribuir

[Referência para mantenedores e agentes](./CLAUDE.md) · [CODING](./docs/CODING.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## Licença

[MIT](./LICENSE)
