---
description: 'Un ancla consciente del enrutador que intercepta la navegación dentro de la aplicación y deja pasar los enlaces externos al navegador.'
---

# Link

Ancla consciente del enrutador que dibuja un `<a>` alrededor de su contenido con slot e intercepta la navegación dentro de la aplicación.

> **Úsalo cuando** necesites un ancla que enrute las rutas internas a través del enrutador de ranui y deje que los enlaces externos pasen al navegador: `<r-link>` intercepta la navegación interna y hace `push` o `replace` por ti.

## Inicio rápido

### Uso básico

<ran-demo>
  <r-link href="/getting-started">Primeros pasos</r-link>
</ran-demo>

```html
<r-link href="/getting-started">Primeros pasos</r-link>
```

Cuando se hace clic en un `href` interno, el enlace entrega la ruta al enrutador de ranui activo (`push`, o `replace` si está puesto el atributo `replace`). Los enlaces externos (`https://`, `//`, `mailto:`, `tel:`) y los clics con modificadores (botón central, Ctrl/Cmd/Shift/Alt) pasan al navegador como de costumbre. Si no hay ningún enrutador registrado, despacha en su lugar un evento `ran-navigate` que burbujea y es `composed`.

## Referencia de la API

### Propiedades

| Propiedad | Tipo      | Por defecto | Descripción                                                                                        |
| --------- | --------- | ----------- | -------------------------------------------------------------------------------------------------- |
| `href`    | `string`  | `''`        | Destino de la navegación. Las rutas internas se enrutan en la app; las URL externas navegan normal |
| `replace` | `boolean` | `false`     | Si está presente, la navegación interna reemplaza la entrada actual del historial (solo lectura)   |
| `sheet`   | `string`  | `''`        | CSS inyectado en el shadow DOM del enlace                                                          |

### Destino `href`

Las rutas internas se enrutan dentro de la app; las URL absolutas y los enlaces `mailto:` / `tel:` navegan con normalidad.

<ran-demo>
  <r-link href="/docs">Enlace interno</r-link>
  <r-link href="https://example.com">Enlace externo</r-link>
</ran-demo>

```html
<r-link href="/docs">Enlace interno</r-link> <r-link href="https://example.com">Enlace externo</r-link>
```

### Reemplazar el historial `replace`

Atributo booleano. Cuando está presente, la navegación interna reemplaza la entrada actual del historial (`router.replace`) en lugar de añadir una nueva.

<ran-demo>
  <r-link href="/settings" replace>Reemplazar entrada</r-link>
</ran-demo>

```html
<r-link href="/settings" replace>Reemplazar entrada</r-link>
```

### Estilos externos `sheet`

CSS inyectado en el shadow DOM del enlace. Sigue la misma convención `sheet` que usan todos los demás componentes de ranui. Como el `<a>` sobre el que se hace clic vive dentro del shadow root, usa `sheet` para darle un modelo de caja (`display`, `padding`, `width`) cuando quieras que el host se lea como un botón o una tarjeta.

<ran-demo>
  <r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; background: var(--ran-color-bg-muted); }">Enlace con relleno</r-link>
</ran-demo>

```html
<r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; }">Enlace con relleno</r-link>
```

## Slots

| Slot          | Descripción                                                             |
| ------------- | ----------------------------------------------------------------------- |
| (por defecto) | Contenido del enlace, proyectado en el `<a>` del shadow (texto o nodos) |

## Eventos

| Evento         | Detalle                              | Cuándo                                                                                                 |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `ran-navigate` | `{ path: string, replace: boolean }` | Se hace clic en un enlace interno y no hay ningún enrutador de ranui activo. Burbujea y es `composed`. |

```html
<r-link href="/docs">Docs</r-link>

<script>
  const link = document.createElement('r-link');
  link.href = '/docs';
  link.textContent = 'Docs';
  link.addEventListener('ran-navigate', (e) => {
    console.log(e.detail.path, e.detail.replace);
  });
  nav.append(link);
</script>
```

## Buenas prácticas

- **Navegación interna**: usa un `href` relativo a la raíz (por ejemplo `/docs`) para que el enrutador lo gestione dentro de la app.
- **Enlaces externos**: las URL absolutas y `mailto:` / `tel:` pasan al navegador; no hace falta configurar nada.
- **Reemplazar el historial**: añade `replace` a los enlaces que no deban crear una entrada para el botón «atrás» (redirecciones, cambio de pestaña).
- **Estado activo**: el host aplica estilos a `:host([active]) a` (negrita + subrayado), así que pon el atributo `active` para marcar el enlace actual.
- **Como botón o tarjeta**: pon la superficie (fondo, borde, radio) en el host e inyecta el modelo de caja del `<a>` (`display`, `padding`, `width`) mediante `sheet`, para que toda el área sea clicable.
- **Temas**: el `<a>` lee los tokens globales `--ran-color-link`, `--ran-color-primary` (anillo de foco) y `--ran-radius-sm`; sobrescribe esos tokens en lugar de esperar variables `--ran-link-*` propias del componente (no existen).
