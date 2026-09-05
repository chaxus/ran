# loadScript

Inyecta un único `<script>` sobre la marcha, sin repetir el mismo contenido.

En qué se diferencia de [`scriptOnLoad`](/es/src/ranuts/utils/script_on_load): aquella carga **un lote** de URL de una vez (y manda los `.css` por una etiqueta `<link>`), mientras que esta se ocupa de **un solo** script, admite un cuerpo en línea y garantiza que el mismo script se evalúe una única vez; inyectar dos veces el SDK de un tercero suele significar que sus efectos de inicialización ocurrieron dos veces.

La clave para no repetir es el md5 de `type + content`, así que una URL y un script en línea con el mismo nombre no pueden confundirse.

## Uso

```ts
import { loadScript } from 'ranuts/utils';

// Script externo
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });

// Script en línea
await loadScript({ type: 'content', content: 'window.__ready = true;' });

// La segunda llamada no hace nada: ya se evaluó
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });
```

## API

### loadScript

#### Parámetros

| Parámetro | Descripción                                                         | Tipo                 | Por defecto |
| --------- | ------------------------------------------------------------------- | -------------------- | ----------- |
| `type`    | `'url'` carga con `src`; `'content'` incrusta el texto del script   | `'url' \| 'content'` | Obligatorio |
| `content` | La URL si `type` es `'url'`; el cuerpo del script si es `'content'` | `string`             | Obligatorio |

#### Devuelve

| Argumento | Descripción                                          | Tipo                            |
| --------- | ---------------------------------------------------- | ------------------------------- |
| `promise` | Se resuelve con `{ success: true }` una vez evaluado | `Promise<{ success: boolean }>` |

Se rechaza con `{ success: false, error }` cuando un script externo no consigue cargar.

## Notas

Un script **en línea** se evalúa de forma síncrona en cuanto se añade y después no emite ningún evento `load`. Esperar solo a `onload` dejaría la promesa pendiente para siempre en un navegador real, así que con `type: 'content'` la función se resuelve en cuanto `append` retorna. (jsdom _sí_ emite un evento load para los scripts en línea, y por eso una prueba unitaria no detectaría la diferencia.)
