---
description: 'Un gráfico de radar o de araña para comparar varias métricas de un mismo conjunto de datos sobre un lienzo 2D.'
---

# Radar

Gráfico de radar para comparar varias métricas de un mismo conjunto de datos sobre un lienzo bidimensional.

> **Úsalo cuando** necesites un gráfico de radar o de araña para comparar varias métricas de un conjunto de datos. Pásale a `<r-radar>` un array JSON de nombres de eje y puntuaciones mediante el atributo `abilitys`.

## Inicio rápido

### Uso básico

Los datos se pasan por el atributo `abilitys` como una **cadena JSON** (un array de objetos). Como los atributos HTML solo pueden contener cadenas, el valor tiene que ser JSON válido; se analiza internamente con `JSON.parse`. El host `<r-radar>` no tiene tamaño propio, así que dale un ancho y un alto explícitos.

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'
></r-radar>
```

También puedes definir los datos de forma imperativa por la propiedad JS `abilitys`, que acepta un array (se convierte a cadena de vuelta al atributo) o una cadena JSON:

```js
const radar = document.createElement('r-radar');
radar.abilitys = [
  { abilityName: 'Vida', scoreRate: 10 },
  { abilityName: 'Ataque', scoreRate: 90 },
  { abilityName: 'Defensa', scoreRate: 20 },
];
chart.append(radar);
```

## Referencia de la API

### Propiedades

| Propiedad      | Tipo               | Por defecto                                  | Descripción                                                      |
| -------------- | ------------------ | -------------------------------------------- | ---------------------------------------------------------------- |
| `abilitys`     | `string` / `Array` | `''`                                         | Datos del gráfico como cadena JSON (o array por la propiedad JS) |
| `colorPolygon` | `string`           | `var(--ran-radar-polygon-color)` / `#e6e6e6` | Color de los polígonos concéntricos de la rejilla                |
| `colorLine`    | `string`           | `var(--ran-radar-line-color)` / `#e6e6e6`    | Color de los ejes y del borde exterior                           |
| `fillColor`    | `string`           | `rgba(255,121,35,0.60)`                      | Color de relleno de la región de datos                           |
| `strokeColor`  | `string`           | `rgba(255,121,35,0.60)`                      | Color del contorno de la región y de los puntos de vértice       |
| `sheet`        | `string`           | `''`                                         | CSS inyectado en el shadow DOM del componente                    |

Cada entrada del array `abilitys` admite estas claves:

| Clave             | Tipo     | Obligatoria | Descripción                                                       |
| ----------------- | -------- | ----------- | ----------------------------------------------------------------- |
| `abilityName`     | `string` | Sí          | Texto de la etiqueta del eje                                      |
| `scoreRate`       | `number` | Sí          | Valor en ese eje; la rejilla llega como máximo a `100`            |
| `backgroundColor` | `string` | No          | Color de fondo de la etiqueta (por defecto transparente)          |
| `fontSize`        | `number` | No          | Tamaño de letra de la etiqueta (por defecto, escalado al gráfico) |
| `fontColor`       | `string` | No          | Color del texto de la etiqueta (por defecto `--ran-color-text`)   |
| `fontFamily`      | `string` | No          | Familia tipográfica de la etiqueta (por defecto `SimHei`)         |

> Nota: `colorPolygon`, `colorLine`, `fillColor` y `strokeColor` se leen sin distinguir mayúsculas, así que se dibujan bien tanto si el atributo está desde el principio como si cambia tras el montaje; actualizar cualquiera de ellos vuelve a dibujar el gráfico. Para un estilo que siga el tema, prefiere las variables CSS de más abajo.

### Datos del gráfico `abilitys`

El estilo de la etiqueta por eje (`backgroundColor`, `fontSize`, `fontColor`) se puede definir en entradas concretas:

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"Vida","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"Vida","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'
></r-radar>
```

### Color de la rejilla `colorPolygon`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" colorPolygon="green" abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorPolygon="green"
  abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'
></r-radar>
```

