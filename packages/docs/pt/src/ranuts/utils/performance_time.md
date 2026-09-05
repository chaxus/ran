# performanceTime

Obtém um carimbo de tempo de alta precisão, tanto no navegador quanto no Node.js.

## API

### performanceTime

#### Retorna

| Argumento | Descrição                                         | Tipo     |
| --------- | ------------------------------------------------- | -------- |
| `number`  | Carimbo de tempo de alta precisão (milissegundos) | `number` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// Executa algumas operações
const end = performanceTime();
console.log(`Duração: ${end - start} ms`);
```

### Medir o desempenho

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// Executa operações custosas
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}
const end = performanceTime();
console.log(`Duração da operação: ${end - start} ms`);
```

### Tempo de execução de uma função

```js
import { performanceTime } from 'ranuts';

function expensiveFunction() {
  // Cálculo complexo
  return Math.random() * 1000;
}

const start = performanceTime();
const result = expensiveFunction();
const end = performanceTime();
console.log(`Resultado: ${result}, duração: ${end - start} ms`);
```

## Notas

1. **Ambientes suportados**:
   - Navegador: usa `performance.now()`
   - Node.js: usa `process.hrtime()`
   - Outros: recorre a `Date.now()`

2. **Precisão**: `performance.now()` e `process.hrtime()` chegam ao microssegundo, mais finos que `Date.now()`.

3. **Tempo relativo**: o carimbo devolvido é relativo; serve para medir diferenças, não como tempo absoluto.

4. **Unidade**: o valor devolvido está em milissegundos.
