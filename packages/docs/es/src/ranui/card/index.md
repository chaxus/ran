---
description: 'Un contenedor de contenido estructurado con zonas de cabecera, cuerpo y pie, presentado como una superficie con borde al estilo Geist para agrupar contenido relacionado.'
---

# Card

Un contenedor de contenido estructurado con zonas de cabecera, cuerpo y pie para agrupar contenido relacionado. Las tarjetas son superficies con borde al estilo Geist (el fondo de página más un borde de 1px, no un relleno gris) y permanecen inertes al pasar el ratón salvo que lo actives con `hoverable`.

> **Úsalo cuando** necesites agrupar contenido relacionado en una superficie con borde con zonas de título, descripción, cuerpo y pie: `<r-card>` te da esos slots más un estado interactivo opcional con `hoverable`.

## Inicio rápido

### Uso básico

<Demo>
  <r-card heading="Título de la tarjeta" description="Subtítulo opcional" style="max-width: 360px;">
    <span slot="extra" style="font-size: 12px;">tag</span>
    <p style="margin: 0;">El contenido del cuerpo va en el slot por defecto.</p>
    <a slot="footer" href="#">Ver notas</a>
  </r-card>
</Demo>

```html
<r-card heading="Título de la tarjeta" description="Subtítulo opcional">
  <span slot="extra">tag</span>
  <p>El contenido del cuerpo va en el slot por defecto.</p>
  <a slot="footer" href="#">Ver notas</a>
</r-card>
```

## Referencia de la API

### Propiedades

| Propiedad     | Tipo      | Por defecto | Descripción                                                                        |
| ------------- | --------- | ----------- | ---------------------------------------------------------------------------------- |
| `heading`     | `string`  | `''`        | Encabezado de la tarjeta, arriba de la cabecera. Se oculta si está vacío.          |
| `description` | `string`  | `''`        | Subtítulo dibujado bajo el título. Se oculta si está vacío.                        |
| `hoverable`   | `boolean` | `false`     | Tarjeta interactiva: al pasar el ratón el borde se oscurece y la tarjeta se eleva. |
| `sheet`       | `string`  | `''`        | CSS inyectado en el shadow DOM de la tarjeta.                                      |

### Encabezado `heading`

El encabezado de la tarjeta, mostrado arriba de la cabecera. Se oculta si está vacío.

<Demo>
  <r-card heading="Solo un título" style="max-width: 360px;">
    <p style="margin: 0;">Contenido del cuerpo.</p>
  </r-card>
</Demo>

```html
<r-card heading="Solo un título">
  <p>Contenido del cuerpo.</p>
</r-card>
```

### Descripción `description`

Un subtítulo dibujado bajo el título. Se oculta si está vacío. Cuando no defines ni `title` ni `description`, toda la cabecera queda oculta.

<Demo>
  <r-card heading="Título" description="Un breve subtítulo de apoyo" style="max-width: 360px;">
    <p style="margin: 0;">Contenido del cuerpo.</p>
  </r-card>
</Demo>

```html
<r-card heading="Título" description="Un breve subtítulo de apoyo">
  <p>Contenido del cuerpo.</p>
</r-card>
```

### Tarjeta interactiva `hoverable`

Las tarjetas no reaccionan al ratón por defecto. Añade el atributo `hoverable` a las tarjetas que de verdad se pueden pulsar: al pasar por encima, el borde se oscurece un paso en la escala de grises (`--ran-color-border` → `--ran-color-border-hover`) y la superficie toma la sombra elevada discreta (`--ran-shadow-elevated`).

<Demo>
  <r-card hoverable heading="Tarjeta con hover" description="Pasa el ratón" style="max-width: 360px; cursor: pointer;">
    <p style="margin: 0;">El borde se oscurece y la tarjeta se eleva ligeramente.</p>
  </r-card>
</Demo>

```html
<r-card hoverable heading="Tarjeta con hover" description="Pasa el ratón">
  <p>El borde se oscurece y la tarjeta se eleva ligeramente.</p>
</r-card>
```

`hoverable` es puramente visual: resérvalo para tarjetas que responden a clics y deja inertes las no interactivas.

### Estilos externos `sheet`

CSS inyectado en el shadow DOM de la tarjeta. Sigue la misma convención `sheet` que usan todos los demás componentes de ranui.

```html
<r-card heading="Tarjeta con tema" sheet=".ran-card { background: #f6ffed; }">
  <p>Contenido del cuerpo.</p>
</r-card>
```

## Slots

| Slot            | Descripción                                                             |
| --------------- | ----------------------------------------------------------------------- |
| _(por defecto)_ | Contenido del cuerpo, dibujado en el cuerpo de la tarjeta.              |
| `extra`         | Lado derecho de la cabecera: distintivos, enlaces o acciones.           |
| `footer`        | Contenido del pie. El pie queda oculto hasta que este slot tiene nodos. |

## Partes CSS

La tarjeta expone estos puntos `::part()` para dar estilo desde fuera:

| Parte         | Descripción                            |
| ------------- | -------------------------------------- |
| `card`        | El contenedor exterior de la tarjeta.  |
| `header`      | La fila de cabecera.                   |
| `title`       | El texto del título.                   |
| `description` | El texto del subtítulo.                |
| `extra`       | El slot `extra` de la cabecera.        |
| `body`        | La zona del cuerpo (slot por defecto). |
| `footer`      | La zona del pie (slot `footer`).       |

Se pueden sobrescribir estas variables CSS: `--ran-card-display`, `--ran-card-min-height`, `--ran-card-gap`, `--ran-card-padding`, `--ran-card-radius`, `--ran-card-background`, `--ran-card-border-color`, `--ran-card-shadow`, `--ran-card-hover-border-color`, `--ran-card-hover-shadow` (las dos últimas se aplican con `hoverable`), `--ran-card-title-color`, `--ran-card-title-font-size`, `--ran-card-title-font-weight`, `--ran-card-description-color`, `--ran-card-description-font-size`.

```css
r-card {
  --ran-card-background: var(--surface-2);
  --ran-card-radius: 12px;
  --ran-card-min-height: 148px;
}
r-card::part(header) {
  border-bottom: 1px solid var(--line);
}
```

## Eventos

La tarjeta es un contenedor pasivo y no despacha eventos personalizados.

## Buenas prácticas

- **Título y descripción**: usa `title` para el encabezado y `description` para un breve subtítulo de apoyo; omite ambos para ocultar la cabecera por completo.
- **Contenido del cuerpo**: coloca el contenido principal en el slot por defecto.
- **Acciones en la cabecera**: usa el slot `extra` para distintivos, enlaces o acciones alineados a la derecha de la cabecera.
- **Pie**: usa el slot `footer` para acciones o enlaces secundarios; permanece oculto hasta que le pongas contenido.
- **Respuesta al hover**: añade `hoverable` solo a las tarjetas que se pueden pulsar; las no interactivas no deben reaccionar al ratón.
- **Temas**: prefiere las variables CSS y `::part()` frente al atributo `sheet` cuando el estilo deba reutilizarse.
