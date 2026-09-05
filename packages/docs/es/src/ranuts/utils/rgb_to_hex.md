# rgbToHex

Convierte valores RGB en un color hexadecimal.

## API

### rgbToHex

#### Devuelve

| Argumento | Descripción          | Tipo     |
| --------- | -------------------- | -------- |
| `string`  | El color hexadecimal | `string` |

#### Parámetros

| Parámetro | Descripción                    | Tipo                        | Por defecto |
| --------- | ------------------------------ | --------------------------- | ----------- |
| `r`       | Valor del rojo, o el array RGB | `string \| number \| Array` | Obligatorio |
| `g`       | Valor del verde (opcional)     | `string \| number`          | `0`         |
| `b`       | Valor del azul (opcional)      | `string \| number`          | `0`         |

## Ejemplo

### Uso básico

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex(255, 0, 0);
console.log(hex); // '#ff0000'

const hex2 = rgbToHex(0, 255, 0);
console.log(hex2); // '#00ff00'
```

### Pasar un array

```js
import { rgbToHex } from 'ranuts';

const hex = rgbToHex([255, 87, 51]);
console.log(hex); // '#ff5733'
```

### Conversión de color

```js
import { rgbToHex, hexToRgb } from 'ranuts';

const rgb = [255, 87, 51];
const hex = rgbToHex(rgb);
console.log(hex); // '#ff5733'

// De vuelta a RGB
const rgb2 = hexToRgb(hex);
console.log(rgb2); // [255, 87, 51]
```

### Generar colores sobre la marcha

```js
import { rgbToHex } from 'ranuts';

function generateColor(r, g, b) {
  return rgbToHex(r, g, b);
}

const color = generateColor(100, 150, 200);
console.log(color); // '#6496c8'
```

## Notas

1. **Formas de pasarlo**: admite tres:
   - Tres argumentos sueltos: `rgbToHex(r, g, b)`
   - Un array: `rgbToHex([r, g, b])`
   - Cadena o número: se convierten solos

2. **Valor devuelto**: siempre un color hexadecimal con el símbolo `#`.

3. **Rango**: los valores RGB suelen ir de 0 a 255; los que se salgan se convierten igualmente a hexadecimal.

4. **Cuándo usarlo**: es habitual para convertir colores, generar colores de CSS y procesarlos.
