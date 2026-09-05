# addNumSym

Añade el signo (+ o -) a un número.

## API

### addNumSym

#### Devuelve

| Argumento | Descripción                          | Tipo     |
| --------- | ------------------------------------ | -------- |
| `string`  | El número, como cadena, con su signo | `string` |

#### Parámetros

| Parámetro | Descripción                                  | Tipo               | Por defecto |
| --------- | -------------------------------------------- | ------------------ | ----------- |
| `value`   | Número o cadena que se procesa               | `string \| number` | Obligatorio |
| `flag`    | Indicador de signo (opcional, para forzarlo) | `string \| number` | Opcional    |

## Ejemplo

### Uso básico

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100)); // '+100'
console.log(addNumSym(-50)); // '-50'
console.log(addNumSym(0)); // '0'
```

### Entrada como cadena

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('100')); // '+100'
console.log(addNumSym('-50')); // '-50' (ya trae signo, no cambia)
```

### Forzar el signo

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym(100, 1)); // '+100' (flag > 0)
console.log(addNumSym(100, -1)); // '100' (flag <= 0, no se añade el +)
console.log(addNumSym(100, 0)); // '100'
```

### Cuando ya trae signo

```js
import { addNumSym } from 'ranuts';

console.log(addNumSym('+100')); // '+100' (ya trae signo, no cambia)
console.log(addNumSym('-50')); // '-50' (ya trae signo, no cambia)
```

## Notas

1. **Reglas del signo**:
   - A los positivos se les pone `+`
   - Los negativos conservan su `-`
   - El cero no lleva signo

2. **Signo ya presente**: si la cadena empieza por `+` o `-`, no se añade otro.

3. **Forzarlo**: con el argumento `flag` se controla si se pone el `+` (se pone cuando `flag > 0`).

4. **Cuándo usarlo**: es habitual para mostrar ganancias y pérdidas, variaciones y cualquier cifra donde el signo deba verse.
