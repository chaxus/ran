# perToNum

Convierte una cadena de porcentaje en un número.

## API

### perToNum

#### Devuelve

| Argumento | Descripción          | Tipo     |
| --------- | -------------------- | -------- |
| `number`  | El número resultante | `number` |

#### Parámetros

| Parámetro | Descripción          | Tipo     | Por defecto |
| --------- | -------------------- | -------- | ----------- |
| `str`     | Cadena de porcentaje | `string` | `''`        |

## Ejemplo

### Uso básico

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5
console.log(perToNum('100%')); // 1
console.log(perToNum('150%')); // 1.5
```

### Porcentajes mayores que 1

```js
import { perToNum } from 'ranuts';

console.log(perToNum('50%')); // 0.5 (es 1 o menos, se devuelve tal cual)
console.log(perToNum('150%')); // 1.5 (pasa de 1, se divide entre 100)
console.log(perToNum('200%')); // 2
```

### Cadenas numéricas normales

```js
import { perToNum } from 'ranuts';

console.log(perToNum('0.5')); // 0.5
console.log(perToNum('100')); // 100
```

### Cadena vacía

```js
import { perToNum } from 'ranuts';

console.log(perToNum('')); // 0
console.log(perToNum()); // 0
```

## Notas

1. **Tratamiento del porcentaje**:
   - Si el valor pasa de 1, se divide entre 100 (por ejemplo `150%` → `1.5`)
   - Si el valor es 1 o menos, se devuelve tal cual (por ejemplo `50%` → `0.5`)

2. **Cadenas sin porcentaje**: si la cadena no acaba en `%`, se convierte directamente a número.

3. **Valores vacíos**: una cadena vacía devuelve `0`.

4. **Cuándo usarlo**: es habitual para manejar porcentajes de CSS, valores de progreso y similares.
