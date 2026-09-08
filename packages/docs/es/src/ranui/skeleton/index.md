---
description: 'El Skeleton de ranui (<r-skeleton>) muestra un marcador de posición con brillo que ocupa el espacio del contenido mientras se carga.'
---

# Skeleton

Gráfico de marcador de posición que ocupa el espacio del contenido mientras se carga, con una animación de brillo.

> **Úsalo cuando** necesites una barra de marcador con brillo que reserve el espacio del contenido mientras se carga. Dimensiona el padre de `<r-skeleton>` para que coincida con el contenido real y sustitúyelo cuando lleguen los datos.

## Inicio rápido

### Uso básico

El esqueleto se estira para ocupar el ancho de su elemento padre y mide `16px` de alto por defecto.

<ran-demo>
  <r-skeleton></r-skeleton>
</ran-demo>

```html
<r-skeleton></r-skeleton>
```

### El ancho sigue al padre

Como el esqueleto es `width: 100%`, controla su longitud dimensionando el contenedor en el que vive.

<ran-demo column>
  <div style="width: 100px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 200px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 100%">
    <r-skeleton></r-skeleton>
  </div>
</ran-demo>

```html
<div style="width: 100px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 200px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 100%">
  <r-skeleton></r-skeleton>
</div>
```

### Apilar marcadores

Combina varios esqueletos para imitar un bloque de texto o un párrafo.

<ran-demo column>
  <div style="width: 100%; display: flex; flex-direction: column; gap: 12px">
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
  </div>
</ran-demo>

```html
<div style="display: flex; flex-direction: column; gap: 12px">
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
</div>
```

## Referencia de la API

### Propiedades

| Propiedad | Tipo     | Por defecto | Descripción                                                             |
| --------- | -------- | ----------- | ----------------------------------------------------------------------- |
| `sheet`   | `string` | `''`        | CSS inyectado en el shadow DOM del componente para sobrescribir estilos |

### Estilos propios `sheet`

Pasa una cadena de CSS por `sheet` para sobrescribir el aspecto del esqueleto dentro de su shadow DOM.

<ran-demo>
  <r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
</ran-demo>

```html
<r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
```

### Variables CSS

El esqueleto también expone propiedades personalizadas de CSS para darle tema sin `sheet`:

| Variable                                    | Por defecto                    | Descripción                         |
| ------------------------------------------- | ------------------------------ | ----------------------------------- |
| `--ran-skeleton-height`                     | `16px`                         | Alto de la barra                    |
| `--ran-skeleton-background`                 | `var(--ran-gray-alpha-200, …)` | Color de fondo base (sin brillo)    |
| `--ran-skeleton-border-radius`              | `var(--ran-radius-sm, 6px)`    | Radio de las esquinas               |
| `--ran-skeleton-shimmer-background`         | `linear-gradient(90deg, …)`    | Degradado del reflejo en movimiento |
| `--ran-skeleton-shimmer-animation-duration` | `1.4s`                         | Duración de una pasada del brillo   |

<ran-demo>
  <r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
</ran-demo>

```html
<r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
```

## Eventos

Ninguno. El esqueleto no despacha eventos personalizados.

## Slots

Ninguno. El esqueleto solo dibuja su propia barra y no proyecta contenido con slots.

## Buenas prácticas

- **Ajusta la maqueta**: dimensiona el contenedor padre para que cada esqueleto coincida con el ancho del contenido real al que sustituye.
- **Imita la forma**: apila varios esqueletos con separaciones uniformes para representar texto de varias líneas o filas de una lista.
- **Da tema con variables**: prefiere las variables CSS `--ran-skeleton-*` para ajustes sencillos; usa `sheet` solo cuando necesites selectores que las variables no cubren.
- **Sustituye al cargar**: reemplaza los esqueletos por el contenido real en cuanto lleguen los datos, en lugar de dejarlos animándose indefinidamente.
