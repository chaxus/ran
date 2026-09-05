# buildOffsets / indexForOffset / segmentByRanges

As contas de coordenadas para quando «o conteúdo está partido em pedaços mas as anotações são guardadas contra o texto inteiro». Guarde um destaque como um **deslocamento global** em vez de «pedaço N, caractere M» e ele sobrevive a um novo fatiamento: mude o tamanho da letra, a largura da página ou o tamanho dos fragmentos, e a anotação continua apontando para as mesmas palavras.

## API

### buildOffsets(lengths)

Somas acumuladas: `offsets[i]` é o comprimento total de tudo que vem antes do pedaço `i`.

```js
buildOffsets([3, 5, 2]); // [0, 3, 8]
```

### indexForOffset(offsets, offset)

Faz busca binária para achar em que pedaço cai um deslocamento global. Deslocamentos fora da faixa são ajustados para `[0, offsets.length - 1]`, e um array vazio devolve `0`. O resultado sempre pode ser usado como índice sem risco.

### segmentByRanges(text, chunkStart, ranges)

Divide um pedaço em segmentos comuns e coincidentes, para desenhar por partes (destaques, acertos de busca, coloração de diferenças).

| Parâmetro    | Descrição                                        | Tipo                        |
| ------------ | ------------------------------------------------ | --------------------------- |
| `text`       | O texto deste pedaço                             | `string`                    |
| `chunkStart` | O deslocamento global em que este pedaço começa  | `number`                    |
| `ranges`     | `{ start, end, value }[]` em coordenadas globais | `readonly OffsetRange<T>[]` |

Devolve `{ text, start, end, value }[]`, em que `value` é `null` para o texto que nenhuma faixa cobre. Juntar os segmentos sempre reconstrói `text`, e há sempre ao menos um segmento.

## Exemplo

```js
import { buildOffsets, indexForOffset, segmentByRanges } from 'ranuts';

const offsets = buildOffsets(pages.map((p) => p.text.length));

// Em que página esta nota começa?
const pageIndex = indexForOffset(offsets, note.start);

// Desenhar uma página com seus destaques
const segments = segmentByRanges(
  pages[i].text,
  offsets[i],
  notes.map((n) => ({
    start: n.start,
    end: n.end,
    value: n,
  })),
);
segments.forEach((s) => container.append(s.value ? mark(s.text, s.value) : text(s.text)));
```

## Notas

1. **As faixas são semiabertas**: `[start, end)`.
2. **As sobreposições são resolvidas, não fundidas.** As faixas são consumidas em ordem; uma posterior fica só com a parte ainda não coberta, e a que estiver inteiramente dentro de outra anterior é descartada. Os pontos de corte crescem estritamente, então nenhum segmento sai vazio por acidente nem duplicado.
3. **Faixas fora do pedaço são ignoradas** e as que se sobrepõem em parte são aparadas, de modo que você pode passar a lista inteira de anotações para cada pedaço.
