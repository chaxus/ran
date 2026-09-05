---
description: 'El Loading de ranui (<r-loading>) muestra un indicador giratorio mientras hay contenido o una acción en marcha.'
---

<script setup>
import Loading from '../../../../vue/loading.vue'
</script>

# Loading

Componente de carga con una colección de indicadores animados para señalar trabajo en marcha.

> **Úsalo cuando** necesites un indicador animado que señale trabajo en marcha: `<r-loading>` ofrece unas 30 animaciones integradas, seleccionadas con `name` y tematizadas mediante variables CSS.

## Inicio rápido

### Uso básico

<Demo>
  <r-loading name="circle"></r-loading>
</Demo>

```html
<r-loading name="circle"></r-loading>
```

## Referencia de la API

### Propiedades

| Propiedad | Tipo     | Por defecto | Descripción                                                               |
| --------- | -------- | ----------- | ------------------------------------------------------------------------- |
| `name`    | `string` | `'circle'`  | Tipo de animación. Recurre a `circle` si no se define o no se reconoce    |
| `sheet`   | `string` | `''`        | Texto CSS inyectado en el shadow DOM del componente para estilos externos |

### Tipos de carga `name`

Define `name` con uno de los tipos de animación integrados. Cualquier valor desconocido no dibuja nada (solo se atienden los nombres de la lista de abajo).

<Demo>
  <r-loading name="double-bounce"></r-loading>
  <r-loading name="rotate"></r-loading>
  <r-loading name="stretch"></r-loading>
  <r-loading name="cube"></r-loading>
</Demo>

```html
<r-loading name="double-bounce"></r-loading>
<r-loading name="rotate"></r-loading>
<r-loading name="stretch"></r-loading>
<r-loading name="cube"></r-loading>
```

Valores disponibles:

`double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`

### Estilos externos `sheet`

El atributo `sheet` inyecta CSS en crudo en el shadow root del componente y te permite sobrescribir reglas internas desde fuera, sin paso de compilación.

```html
<r-loading name="circle" sheet=".circle { transform: scale(1.5); }"></r-loading>
```

## Estilos propios

Cada animación se tematiza por completo con variables CSS. Defínelas en el elemento `r-loading` (o en un antepasado) para controlar tamaño y color. Usar unidades `px` da un control más preciso que el dimensionado por defecto basado en `em`.

### Ajustar el tamaño

```css
/* Circle */
r-loading {
  --loading-circle-width: 32px;
  --loading-circle-height: 32px;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce-width: 40px;
  --loading-double-bounce-height: 40px;
}

/* Rotate */
r-loading {
  --loading-rotate-width: 48px;
  --loading-rotate-height: 48px;
}

/* Stretch */
r-loading {
  --loading-stretch-width: 60px;
  --loading-stretch-height: 72px;
}
```

### Ajustar el color

```css
/* Circle */
r-loading {
  --loading-circle-container-div-background: #1890ff;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce1-background: #52c41a;
  --loading-double-bounce2-background: #52c41a;
}

/* Rotate */
r-loading {
  --loading-rotate-background: #faad14;
}

/* Stretch */
r-loading {
  --loading-stretch-div-background-color: #f5222d;
}
```

### Ejemplos en vivo

<Demo>
  <r-loading name="circle" style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"></r-loading>
  <r-loading name="rotate" style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"></r-loading>
</Demo>

```html
<r-loading
  name="circle"
  style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"
></r-loading>
<r-loading
  name="rotate"
  style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"
></r-loading>
```

### Variables CSS habituales

Cada tipo de animación tiene su propio espacio de nombres de tokens. Los más comunes siguen este patrón:

| Variable                                | Por defecto | Descripción                                          |
| --------------------------------------- | ----------- | ---------------------------------------------------- |
| `--loading-{type}-width`                | `4em`       | Ancho de la animación (se recomiendan unidades `px`) |
| `--loading-{type}-height`               | `4em`       | Alto de la animación (se recomiendan unidades `px`)  |
| `--loading-{type}-background`           | `#4096ff`   | Color de fondo principal                             |
| `--loading-{type}-div-background-color` | `#4096ff`   | Color de fondo de los subelementos                   |

> Sustituye `{type}` por un nombre concreto de animación, por ejemplo `circle`, `double-bounce` o `rotate`. Los colores base recurren por defecto a los tokens de tema `--ran-color-primary`, `--ran-color-success` y `--ran-color-text`.

## Partes CSS

Cada animación expone su elemento raíz como un `::part()` con el nombre de su valor de `name`, así que puedes apuntar a él desde fuera del shadow DOM:

```css
r-loading::part(rotate) {
  filter: drop-shadow(0 0 4px currentColor);
}
```

Nombres de parte: `double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`. La animación `solar` expone además una parte `sun`.

## Slots

Ninguno. El componente dibuja su animación por completo desde el shadow DOM y no proyecta hijos del light DOM.

## Eventos

Ninguno. El componente no despacha eventos personalizados.

## Todas las animaciones de carga

<Loading />

## Buenas prácticas

- **Elige según la escena**: escoge una animación que encaje con el contexto y el ritmo de la tarea.
- **Variables CSS**: personaliza tamaño y color con los tokens `--loading-{type}-*` en lugar de envolver elementos.
- **Dimensionado**: prefiere unidades `px` al `em` por defecto para obtener medidas predecibles.
- **Rendimiento**: evita dibujar muchas animaciones simultáneas en una misma pantalla.
- **Carga bajo demanda**: cada animación es un fragmento diferido aparte (su JS y su CSS), así que un `name` solo carga la variante que usa; referenciar una animación nunca empaqueta las otras 28. La `circle` por defecto y la habitual `dot` vienen integradas para un primer dibujado inmediato y sin destello; el resto se cargan de forma asíncrona en su primer uso. El uso no cambia: basta con definir `name`.
- **Temas**: los colores base siguen los tokens de tema `--ran-color-*`, así que las animaciones se adaptan solas a los modos claro y oscuro.
