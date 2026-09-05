# randomColor

Genera un objeto de color aleatorio.

## API

### randomColor

#### Devuelve

| Argumento | Descripción               | Tipo    |
| --------- | ------------------------- | ------- |
| `Color`   | Objeto de color aleatorio | `Color` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { randomColor } from 'ranuts';

const color = randomColor();
console.log(color.hex); // '#a3f5c2' (aleatorio)
console.log(color.rgb); // Rgb { r: 163, g: 245, b: 194 }
console.log(color.hsl); // Hsl { h: 150, s: 80, l: 80 }
```

### Sacar los valores del color aleatorio

```js
import { randomColor } from 'ranuts';

const color = randomColor();
const hexColor = color.hex;
const rgbColor = color.rgb.toString();
const hslColor = color.hsl.toString();

console.log(hexColor); // '#a3f5c2'
console.log(rgbColor); // 'rgb(163,245,194)'
console.log(hslColor); // 'hsl(150,80%,80%)'
```

### Generar varios colores aleatorios

```js
import { randomColor } from 'ranuts';

const colors = Array.from({ length: 5 }, () => randomColor());
colors.forEach((color, index) => {
  console.log(`Color ${index + 1}:`, color.hex);
});
```

### Aplicar un color aleatorio

```js
import { randomColor } from 'ranuts';

const color = randomColor();
document.body.style.backgroundColor = color.hex;
```

## Notas

1. **Generación aleatoria**: cada llamada produce un color hexadecimal al azar.
2. **Objeto completo**: devuelve un objeto `Color` entero, con todas sus propiedades: hex, rgb, hsl y demás.
3. **Formato del color**: el valor generado incluye el símbolo `#`, así que se puede usar directamente en CSS.
4. **Cuándo usarlo**: es habitual para generar colores al azar, en selectores de color y en visualización de datos.
