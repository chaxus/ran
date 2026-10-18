# ranuts

Utilitários TypeScript para APIs do navegador, dados, streams e renderização 2D.

[![npm](https://img.shields.io/npm/v/ranuts.svg)](https://www.npmjs.com/package/ranuts) · [MIT](./LICENSE)

ESM · IIFE · TypeScript

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | **Português** | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## Início rápido

```sh
npm install ranuts
```

```ts
import { rgbToHex } from 'ranuts/utils';

console.log(rgbToHex(1, 2, 3)); // #010203
```

## ESM

Escolha a entrada conforme o ambiente e a tarefa. Alguns utilitários exigem objetos globais do navegador; importar o pacote não torna todas as funções compatíveis com o servidor.

| Pacote                | Uso                                                          |
| --------------------- | ------------------------------------------------------------ |
| `ranuts/utils`        | DOM/BOM, cores, binários, armazenamento e outros utilitários |
| `ranuts/i18n`         | Internacionalização independente                             |
| `ranuts/stream`       | Análise SSE e estado de respostas em streaming               |
| `ranuts/conversation` | Projeção do log de eventos de conversa                       |
| `ranuts/visual`       | Renderização 2D; navegador                                   |
| `ranuts/vnode`        | DOM virtual; navegador                                       |
| `ranuts/sw`           | Estratégias de cache do Service Worker                       |

## IIFE / CDN

Para uma tag script clássica, use um IIFE independente. Substitua VERSION por uma versão publicada; não é necessário bundler ou carregador de módulos.

```html
<script src="https://cdn.jsdelivr.net/npm/ranuts@VERSION/dist/iife/utils.iife.js"></script>
<script>
  console.log(ranuts_utils.rgbToHex(1, 2, 3));
</script>
```

O IIFE de utilitários expõe `ranuts_utils`; o completo `dist/iife/index.iife.js` expõe `ranuts`. Substitua VERSION por uma versão publicada.

## Documentação

- [ranuts](https://ran.chaxus.com/pt/src/ranuts/)
- [API](./docs/API.md)
- [Referência para mantenedores e agentes](./CLAUDE.md)

## Contribuir

[Referência para mantenedores e agentes](./CLAUDE.md) · [AGENTS.md](https://github.com/chaxus/ran/blob/main/AGENTS.md)

## Licença

[MIT](./LICENSE)
