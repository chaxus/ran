---
description: 'Renderiza diagramas do Mermaid (fluxo, sequência, classes, estados, gantt) como um web component independente de framework, com carregamento sob demanda.'
---

# Mermaid

Renderiza diagramas do [Mermaid](https://mermaid.js.org/) (fluxo, sequência, classes, estados,
gantt…) como um web component independente de framework. O `<r-mermaid>` carrega a biblioteca
mermaid sob demanda no primeiro render (aplicações que nunca a usam não pagam nada) e desenha o
diagrama no próprio shadow root, ficando isolado dos estilos da página.

> **Use quando** quiser colocar em qualquer página um diagrama escrito como texto sem ligar o
> mermaid você mesmo, opcionalmente com uma barra de copiar / baixar / tela cheia e um visualizador
> com deslocamento e zoom.

## Início rápido

<Demo>
  <r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]; C --> D[Respond]</r-mermaid>
</Demo>

```html
<r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]</r-mermaid>
```

```js
import 'ranui'; // ou a entrada independente:
import 'ranui/mermaid';
```

A fonte do diagrama é lida do **conteúdo de texto** do elemento ou de um atributo `code` codificado
em URI (use `code` quando a sintaxe contiver `<`, por exemplo o `<|--` de `classDiagram`, para que
ela sobreviva à análise do HTML):

```js
el.code = 'classDiagram\n  Dog --|> Animal'; // o setter da propriedade codifica em URI para você
```

## Controles

Cada controle é **opcional** e ligado por um atributo booleano; um `<r-mermaid>` sem nada é um
diagrama estático e limpo. A barra aparece ao passar o mouse (canto superior direito).

<Demo>
  <r-mermaid copy download fullscreen>graph TD; A[Start] --> B[Do work]; B --> C[End]</r-mermaid>
</Demo>

```html
<r-mermaid copy download fullscreen>graph TD; A --> B; B --> C</r-mermaid>
```

- **copy**: copia a fonte do diagrama para a área de transferência.
- **download**: SVG / PNG / fonte (`.mmd`); com um único formato baixa direto, com vários mostra um
  menu. Restrinja com `download="svg"` ou `download="svg png"`.
- **fullscreen**: abre uma caixa de luz sem cabeçalho (r-modal) com **deslocamento e zoom** (roda
  para ampliar, arrastar para mover, com reinício); fecha pelo ✕, clique no fundo ou `Esc`.

## Referência da API

### Atributos

| Atributo     | Tipo                          | Padrão    | Descrição                                                                                                                                                        |
| ------------ | ----------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`       | `string` (codificado em URI)  | —         | Fonte do diagrama. Na falta dele, recorre ao conteúdo de texto do elemento.                                                                                      |
| `theme`      | `'auto' \| 'light' \| 'dark'` | `'auto'`  | Tema do mermaid. `auto` segue a página (`.dark` / `[data-ran-theme]`) e re-renderiza ao alternar.                                                                |
| `copy`       | booleano                      | desligado | Mostra o botão de copiar a fonte.                                                                                                                                |
| `download`   | booleano / `"svg png source"` | desligado | Mostra o botão de download; o valor restringe os formatos oferecidos.                                                                                            |
| `fullscreen` | booleano                      | desligado | Mostra o botão de tela cheia.                                                                                                                                    |
| `sheet`      | `string`                      | —         | CSS extra injetado no shadow root.                                                                                                                               |
| `label-*`    | `string`                      | Inglês    | Sobrescreve os rótulos: `label-copy`, `label-download`, `label-fullscreen`, `label-zoom-in`, `label-zoom-out`, `label-reset`, `label-diagram` (nome do diálogo). |

## Eventos

Todos os eventos borbulham e cruzam a fronteira do shadow (`composed`).

| Evento             | `detail`                                 | Disparado quando                            |
| ------------------ | ---------------------------------------- | ------------------------------------------- |
| `render`           | `{ ok: true }`                           | um diagrama terminou de renderizar          |
| `copied`           | `{ kind: 'source' }`                     | a fonte foi copiada                         |
| `download`         | `{ format: 'svg' \| 'png' \| 'source' }` | um arquivo foi baixado                      |
| `error`            | `{ message: string }`                    | o diagrama falhou ao analisar ou renderizar |
| `fullscreenchange` | `{ open: boolean }`                      | a caixa de luz abriu ou fechou              |

## Partes CSS

| Parte     | Descrição                                   |
| --------- | ------------------------------------------- |
| `mermaid` | O invólucro externo.                        |
| `diagram` | O contêiner do diagrama renderizado.        |
| `toolbar` | A barra de controles que aparece ao passar. |
| `button`  | Cada botão de ícone da barra.               |
| `error`   | A caixa de mensagem de erro (quando falha). |

```css
r-mermaid::part(toolbar) {
  background: var(--surface);
}
```

## Variáveis CSS

Sobrescreva no elemento (cada uma recorre a um token semântico e depois a um literal):
`--ran-mermaid-padding`, `--ran-mermaid-toolbar-background`, `--ran-mermaid-toolbar-gap`,
`--ran-mermaid-button-size`, `--ran-mermaid-button-color`, `--ran-mermaid-button-hover-background`,
`--ran-mermaid-error-color`.

## Notas

- **Carregado sob demanda**: o mermaid (e o r-modal usado na tela cheia) são importações dinâmicas,
  então chegam como blocos assíncronos separados só quando um diagrama renderiza ou a tela cheia
  abre.
- **Fidelidade do render**: o `<r-mermaid>` usa o render do próprio mermaid, então todos os tipos de
  diagrama e temas são suportados.
- **Exportar PNG**: diagramas que usam rótulos HTML (`htmlLabels` do mermaid) são desenhados com
  `<foreignObject>`, o que pode contaminar o canvas e fazer a exportação PNG falhar; nesse caso um
  evento `error` é despachado. Exportar SVG e a fonte sempre funciona.
