# parseChineseNumber / parseRomanNumber / parseEnglishNumber

Analiza números escritos para personas: `第二十三章`, `Chapter XIV`, `Part Three`.

Los tres comparten un mismo contrato: **devuelven `null` en vez de adivinar** cuando la entrada no se puede analizar por completo. Estos analizadores suelen alimentar la decisión de «¿es esta línea un encabezado?», y un solo número mal leído envenena toda la comprobación de la secuencia.

## API

| Función | Acepta |
| --------------------------- | --------------------------------------------------------------------------------------- |
| `parseChineseNumber(value)` | Dígitos (de ancho medio y completo), `一二三…`, las unidades `十百千万/萬`, simplificado y tradicional |
| `parseRomanNumber(value)` | `IVXLCDM`, en cualquier caja, con notación sustractiva (`IV`, `IX`) |
| `parseEnglishNumber(value)` | Dígitos, los numerales ingleses `one`–`twenty`, y después números romanos |

Ayudas de cadena relacionadas: `toHalfWidth(value)` / `toFullWidth(value)` normalizan los caracteres de ancho completo, algo que `parseChineseNumber` ya aplica por ti.

## Ejemplo

```js
import { parseChineseNumber, parseRomanNumber, parseEnglishNumber, toHalfWidth } from 'ranuts';

parseChineseNumber('二十三'); // 23
parseChineseNumber('一百零三'); // 103
parseChineseNumber('三萬'); // 30000
parseChineseNumber('第三章'); // null — extrae antes el trozo numérico

parseRomanNumber('MCMXCIV'); // 1994
parseEnglishNumber('Three'); // 3
toHalfWidth('（１）'); // '(1)'
```

## Notas

1. **Pasa solo el trozo numérico.** `第三章` devuelve `null`: saca antes el `三` con tu propio patrón y analiza eso.
2. **Un `十` sin nada delante vale 1**, así que `十五` es 15, no 5.
3. **`parseEnglishNumber` prueba dígitos, luego palabras y luego números romanos.** De `twenty-one` en adelante no está cubierto; amplía la tabla de palabras si lo necesitas.
