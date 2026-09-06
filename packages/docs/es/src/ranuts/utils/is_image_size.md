# isImageSize

Comprueba si las dimensiones de un archivo de imagen cumplen lo que se pide.

## API

### isImageSize

#### Devuelve

| Argumento          | Descripción                                                  | Tipo      |
| ------------------ | ------------------------------------------------------------ | --------- |
| `Promise<boolean>` | Promesa que se resuelve indicando si las dimensiones cumplen | `Promise` |

#### Parámetros

| Parámetro | Descripción                    | Tipo     | Por defecto |
| --------- | ------------------------------ | -------- | ----------- |
| `file`    | El objeto de archivo de imagen | `File`   | Obligatorio |
| `width`   | Ancho esperado (opcional)      | `number` | Opcional    |
| `height`  | Alto esperado (opcional)       | `number` | Opcional    |

## Ejemplo

### Uso básico

```js
import { isImageSize } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      // Comprobar si el ancho es 800
      const isValid = await isImageSize(file, 800);
      if (isValid) {
        console.log('El ancho de la imagen cumple');
      } else {
        console.log('El ancho de la imagen no cumple');
      }
    } catch (error) {
      console.error('Falló la comprobación:', error);
    }
  }
});
```

### Comprobar ancho y alto

```js
import { isImageSize } from 'ranuts';

async function validateImage(file) {
  // Comprobar si es 800x600
  const isValid = await isImageSize(file, 800, 600);
  return isValid;
}
```

### Comprobar solo el alto

```js
import { isImageSize } from 'ranuts';

const isValid = await isImageSize(file, undefined, 600);
// Solo comprueba si el alto es 600
```

### Validar antes de subir

```js
import { isImageSize } from 'ranuts';

async function handleFileUpload(file) {
  const isValid = await isImageSize(file, 1920, 1080);
  if (!isValid) {
    alert('La imagen debe medir 1920x1080');
    return;
  }
  // Seguir con la subida
}
```

## Comportamiento

1. **Si das `width` y `height`, ambas han de coincidir.** Si no das ninguna, solo se comprueba que el archivo se descodifique como imagen.
2. **Un fallo al descodificar rechaza** (archivo corrupto, algo que no es una imagen) en lugar de dejar la promesa pendiente.
3. **La URL de objeto siempre se libera**, tanto si sale bien como si sale mal, de modo que validar muchos archivos no va dejando URL de blob colgadas hasta que se abandone la página.
4. **Solo en el navegador**: bajo renderizado en servidor rechaza con un error claro.

::: warning Corregido en la 0.3
Antes la segunda condición pisaba a la primera, así que pasar `width` y `height` a la vez ignoraba `width` en silencio; no había `onerror`, de modo que un archivo corrupto dejaba la promesa pendiente para siempre; y la guarda para el servidor llamaba a `reject` sin retornar, seguía adelante, tocaba `window` y lanzaba un `ReferenceError`.
:::

## Notas

1. **Es asíncrono**: devuelve una promesa, así que hay que usar `await` o `.then()`.

2. **Sobre los argumentos**:
   - Si solo das `width`, solo se comprueba el ancho
   - Si solo das `height`, solo se comprueba el alto
   - Si das los dos, ambos han de coincidir

3. **En el servidor**: rechaza en entornos de servidor (sin objeto `window`).

4. **Limpieza de memoria**: la función libera por dentro la URL de objeto que creó; no hay que hacer nada a mano.

5. **Cuándo usarlo**: es habitual para validar dimensiones antes de subir un archivo, comprobar el tamaño de un avatar y similares.
