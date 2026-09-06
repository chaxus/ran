# createHandoff

Pasa un valor (un `File`, un `Blob`, cualquier cosa clonable estructuradamente) de una página a la siguiente dentro del mismo origen.

Un `File` que la persona eligió en la página A no puede viajar a la página B. No cabe en una URL y no es serializable; `sessionStorage` solo admite cadenas. IndexedDB guarda tal cual los valores clonables estructuradamente, así que la página A deja el valor y navega, y la página B lo recoge.

## API

### createHandoff(options)

| Parámetro   | Descripción                                                         | Tipo     | Por defecto |
| ----------- | ------------------------------------------------------------------- | -------- | ----------- |
| `dbName`    | Nombre de la base de datos; ambos lados deben usar el mismo         | `string` | Obligatorio |
| `storeName` | Nombre del almacén de objetos, que se crea al abrir por primera vez | `string` | `'files'`   |
| `key`       | Clave bajo la que se guarda el único valor pendiente                | `string` | `'pending'` |

#### Devuelve

| Método       | Descripción                                                            |
| ------------ | ---------------------------------------------------------------------- |
| `put(value)` | Guarda un valor para la página siguiente. `false` si no pudo guardarlo |
| `take()`     | Recoge el valor pendiente y lo borra. `null` si no hay nada pendiente  |

## Ejemplo

### La página de entrada le pasa un archivo a la aplicación

```js
import { createHandoff } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

input.addEventListener('change', async () => {
  await handoff.put(input.files[0]);
  location.href = '/app?open=local';
});
```

### La aplicación lo recoge

```js
import { createHandoff, queryFlag } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

if (queryFlag('open')) {
  const file = await handoff.take();
  if (file) openDocument(file); // null al recargar: el valor ya se consumió
}
```

## Notas

1. **Leer destruye.** `take()` borra el valor dentro de la misma transacción con que lo lee. Eso es lo que impide que recargar la página vuelva a abrir el mismo archivo, y lo que hace que una URL `?open=local` caducada no encuentre nada.

2. **Dos pestañas no pueden ganar las dos.** Como la lectura y el borrado comparten una sola transacción, una carrera entre pestañas entrega el valor exactamente a una de ellas.

3. **`put` se resuelve al confirmar, no al pedir la escritura.** El valor solo queda a salvo cuando la transacción se confirma, y la página suele marcharse justo después.

4. **Los fallos son discretos.** Un IndexedDB ausente o bloqueado (renderizado en servidor, modo privado, un marco de terceros) hace que `put` se resuelva a `false` y `take` a `null`. Una página que solo _intentó_ pasar algo no debe romperse porque no hubiera almacenamiento.

5. **El almacén se crea en la versión 1** por el lado que abra primero la base de datos; el otro se lo encuentra ya hecho.

6. **Un valor cada vez.** Esto es un relevo, no una cola: un segundo `put` sobrescribe el valor pendiente. Usa [`WebDB`](/es/src/ranuts/utils/web_db) cuando necesites almacenamiento de verdad.
