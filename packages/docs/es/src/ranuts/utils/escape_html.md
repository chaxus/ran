# escapeHtml

Escapa los caracteres especiales de HTML para prevenir ataques XSS.

## API

### escapeHtml

#### Devuelve

| Argumento | Descripción        | Tipo     |
| --------- | ------------------ | -------- |
| `string`  | La cadena escapada | `string` |

#### Parámetros

| Parámetro | Descripción          | Tipo                       | Por defecto |
| --------- | -------------------- | -------------------------- | ----------- |
| `string`  | Cadena que se escapa | `string \| number \| null` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { escapeHtml } from 'ranuts';

const html = '<script>alert("XSS")</script>';
const escaped = escapeHtml(html);
console.log(escaped); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

### Escapar caracteres especiales

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml('"hello"')); // '&quot;hello&quot;'
console.log(escapeHtml("'world'")); // '&#39;world&#39;'
console.log(escapeHtml('a & b')); // 'a &amp; b'
console.log(escapeHtml('<div>')); // '&lt;div&gt;'
```

### Números y null

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml(123)); // '123'
console.log(escapeHtml(null)); // 'null'
```

### Prevenir ataques XSS

```js
import { escapeHtml } from 'ranuts';

const userInput = '<img src=x onerror=alert(1)>';
const safe = escapeHtml(userInput);
document.getElementById('content').textContent = safe;
// Se muestra sin peligro; el script no se ejecuta
```

## Notas

1. **Caracteres escapados**: se escapan los siguientes:
   - `"` → `&quot;`
   - `'` → `&#39;`
   - `&` → `&amp;`
   - `<` → `&lt;`
   - `>` → `&gt;`

2. **Conversión de tipo**: lo que no es una cadena se convierte primero a cadena y luego se escapa.

3. **Seguridad**: sirve para prevenir ataques XSS; úsalo siempre que muestres contenido escrito por el usuario.

4. **Rendimiento**: si la cadena no contiene caracteres especiales, se devuelve tal cual.
