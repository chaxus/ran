# queryFlag / isInIframe

Lee una bandera booleana de la URL y averigua si la página está incrustada: las dos comprobaciones que hay detrás de `?embed`, `?readonly` y `?debug`.

## API

| Función                | Descripción                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `queryFlag(key, url?)` | Si un parámetro de consulta se lee como verdadero                |
| `isInIframe()`         | Si esta página corre dentro de un iframe; `false` en el servidor |

### `queryFlag`

| Parámetro | Descripción                       | Tipo     | Por defecto         |
| --------- | --------------------------------- | -------- | ------------------- |
| `key`     | Nombre del parámetro              | `string` | Obligatorio         |
| `url`     | URL completa o cadena de consulta | `string` | La ubicación actual |

Verdadero para `?k`, `?k=`, `?k=1` y `?k=true` (sin distinguir mayúsculas). Falso para todo lo demás, incluidos el parámetro ausente y un `?k=false` explícito.

## Ejemplo

### Leer una bandera

```js
import { queryFlag } from 'ranuts';

queryFlag('embed', '?embed'); // true  ← la forma más habitual
queryFlag('embed', '?embed=1'); // true
queryFlag('embed', '?embed=true'); // true
queryFlag('embed', '?embed=false'); // false
queryFlag('embed', '?lang=en'); // false
```

### Detectar el modo incrustado

```js
import { queryFlag, isInIframe } from 'ranuts';

// Está incrustada si va en un marco, o si el anfitrión lo pidió expresamente.
const embedded = isInIframe() || queryFlag('embed') || queryFlag('embedded');

if (embedded) {
  document.body.classList.add('embed-mode');
}
```

### No medir dentro de la página de otro

```js
import { isInIframe } from 'ranuts';

// Medir aquí nos apuntaría las visitas del sitio anfitrión.
if (!isInIframe()) initAnalytics();
```

### Vista previa de solo lectura

```js
import { queryFlag } from 'ranuts';

openDocument(file, { readonly: queryFlag('readonly') });
```

## Notas

1. **Lo habitual es escribir la bandera a secas.** `?embed` no lleva valor, así que `getQuery(url).embed` es `''` (falso), y una comprobación de veracidad sin más se pierde en silencio la forma más común. Para eso existe `queryFlag`.

2. **`?k=false` es falso.** Se respeta la negación explícita en lugar de tomarla por «está, luego está activo».

3. **`isInIframe` va protegida.** Leer `window.parent` puede lanzar una excepción entre orígenes distintos en algunos motores; un padre ilegible se toma por incrustado, porque eso es justo lo que significa.

4. **Ambas son seguras en el servidor.** Sin `window`, `isInIframe` es `false` y `queryFlag` es `false` salvo que se le pase una `url`, así que basta con darles la URL para usarlas en un script de compilación.
