# clearBr

Quita de una cadena los espacios, las etiquetas HTML y los saltos de línea.

## API

### clearBr

#### Devuelve

| Argumento | Descripción         | Tipo     |
| --------- | ------------------- | -------- |
| `string`  | La cadena ya limpia | `string` |

#### Parámetros

| Parámetro | Descripción                | Tipo     | Por defecto |
| --------- | -------------------------- | -------- | ----------- |
| `str`     | Cadena que se va a limpiar | `string` | `''`        |

## Ejemplo

### Uso básico

```js
import { clearBr } from 'ranuts';

const text = '  <p>Hello\nWorld</p>  ';
const cleaned = clearBr(text);
console.log(cleaned); // 'HelloWorld'
```

### Limpiar contenido HTML

```js
import { clearBr } from 'ranuts';

const html = '<div>Esto es contenido de <strong>prueba</strong></div>\nsalto de línea';
const cleaned = clearBr(html);
console.log(cleaned); // 'Estoescontenidodepruebasaltodelínea'
```

### Cadena vacía

```js
import { clearBr } from 'ranuts';

console.log(clearBr('')); // '' (cadena vacía)
console.log(clearBr()); // '' (cadena vacía)
```

## Notas

1. **Qué limpia**: quita todos los espacios, las etiquetas HTML y los saltos de línea (`\r\n`).
2. **Cadena vacía**: si la entrada es una cadena vacía, devuelve una cadena vacía sin más.
3. **Cuándo usarlo**: es habitual para extraer el texto plano quitando las marcas de formato.
