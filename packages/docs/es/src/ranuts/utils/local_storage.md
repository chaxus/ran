# Utilidades para localStorage

Acceso a localStorage que no puede lanzar, más una vista con prefijo y serialización JSON por encima.

`localStorage` no es que simplemente no exista al renderizar en el servidor: también lanza al _acceder_ a él desde un iframe de terceros con las cookies bloqueadas, y al _escribir_ en el modo privado de Safari o al llegar al cupo. Aquí toda lectura y toda escritura van protegidas, porque un fallo de almacenamiento debería degradar una preferencia, nunca romper la página.

## API

### localStorageSetItem

Guarda un valor en localStorage.

#### Parámetros

| Parámetro | Descripción        | Tipo     | Por defecto |
| --------- | ------------------ | -------- | ----------- |
| `name`    | Nombre de la clave | `string` | Obligatorio |
| `value`   | El valor           | `string` | Obligatorio |

#### Devuelve

Sin valor de retorno (`void`)

### localStorageGetItem

Lee un valor de localStorage.

#### Parámetros

| Parámetro | Descripción        | Tipo     | Por defecto |
| --------- | ------------------ | -------- | ----------- |
| `name`    | Nombre de la clave | `string` | Obligatorio |

#### Devuelve

| Argumento | Descripción                                  | Tipo     |
| --------- | -------------------------------------------- | -------- |
| `string`  | El valor guardado; cadena vacía si no existe | `string` |

### localStorageRemoveItem

Quita una clave.

| Parámetro | Descripción        | Tipo     | Por defecto |
| --------- | ------------------ | -------- | ----------- |
| `name`    | Nombre de la clave | `string` | Obligatorio |

### createStore(prefix?)

Una vista sobre localStorage con prefijo y serialización JSON.

#### Devuelve

| Método               | Descripción                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `get(key, fallback)` | El valor guardado, o `fallback` si falta, no está disponible o está corrupto |
| `set(key, value)`    | Serializa y guarda; `false` si no se llegó a escribir nada                   |
| `remove(key)`        | Quita la clave                                                               |
| `keyOf(key)`         | La clave completa (`prefix + key`), útil para escuchar el evento `storage`   |

## Ejemplo

### Uso básico

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// Guardar el valor
localStorageSetItem('username', 'john');

// Leer el valor
const username = localStorageGetItem('username');
console.log(username); // 'john'
```

### Guardar un objeto

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

const user = { name: 'John', age: 30 };
localStorageSetItem('user', JSON.stringify(user));

const storedUser = JSON.parse(localStorageGetItem('user'));
console.log(storedUser); // { name: 'John', age: 30 }
```

### Seguridad en el servidor

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// En el servidor no lanza error: falla en silencio
localStorageSetItem('key', 'value'); // En el servidor: no hace nada
const value = localStorageGetItem('key'); // En el servidor: devuelve ''
```

### Comprobar si existe

```js
import { localStorageGetItem } from 'ranuts';

const value = localStorageGetItem('myKey');
if (value) {
  console.log('El valor existe:', value);
} else {
  console.log('El valor no existe');
}
```

### Almacenamiento JSON con espacio de nombres

```js
import { createStore } from 'ranuts';

const history = createStore('agent_history_');

history.set('default', messages); // escribe agent_history_default
const restored = history.get('default', []); // [] si falta o está corrupto
history.remove('default');
```

### Varias funciones, un mismo origen

```js
import { createStore } from 'ranuts';

// Los prefijos evitan que funciones sin relación entre sí choquen.
const keys = createStore('agent_api_key_');
const prefs = createStore('editor_prefs_');

keys.set('anthropic', token);
prefs.set('theme', 'dark');
```

## Notas

1. **Aquí no lanza nada.** Que no haya almacenamiento, un marco de terceros bloqueado, el modo privado, el cupo: todo eso se degrada sin ruido. `localStorageGetItem` devuelve `''`, las funciones que escriben no hacen nada y `createStore().set()` informa `false`.

2. **La protección está en la llamada, no al cargar el módulo.** La búsqueda del almacenamiento ocurre dentro de cada llamada, así que esto funciona tras renderizar en servidor e hidratar, y se puede sustituir en las pruebas.

3. **`createStore` no valida nada.** Lo que hubiera guardado vuelve tipado como `T`; compruébalo tú si cruza una frontera de versión. El valor de reserva solo cubre la ausencia y el fallo al analizar: un valor escrito por una versión anterior de tu código no puede lanzarle un `SyntaxError` a quien llama, pero sí puede tener la forma equivocada.

4. **`set` devuelve `false`** ante una estructura circular, un `BigInt`, o una escritura que no llegó a cuajar. Vuelve a leer el valor para confirmarlo.

5. **Límite de tipos**: las utilidades en crudo solo manejan cadenas. Usa `createStore` en vez de escribir a mano `JSON.stringify` y `JSON.parse` con un try/catch en cada sitio.

6. **Valor devuelto**: cuando el valor no existe, `localStorageGetItem` devuelve `''`, no `null`.
