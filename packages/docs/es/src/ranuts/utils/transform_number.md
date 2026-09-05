# transformNumber

Convierte un número en una cadena con unidades, tanto chinas como inglesas.

## API

### transformNumber

#### Devuelve

| Argumento | Descripción           | Tipo     |
| --------- | --------------------- | -------- |
| `string`  | La cadena con formato | `string` |

#### Parámetros

| Parámetro   | Descripción                           | Tipo     | Por defecto |
| ----------- | ------------------------------------- | -------- | ----------- |
| `value`     | Número, como cadena, que se convierte | `string` | Obligatorio |
| `locale`    | Configuración regional                | `string` | `'zh-CN'`   |
| `precision` | Precisión del cálculo                 | `number` | `2`         |
| `fixed`     | Decimales que se muestran             | `number` | `2`         |

## Ejemplo

### Uso básico

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000')); // '1.00 万' (diez mil, en chino)
console.log(transformNumber('1000000')); // '100.00 万' (un millón)
console.log(transformNumber('100000000')); // '1.00 亿' (cien millones)
```

### Unidades inglesas

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1000', 'en')); // '1.00K'
console.log(transformNumber('1000000', 'en')); // '1.00M'
console.log(transformNumber('1000000000', 'en')); // '1.00B'
```

### Ajustar la precisión

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('1234', 'zh-CN', 2, 1)); // '0.1 万'
console.log(transformNumber('12345', 'zh-CN', 2, 0)); // '1 万'
```

### Entradas no válidas

```js
import { transformNumber } from 'ranuts';

console.log(transformNumber('abc')); // '--'
console.log(transformNumber('')); // '--'
```

## Notas

1. **Sistema de unidades**:
   - `zh-CN`: 万 (diez mil), 亿 (cien millones), 万亿 (billón), cada cuatro dígitos
   - `zh-HK`: 萬, 億, 萬億, también cada cuatro dígitos
   - `en`: K (mil), M (millón), B (mil millones), T (billón), cada tres dígitos

2. **Precisión**: usa `Mathjs` para calcular sin arrastrar errores de coma flotante.

3. **Entrada no válida**: si lo que llega no es un número, devuelve `'--'`.

4. **Cuándo usarlo**: es habitual para mostrar cifras grandes: importes, visitas, seguidores y demás.
