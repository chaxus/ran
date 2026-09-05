# scriptOnLoad

Inserta etiquetas `script` o `link` sobre la marcha y espera a que carguen todos los recursos.

## API

### scriptOnLoad

#### Devuelve

| Argumento       | Descripción                                                   | Tipo      |
| --------------- | ------------------------------------------------------------- | --------- |
| `Promise<void>` | Promesa que se resuelve cuando han cargado todos los recursos | `Promise` |

#### Parámetros

| Parámetro  | Descripción                                       | Tipo          | Por defecto |
| ---------- | ------------------------------------------------- | ------------- | ----------- |
| `urls`     | Array con las URL de los recursos                 | `string[]`    | Obligatorio |
| `append`   | Elemento padre donde se insertan (opcional)       | `HTMLElement` | `body`      |
| `callback` | Callback para cuando todo haya cargado (opcional) | `Function`    | Opcional    |

## Ejemplo

### Uso básico

```js
import { scriptOnLoad } from 'ranuts';

// Cargar un solo script
await scriptOnLoad(['https://example.com/script.js']);
console.log('Script cargado');
```

### Cargar varios recursos

```js
import { scriptOnLoad } from 'ranuts';

// Cargar a la vez varios scripts y hojas de estilo
await scriptOnLoad([
  'https://example.com/script1.js',
  'https://example.com/script2.js',
  'https://example.com/style.css',
]);
console.log('Todos los recursos cargados');
```

### Usar un callback

```js
import { scriptOnLoad } from 'ranuts';

scriptOnLoad(['https://example.com/library.js'], document.body, () => {
  console.log('Recursos cargados; ya se pueden usar');
});
```

### Cargar una librería de terceros sobre la marcha

```js
import { scriptOnLoad } from 'ranuts';

async function loadLibrary() {
  await scriptOnLoad(['https://cdn.example.com/library.js']);
  // La librería ya está cargada y se puede usar
  window.Library.init();
}
```

## Notas

1. **Detecta el tipo solo**: por la terminación de la URL (`.css`) distingue si es una hoja de estilo o un script.
2. **Carga en paralelo**: todos los recursos cargan a la vez y la promesa se resuelve cuando han terminado todos.
3. **Dónde se insertan**: por defecto en `body`, aunque se puede indicar otro elemento padre.
4. **Promesa y callback**: admite las dos formas, y se pueden combinar.
