# convertImageToBase64

Convierte un archivo de imagen en una cadena codificada en Base64.

## API

### convertImageToBase64

#### Devuelve

| Argumento                             | Descripción                                        | Tipo      |
| ------------------------------------- | -------------------------------------------------- | --------- |
| `Promise<convertImageToBase64Return>` | Promesa que se resuelve con el objeto de resultado | `Promise` |

#### convertImageToBase64Return

| Propiedad | Descripción         | Tipo                            |
| --------- | ------------------- | ------------------------------- |
| `success` | Si salió bien       | `boolean`                       |
| `data`    | Los datos en Base64 | `string \| ArrayBuffer \| null` |
| `message` | Mensaje de error    | `string`                        |

#### Parámetros

| Parámetro | Descripción                    | Tipo   | Por defecto |
| --------- | ------------------------------ | ------ | ----------- |
| `file`    | El objeto de archivo de imagen | `File` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { convertImageToBase64 } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await convertImageToBase64(file);
      if (result.success) {
        console.log('Base64:', result.data);
        // Sirve tal cual para el src de una img
        document.getElementById('preview').src = result.data;
      }
    } catch (error) {
      console.error('Falló la conversión:', error);
    }
  }
});
```

### Previsualizar antes de subir

```js
import { convertImageToBase64 } from 'ranuts';

async function previewImage(file) {
  const result = await convertImageToBase64(file);
  if (result.success) {
    return result.data; // data:image/jpeg;base64,...
  }
  throw new Error('Falló la conversión de la imagen');
}
```

### Manejo de errores

```js
import { convertImageToBase64 } from 'ranuts';

try {
  const result = await convertImageToBase64(file);
  if (!result.success) {
    console.error('Error:', result.message);
  }
} catch (error) {
  console.error('Excepción:', error);
}
```

## Notas

1. **Es asíncrono**: devuelve una promesa, así que hay que usar `await` o `.then()`.

2. **Tipos de archivo**: admite todos los formatos de imagen que admita el navegador (JPEG, PNG, GIF, WebP y demás).

3. **Formato de los datos**: el `data` que devuelve es una Data URL completa (`data:image/jpeg;base64,...`), lista para el atributo `src` de una etiqueta `img`.

4. **Errores**: si la conversión falla, la promesa se rechaza; hay que capturarlo.

5. **Cuándo usarlo**: es habitual para previsualizar imágenes, procesarlas antes de subirlas y guardarlas en local.
