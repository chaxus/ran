---
description: 'El Button de ranui (<r-button>) es un Web Component independiente de framework que dispara acciones inmediatas, con varios tipos, tamaños y estados de carga o deshabilitado.'
---

# Button

Componente de botón para disparar acciones inmediatas, con varios estilos y estados.

> **Úsalo cuando** necesites un control de acción sobre el que se pueda hacer clic, con estilos ya preparados (primary, contrast, warning, text) además de estado deshabilitado e iconos: recurre a `<r-button>` en lugar de dar estilo a un `<button>` desnudo.

## Inicio rápido

### Uso básico

<ran-demo>
  <r-button>Button</r-button>
</ran-demo>

```html
<r-button>Button</r-button>
```

## Referencia de la API

### Propiedades

| Propiedad  | Tipo      | Por defecto | Descripción                                                        |
| ---------- | --------- | ----------- | ------------------------------------------------------------------ |
| `type`     | `string`  | `'default'` | Tipo de botón: `default`, `primary`, `contrast`, `warning`, `text` |
| `disabled` | `boolean` | `false`     | Si el botón está deshabilitado                                     |
| `icon`     | `string`  | `''`        | Nombre del icono del botón                                         |
| `effect`   | `boolean` | `true`      | Si se muestra el efecto de onda al hacer clic                      |

### Tipos de botón `type`

<ran-demo>
  <r-button type="primary">Primary Button</r-button>
  <r-button type="warning">Warning Button</r-button>
  <r-button type="text">Text Button</r-button>
  <r-button>Default Button</r-button>
</ran-demo>

```html
<r-button type="primary">Primary Button</r-button>
<r-button type="warning">Warning Button</r-button>
<r-button type="text">Text Button</r-button>
<r-button>Default Button</r-button>
```

`primary` es la acción monocroma (del lenguaje de diseño Geist): negro sobre blanco en modo claro, blanco sobre negro en modo oscuro. Aquí el azul no aporta significado de marca; queda reservado para los enlaces y el anillo de foco. Se apoya en los tokens `--ran-color-primary*` (`--ran-color-primary`, `-hover`, `-active` y `--ran-color-primary-text` para la tinta inversa); consulta [Tema y tokens](/es/src/ranui/theme/).

### Estado deshabilitado `disabled`

<ran-demo>
  <r-button type="primary" disabled>Primary Button</r-button>
  <r-button type="warning" disabled>Warning Button</r-button>
  <r-button type="text" disabled>Text Button</r-button>
  <r-button disabled>Default Button</r-button>
</ran-demo>

```html
<r-button type="primary" disabled>Primary Button</r-button>
<r-button type="warning" disabled>Warning Button</r-button>
<r-button type="text" disabled>Text Button</r-button>
<r-button disabled>Default Button</r-button>
```

### Botón con icono `icon`

> 💡 **Consejo**: para colocar el icono con precisión, usa directamente el componente Icon.

<ran-demo>
  <r-button type="default" icon="user">Default Button</r-button>
  <r-button type="primary" icon="home">Primary Button</r-button>
</ran-demo>

```html
<r-button type="default" icon="user">Default Button</r-button>
<r-button type="primary" icon="home">Primary Button</r-button>
```

### Control del efecto `effect`

La onda al hacer clic viene activada. Define `effect="false"` para un botón liso, sin ella. Los dos botones de abajo solo se diferencian en ese atributo, así que puedes compararlos haciendo clic en cada uno. La onda es un efecto para dispositivos apuntadores y solo se dibuja a partir de un ancho de ventana de 1024px.

<ran-demo>
  <r-button type="primary" icon="home">Con onda (por defecto)</r-button>
  <r-button type="primary" icon="home" effect="false">Sin onda</r-button>
</ran-demo>

```html
<r-button type="primary" icon="home">Con onda (por defecto)</r-button>
<r-button type="primary" icon="home" effect="false">Sin onda</r-button>
```

Solo el valor literal `false` desactiva la onda; `effect="true"` y cualquier otro valor la dejan activada. Desde código, asigna la propiedad como booleano: `button.effect = false`.

## Eventos

```html
<r-button onclick="handleClick()">Click Me</r-button>

<script>
  function handleClick() {
    console.log('Button clicked');
  }
</script>
```

## Estilos

`<r-button>` expone **43 propiedades personalizadas de CSS** propias: `--ran-btn-background`, `--ran-btn-color`, `--ran-btn-border-color`, sus variantes `hover` y `active`, las tres de la variante `warning`, y además los tokens semánticos que lee del tema.

```css
/* un botón, o todos los botones dentro de un ámbito */
r-button {
  --ran-btn-background: var(--ran-color-bg-subtle);
  --ran-btn-hover-background: var(--ran-color-bg-hover);
  --ran-btn-border-radius: var(--ran-radius-full);
}
```

Cuando el cambio no sea propio del botón, recurre a un token **semántico**: sobrescribir `--ran-color-primary` cambia el aspecto de la acción principal en todas partes, no solo aquí.

Partes: `button` · `content`

```css
r-button::part(content) {
  letter-spacing: 0.02em;
}
```

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#button); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Buenas prácticas

- **Acciones principales**: usa `type="primary"` (monocromo: negro sobre blanco / blanco sobre negro)
- **Acciones peligrosas**: usa `type="warning"`
- **Acciones secundarias**: usa `type="text"`
- **Estado deshabilitado**: usa `disabled` cuando la acción no esté disponible
- **Iconos**: añade iconos pertinentes para mejorar la experiencia