### Color de los ejes `colorLine`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" colorLine="blue" abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorLine="blue"
  abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'
></r-radar>
```

### Relleno de la región `fillColor`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" fillColor="red" abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  fillColor="red"
  abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'
></r-radar>
```

### Contorno de la región `strokeColor`

<Demo>
  <r-radar style="width:300px;height:300px;display:block;" strokeColor="blue" abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'></r-radar>
</Demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  strokeColor="blue"
  abilitys='[{"abilityName":"Vida","scoreRate":"10"},{"abilityName":"Ataque","scoreRate":"90"},{"abilityName":"Defensa","scoreRate":"20"},{"abilityName":"Maestría elemental","scoreRate":"50"},{"abilityName":"Prob. de crítico","scoreRate":"80"},{"abilityName":"Daño crítico","scoreRate":"50"}]'
></r-radar>
```

### Datos de ejemplo completos

Como un `attribute` de HTML solo puede llevar una `string`, los datos que le pases tienen que ser una cadena `json`, que se convierte de nuevo en un array de objetos con `JSON.parse`; un `JSON` mal formado no se puede analizar:

```json
[
  {
    "abilityName": "Vida",
    "scoreRate": "10",
    "backgroundColor": "red",
    "fontSize": "30",
    "fontColor": "blue"
  },
  {
    "abilityName": "Ataque",
    "scoreRate": "90"
  },
  {
    "abilityName": "Defensa",
    "scoreRate": "20"
  },
  {
    "abilityName": "Maestría elemental",
    "scoreRate": "50"
  },
  {
    "abilityName": "Prob. de crítico",
    "scoreRate": "80"
  },
  {
    "abilityName": "Daño crítico",
    "scoreRate": "50"
  }
]
```

### Variables CSS

Los colores del gráfico también se pueden definir (de forma reactiva al tema) mediante propiedades personalizadas de CSS en el host:

| Variable                    | Por defecto                           | Descripción                          |
| --------------------------- | ------------------------------------- | ------------------------------------ |
| `--ran-radar-polygon-color` | `var(--ran-color-border)` / `#e6e6e6` | Color de la rejilla                  |
| `--ran-radar-line-color`    | `var(--ran-color-border)` / `#e6e6e6` | Color de los ejes                    |
| `--ran-radar-fill-color`    | `rgba(255,121,35,0.60)`               | Relleno de la región de datos        |
| `--ran-radar-stroke-color`  | `rgba(255,121,35,0.60)`               | Contorno de la región de datos       |
| `--ran-radar-width`         | `100%`                                | Ancho del contenedor del lienzo      |
| `--ran-radar-height`        | `100%`                                | Alto del contenedor del lienzo       |
| `--ran-radar-display`       | `block`                               | `display` del contenedor del lienzo  |
| `--ran-radar-position`      | `relative`                            | `position` del contenedor del lienzo |

El color del texto de las etiquetas también recurre al token de tema `--ran-color-text`, así que se leen bien en modo claro y oscuro.

## Eventos

Ninguno. `<r-radar>` no despacha eventos personalizados.

## Buenas prácticas

- **Dimensionado**: el host no tiene tamaño propio; define siempre un `width`/`height` explícito (con `style` o con las variables `--ran-radar-width`/`--ran-radar-height`). El gráfico se redibuja solo al cambiar el tamaño del contenedor, mediante un `ResizeObserver`.
- **Formato de los datos**: pasa JSON válido en `abilitys`; un JSON mal formado se registra y no se puede analizar. Usa la propiedad JS `abilitys` cuando trabajes con arrays de verdad desde código.
- **Escala**: `scoreRate` se mide contra un máximo fijo de `100`; normaliza tus valores a ese rango.
- **Temas**: los atributos de color (`colorPolygon`, `colorLine`, `fillColor`, `strokeColor`) son reactivos y redibujan el gráfico al cambiarlos tras el montaje. Prefiere las variables CSS `--ran-radar-*` cuando quieras que los colores sigan solos el tema claro u oscuro.
