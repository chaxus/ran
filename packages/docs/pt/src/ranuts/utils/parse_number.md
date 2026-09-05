# parseChineseNumber / parseRomanNumber / parseEnglishNumber

Analisa números escritos para pessoas: `第二十三章`, `Chapter XIV`, `Part Three`.

Os três seguem o mesmo contrato: **devolvem `null` em vez de chutar** quando a entrada não pode ser analisada por inteiro. Esses analisadores costumam alimentar a decisão de «esta linha é um título?», e um único número errado estraga toda a verificação da sequência.

## API

| Função | Aceita |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `parseChineseNumber(value)` | Dígitos (de meia largura e largura inteira), `一二三…`, as unidades `十百千万/萬`, simplificado e tradicional |
| `parseRomanNumber(value)` | `IVXLCDM`, em qualquer caixa, com notação subtrativa (`IV`, `IX`) |
| `parseEnglishNumber(value)` | Dígitos, os numerais ingleses `one`–`twenty` e, depois, números romanos |

Auxiliares de string relacionados: `toHalfWidth(value)` / `toFullWidth(value)` normalizam caracteres de largura inteira, algo que `parseChineseNumber` já aplica por você.

## Exemplo

```js
import { parseChineseNumber, parseRomanNumber, parseEnglishNumber, toHalfWidth } from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('一百零三'); // 103
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null — extraia antes o trecho numérico

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（１）'); // '(1)'
```

## Notas

1. **Passe apenas o trecho numérico.** `第三章` devolve `null`: tire antes o `三` com o seu próprio padrão e analise isso.
2. **Um `十` sem nada antes vale 1**, então `十五` é 15, não 5.
3. **`parseEnglishNumber` tenta dígitos, depois palavras, depois romanos.** De `twenty-one` em diante não há cobertura; amplie a tabela de palavras se precisar.
