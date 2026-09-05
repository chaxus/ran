# transformNumber

Converte um número em uma string com unidades, tanto chinesas quanto inglesas.

## API

### transformNumber

#### Retorna

| Argumento | Descrição          | Tipo     |
| --------- | ------------------ | -------- |
| `string`  | A string formatada | `string` |

#### Parâmetros

| Parâmetro   | Descrição                                | Tipo     | Padrão      |
| ----------- | ---------------------------------------- | -------- | ----------- |
| `value`     | Número, como string, que será convertido | `string` | Obrigatório |
| `locale`    | Configuração regional                    | `string` | `'zh-CN'`   |
| `precision` | Precisão do cálculo                      | `number` | `2`         |
| `fixed`     | Casas decimais exibidas                  | `number` | `2`         |

## Exemplo

### Uso básico

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000')); // '1.00 万' (dez mil, em chinês)
console.log(transformNumber('1000000')); // '100.00 万' (um milhão)
console.log(transformNumber('100000000')); // '1.00 亿' (cem milhões)
```

### Unidades inglesas

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000', 'en')); // '1.00K'
console.log(transformNumber('1000000', 'en')); // '1.00M'
console.log(transformNumber('1000000000', 'en')); // '1.00B'
```

### Ajustar a precisão

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1234', 'zh-CN', 2, 1)); // '0.1 万'
console.log(transformNumber('12345', 'zh-CN', 2, 0)); // '1 万'
```

### Entradas inválidas

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('abc')); // '--'
console.log(transformNumber('')); // '--'
```

## Notas

1. **Sistema de unidades**:
   - `zh-CN`: 万 (dez mil), 亿 (cem milhões), 万亿 (trilhão), a cada quatro dígitos
   - `zh-HK`: 萬, 億, 萬億, também a cada quatro dígitos
   - `en`: K (mil), M (milhão), B (bilhão), T (trilhão), a cada três dígitos

2. **Precisão**: usa o `Mathjs` para calcular sem arrastar erros de vírgula flutuante.

3. **Entrada inválida**: se o que chega não é um número, devolve `'--'`.

4. **Quando usar**: é comum para exibir números grandes: valores, visualizações, seguidores e afins.
