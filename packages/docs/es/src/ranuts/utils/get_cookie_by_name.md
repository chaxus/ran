# getCookieByName

Obtiene el valor de una cookie por su nombre mediante una expresión regular.

## API

### getCookieByName

#### Devuelve

| Argumento | Descripción                                      | Tipo     |
| --------- | ------------------------------------------------ | -------- |
| `string`  | El valor de la cookie; cadena vacía si no existe | `string` |

#### Parámetros

| Parámetro | Descripción         | Tipo     | Por defecto |
| --------- | ------------------- | -------- | ----------- |
| `name`    | Nombre de la cookie | `string` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { getCookieByName } from 'ranuts';

const token = getCookieByName('token');
console.log(token); // El valor de la cookie, o una cadena vacía
```

### En qué se diferencia de getCookie

```js
import { getCookie, getCookieByName } from 'ranuts';

// getCookie parte la cadena
const value1 = getCookie('token');

// getCookieByName usa una expresión regular
const value2 = getCookieByName('token');

// Hacen lo mismo; solo cambia la implementación
```

### Comprobar si la cookie existe

```js
import { getCookieByName } from 'ranuts';

const sessionId = getCookieByName('sessionId');
if (sessionId) {
  console.log('ID de sesión:', sessionId);
} else {
  console.log('No existe el ID de sesión');
}
```

## Notas

1. **Coincidencia por expresión regular**: busca la cookie con una expresión regular, así que tolera espacios antes o después del nombre.
2. **Seguro en el servidor**: en entornos de servidor (sin objeto `window`) devuelve una cadena vacía y no lanza errores.
3. **Diferencia con getCookie**: hacen lo mismo, pero `getCookieByName` usa una expresión regular y `getCookie` parte la cadena.
4. **Valor devuelto**: cuando la cookie no existe devuelve una cadena vacía, no `null` ni `undefined`.
