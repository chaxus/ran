# mathjs

Función de cálculo exacto que sortea los problemas de precisión de los flotantes de JavaScript y admite encadenamiento.

## API

### mathjs

#### Devuelve

| Argumento             | Descripción                         | Tipo                                 |
| --------------------- | ----------------------------------- | ------------------------------------ |
| `ComputeNumberResult` | Objeto con el resultado del cálculo | `{ result: number, next: Function }` |

#### Parámetros

| Parámetro | Descripción                    | Tipo     | Por defecto |
| --------- | ------------------------------ | -------- | ----------- |
| `a`       | Primer número                  | `number` | Obligatorio |
| `type`    | Operación (`+`, `-`, `*`, `/`) | `string` | Obligatorio |
| `b`       | Segundo número                 | `number` | Obligatorio |

#### ComputeNumberResult

| Propiedad | Descripción                    | Tipo       |
| --------- | ------------------------------ | ---------- |
| `result`  | El resultado del cálculo       | `number`   |
| `next`    | Función para seguir calculando | `Function` |

## Ejemplo

### Uso básico

```js
import { mathjs } from 'ranuts';

const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3 (exacto, no 0.30000000000000004)
```

### Encadenamiento

```js
import { mathjs } from 'ranuts';

const result = mathjs(1.3, '-', 1.2).next('+', 1.5).next('*', 2.3).next('/', 0.2);
console.log(result.result); // El resultado exacto
```

### Sortear los problemas de precisión

```js
import { mathjs } from 'ranuts';

// El cálculo nativo de JavaScript pierde precisión
console.log(0.1 + 0.2); // 0.30000000000000004

// Con mathjs el resultado es exacto
const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3
```

### Un cálculo más largo

```js
import { mathjs } from 'ranuts';

const total = mathjs(100, '*', 0.1).next('+', 50).next('-', 20).next('/', 2);
console.log(total.result); // El resultado exacto
```

## Notas

1. **Precisión**: trata solo los problemas de coma flotante y evita el clásico `0.1 + 0.2 !== 0.3`.
2. **Encadenamiento**: se pueden encadenar cálculos con el método `next`.
3. **Operaciones**: las cuatro básicas: `+` (sumar), `-` (restar), `*` (multiplicar) y `/` (dividir).
4. **Coste**: algo más lento que las operaciones nativas, pero la exactitud está garantizada.
