# hexToRgb

Convierte un color hexadecimal en un array RGB.

## API

### hexToRgb

#### Devuelve

| Argumento               | Descripción                 | Tipo                    |
| ----------------------- | --------------------------- | ----------------------- |
| `Array<number> \| null` | Array RGB [r, g, b], o null | `Array<number> \| null` |

#### Parámetros

| Parámetro | Descripción       | Tipo     | Por defecto |
| --------- | ----------------- | -------- | ----------- |
| `hex`     | Color hexadecimal | `string` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#ff0000');
console.log(rgb); // [255, 0, 0]

const rgb2 = hexToRgb('#00ff00');
console.log(rgb2); // [0, 255, 0]
```

### Valores no válidos

```js
import { hexToRgb } from 'ranuts';

const rgb = hexToRgb('#invalid');
console.log(rgb); // null
```

### Con o sin el símbolo `#`

```js
import { hexToRgb } from 'ranuts';

const rgb1 = hexToRgb('#ff0000');
const rgb2 = hexToRgb('ff0000');
console.log(rgb1); // [255, 0, 0]
console.log(rgb2); // [255, 0, 0]
```

### Conversión de color

```js
import { hexToRgb, rgbToHex } from 'ranuts';

const hex = '#ff5733';
const rgb = hexToRgb(hex);
console.log(rgb); // [255, 87, 51]

// De vuelta a hexadecimal
const hex2 = rgbToHex(rgb[0], rgb[1], rgb[2]);
console.log(hex2); // '#ff5733'
```

## Notas

1. **Formato admitido**: colores hexadecimales de seis dígitos (por ejemplo `#ff0000` o `ff0000`).
2. **Valor devuelto**: si acierta, un array `[r, g, b]`; si falla, `null`.
3. **Mayúsculas y minúsculas**: `#FF0000` y `#ff0000` valen igual.
4. **Cuándo usarlo**: es habitual para convertir colores, procesarlos y manejar colores de CSS.
