---
description: 'Una salida de enrutado que muestra su contenido solo mientras la ruta actual coincide con un patrón, para usar dentro de r-router.'
---

# Route

Un elemento de salida de enrutado. Colocado dentro de un [`r-router`](../router/), muestra el contenido de su slot cuando la ruta actual coincide con su patrón `path` y lo oculta en caso contrario.

> **Úsalo cuando** necesites una salida de enrutado que muestre su contenido solo mientras la ruta actual coincide con un patrón (con soporte de `:param` y `*`). Coloca `<r-route>` dentro de un `<r-router>` para construir un conmutador de vistas en el cliente.

## Inicio rápido

### Uso básico

Un `r-route` cuyo `path` es `/` coincide con la ruta por defecto, así que su contenido se dibuja por sí solo:

<Demo>
  <r-route path="/">
    <p>Este contenido se muestra cuando la ruta actual coincide.</p>
  </r-route>
</Demo>

```html
<r-route path="/">
  <p>Este contenido se muestra cuando la ruta actual coincide.</p>
</r-route>
```

### Dentro de un enrutador

Usadas dentro de un [`r-router`](../router/), varias rutas actúan como un conmutador: el enrutador sincroniza cada hijo `r-route` al navegar, mostrando aquellos cuyo `path` coincide y ocultando el resto:

```html
<r-router>
  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/users/:id"><h2>User profile</h2></r-route>
</r-router>
```

El contenedor `r-router` y la API de JavaScript `createRouter` / `RouterCore` (navegación, guardas, transiciones de vista) están documentados en la [página de Router](../router/).

## Referencia de la API

### Propiedades

| Propiedad | Tipo                     | Por defecto | Descripción                                                                   |
| --------- | ------------------------ | ----------- | ----------------------------------------------------------------------------- |
| `path`    | `string`                 | `'/'`       | Patrón comparado con la ruta actual. Admite segmentos `:param` y `*`          |
| `exact`   | `boolean`                | `false`     | Solo lectura. Con el atributo `exact` presente, exige una coincidencia exacta |
| `params`  | `Record<string, string>` | `{}`        | Solo lectura. Los parámetros capturados en la coincidencia actual             |
| `sheet`   | `string`                 | `''`        | CSS inyectado en el shadow DOM del componente                                 |

### Coincidencia de ruta `path`

El `path` se parte por `/` y se compila en una expresión regular segmento a segmento:

- un segmento que empieza por `:` captura un parámetro con nombre (coincide con un segmento de ruta)
- un segmento `*` coincide con todo el resto de la ruta
- cualquier otro segmento coincide literalmente

Sin `exact`, el patrón coincide con la ruta como **prefijo** (se permiten segmentos finales). Con `exact`, solo se acepta una coincidencia completa.

```
/users            coincide con /users, /users/42, /users/42/profile
/users (exact)    coincide solo con /users
/users/:id        captura :id → params.id
/*                coincide con todo
```

Lee los parámetros capturados en la propiedad de solo lectura `params` (cada valor viene decodificado con `decodeURIComponent`):

```js
const route = document.createElement('r-route');
route.path = '/users/:id';
router.append(route);
route.params; // p. ej. { id: '42' } cuando el enrutador hace coincidir esta ruta
```

### Coincidencia exacta `exact`

Atributo booleano. Cuando está presente, la salida coincide solo con una ruta exacta (sin coincidencia por prefijo): `path="/users" exact` coincide con `/users` pero no con `/users/42`.

```html
<r-route path="/" exact><h2>Home</h2></r-route>
```

### CSS externo `sheet`

CSS inyectado en el shadow DOM del componente, con la misma convención `sheet` que usan todos los demás componentes de ranui.

### Slots

El slot por defecto (sin nombre) contiene el contenido que se muestra mientras la ruta está activa. Cuando la ruta no coincide, el host recibe `hidden` y el contenido no se muestra.

```html
<r-route path="/about">
  <!-- slot por defecto: se muestra solo mientras /about está activo -->
  <h2>About</h2>
</r-route>
```

## Eventos

### `routematch`

Se dispara cuando esta salida se activa (su `path` coincide con la ruta actual). **Burbujea.** `event.detail` es `{ path, params }`:

```html
<r-route path="/users/:id"><h2>User profile</h2></r-route>

<script>
  // Escucha antes de montar una ruta construida del mismo modo
  const route = document.createElement('r-route');
  route.path = '/users/:id';
  route.addEventListener('routematch', (e) => {
    console.log(e.detail.path, e.detail.params); // '/users/42', { id: '42' }
  });
  router.append(route);
</script>
```

## Estilos

`r-route` no expone identificadores `::part()` ni variables CSS `--ran-route-*` propias. El host es un elemento `display: block` normal que se colapsa a `display: none` mientras está oculto. Usa el atributo `sheet` o da estilo al host directamente para personalizarlo.

Impórtalo con `import 'ranui'` (registra todos los componentes) o con el independiente `import 'ranui/route'`.

## Buenas prácticas

- **Móntalo dentro de `r-router`**: `r-route` solo conmuta al navegar cuando tiene un antepasado [`r-router`](../router/) que lo sincronice.
- **Usa `exact` en la raíz**: da a `path="/"` el atributo `exact` para que no coincida por prefijo con todas las demás rutas.
- **Ordena de lo específico a lo general**: coloca al final una ruta comodín `path="/*"`, ya que una ruta sin `exact` coincide con su prefijo.
- **Lee `params`, no analices la URL**: captura los segmentos dinámicos con `:param` y léelos de la propiedad `params`.
- **Reacciona a la activación con `routematch`**: usa el evento `routematch`, que burbujea, para disparar la carga de datos cuando una ruta se activa.
