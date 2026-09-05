---
description: 'El Progress de ranui (<r-progress>) muestra el avance de una tarea como una barra, con un tirador arrastrable opcional.'
---

# Progress

Barra de progreso para mostrar el avance de una tarea, con un tirador arrastrable opcional.

> **Úsalo cuando** necesites una barra que muestre el avance de una tarea. Usa `<r-progress>` tal cual para un progreso de solo lectura, o `type="drag"` cuando el usuario deba fijar el valor con un tirador arrastrable.

## Inicio rápido

<Demo>
  <r-progress percent="40%"></r-progress>
</Demo>

```html
<r-progress percent="40%"></r-progress>
```

> 💡 **Consejo**: `r-progress` es un elemento de bloque sin ancho intrínseco. Dentro de una fila flex puede colapsar a ancho cero; dale un ancho explícito (por ejemplo `style="width:100%"`) o colócalo en un contexto de bloque.

## Referencia de la API

### Propiedades

| Propiedad | Tipo     | Por defecto | Descripción                                                             |
| --------- | -------- | ----------- | ----------------------------------------------------------------------- |
| `percent` | `string` | `'0'`       | Progreso actual; admite un número o un porcentaje. Se limita a `total`. |
| `total`   | `string` | `'100'`     | Progreso total; admite un número o un porcentaje.                       |
| `type`    | `string` | `'primary'` | Tipo de barra: `primary` (estática) o `drag` (clicable y arrastrable).  |
| `dot`     | `string` | `'true'`    | Si se muestra el tirador de arrastre: `true` o `false`.                 |
| `sheet`   | `string` | `''`        | CSS inyectado en el shadow DOM del componente.                          |

### Valor del progreso `percent`

Define el progreso actual. Admite un número o una cadena de porcentaje y no puede superar `total`. Cuando `total` no está definido, vale `100` por defecto (es decir, `percent` se lee como porcentaje de 100).

<Demo column>
  <r-progress percent="30%"></r-progress>
  <r-progress percent="70%"></r-progress>
  <r-progress percent="100%"></r-progress>
</Demo>

```html
<r-progress percent="30%"></r-progress>
<r-progress percent="70%"></r-progress>
<r-progress percent="100%"></r-progress>
```

### Progreso total `total`

Define el denominador de `percent`. Se admiten tanto números como porcentajes, así que `percent="30" total="1000"` llena la barra al 3%.

<Demo column>
  <r-progress percent="30" total="1000"></r-progress>
  <r-progress percent="70" total="100"></r-progress>
  <r-progress percent="10%" total="100%"></r-progress>
</Demo>

```html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
```

### Tipo de barra `type`

- `primary`: barra de progreso estática. Es el valor por defecto si no defines `type`.
- `drag`: barra clicable y arrastrable. Hacer clic en la pista o arrastrar el tirador actualiza `percent` y dispara un evento `change`. Arrastrar el tirador requiere `dot="true"`.

<Demo column>
  <r-progress type="drag" percent="30%"></r-progress>
  <r-progress type="primary" percent="40%"></r-progress>
</Demo>

```html
<r-progress type="drag" percent="30%"></r-progress> <r-progress type="primary" percent="40%"></r-progress>
```

### Tirador de arrastre `dot`

Activa o desactiva el tirador. Solo se dibuja cuando `dot="true"` **y** `type="drag"`; en una barra `primary` estática se omite a propósito, así que allí `dot` no tiene efecto visible.

<Demo column>
  <r-progress type="drag" percent="30%" dot="true"></r-progress>
  <r-progress type="drag" percent="30%" dot="false"></r-progress>
</Demo>

```html
<r-progress type="drag" percent="30%" dot="true"></r-progress>
<r-progress type="drag" percent="30%" dot="false"></r-progress>
```

## Eventos

### `change`

Se despacha en el tipo `drag` cada vez que el usuario hace clic en la pista o arrastra el tirador, actualizando `percent`. El objeto `detail` lleva:

| Campo     | Tipo     | Descripción     |
| --------- | -------- | --------------- |
| `value`   | `string` | Progreso actual |
| `percent` | `string` | Progreso actual |
| `total`   | `string` | Progreso total  |

```html
<r-progress type="drag" percent="30%"></r-progress>

<script>
  const progress = document.createElement('r-progress');
  progress.type = 'drag';
  progress.percent = '30%';
  progress.addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.percent, e.detail.total);
  });
  container.append(progress);
</script>
```

## Partes CSS

| Parte   | Descripción                       |
| ------- | --------------------------------- |
| `track` | La pista del progreso (el fondo). |
| `fill`  | La porción llena de la pista.     |
| `dot`   | El tirador de arrastre.           |

```css
r-progress::part(fill) {
  background: var(--ran-color-primary);
}
```

## Buenas prácticas

- **Barras estáticas**: usa el `type="primary"` por defecto para mostrar un progreso de solo lectura.
- **Barras interactivas**: usa `type="drag"` cuando el usuario deba poder fijar el valor, y escucha el evento `change`.
- **Porcentaje o número**: mezcla `percent` y `total` con libertad; pasa números crudos cuando correspondan a un total conocido, o porcentajes para un control directo.
- **Ancho en la maqueta**: envuelve la barra en un contenedor de bloque o dale un ancho explícito para que no colapse en maquetas flex.
