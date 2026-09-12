---
description: 'Web Component renderizador de Markdown feito para streaming: fecha o markdown que chegou pela metade, redesenha só o bloco que mudou e embute código (shiki), diagramas Mermaid e matemática.'
---

# Markdown

Renderiza Markdown (inclusive a **saída de uma IA token a token**) como um web component independente de framework. O `<r-markdown>` é modelado no [Streamdown](https://streamdown.ai) da Vercel: enquanto o texto chega, ele fecha na hora o `**bold`, o `` `code ``, os links e a matemática `$$` digitados pela metade, divide o documento em blocos e redesenha **só o bloco que mudou**, de modo que uma resposta longa nunca é reanalisada do início a cada token.

Blocos cercados com ` ```mermaid ` viram [`<r-mermaid>`](/pt/src/ranui/mermaid/), a matemática vira [`<r-math>`](/pt/src/ranui/math/), e o código pode ser destacado com shiki; cada um deles é carregado sob demanda na primeira vez que o conteúdo precisa. A saída é sanitizada com DOMPurify.

> **Use quando** exibir Markdown que você não controla por inteiro (respostas de chat, fluxos de LLM, comentários de usuários, documentação) e quiser streaming, suporte a código, diagramas e matemática, e HTML seguro, sem ter de ligar você mesmo um parser, um sanitizador e um destacador.

## Início rápido

<ran-demo>
  <r-markdown copy highlight data-content="%23%20Ol%C3%A1%0A%0AUm%20pouco%20de%20%2A%2Anegrito%2A%2A%2C%20um%20pouco%20de%20%2Ait%C3%A1lico%2A%2C%20um%20%5Blink%5D%28https%3A%2F%2Fgithub.com%2Fchaxus%2Fran%29%20e%20%60c%C3%B3digo%20em%20linha%60.%0A%0A%60%60%60ts%0Aconst%20greet%20%3D%20%28name%3A%20string%29%3A%20string%20%3D%3E%20%60Hi%20%24%7Bname%7D%60%3B%0A%60%60%60%0A%0A%7C%20Recurso%20%7C%20Situa%C3%A7%C3%A3o%20%7C%0A%7C%20---%20%7C%20---%20%7C%0A%7C%20Streaming%20%7C%20%E2%9C%85%20%7C%0A%7C%20Mermaid%20%2F%20matem%C3%A1tica%20%7C%20%E2%9C%85%20%7C"></r-markdown>
</ran-demo>

```html
<r-markdown copy highlight content="# Olá ..."></r-markdown>
```

```js
import 'ranui'; // ou a entrada independente:
import 'ranui/markdown';
```

A fonte é lida da **propriedade `content`** (a preferida: não é refletida, então transmitir uma resposta longa não agita o DOM), do atributo `content` ou do texto do próprio elemento:

```js
const el = document.createElement('r-markdown');
el.setAttribute('caret', ''); // mostra um cursor piscando enquanto o texto chega
for await (const chunk of stream) {
  el.content += chunk; // só o último bloco é redesenhado
}
el.removeAttribute('caret');
container.append(el);
```

## Streaming

`mode="streaming"` (o padrão) passa o texto primeiro pelo [remend](https://www.npmjs.com/package/remend), o finalizador de markdown incompleto extraído do Streamdown: assim um `**bold` recebido pela metade sai em negrito em vez de mostrar asteriscos, `[text](https://exa` fica como texto simples até a URL fechar, um `- ` não transforma o parágrafo anterior em título, e por aí vai. Para documentos já prontos, use `mode="static"` e pule essa passagem, renderizando tudo de uma vez.

<ran-demo>
  <r-markdown caret data-content="%2A%C3%8Anfase%2A%20pela%20metade%2C%20%60c%C3%B3digo%20em%20linha%60%20e%20%2A%2Anegrito%20que%20ainda%20est%C3%A1%20chegando"></r-markdown>
</ran-demo>

```html
<r-markdown caret content="*Ênfase* pela metade, `código em linha` e **negrito que ainda está chegando"></r-markdown>
```

- **cursor**: `caret` mostra um `▋` piscando e `caret="circle"` um `●`, depois do último bloco. Ele se esconde sozinho enquanto uma cerca de código continua aberta ou o último bloco é uma tabela.
- **cercas de código incompletas** ficam em texto simples (sem lampejo de destaque, sem diagrama pela metade) até a cerca de fechamento chegar; nesse meio-tempo o contêiner carrega `data-incomplete`.

## Blocos de código

Todo bloco de código ganha um cabeçalho com o nome da linguagem e, se você ativar, botões de copiar e baixar. Acrescente `highlight` para destacar a sintaxe com [shiki](https://shiki.style) (carregado sob demanda; as linguagens chegam conforme o uso; `github-light` / `github-dark` por padrão, seguindo o tema da página).

<ran-demo>
  <r-markdown copy download line-numbers highlight data-content="%60%60%60python%0Adef%20fib%28n%3A%20int%29%20-%3E%20int%3A%0A%20%20%20%20return%20n%20if%20n%20%3C%202%20else%20fib%28n%20-%201%29%20%2B%20fib%28n%20-%202%29%0A%0Aprint%28fib%2810%29%29%0A%60%60%60"></r-markdown>
</ran-demo>

```html
<r-markdown copy download line-numbers highlight></r-markdown>
<!-- escolha os temas: claro escuro -->
<r-markdown highlight="vitesse-light vitesse-dark"></r-markdown>
```

## Mermaid e matemática

<ran-demo>
  <r-markdown data-content="%60%60%60mermaid%0Agraph%20LR%3B%20A%5BPrompt%5D%20--%3E%20B%5BModel%5D%3B%20B%20--%3E%20C%5BTokens%5D%3B%20C%20--%3E%20D%5Br-markdown%5D%0A%60%60%60%0A%0A%24%24%0AE%20%3D%20mc%5E2%0A%24%24%0A%0AA%20express%C3%A3o%20%5C%28e%5E%7Bi%5Cpi%7D%20%2B%201%20%3D%200%5C%29%20corre%20junto%20do%20texto."></r-markdown>
</ran-demo>

- ` ```mermaid ` → `<r-mermaid>` (com tela cheia; `copy` / `download` são repassados).
- `$$…$$`, `\[…\]` e ` ```math ` → `<r-math>` em bloco; `\(…\)` → em linha. O cifrão simples `$…$` **precisa ser ativado** com `inline-math`, porque se confunde com valores em dinheiro.

## Referência da API

### Atributos

| Atributo       | Tipo                                      | Padrão        | Descrição                                                                                                                                                   |
| -------------- | ----------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`      | `string`                                  | —             | Fonte Markdown. A **propriedade** `content` tem precedência e não é refletida; na falta das duas, usa o texto do elemento.                                  |
| `mode`         | `'streaming' \| 'static'`                 | `'streaming'` | `streaming` fecha o markdown incompleto e compara por bloco; `static` desenha o texto inteiro como está, de uma vez.                                        |
| `caret`        | booleano / `'circle'`                     | desligado     | Cursor piscando depois do último bloco (`▋`, ou `●` com `circle`).                                                                                          |
| `copy`         | booleano                                  | desligado     | Botão de copiar nos blocos de código (repassado ao `<r-mermaid>` embutido).                                                                                 |
| `download`     | booleano                                  | desligado     | Botão de baixar nos blocos de código (`code.<ext>` conforme a linguagem).                                                                                   |
| `line-numbers` | booleano                                  | desligado     | Números de linha nos blocos de código.                                                                                                                      |
| `highlight`    | booleano / nomes de tema `"claro escuro"` | desligado     | Destaque de sintaxe via shiki. Sozinho → `github-light github-dark`; um nome → os dois; dois nomes → claro / escuro.                                        |
| `inline-math`  | booleano                                  | desligado     | Trata `$…$` como matemática em linha (`\(…\)` sempre é).                                                                                                    |
| `link-target`  | `string`                                  | `'_blank'`    | `target` dos links externos (com `rel="noopener noreferrer"` acrescentado). `_self` deixa os links intactos. As `#âncoras` da própria página nunca recebem. |
| `theme`        | `'auto' \| 'light' \| 'dark'`             | `'auto'`      | Tema do destaque e dos diagramas. `auto` segue a página (`.dark`, `[data-ran-theme]`, senão `prefers-color-scheme`).                                        |
| `sheet`        | `string`                                  | —             | CSS extra injetado no shadow root.                                                                                                                          |
| `label-*`      | `string`                                  | inglês        | Sobrescreve os rótulos dos controles: `label-copy`, `label-download`.                                                                                       |

Apelidos de propriedade: `content`, `mode`, `caret`, `copyable`, `downloadable`, `lineNumbers`, `highlight`, `inlineMath`, `linkTarget`, `theme`, `sheet`.

## Eventos

Todos os eventos borbulham e cruzam a fronteira do shadow DOM (`composed`).

| Evento     | `detail`                               | Dispara quando                                          |
| ---------- | -------------------------------------- | ------------------------------------------------------- |
| `render`   | `{ blocks: number, changed: number }`  | uma passagem de desenho mudou pelo menos um bloco       |
| `copied`   | `{ kind: 'code', language, code }`     | um bloco de código foi copiado                          |
| `download` | `{ kind: 'code', language, filename }` | um bloco de código foi baixado                          |
| `error`    | `{ message: string }`                  | a análise ou o desenho falhou (também aparece no lugar) |

## Parts CSS

| Part           | Descrição                                     |
| -------------- | --------------------------------------------- |
| `markdown`     | O invólucro externo.                          |
| `body`         | O contêiner dos blocos.                       |
| `block`        | Cada bloco desenhado.                         |
| `code`         | O contêiner de um bloco de código.            |
| `code-header`  | A barra de linguagem e ações de um bloco.     |
| `code-lang`    | O rótulo da linguagem.                        |
| `code-actions` | O grupo de botões de ação.                    |
| `button`       | Cada botão de copiar ou baixar.               |
| `table`        | O invólucro de tabela com rolagem horizontal. |
| `error`        | A caixa de erro (quando o desenho falha).     |

```css
r-markdown::part(code) {
  border-radius: 8px;
}
```

## Variáveis CSS

Sobrescreva no elemento (cada uma recai num token semântico e depois num valor literal): `--ran-markdown-color`, `--ran-markdown-font-size`, `--ran-markdown-line-height`, `--ran-markdown-gap`, `--ran-markdown-heading-color`, `--ran-markdown-link-color`, `--ran-markdown-inline-code-bg`, `--ran-markdown-code-bg`, `--ran-markdown-code-border`, `--ran-markdown-code-radius`, `--ran-markdown-code-font-size`, `--ran-markdown-mono-font`, `--ran-markdown-blockquote-border`, `--ran-markdown-table-border`, `--ran-markdown-table-header-bg`, `--ran-markdown-caret`, `--ran-markdown-caret-color`, `--ran-markdown-button-color`, `--ran-markdown-error-color`.

## Notas

- **Carregado sob demanda**: o pedaço do parser (marked + DOMPurify + remend) carrega no primeiro desenho; shiki, mermaid e Temml carregam só quando o conteúdo os usa. Aplicações que nunca desenham markdown não pagam nada.
- **Sanitizado**: o HTML cru dentro do markdown passa pelo DOMPurify: scripts, manipuladores de eventos, URLs `javascript:`, `<style>`, formulários e iframes são removidos. As caixas de seleção de listas de tarefas sobrevivem.
- **A comparação por blocos** os indexa por posição, então o estado do DOM dentro de blocos intocados (um diagrama aberto em tela cheia, uma tabela rolada) sobrevive às atualizações do streaming. O documento é lexado uma vez e cada bloco é desenhado a partir dos próprios tokens, de modo que uma definição de referência de link se resolve entre blocos (`[text][id]` num bloco, `[id]: url` em outro).
- **As notas de rodapé do GFM** (`[^1]`) **não** têm suporte: o marked não tem tokenizador de notas de rodapé, então os marcadores saem como texto literal.
- **O shiki é resolvido a partir da sua própria instalação.** A compilação ES deixa o `import('shiki')` intocado, então o seu empacotador o separa em pedaços e baixa só as gramáticas que as suas cercas de código usam. O shiki é uma dependência normal do ranui, então `npm i ranui` já o traz; não há nada a acrescentar.
- **IIFE independente**: o `dist/iife/markdown.iife.js` não tem resolvedor, então embute mermaid, Temml e o pacote de linguagens _web_ do shiki (uns 50 idiomas comuns). Para cobertura completa de linguagens e um download menor, prefira a entrada ES (`ranui/markdown`).
