---
description: 'Una superficie de sección de página con un encabezado accesible y un subtítulo opcionales sobre un cuerpo con slot.'
---

# Section

Superficie de sección de página con un encabezado y un subtítulo opcionales sobre un cuerpo con slot.

> **Úsalo cuando** necesites etiquetar una región importante de la página con un encabezado accesible de nivel 2 y, si quieres, un subtítulo sobre su contenido. `<r-section>` aporta la fila de encabezado y la superficie del cuerpo.

## Inicio rápido

### Uso básico

<ran-demo column>
  <r-section heading="Encabezado de la sección" subtitle="Una línea breve que describe esta sección.">
    <p style="margin: 0;">El contenido del cuerpo va en el slot por defecto.</p>
  </r-section>
</ran-demo>

```html
<r-section heading="Encabezado de la sección" subtitle="Una línea breve que describe esta sección.">
  <p>El contenido del cuerpo va en el slot por defecto.</p>
</r-section>
```

## Referencia de la API

### Propiedades

| Propiedad  | Tipo     | Por defecto | Descripción                                   |
| ---------- | -------- | ----------- | --------------------------------------------- |
| `heading`  | `string` | `''`        | Encabezado de la sección, con nivel 2 de ARIA |
| `subtitle` | `string` | `''`        | Línea de apoyo bajo el encabezado             |
| `sheet`    | `string` | `''`        | CSS inyectado en el shadow DOM de la sección  |

La fila de encabezado (encabezado + subtítulo) se oculta por completo cuando `heading` y `subtitle` están vacíos.

### Encabezado `heading`

El encabezado de la sección, representado como encabezado ARIA de nivel 2 (`role="heading"`, `aria-level="2"`). Se oculta cuando está vacío.

<ran-demo column>
  <r-section heading="Solo un encabezado">
    <p style="margin: 0;">Contenido del cuerpo.</p>
  </r-section>
</ran-demo>

```html
<r-section heading="Solo un encabezado">
  <p>Contenido del cuerpo.</p>
</r-section>
```

### Subtítulo `subtitle`

Una línea de apoyo bajo el encabezado. Se oculta cuando está vacía.

<ran-demo column>
  <r-section heading="Encabezado" subtitle="Texto de subtítulo de apoyo.">
    <p style="margin: 0;">Contenido del cuerpo.</p>
  </r-section>
</ran-demo>

```html
<r-section heading="Encabezado" subtitle="Texto de subtítulo de apoyo.">
  <p>Contenido del cuerpo.</p>
</r-section>
```

### CSS del shadow `sheet`

CSS inyectado en el shadow DOM de la sección, con la misma convención `sheet` que usan todos los demás componentes de ranui.

<ran-demo column>
  <r-section heading="Sección con tema" subtitle="Encabezado recoloreado mediante sheet." sheet=".ran-section-heading { color: #006bff; }">
    <p style="margin: 0;">Contenido del cuerpo.</p>
  </r-section>
</ran-demo>

```html
<r-section heading="Sección con tema" sheet=".ran-section-heading { color: #006bff; }">
  <p>Contenido del cuerpo.</p>
</r-section>
```

## Slots

| Slot            | Descripción                                       |
| --------------- | ------------------------------------------------- |
| _(por defecto)_ | Contenido del cuerpo, bajo la fila de encabezado. |

## Partes CSS

| Parte      | Descripción                                             |
| ---------- | ------------------------------------------------------- |
| `header`   | La fila que envuelve encabezado y subtítulo             |
| `heading`  | El elemento de encabezado ARIA de nivel 2               |
| `subtitle` | La línea de subtítulo de apoyo                          |
| `body`     | El envoltorio del cuerpo alrededor del slot por defecto |

Variables CSS expuestas: `--ran-section-border-color`, `--ran-section-radius`, `--ran-section-background`, `--ran-section-shadow`, `--ran-section-padding`, `--ran-section-heading-color`, `--ran-section-heading-font-size`, `--ran-section-heading-font-weight`, `--ran-section-subtitle-color`.

```css
r-section {
  --ran-section-background: var(--surface-1);
  --ran-section-padding: 32px;
  --ran-section-heading-color: var(--text-strong);
}
r-section::part(subtitle) {
  max-width: 48ch;
}
```

## Buenas prácticas

- **Títulos de sección**: define `heading` para etiquetar cada región importante de la página.
- **Contexto**: usa `subtitle` para una línea breve de apoyo; omite ambos para obtener una superficie lisa sin fila de encabezado.
- **Accesibilidad**: el encabezado se expone como encabezado ARIA de nivel 2, así que participa en el esquema del documento; mantenlo significativo.
- **Temas**: prefiere las variables CSS `--ran-section-*` o los selectores `::part()` frente al atributo `sheet` cuando el estilo deba reutilizarse.
