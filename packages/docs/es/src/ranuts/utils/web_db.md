# WebDB

Una envoltura de promesas sobre IndexedDB. El IndexedDB nativo se apoya en callbacks de eventos y transacciones: cada lectura o escritura son cinco pasos (abrir → transacción → objectStore → petición → `onsuccess`/`onerror`). `WebDB` reduce todo eso a `await db.add({ storeName, data })`.

## API

### new WebDB(options)

| Parámetro | Descripción                                                                                      | Tipo               | Por defecto |
| --------- | ------------------------------------------------------------------------------------------------ | ------------------ | ----------- |
| `dbName`  | Nombre de la base de datos                                                                       | `string`           | Obligatorio |
| `version` | Versión del esquema; súbela cada vez que cambies `stores`                                        | `number`           | `1`         |
| `stores`  | Almacenes de objetos e índices, declarados y creados durante una actualización                   | `IDBStoreSchema[]` | `[]`        |
| `upgrade` | Salida de emergencia para migraciones que el esquema no sabe expresar; corre después de `stores` | `Function`         | —           |

Todos los métodos se resuelven o se rechazan con la misma forma, `IDBResult`, así que a quien llama le basta con mirar `error`.

| Método                                               | Descripción                          |
| ---------------------------------------------------- | ------------------------------------ |
| `openDataBase()`                                     | Abre (y actualiza si hace falta)     |
| `closeDataBase()`                                    | Cierra y suelta el asa               |
| `refreshDatabase()`                                  | Cierra y vuelve a abrir              |
| `deleteDatabase()`                                   | Borra la base de datos               |
| `add({ storeName, data })`                           | Inserta; falla si la clave ya existe |
| `update({ storeName, data })`                        | Put: inserta o sobrescribe           |
| `readByKey({ storeName, key })`                      | Lee un registro                      |
| `readAll({ storeName, query?, count? })`             | Lee todos los registros              |
| `readByCursor({ storeName, keyRange?, direction? })` | Recorre con un cursor                |
| `count({ storeName, query? })`                       | Cuenta registros                     |
| `delete({ storeName, key })`                         | Borra un registro                    |
| `clear({ storeName })`                               | Vacía un almacén                     |

### `db.collection<T>(name)`

Un asa tipada e indulgente sobre un solo almacén. Fija el nombre del almacén una vez y devuelve valores llanos en lugar de `IDBResult`.

| Miembro       | Devuelve             | Si falla |
| ------------- | -------------------- | -------- |
| `get(key)`    | `Promise<T \| null>` | `null`   |
| `all()`       | `Promise<T[]>`       | `[]`     |
| `count()`     | `Promise<number>`    | `0`      |
| `add(value)`  | `Promise<boolean>`   | `false`  |
| `put(value)`  | `Promise<boolean>`   | `false`  |
| `remove(key)` | `Promise<boolean>`   | `false`  |
| `clear()`     | `Promise<boolean>`   | `false`  |

```js
const notes = db.collection('books_notes');
await notes.put(note); // false si falló
const all = await notes.all(); // [] si falló
```

::: warning Elige la capa adecuada
Todos estos métodos **se tragan el error**. Es lo correcto por defecto para lo que la mayoría de aplicaciones guarda en IndexedDB (por dónde iba leyendo, borradores, cachés), donde una lectura fallida debe degradar la función, no tumbar la pantalla. Es lo incorrecto cuando la escritura _es_ la acción de la persona (guardar un documento, cerrar una compra): ahí llama a los métodos de arriba, los que devuelven `IDBResult`, y ocúpate del fallo.
:::

## Ejemplo

```js
import { WebDB } from 'ranuts';

const db = new WebDB({
  dbName: 'read',
  version: 4,
  stores: [
    { name: 'books', options: { keyPath: 'id' }, indexes: [{ name: 'byAuthor', keyPath: 'author' }] },
    { name: 'notes', options: { keyPath: 'id' } },
  ],
});

await db.openDataBase();
await db.add({ storeName: 'books', data: { id: '1', title: 'Walden' } });
const { data } = await db.readByKey({ storeName: 'books', key: '1' });
```

## Notas

1. **Los almacenes solo pueden crearse dentro de una transacción de actualización**: por eso se declaran de antemano en vez de crearse una vez abierta la base de datos. Crear un almacén o un índice que falta es idempotente, así que no hay problema en conservar el mismo array `stores` entre versiones.
2. **Bajar de versión se arregla solo.** Abrir con una versión menor que la que hay en disco lanza un `VersionError`; `WebDB` extrae de ahí la versión real, se pone a la par y vuelve a abrir en lugar de dejar salir el error.
3. **Esta conexión nunca bloquea una actualización.** Cada apertura registra `onversionchange`, de modo que cuando otra pestaña o worker pide una versión superior, esta conexión se cierra sola.
4. **Combínalo con `singleFlight`** para que varias llamadas simultáneas compartan una sola apertura: `const ready = singleFlight(() => db.openDataBase())`.
