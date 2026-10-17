# formatDate

Formata uma data com um padrão de tokens.

## API

### formatDate(value?, pattern?)

| Parâmetro | Descrição                                                              | Tipo                       | Padrão                  |
| --------- | ---------------------------------------------------------------------- | -------------------------- | ----------------------- |
| `value`   | Carimbo de tempo, string de data ou `Date`; omita para o momento atual | `number \| string \| Date` | agora                   |
| `pattern` | Padrão de tokens                                                       | `string`                   | `'YYYY-MM-DD HH:mm:ss'` |

| Token       | Significado | Token    | Significado   |
| ----------- | ----------- | -------- | ------------- |
| `YYYY`/`YY` | Ano         | `mm`/`m` | Minuto        |
| `MM`/`M`    | Mês (1–12)  | `ss`/`s` | Segundo       |
| `DD`/`D`    | Dia         | `SSS`    | Milissegundos |
| `HH`/`H`    | Hora (0–23) | `A`/`a`  | AM/PM · am/pm |
| `hh`/`h`    | Hora (1–12) | `[...]`  | Texto literal |

Devolve `'Invalid Date'` quando a entrada não pode ser interpretada.

## Exemplo

```js
import { formatDate } from 'ranuts';

formatDate(); // '2026-07-25 14:30:00'
formatDate(1753425000000, 'YYYY/MM/DD'); // '2026/07/25'
formatDate(new Date(), 'YYYY[年]MM[月]DD[日] hh:mm a');
formatDate('not a date'); // 'Invalid Date'
```

## Notas

1. **Maiúsculas contam.** `MM` é o mês e `mm` é o minuto; `HH` é de 24 horas e `hh` de 12.
2. **O padrão é substituído em uma única passada**, então um valor recém-escrito nunca é capturado de novo por um token posterior.
3. **Ponha o texto literal entre `[]`** para tirar suas letras da substituição.
