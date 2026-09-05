# hexToRgb

Converte uma cor hexadecimal em um array RGB.

## API

### hexToRgb

#### Retorna

| Argumento               | Descrição                    | Tipo                    |
| ----------------------- | ---------------------------- | ----------------------- |
| `Array<number> \| null` | Array RGB [r, g, b], ou null | `Array<number> \| null` |

#### Parâmetros

| Parâmetro | Descrição       | Tipo     | Padrão      |
| --------- | --------------- | -------- | ----------- |
| `hex`     | Cor hexadecimal | `string` | Obrigatório |

## Exemplo

### Uso básico

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#ff0000');
console.log(rgb); // [255, 0, 0]

const rgb2 = hexToRgb('#00ff00');
console.log(rgb2); // [0, 255, 0]
```

### Valores inválidos

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#invalid');
console.log(rgb); // null
```

### Com ou sem o símbolo `#`

```js
import { hexToRgb } from 'ranuts';

const rgb1 = hexToRgb('#ff0000');
const rgb2 = hexToRgb('ff0000');
console.log(rgb1); // [255, 0, 0]
console.log(rgb2); // [255, 0, 0]
```

### Conversão de cor

```js
import { hexToRgb, rgbToHex } from 'ranuts';

const hex = '#ff5733';
const rgb = hexToRgb(hex);
console.log(rgb); // [255, 87, 51]

// De volta para hexadecimal
const hex2 = rgbToHex(rgb[0], rgb[1], rgb[2]);
console.log(hex2); // '#ff5733'
```

## Notas

1. **Formato aceito**: cores hexadecimais de seis dígitos (por exemplo `#ff0000` ou `ff0000`).
2. **Valor devolvido**: se der certo, um array `[r, g, b]`; se falhar, `null`.
3. **Maiúsculas e minúsculas**: `#FF0000` e `#ff0000` valem igual.
4. **Quando usar**: é comum para converter cores, tratá-las e lidar com cores de CSS.
