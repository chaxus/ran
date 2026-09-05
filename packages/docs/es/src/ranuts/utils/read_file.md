# readFileAs*

Envoltorios con promesas alrededor de `FileReader`.

| Función                           | Resuelve con  | Sirve para                                                      |
| --------------------------------- | ------------- | --------------------------------------------------------------- |
| `readFileAsArrayBuffer(blob)`     | `ArrayBuffer` | Procesar binario                                                |
| `readFileAsUint8Array(blob)`      | `Uint8Array`  | Alimentar `checkEncoding` / `arrayBufferToString`               |
| `readFileAsText(blob, encoding?)` | `string`      | Archivos de texto; si no sabes la codificación, olfatéala antes |
| `readFileAsDataURL(blob)`         | `string`      | Vistas previas de imágenes                                      |

## Ejemplo

```js
import { readFileAsUint8Array, arrayBufferToString } from 'ranuts';

input.addEventListener('change', async (e) => {
  const bytes = await readFileAsUint8Array(e.target.files[0]);
  const text = arrayBufferToString(bytes); // la codificación se olfatea, GBK/Big5 incluidos
});
```

## Notas

1. **Las tres salidas están conectadas**: `onload`, `onerror` y `onabort`. Olvidar `onabort` es la manera clásica de dejar una promesa pendiente para siempre cuando alguien cancela el selector de archivos.
2. **Rechaza con un error claro** allí donde no existe `FileReader` (Node, algunos contextos de worker).
3. **Nunca hagas `new TextDecoder().decode()` sobre un archivo de origen desconocido**: eso da por hecho UTF-8 y convierte GBK/Big5 en galimatías. Usa `arrayBufferToString`, que olfatea primero.
