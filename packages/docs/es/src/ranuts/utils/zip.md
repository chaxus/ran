# zip

Lee y modifica archivos ZIP sin dependencias, usando el propio DEFLATE de la plataforma.

ZIP es el contenedor que hay detrás de OOXML (`.docx`, `.xlsx`, `.pptx`), de EPUB, de ODF y de las extensiones de navegador. «Sácame un archivo de aquí dentro» y «reescribe un archivo de aquí dentro» salen a cada rato, y una biblioteca ZIP completa es una dependencia enorme para eso. Lo único que hacen falta para esas dos tareas es el directorio central y DEFLATE, y DEFLATE viene hoy en todos los navegadores como `DecompressionStream`.

## API

| Función                            | Descripción                                                                 |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `readZipEntries(bytes)`            | Analiza el directorio central y devuelve `ZipEntry[]`; `[]` si no es un ZIP |
| `readZipEntry(bytes, nameOrEntry)` | Descomprime una entrada; `null` si falta o no está soportada                |
| `zipHasEntry(bytes, name)`         | Si existe una entrada con exactamente ese nombre                            |
| `rewriteZip(bytes, options)`       | Rehace el archivo con entradas sustituidas o nuevas añadidas                |
| `createZip(files)`                 | Construye un archivo desde cero, con todas las entradas STORED              |
| `crc32(data)`                      | El CRC32 de IEEE, la suma de verificación que ZIP guarda por entrada        |
| `inflateRaw(data)`                 | Descomprime bytes DEFLATE en crudo (sin envoltura zlib ni gzip)             |

### `rewriteZip` options

| Opción      | Descripción                                                                                 | Por defecto        |
| ----------- | ------------------------------------------------------------------------------------------- | ------------------ |
| `filter`    | Qué entradas se descomprimen y se pasan a `transform`                                       | todos los archivos |
| `transform` | `(data, entry) => Uint8Array \| string \| null`; con `null` la entrada se queda como estaba | —                  |
| `inject`    | Entradas totalmente nuevas que se añaden: `{ name, data }[]`                                | —                  |

### `ZipEntry`

| Campo                                       | Descripción                                                             |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| `name`                                      | La ruta dentro del archivo, por ejemplo `word/document.xml`             |
| `compression`                               | `ZIP_STORED` (0) o `ZIP_DEFLATE` (8)                                    |
| `crc`, `compressedSize`, `uncompressedSize` | Tal como constan en el directorio central                               |
| `modTime`, `modDate`                        | Marca de tiempo empaquetada al estilo MS-DOS; se conserva al reescribir |
| `directory`                                 | Si el nombre acaba en `/`                                               |
| `dataStart`                                 | Dónde empiezan los bytes comprimidos dentro del origen                  |

## Ejemplo

### Sacar un archivo de un `.docx`

```js
import { readZipEntry } from 'ranuts';

const bytes = new Uint8Array(await file.arrayBuffer());
const xml = await readZipEntry(bytes, 'word/document.xml');
if (xml) {
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(xml), 'text/xml');
}
```

### Listar lo que hay dentro

```js
import { readZipEntries } from 'ranuts';

for (const entry of readZipEntries(bytes)) {
  if (entry.directory) continue;
  console.log(entry.name, entry.uncompressedSize);
}
```

### Retocar todas las partes XML y añadir un archivo

```js
import { rewriteZip } from 'ranuts';

const patched = await rewriteZip(bytes, {
  filter: (entry) => entry.name.endsWith('.xml'),
  transform: (data) => new TextDecoder().decode(data).replace(/&amp;#10;/g, '&#10;'),
  inject: [{ name: 'meta.json', data: JSON.stringify({ patched: true }) }],
});
```

### Extraer el material incrustado como URL de objeto

```js
import { readZipEntries, readZipEntry, getMime } from 'ranuts';

const media = {};
for (const entry of readZipEntries(bytes)) {
  if (!entry.name.startsWith('word/media/')) continue;
  const data = await readZipEntry(bytes, entry);
  if (!data) continue;
  const ext = entry.name.split('.').pop();
  media[entry.name] = URL.createObjectURL(new Blob([data], { type: getMime(`.${ext}`) }));
}
```

### Construir un contenedor

```js
import { createZip } from 'ranuts';

const zip = createZip([
  { name: 'mimetype', data: 'application/epub+zip' },
  { name: 'META-INF/container.xml', data: containerXml },
]);
```

## Notas

1. **Lee STORED y DEFLATE.** Los demás métodos de compresión aparecen en `readZipEntries`, pero `readZipEntry` devuelve `null` para ellos en vez de adivinar.

2. **Lo reescrito queda sin comprimir.** Las entradas sustituidas y las añadidas se escriben STORED, así que la salida es mayor que la entrada. Las entradas que no se tocan conservan sus bytes comprimidos originales, copiados tal cual. Es el trato correcto para retocar y entregar, y el equivocado para archivar.

3. **`rewriteZip` devuelve el array original cuando nada cambió**, también cuando una transformación devuelve bytes idénticos. Ese camino no cuesta nada y el resultado se puede comparar con `===`.

4. **Los tamaños salen del directorio central, nunca de las cabeceras locales.** Los archivos escritos por un escritor en flujo activan el bit 3 de propósito general y dejan ceros en la cabecera local, y meten los valores reales en un descriptor de datos _después_ de los bytes comprimidos. Fiarse de las cabeceras locales es la manera más habitual de que un lector de ZIP hecho a mano se rompa con archivos reales; `rewriteZip` además escribe cabeceras locales nuevas y baja ese bit, de modo que su salida la leen incluso los analizadores estrictos.

5. **Si la transformación falla, la entrada se conserva.** Si `transform` lanza, o si la entrada usa un método no soportado, el contenido original se copia sin más: una reescritura nunca debe perder datos que no supo entender.

6. **Sin ZIP64, sin cifrado, sin varios discos.** Los archivos de más de 4 GiB o con más de 65535 entradas quedan fuera. `readZipEntries` devuelve `[]` ante cualquier cosa que no sepa analizar, en lugar de lanzar, porque quien llama suele estar inspeccionando un archivo que le dio otra persona.

7. **`inflateRaw` necesita `DecompressionStream`**: está en todos los navegadores actuales y en Node 18 o posterior. Donde falte la API, lanza.
