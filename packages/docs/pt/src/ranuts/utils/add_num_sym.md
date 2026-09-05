# addNumSym

Acrescenta o sinal (+ ou -) a um número.

## API

### addNumSym

#### Retorna

| Argumento | Descrição                          | Tipo     |
| --------- | ---------------------------------- | -------- |
| `string`  | O número, como string, com o sinal | `string` |

#### Parâmetros

| Parâmetro | Descrição                                   | Tipo               | Padrão      |
| --------- | ------------------------------------------- | ------------------ | ----------- |
| `value`   | Número ou string a processar                | `string \| number` | Obrigatório |
| `flag`    | Marcador de sinal (opcional, para forçá-lo) | `string \| number` | Opcional    |

## Exemplo

### Uso básico

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100)); // '+100'
console.log(addNumSym(-50)); // '-50'
console.log(addNumSym(0)); // '0'
```

### Entrada como string

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('100')); // '+100'
console.log(addNumSym('-50')); // '-50' (já tem sinal, fica como está)
```

### Forçar o sinal

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100, 1)); // '+100' (flag > 0)
console.log(addNumSym(100, -1)); // '100' (flag <= 0, o + não é acrescentado)
console.log(addNumSym(100, 0)); // '100'
```

### Quando já vem com sinal

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('+100')); // '+100' (já tem sinal, fica como está)
console.log(addNumSym('-50')); // '-50' (já tem sinal, fica como está)
```

## Notas

1. **Regras do sinal**:
   - Aos positivos é acrescentado `+`
   - Os negativos mantêm o `-`
   - O zero não leva sinal

2. **Sinal já presente**: se a string começa com `+` ou `-`, nenhum outro é acrescentado.

3. **Forçar**: com o argumento `flag` controla-se se o `+` entra (entra quando `flag > 0`).

4. **Quando usar**: é comum para mostrar ganhos e perdas, variações e qualquer número em que o sinal precise aparecer.
