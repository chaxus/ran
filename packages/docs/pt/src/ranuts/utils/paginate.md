# paginateText

Corta texto puro em páginas que caibam numa caixa fixa: um leitor, um teleprompter, uma prévia para impressão.

Aritmética pura: recebe a caixa e as medidas tipográficas como números e nunca toca no DOM. Meça o contêiner uma vez na thread principal e depois pagine num Worker, no servidor ou dentro de um teste.

## API

### paginateText(text, box, metrics, options?)

| Parâmetro        | Descrição                                                              | Tipo              |
| ---------------- | ---------------------------------------------------------------------- | ----------------- |
| `text`           | Texto de origem; `\r\n` e `\r` são normalizados para `\n`              | `string`          |
| `box`            | `{ width, height }` em px                                              | `TextBox`         |
| `metrics`        | `{ charWidth, lineHeight, narrowRatio? }` em px                        | `TextGridMetrics` |
| `options.minBox` | Abaixo disso, a caixa é tratada como ainda não diagramada. Padrão `30` | `number`          |

`narrowRatio` é o avanço de um caractere ASCII como fração de `charWidth`; por padrão `0.5625` (9/16).

Devolve `{ pages, total, charsPerLine, linesPerPage, charsPerPage }`, e cada página é `{ text, start, end, index }`, com os deslocamentos referidos ao texto já normalizado.

## Exemplo

```js
import { paginateText } from 'ranuts';

const { width, height } = container.getBoundingClientRect();
const result = paginateText(book, { width, height }, { charWidth: 18.4, lineHeight: 40 });

render(result.pages[0].text);
console.log(`${result.pages.length} páginas, ${result.charsPerLine} caracteres por linha`);
```

## Notas

1. **Ele pressupõe uma grade monoespaçada**: cada caractere avança uma célula (CJK, largura inteira) ou `narrowRatio` de uma (ASCII). É exato com uma fonte monoespaçada e bom o bastante para um corpo de texto predominantemente CJK, mas **não** substitui a modelagem real de um latim proporcional.
2. **Palavras ASCII não são partidas.** Uma página nunca termina no meio de uma palavra, a não ser que a palavra seja maior que uma linha, caso em que é preciso quebrá-la.
3. **Os deslocamentos são contíguos**: `pages[i].start === pages[i - 1].end`, e juntar todos os `page.text` reproduz exatamente o texto normalizado. É isso que permite guardar uma anotação como deslocamento global e mantê-la válida depois de repaginar. Veja [segmentByRanges](./segment).
4. **Uma caixa menor que `minBox` não devolve páginas.** Do contrário, paginar durante a primeira pintura, quando o contêiner ainda mede 0, ficaria rodando à toa.

::: tip Uma palavra maior que uma página
Uma URL, um blob em base64 ou uma fileira longa de hifens contam todos como caracteres de palavra. Quando uma fileira dessas ocupa mais que uma página inteira, não há «página seguinte» para onde adiá-la, então ela é quebrada à força. Adiá-la, em vez disso, faria o cursor voltar ao ponto em que a página começou. A página sai vazia e o laço nunca avança: um travamento, não só uma diagramação ruim.
:::
