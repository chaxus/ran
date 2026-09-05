# isSafari

Determina si el navegador actual es Safari.

## API

### isSafari

#### Devuelve

| Argumento                        | Descripción               | Tipo                             |
| -------------------------------- | ------------------------- | -------------------------------- |
| `boolean \| undefined \| string` | Si el navegador es Safari | `boolean \| undefined \| string` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { isSafari } from 'ranuts';

const isSafariBrowser = isSafari();
if (isSafariBrowser) {
  console.log('El navegador actual es Safari');
} else {
  console.log('No es Safari');
}
```

### Funciones propias de Safari

```js
import { isSafari } from 'ranuts';

if (isSafari()) {
  // Tratamiento propio de Safari
  // por ejemplo, resolver ciertos problemas de compatibilidad
  applySafariFix();
}
```

### Entorno de servidor

```js
import { isSafari } from 'ranuts';

// Devuelve undefined en un entorno de servidor
const result = isSafari();
console.log(result); // undefined (entorno de servidor)
```

## Notas

1. **Cómo lo detecta**: mira si `navigator.vendor` contiene 'Apple'.
2. **Excluye otros navegadores**: deja fuera Chrome iOS (CriOS) y Firefox iOS (FxiOS).
3. **Entorno de servidor**: devuelve `undefined` en entornos de servidor (no hay objeto `navigator`).
4. **Valor devuelto**: `boolean` en el navegador, `undefined` en el servidor; en algunos casos puede devolver una cadena.
