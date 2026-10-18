<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./packages/docs/public/icon-dark.png">
    <img width="72" src="./packages/docs/public/icon.png" alt="ran">
  </picture>
</p>

<h1 align="center">ran</h1>
<p align="center">Componentes de interface e ferramentas TypeScript para aplicações web.</p>
<p align="center"><a href="https://ran.chaxus.com/pt/">Documentação</a> · <a href="https://github.com/chaxus/ran/actions/workflows/ci.yml">CI</a></p>
<p align="center"><a href="./README.md">English</a> · <a href="./README.zh-CN.md">中文</a> · <a href="./README.ja.md">日本語</a> · <a href="./README.es.md">Español</a> · <b>Português</b> · <a href="./README.ko.md">한국어</a> · <a href="./README.de.md">Deutsch</a> · <a href="./README.fa.md">فارسی</a></p>

ran é um conjunto de bibliotecas para criar interfaces web. Use componentes HTML prontos para formulários, painéis e páginas de conteúdo, reutilize funções de navegador e de processamento de dados ou componha interfaces DOM reativas diretamente em TypeScript.

Cada pacote pode ser instalado separadamente. O [site de documentação](./packages/docs/) e a [demonstração de IM](./packages/im/) mostram como combiná-los em aplicações completas.

## Escolha um pacote

| Pacote                                          | O que você pode criar                                                                                                                                                         |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ranui](./packages/ranui/README.pt.md)          | Interfaces com elementos HTML personalizados: campos, seletores, diálogos, tabelas, Markdown e reprodutores de mídia. Inclui temas e ferramentas de renderização no servidor. |
| [ranuts](./packages/ranuts/README.pt.md)        | Fluxos de navegador e dados: conversões de cores e dados binários, armazenamento, análise de SSE e estado de respostas em streaming.                                          |
| [@alixex/ranview](./packages/ranview/README.md) | Interfaces DOM com construtores encadeáveis e sinais reativos; HTML estático para renderização no servidor.                                                                   |

## Experimente ranui

Instale em uma aplicação de navegador com um bundler compatível com ESM:

```sh
npm install ranui
```

Adicione isto à entrada JavaScript da aplicação. O código cria um botão que responde ao clique:

```js
import 'ranui/button';
import 'ranui/style';

const button = document.createElement('r-button');
button.setAttribute('type', 'primary');
button.textContent = 'Salvar';
button.addEventListener('click', () => {
  button.textContent = 'Salvo';
});
document.body.append(button);
```

Os componentes usam elementos personalizados e eventos padrão do navegador, sem exigir o runtime de React ou Vue. Importe outros componentes por suas próprias entradas, como `ranui/input`. Consulte os [exemplos de componentes](https://ran.chaxus.com/pt/src/ranui/) para ver marcação, eventos e personalização, ou o [exemplo de script independente](./packages/ranui/README.pt.md#iife--cdn) para uso sem bundler.

## Desenvolvimento do repositório

Use Node 24+ e pnpm 11.6.0.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm test
pnpm -F docs dev
```

Cada pacote contém seus próprios guias e exemplos. Leia as [diretrizes do repositório](./AGENTS.md) antes de contribuir e as [instruções de publicação](./docs/RELEASING.md) ao preparar os pacotes.

## Licença

[MIT](./LICENSE)
