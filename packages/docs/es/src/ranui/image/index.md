---
description: 'El Image de ranui (<r-image>) muestra una imagen con un sustituto integrado que aparece cuando el origen no se puede cargar.'
---

# Image

Componente de imagen que muestra un sustituto integrado cuando el origen no se puede cargar.

> **Úsalo cuando** necesites una imagen que degrade con elegancia a un marcador de posición si el origen falla: `<r-img>` cambia a un gráfico de «imagen rota» integrado o al `fallback` que le des.

## Inicio rápido

### Uso básico

<ran-demo>
  <r-img src="https://picsum.photos/id/1015/240/160"></r-img>
</ran-demo>

```html
<r-img src="https://picsum.photos/id/1015/240/160"></r-img>
```

## Referencia de la API

### Propiedades

| Propiedad  | Tipo     | Por defecto                       | Descripción                                                                       |
| ---------- | -------- | --------------------------------- | --------------------------------------------------------------------------------- |
| `src`      | `string` | `''`                              | URL de la imagen. Es reactiva: cambiarla tras el montaje recarga la imagen.       |
| `alt`      | `string` | `''`                              | Texto alternativo que se pasa al `<img>` interno. Vacío la marca como decorativa. |
| `fallback` | `string` | data URI integrado de imagen rota | Imagen que se muestra cuando `src` no se puede cargar.                            |
| `sheet`    | `string` | `''`                              | CSS inyectado en el shadow DOM del componente.                                    |

`src`, `alt`, `fallback` y `sheet` se observan y se actualizan de forma reactiva: cambiar cualquiera de ellos en un elemento ya montado surte efecto de inmediato.

### Origen de la imagen `src`

<ran-demo>
  <r-img src="https://picsum.photos/id/1025/240/160"></r-img>
</ran-demo>

```html
<r-img src="https://picsum.photos/id/1025/240/160"></r-img>
```

### Texto alternativo `alt`

`alt` se pasa al `<img>` interno. Déjalo vacío (el valor por defecto) en las imágenes decorativas para que los lectores de pantalla las omitan, y describe las que aportan significado.

<ran-demo>
  <r-img src="https://picsum.photos/id/1035/240/160" alt="Un lago de montaña al atardecer"></r-img>
</ran-demo>

```html
<r-img src="https://picsum.photos/id/1035/240/160" alt="Un lago de montaña al atardecer"></r-img>
```

### Fallo de carga `fallback`

Cuando `src` no se puede cargar, el componente cambia a `fallback`. Si no defines `fallback`, se usa un marcador de imagen rota integrado. Abajo, `src` es una URL inválida, así que se muestra la imagen sustituta.

<ran-demo>
  <r-img src="https://example.invalid/does-not-exist.png" fallback="data:image/png;base64,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"></r-img>
</ran-demo>

```html
<r-img
  src="https://example.invalid/does-not-exist.png"
  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...(marcador de imagen rota)..."
></r-img>
```

### Estilos externos `sheet`

`sheet` inyecta CSS sin procesar en el shadow DOM del componente. Úsalo para dar estilo al contenedor interno `.ran-image` o al `<img>` que hay dentro.

<ran-demo>
  <r-img
    src="https://picsum.photos/id/1043/240/160"
    sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
  ></r-img>
</ran-demo>

```html
<r-img
  src="https://picsum.photos/id/1043/240/160"
  sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
></r-img>
```

## Eventos

Ninguno. `r-img` no despacha eventos personalizados.

## Buenas prácticas

- **Cambia `src` cuando quieras**: es reactivo, así que actualizarlo en un elemento montado recarga la imagen; el sustituto sigue entrando en juego si la nueva URL falla.
- **Da `alt` a las imágenes con significado**: describe el contenido para los lectores de pantalla; deja `alt` vacío solo en las puramente decorativas.
- **Confía en el sustituto integrado**: el marcador de imagen rota por defecto se usa automáticamente, pero define tu propio `fallback` cuando quieras uno acorde a tu marca o al contexto.
- **Da estilo con `sheet`**: como la imagen vive en el shadow DOM, usa el atributo `sheet` (o las variables CSS del componente) para bordes, radio o tamaño.
