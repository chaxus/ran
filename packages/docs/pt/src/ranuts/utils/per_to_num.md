# perToNum

Converte uma string de porcentagem em número.

## API

### perToNum

#### Retorna

| Argumento | Descrição           | Tipo     |
| --------- | ------------------- | -------- |
| `number`  | O número resultante | `number` |

#### Parâmetros

| Parâmetro | Descrição             | Tipo     | Padrão |
| --------- | --------------------- | -------- | ------ |
| `str`     | String de porcentagem | `string` | `''`   |

## Exemplo

### Uso básico

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5
console.log(perToNum('100%')); // 1
console.log(perToNum('150%')); // 1.5
```

### Porcentagens maiores que 1

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5 (é 1 ou menos, volta como está)
console.log(perToNum('150%')); // 1.5 (passa de 1, divide por 100)
console.log(perToNum('200%')); // 2
```

### Strings numéricas comuns

```js
import { perToNum } from 'ranuts';

console.log(perToNum('0.5')); // 0.5
console.log(perToNum('100')); // 100
```

### String vazia

```js
import { perToNum } from 'ranuts';

console.log(perToNum('')); // 0
console.log(perToNum()); // 0
```

## Notas

1. **Tratamento da porcentagem**:
   - Se o valor passa de 1, divide por 100 (por exemplo `150%` → `1.5`)
   - Se o valor é 1 ou menos, volta como está (por exemplo `50%` → `0.5`)

2. **Strings sem porcentagem**: se a string não termina em `%`, é convertida direto em número.

3. **Valores vazios**: string vazia devolve `0`.

4. **Quando usar**: é comum para lidar com porcentagens de CSS, valores de progresso e afins.
