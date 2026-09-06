# Formatação de tempo

O tempo aparece numa interface sob três formas diferentes, e confundi-las é a fonte habitual de trapalhada. O `ranuts` dá a cada uma sua própria função:

| O que o leitor está perguntando      | Função                                 | Saída de exemplo      |
| ------------------------------------ | -------------------------------------- | --------------------- |
| _Quando_ isso aconteceu, exatamente? | [`formatDate`](./timestamp_to_time.md) | `2026-07-25 14:05:09` |
| _Quanto dura_ isso?                  | `formatDuration`                       | `01:01:01`            |
| Há quanto tempo isso foi?            | `formatRelative`                       | `3 days ago`, `5m`    |

## formatDuration

Dá a um número de **segundos** decorridos a forma de relógio com dois-pontos (aquela que um reprodutor usa no cursor de reprodução): `mm:ss`, que se alarga para `hh:mm:ss` depois de uma hora.

#### Parâmetros

| Parâmetro | Descrição                                      | Tipo     | Padrão      |
| --------- | ---------------------------------------------- | -------- | ----------- |
| `seconds` | Segundos decorridos; valores negativos viram 0 | `number` | Obrigatório |

#### Returns

`string`: a duração, ou `''` se a entrada não for um número finito.

```js
import { formatDuration } from 'ranuts/utils';

formatDuration(0); // '00:00'
formatDuration(65); // '01:05'
formatDuration(3661); // '01:01:01'
formatDuration(NaN); // ''
```

Devolver string vazia diante de `NaN` é de propósito: um reprodutor pede `video.duration` antes de os metadados carregarem e recebe `NaN`, e ali um rótulo em branco se lê melhor do que `NaN:NaN`.

::: tip Mudou de nome
Esta função se chamava `timeFormat`. Esse nome continua como apelido obsoleto e se comporta igualzinho, mas não dizia _qual_ dos três formatos de tempo ele produzia.
:::

## formatRelative

Descreve um instante em relação a outro: «há 3 dias», «daqui a 2 horas».

A localização fica por conta do [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) da plataforma, presente em todos os navegadores importantes desde 2020, que já conhece as regras de plural e de flexão de cada idioma. O `formatRelative` entra só com a parte que o `Intl` deixa de fora de propósito: decidir em _qual_ unidade exprimir a diferença.

Como o próprio `Intl`, ele informa uma **única** unidade: uma diferença de 3 dias e 6 horas vira «há 3 dias», nunca «há 3 dias e 6 horas».

#### Parâmetros

| Parâmetro | Descrição              | Tipo                       | Padrão      |
| --------- | ---------------------- | -------------------------- | ----------- |
| `value`   | O instante a descrever | `number \| string \| Date` | Obrigatório |
| `options` | Veja abaixo            | `FormatRelativeOptions`    | `{}`        |

| Opção     | Descrição                                                                        | Tipo                       | Padrão        |
| --------- | -------------------------------------------------------------------------------- | -------------------------- | ------------- |
| `now`     | Contra o que se mede                                                             | `number \| string \| Date` | a hora atual  |
| `locale`  | Etiqueta ou etiquetas BCP 47; o estilo `compact` as ignora                       | `string \| string[]`       | a do ambiente |
| `style`   | `'long' \| 'short' \| 'narrow' \| 'compact'`                                     | `RelativeStyle`            | `'long'`      |
| `numeric` | Com `'auto'` entram expressões como `yesterday`; com `'always'` ficam os números | `'always' \| 'auto'`       | `'auto'`      |

#### Returns

`string`: a descrição, ou `''` quando um dos dois extremos não pode ser interpretado.

```js
import { formatRelative } from 'ranuts/utils';

const twoHoursAgo = Date.now() - 2 * 3600_000;

formatRelative(twoHoursAgo); // '2 hours ago'
formatRelative(twoHoursAgo, { style: 'short' }); // '2 hr. ago'
formatRelative(twoHoursAgo, { locale: 'zh-CN' }); // '2 小时前'
formatRelative(Date.now() + 60_000); // 'in 1 minute'
formatRelative(Date.now() - 86_400_000); // 'yesterday'
formatRelative(Date.now() - 86_400_000, { numeric: 'always' }); // '1 day ago'
```

### O estilo compact

`compact` é aquela forma apertada de etiqueta que aparece ao lado dos itens de um feed ou de uma lista:

```js
formatRelative(Date.now() - 30_000, { style: 'compact' }); // '30s'
formatRelative(Date.now() - 5 * 60_000, { style: 'compact' }); // '5m'
formatRelative(Date.now() - 3 * 3600_000, { style: 'compact' }); // '3h'
formatRelative(Date.now() - 2 * 86_400_000, { style: 'compact' }); // '2d'
```

::: warning Ele não indica o sentido
`compact` é só uma magnitude, então um instante futuro sai exatamente igual a um passado (`5m` nos dois casos). Foi feito para feeds de coisas que já aconteceram. Use outro estilo em qualquer lugar onde o leitor precise separar passado de futuro.
:::

## parseVttTimestamp / parseVttCueTiming

Interpretação dos tempos de legenda WebVTT: as linhas `hh:mm:ss.mmm --> hh:mm:ss.mmm` de um arquivo `.vtt`.

O `parseVttTimestamp` transforma uma marca de tempo (com `hh:` opcional) em segundos; o `parseVttCueTiming` interpreta uma linha de tempos inteira — os dois lados separados por `-->` — e devolve `{ start, end }`, ignorando os ajustes de cue que venham no fim (`align:start line:0`).

```js
import { parseVttTimestamp, parseVttCueTiming } from 'ranuts/utils';

parseVttTimestamp('00:00:05.000'); // 5
parseVttTimestamp('01:05.250'); // 65.25
parseVttTimestamp('not a timestamp'); // undefined

parseVttCueTiming('00:00:00.000 --> 00:00:05.000'); // { start: 0, end: 5 }
parseVttCueTiming('00:00:05.000 --> 00:00:10.000 align:start line:0'); // { start: 5, end: 10 }
```

Os dois devolvem `undefined` quando a entrada não casa, e nunca lançam, de modo que uma linha malformada num arquivo de legendas pode ser pulada em vez de abortar a leitura inteira.

## Notas

1. **Escolha da unidade**: o `formatRelative` pega a unidade mais grossa que a diferença realmente preenche e arredonda dentro dela. Quando o arredondamento cai na soleira da unidade seguinte (59,6 minutos arredondando para «60 minutos»), ele promove, e você lê «há 1 hora».
2. **Arredondamento simétrico**: arredonda-se a magnitude e depois se devolve o sinal, porque em JavaScript `Math.round(-1.5)` dá `-1` e, sem isso, 90 minutos atrás sairia como «há 1 hora» enquanto 90 minutos adiante sairia como «daqui a 2 horas».
3. **Reaproveitar o formatador**: as instâncias de `Intl.RelativeTimeFormat` ficam em cache por combinação de idioma, estilo e `numeric`, então uma lista que desenha cem marcas de tempo constrói um formatador, não cem.
4. **Plano B**: num ambiente sem `Intl.RelativeTimeFormat`, a saída recai no formato compacto em vez de lançar.
