# rgbToHex

Converte valores RGB em uma cor hexadecimal.

## API

### rgbToHex

#### Retorna

| Argumento | Descrição         | Tipo     |
| --------- | ----------------- | -------- |
| `string`  | A cor hexadecimal | `string` |

#### Parâmetros

| Parâmetro | Descrição                         | Tipo                        | Padrão      |
| --------- | --------------------------------- | --------------------------- | ----------- |
| `r`       | Valor do vermelho, ou o array RGB | `string \| number \| Array` | Obrigatório |
| `g`       | Valor do verde (opcional)         | `string \| number`          | `0`         |
| `b`       | Valor do azul (opcional)          | `string \| number`          | `0`         |

## Exemplo

### Uso básico

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex(255, 0, 0);
console.log(hex); // '#ff0000'

const hex2 = rgbToHex(0, 255, 0);
console.log(hex2); // '#00ff00'
```

### Passar um array

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex([255, 87, 51]);
console.log(hex); // '#ff5733'
```

### Conversão de cor

```js
import { rgbToHex, hexToRgb } from 'ranuts';

const rgb = [255, 87, 51];
const hex = rgbToHex(rgb);
console.log(hex); // '#ff5733'

// De volta para RGB
const rgb2 = hexToRgb(hex);
console.log(rgb2); // [255, 87, 51]
```

### Gerar cores em tempo de execução

```js
import { rgbToHex } from 'ranuts';

function generateColor(r, g, b) {
  return rgbToHex(r, g, b);
}

const color = generateColor(100, 150, 200);
console.log(color); // '#6496c8'
```

## Notas

1. **Formas de passar**: aceita três:
   - Três argumentos soltos: `rgbToHex(r, g, b)`
   - Um array: `rgbToHex([r, g, b])`
   - String ou número: convertidos sozinhos

2. **Valor devolvido**: sempre uma cor hexadecimal com o símbolo `#`.

3. **Faixa**: os valores RGB costumam ir de 0 a 255; os que saem disso são convertidos assim mesmo.

4. **Quando usar**: é comum para converter cores, gerar cores de CSS e tratá-las.
