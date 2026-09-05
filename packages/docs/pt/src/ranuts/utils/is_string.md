# isString

Determina se um valor é do tipo string.

## API

### isString

#### Retorna

| Argumento | Descrição       | Tipo      |
| --------- | --------------- | --------- |
| `boolean` | Se é uma string | `boolean` |

#### Parâmetros

| Parâmetro | Descrição         | Tipo      | Padrão      |
| --------- | ----------------- | --------- | ----------- |
| `obj`     | Valor a verificar | `unknown` | Obrigatório |

## Exemplo

### Uso básico

```js
import { isString } from 'ranuts';

console.log(isString('hello')); // true
console.log(isString(123)); // false
console.log(isString(null)); // false
console.log(isString(undefined)); // false
```

### Verificação de tipo

```js
import { isString } from 'ranuts';

function processValue(value) {
  if (isString(value)) {
    console.log('É uma string:', value.toUpperCase());
  } else {
    console.log('Não é uma string');
  }
}

processValue('hello'); // 'É uma string: HELLO'
processValue(123); // 'Não é uma string'
```

### Validação de argumentos

```js
import { isString } from 'ranuts';

function validateInput(input) {
  if (!isString(input)) {
    throw new Error('A entrada precisa ser uma string');
  }
  return input.trim();
}
```

## Notas

1. **Como detecta o tipo**: usa `Object.prototype.toString.call()`, que distingue com precisão.
2. **Rigor**: só devolve `true` quando o valor é mesmo do tipo string; os demais tipos (inclusive objetos String) devolvem `false`.
3. **Quando usar**: é comum para verificar tipos, validar argumentos e afins.
