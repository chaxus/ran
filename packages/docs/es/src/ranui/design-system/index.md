---
description: 'El lenguaje de diseño de ranui y la referencia completa de sus tokens: todos los `--ran-*` globales, con la escalera de color de Geist en claro y oscuro, los roles semánticos, el espacio, los tamaños, la tipografía, el radio, la elevación, el apilamiento, el movimiento, el foco y las primitivas de piel.'
---

# Sistema de diseño

El **lenguaje de diseño** con el que está hecho ranui, y el catálogo **completo** de los tokens que lo expresan: todas las propiedades personalizadas `--ran-*` globales que declara la biblioteca, con su valor en ambos temas. Los componentes leen estos tokens en vez de escribir valores a mano, así que sobrescribir uno reestiliza todo lo que lo consume.

Cuatro páginas responden a cuatro preguntas distintas, y están separadas a propósito:

| Página                                           | Responde                                                   |
| ------------------------------------------------ | ---------------------------------------------------------- |
| **Sistema de diseño** (esta página)              | _Qué_ son los tokens: el vocabulario                       |
| [Pautas de diseño](/es/src/ranui/design-guides/) | _Cómo elegir_ entre ellos al construir una pantalla        |
| [Arquitectura de información](/es/src/ranui/information-architecture/) | _Qué forma_ debe tomar la página misma |
| [Tematización](/es/src/ranui/theme/)             | _Cómo cambiarlos y sobrescribirlos_ en tiempo de ejecución |

> **Úsala cuando** necesites el nombre o el valor de un token (un rol de color, un paso de espacio, un tamaño de icono, un nivel de sombra, una curva de aceleración) o quieras entender por qué las escalas tienen la forma que tienen.

## El lenguaje: Geist

Los tokens de ranui se basan en [Geist](https://vercel.com/geist), el sistema de diseño de código abierto de Vercel. Cada escala de color es una escalera de trabajos fijos, uno por peldaño, no un conjunto de tonos entre los que elegir: el peldaño 200 no es «un gris un poco más oscuro», es «el fondo del hover». Una vez fijado el trabajo de un peldaño, elegir un color para un estado de interacción es una consulta, no un juicio.

ranui adopta esa escalera como sus escalas `--ran-*`, superpone tokens semánticos encima y trae **Geist Sans / Geist Mono** como tipografías por defecto.

## Dos capas {#two-layers}

**Capa 1: la paleta base.** Las escalas crudas de abajo. Rara vez se consumen directamente.

**Capa 2: los tokens semánticos.** `--ran-color-*` y compañía, mapeados sobre la capa 1. **Consume esta capa.** El modo oscuro redefine solo la capa 1, así que cada token semántico cambia a través de `var()` sin una sola sobreescritura oscura por componente en toda la biblioteca.

```
--ran-gray-1000        →  #171717 (claro)  /  #ededed (oscuro)   ← capa 1, cambia
--ran-color-text       →  var(--ran-gray-1000)                    ← capa 2, sigue
--ran-btn-color        →  var(--ran-color-text, …)                ← token de componente
```

Esa cadena es toda la arquitectura: cambia un peldaño base y se propaga a todas partes; cambia un token semántico y cambia un rol; cambia un token de componente y cambia un elemento.

## Color

### La escalera {#the-ladder}

Cada escala de tono va de `100` a `1000`, y cada peldaño tiene un trabajo fijo:

| Peldaño | Rol                    | Peldaño | Rol                             |
| ------- | ---------------------- | ------- | ------------------------------- |
| 100     | Fondo por defecto      | 600     | Borde activo                    |
| 200     | Fondo del hover        | 700     | Relleno sólido (botón/insignia) |
| 300     | Fondo activo (pulsado) | 800     | Relleno sólido (hover)          |
| 400     | Borde por defecto      | 900     | Texto e iconos secundarios      |
| 500     | Borde del hover        | 1000    | Texto e iconos principales      |

### Fondos

| Token                  | Claro                                                           | Oscuro                                                          | Sirve para                 |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------- |
| `--ran-background-100` | <span class="swatch" style="--swatch:#ffffff"></span> `#ffffff` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | Fondo de la página         |
| `--ran-background-200` | <span class="swatch" style="--swatch:#fafafa"></span> `#fafafa` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | Zonas sutiles de la página |

### Gris — `--ran-gray-100..1000`

La escala que hay detrás del texto, los bordes y las superficies.

| Peldaño | Claro                                                           | Oscuro                                                          |
| ------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100     | <span class="swatch" style="--swatch:#f2f2f2"></span> `#f2f2f2` | <span class="swatch" style="--swatch:#1a1a1a"></span> `#1a1a1a` |
| 200     | <span class="swatch" style="--swatch:#ebebeb"></span> `#ebebeb` | <span class="swatch" style="--swatch:#1f1f1f"></span> `#1f1f1f` |
| 300     | <span class="swatch" style="--swatch:#e6e6e6"></span> `#e6e6e6` | <span class="swatch" style="--swatch:#292929"></span> `#292929` |
| 400     | <span class="swatch" style="--swatch:#eaeaea"></span> `#eaeaea` | <span class="swatch" style="--swatch:#2e2e2e"></span> `#2e2e2e` |
| 500     | <span class="swatch" style="--swatch:#c9c9c9"></span> `#c9c9c9` | <span class="swatch" style="--swatch:#454545"></span> `#454545` |
| 600     | <span class="swatch" style="--swatch:#a8a8a8"></span> `#a8a8a8` | <span class="swatch" style="--swatch:#878787"></span> `#878787` |
| 700     | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` |
| 800     | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` |
| 900     | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` | <span class="swatch" style="--swatch:#a0a0a0"></span> `#a0a0a0` |
| 1000    | <span class="swatch" style="--swatch:#171717"></span> `#171717` | <span class="swatch" style="--swatch:#ededed"></span> `#ededed` |

### Gris alfa — `--ran-gray-alpha-100..1000`

Translúcida, así que se superpone a cualquier superficie: la elección correcta para un velo, un lavado de hover o un separador que debe posarse sobre contenido desconocido.

| Peldaño | Claro                                                                        | Oscuro                                                                       |
| ------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 100     | <span class="swatch is-alpha" style="--swatch:#0000000d"></span> `#0000000d` | <span class="swatch is-alpha" style="--swatch:#ffffff12"></span> `#ffffff12` |
| 200     | <span class="swatch is-alpha" style="--swatch:#00000015"></span> `#00000015` | <span class="swatch is-alpha" style="--swatch:#ffffff17"></span> `#ffffff17` |
| 300     | <span class="swatch is-alpha" style="--swatch:#0000001a"></span> `#0000001a` | <span class="swatch is-alpha" style="--swatch:#ffffff21"></span> `#ffffff21` |
| 400     | <span class="swatch is-alpha" style="--swatch:#00000014"></span> `#00000014` | <span class="swatch is-alpha" style="--swatch:#ffffff24"></span> `#ffffff24` |
| 500     | <span class="swatch is-alpha" style="--swatch:#00000036"></span> `#00000036` | <span class="swatch is-alpha" style="--swatch:#ffffff3d"></span> `#ffffff3d` |
| 600     | <span class="swatch is-alpha" style="--swatch:#0000003d"></span> `#0000003d` | <span class="swatch is-alpha" style="--swatch:#ffffff82"></span> `#ffffff82` |
| 700     | <span class="swatch is-alpha" style="--swatch:#00000070"></span> `#00000070` | <span class="swatch is-alpha" style="--swatch:#ffffff8a"></span> `#ffffff8a` |
| 800     | <span class="swatch is-alpha" style="--swatch:#00000082"></span> `#00000082` | <span class="swatch is-alpha" style="--swatch:#ffffff78"></span> `#ffffff78` |
| 900     | <span class="swatch is-alpha" style="--swatch:#000000b3"></span> `#000000b3` | <span class="swatch is-alpha" style="--swatch:#ffffff9c"></span> `#ffffff9c` |
| 1000    | <span class="swatch is-alpha" style="--swatch:#000000e8"></span> `#000000e8` | <span class="swatch is-alpha" style="--swatch:#ffffffeb"></span> `#ffffffeb` |

### Azul — `--ran-blue-100..1000`

Reservado para los enlaces y el anillo de foco.

| Peldaño | Claro                                                           | Oscuro                                                          |
| ------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100     | <span class="swatch" style="--swatch:#f0f7ff"></span> `#f0f7ff` | <span class="swatch" style="--swatch:#06193a"></span> `#06193a` |
| 200     | <span class="swatch" style="--swatch:#e9f4ff"></span> `#e9f4ff` | <span class="swatch" style="--swatch:#022248"></span> `#022248` |
| 300     | <span class="swatch" style="--swatch:#dfefff"></span> `#dfefff` | <span class="swatch" style="--swatch:#002f62"></span> `#002f62` |
| 400     | <span class="swatch" style="--swatch:#cae7ff"></span> `#cae7ff` | <span class="swatch" style="--swatch:#003674"></span> `#003674` |
| 500     | <span class="swatch" style="--swatch:#94ccff"></span> `#94ccff` | <span class="swatch" style="--swatch:#00418b"></span> `#00418b` |
| 600     | <span class="swatch" style="--swatch:#48aeff"></span> `#48aeff` | <span class="swatch" style="--swatch:#0090ff"></span> `#0090ff` |
| 700     | <span class="swatch" style="--swatch:#006bff"></span> `#006bff` | <span class="swatch" style="--swatch:#006efe"></span> `#006efe` |
| 800     | <span class="swatch" style="--swatch:#0059ec"></span> `#0059ec` | <span class="swatch" style="--swatch:#005be7"></span> `#005be7` |
| 900     | <span class="swatch" style="--swatch:#005ff2"></span> `#005ff2` | <span class="swatch" style="--swatch:#47a8ff"></span> `#47a8ff` |
| 1000    | <span class="swatch" style="--swatch:#002359"></span> `#002359` | <span class="swatch" style="--swatch:#eaf6ff"></span> `#eaf6ff` |

### Rojo — `--ran-red-100..1000`

Peligro y errores.

| Peldaño | Claro                                                           | Oscuro                                                          |
| ------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100     | <span class="swatch" style="--swatch:#ffeeef"></span> `#ffeeef` | <span class="swatch" style="--swatch:#330a11"></span> `#330a11` |
| 200     | <span class="swatch" style="--swatch:#ffe8ea"></span> `#ffe8ea` | <span class="swatch" style="--swatch:#440d13"></span> `#440d13` |
| 300     | <span class="swatch" style="--swatch:#ffe3e4"></span> `#ffe3e4` | <span class="swatch" style="--swatch:#5d0e17"></span> `#5d0e17` |
| 400     | <span class="swatch" style="--swatch:#ffd7d6"></span> `#ffd7d6` | <span class="swatch" style="--swatch:#6f101b"></span> `#6f101b` |
| 500     | <span class="swatch" style="--swatch:#ffb1b3"></span> `#ffb1b3` | <span class="swatch" style="--swatch:#88151f"></span> `#88151f` |
| 600     | <span class="swatch" style="--swatch:#ff676d"></span> `#ff676d` | <span class="swatch" style="--swatch:#f32e40"></span> `#f32e40` |
| 700     | <span class="swatch" style="--swatch:#fc0035"></span> `#fc0035` | <span class="swatch" style="--swatch:#f13242"></span> `#f13242` |
| 800     | <span class="swatch" style="--swatch:#ea001d"></span> `#ea001d` | <span class="swatch" style="--swatch:#e2162a"></span> `#e2162a` |
| 900     | <span class="swatch" style="--swatch:#d8001b"></span> `#d8001b` | <span class="swatch" style="--swatch:#ff565f"></span> `#ff565f` |
| 1000    | <span class="swatch" style="--swatch:#47000c"></span> `#47000c` | <span class="swatch" style="--swatch:#ffe9ed"></span> `#ffe9ed` |

### Ámbar — `--ran-amber-100..1000`

Advertencias.

| Peldaño | Claro                                                           | Oscuro                                                          |
| ------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100     | <span class="swatch" style="--swatch:#fff6de"></span> `#fff6de` | <span class="swatch" style="--swatch:#2a1700"></span> `#2a1700` |
| 200     | <span class="swatch" style="--swatch:#fff4cf"></span> `#fff4cf` | <span class="swatch" style="--swatch:#361900"></span> `#361900` |
| 300     | <span class="swatch" style="--swatch:#fff1c1"></span> `#fff1c1` | <span class="swatch" style="--swatch:#502800"></span> `#502800` |
| 400     | <span class="swatch" style="--swatch:#ffdc73"></span> `#ffdc73` | <span class="swatch" style="--swatch:#5b3000"></span> `#5b3000` |
| 500     | <span class="swatch" style="--swatch:#ffc543"></span> `#ffc543` | <span class="swatch" style="--swatch:#703e00"></span> `#703e00` |
| 600     | <span class="swatch" style="--swatch:#ffa600"></span> `#ffa600` | <span class="swatch" style="--swatch:#ed9a00"></span> `#ed9a00` |
| 700     | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` |
| 800     | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 900     | <span class="swatch" style="--swatch:#aa4d00"></span> `#aa4d00` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 1000    | <span class="swatch" style="--swatch:#561900"></span> `#561900` | <span class="swatch" style="--swatch:#fff3d5"></span> `#fff3d5` |

### Verde — `--ran-green-100..1000`

Éxito.

| Peldaño | Claro                                                           | Oscuro                                                          |
| ------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100     | <span class="swatch" style="--swatch:#ecfdec"></span> `#ecfdec` | <span class="swatch" style="--swatch:#002608"></span> `#002608` |
| 200     | <span class="swatch" style="--swatch:#e5fce7"></span> `#e5fce7` | <span class="swatch" style="--swatch:#00320b"></span> `#00320b` |
| 300     | <span class="swatch" style="--swatch:#d3fad1"></span> `#d3fad1` | <span class="swatch" style="--swatch:#003a0e"></span> `#003a0e` |
| 400     | <span class="swatch" style="--swatch:#b9f5bc"></span> `#b9f5bc` | <span class="swatch" style="--swatch:#004615"></span> `#004615` |
| 500     | <span class="swatch" style="--swatch:#82eb8d"></span> `#82eb8d` | <span class="swatch" style="--swatch:#006717"></span> `#006717` |
| 600     | <span class="swatch" style="--swatch:#4ce15e"></span> `#4ce15e` | <span class="swatch" style="--swatch:#00952d"></span> `#00952d` |
| 700     | <span class="swatch" style="--swatch:#28a948"></span> `#28a948` | <span class="swatch" style="--swatch:#00ac3a"></span> `#00ac3a` |
| 800     | <span class="swatch" style="--swatch:#279141"></span> `#279141` | <span class="swatch" style="--swatch:#009432"></span> `#009432` |
| 900     | <span class="swatch" style="--swatch:#107d32"></span> `#107d32` | <span class="swatch" style="--swatch:#00ca50"></span> `#00ca50` |
| 1000    | <span class="swatch" style="--swatch:#003a00"></span> `#003a00` | <span class="swatch" style="--swatch:#d8ffe4"></span> `#d8ffe4` |

### Tokens semánticos de color

La capa que los componentes leen de verdad. Todo lo de aquí se resuelve a través de las escalas de arriba, así que cambia con el tema por sí solo.

| Token                          | Se resuelve en                                                                                                                             | Rol                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| `--ran-color-bg`               | `--ran-background-100`                                                                                                                     | Fondo de la página                         |
| `--ran-color-bg-subtle`        | `--ran-background-200`                                                                                                                     | Zonas sutiles de la página                 |
| `--ran-color-bg-elevated`      | `--ran-background-100` · gray-100 (oscuro)                                                                                                 | Tarjetas, superficies                      |
| `--ran-color-bg-muted`         | `--ran-gray-100`                                                                                                                           | Rellenos hundidos o apagados               |
| `--ran-color-bg-hover`         | `--ran-gray-200`                                                                                                                           | Superficie del hover                       |
| `--ran-color-bg-active`        | `--ran-gray-300`                                                                                                                           | Superficie activa (pulsada)                |
| `--ran-color-text`             | `--ran-gray-1000`                                                                                                                          | Texto principal                            |
| `--ran-color-text-secondary`   | `--ran-gray-900`                                                                                                                           | Texto secundario                           |
| `--ran-color-text-disabled`    | `--ran-gray-700`                                                                                                                           | Texto deshabilitado                        |
| `--ran-color-border`           | `--ran-gray-400`                                                                                                                           | Borde por defecto                          |
| `--ran-color-border-secondary` | `--ran-gray-300`                                                                                                                           | Borde más sutil                            |
| `--ran-color-border-hover`     | `--ran-gray-500`                                                                                                                           | Borde del hover                            |
| `--ran-color-border-active`    | `--ran-gray-600`                                                                                                                           | Borde activo                               |
| `--ran-color-primary`          | `--ran-gray-1000`                                                                                                                          | La acción principal (monocroma)            |
| `--ran-color-primary-hover`    | <span class="swatch" style="--swatch:#383838"></span> `#383838` · <span class="swatch" style="--swatch:#cccccc"></span> `#cccccc` (oscuro) | Hover del primario                         |
| `--ran-color-primary-active`   | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` · <span class="swatch" style="--swatch:#b3b3b3"></span> `#b3b3b3` (oscuro) | Primario pulsado                           |
| `--ran-color-primary-text`     | `--ran-background-100`                                                                                                                     | La tinta **sobre** una superficie primaria |
| `--ran-color-success`          | `--ran-green-700`                                                                                                                          | Éxito                                      |
| `--ran-color-warning`          | `--ran-amber-700`                                                                                                                          | Advertencia                                |
| `--ran-color-danger`           | `--ran-red-700`                                                                                                                            | Peligro / error                            |
| `--ran-color-link`             | `--ran-blue-700`                                                                                                                           | Enlaces                                    |

`--ran-color-primary-hover` / `-active` son los dos literales de la capa semántica: avanzan hacia el fondo de la página en lugar de a lo largo de una escala, así que el modo oscuro los redefine directamente.

### Qué significa cada acento

- **El primario es monocromo**: negro sobre blanco en claro, blanco sobre negro en oscuro (el tono de marca de Geist, `<r-button type="primary">`). El texto y los iconos encima usan `--ran-color-primary-text`, que cambia con él. No hay un token de «contraste» aparte: el primario _es_ la acción de mayor contraste.
- **El azul está reservado** para los enlaces (`--ran-color-link`) y el anillo de foco. No es un primario alternativo.
- **Verde = éxito · ámbar = advertencia · rojo = peligro.** Un significado cada uno.

No existe `--ran-color-error`; el token es `--ran-color-danger`. Un `var()` que nombra una propiedad nunca declarada se resuelve en nada y la declaración entera se descarta en silencio, y por eso el nombre equivocado merece comprobarse contra esta tabla en vez de adivinarse.

## Espacio {#spacing}

Los huecos entre las cosas: `padding`, `margin`, `gap`. Una unidad base de 4px con **nueve valores**, ni uno más:

| Token           | Valor | Token            | Valor |
| --------------- | ----- | ---------------- | ----- |
| `--ran-space-1` | 4px   | `--ran-space-8`  | 32px  |
| `--ran-space-2` | 8px   | `--ran-space-10` | 40px  |
| `--ran-space-3` | 12px  | `--ran-space-16` | 64px  |
| `--ran-space-4` | 16px  | `--ran-space-24` | 96px  |
| `--ran-space-6` | 24px  |                  |       |

El número es el múltiplo de 4px, así que la escala salta: no existe `--ran-space-5`. Ese es el punto: un conjunto limitado es lo que produce el ritmo de una página.

## Tamaños

Las dimensiones propias de un elemento: tamaños de icono, alturas de control, controles pequeños cuadrados o rectangulares.

| Token          | Valor | Normalmente                                       |
| -------------- | ----- | ------------------------------------------------- |
| `--ran-size-1` | 16px  | La caja de un checkbox, un icono pequeño en línea |
| `--ran-size-2` | 18px  | —                                                 |
| `--ran-size-3` | 20px  | Icono dentro de un control                        |
| `--ran-size-4` | 24px  | Botón de icono en una barra de herramientas       |
| `--ran-size-5` | 28px  | Altura de un control compacto                     |
| `--ran-size-6` | 30px  | —                                                 |
| `--ran-size-7` | 32px  | Altura de control por defecto                     |

**Es una escala aparte de la de espacio a propósito**, y mezclarlas es un error que comprueba una máquina (`sizing-scale`). Las dos tienen rangos y progresiones distintos (una escala de espacio que dobla desde 4px produce valores incómodos para iconos y controles), y quien la use debe poder reajustar una sin perturbar la otra: que un icono crezca no debería ensanchar además cada hueco que casualmente comparta su valor en píxeles. Cuando un peldaño coincide numéricamente con uno de espacio (`--ran-size-4` y `--ran-space-6` son ambos 24px) es coincidencia, no un alias.

Una dimensión genuinamente irrepetible que ningún otro componente comparte (el `min-width` de un menú, por ejemplo) se queda como token de componente con su propio valor literal de respaldo, en vez de forzarse a un peldaño.

## Tipografía {#typography}

| Token               | Valor                                                           |
| ------------------- | --------------------------------------------------------------- |
| `--ran-font-family` | Geist / Geist Sans, y luego la pila de interfaz del sistema     |
| `--ran-font-mono`   | Geist Mono, y luego `ui-monospace`, SF Mono, Menlo, Consolas, … |
| `--ran-font-size`   | `14px` (el tamaño base)                                         |
| `--ran-line-height` | `1.5715`                                                        |

El texto se organiza por **rol**, y el rol fija a la vez la fuente, el tamaño, el grosor y la altura de línea:

| Rol         | Uso                                   | Token de grosor                                                                | Tokens de tamaño                           |
| ----------- | ------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------ |
| **heading** | Títulos                               | `--ran-text-heading-weight` (600)                                              | `--ran-text-heading-1..4` (32/24/20/16px)  |
| **label**   | Una línea, para recorrer con la vista | `--ran-text-label-weight` (500)                                                | `--ran-text-label-1..3` (14/13/12px)       |
| **copy**    | Cuerpo de varias líneas               | `--ran-text-copy-weight` (400)                                                 | `--ran-text-copy-1..2` (16/14px)           |
| **button**  | Texto de botón                        | `--ran-text-button-weight` (500)                                               | `--ran-text-button-size` (14px)            |
| **mono**    | Código, datos, antetítulos            | `--ran-text-mono-weight-regular` (400) / `--ran-text-mono-weight-medium` (500) | toma prestados los tamaños de label / copy |

Dos tokens existen solo para que un rol aterrice bien:

| Token                           | Valor     | Por qué                                                               |
| ------------------------------- | --------- | --------------------------------------------------------------------- |
| `--ran-text-heading-tracking`   | `-0.03em` | Los títulos necesitan un interletraje más apretado a tamaños grandes. |
| `--ran-text-button-line-height` | `1`       | Centrado vertical nítido dentro de un control de altura fija.         |

Geist limita el grosor a 600 (semibold). El énfasis viene del tamaño y del espacio, no de una tipografía más gruesa. No existe `--ran-text-copy-3`: el peldaño de 12px es `--ran-text-label-3`.

### Tipografías

ranui aloja por su cuenta ambas familias (peso variable 100–900, SIL OFL 1.1), así que una sola importación las carga sin depender de ningún CDN:

```js
import 'ranui/fonts'; // empaquetadores
```

```html
<link rel="stylesheet" href="…/ranui/dist/fonts/fonts.css" />
```

Sin ella, los tokens recurren a las pilas de fuentes del sistema; todo sigue funcionando, solo que sin las familias de Geist.

## Radio

| Token               | Valor    | Sirve para                           |
| ------------------- | -------- | ------------------------------------ |
| `--ran-radius-sm`   | `6px`    | Controles: botón, campo, desplegable |
| `--ran-radius-md`   | `12px`   | Tarjetas, diálogos                   |
| `--ran-radius-lg`   | `16px`   | Superficies grandes                  |
| `--ran-radius-full` | `9999px` | Píldoras, avatares                   |

## Elevación

La sombra es un **rol**, no un adorno. Elige el nivel por lo que es el elemento. El modo oscuro reemplaza los tres, porque una sombra afinada para una página blanca desaparece sobre una negra.

| Token                   | Sirve para                                                                         | Claro                                                           | Oscuro                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--ran-shadow-elevated` | Superficies en el flujo que además tienen borde: `r-card`, `r-section`             | `0 1px 2px rgba(0,0,0,.04), 0 2px 4px -2px rgba(0,0,0,.05)`     | `0 1px 2px rgba(0,0,0,.16)`                                                                 |
| `--ran-shadow-menu`     | Capas pasajeras sobre el contenido: desplegable, menú de selección, popover, aviso | `0 2px 4px rgba(0,0,0,.05), 0 8px 24px -6px rgba(0,0,0,.14)`    | `0 1px 1px rgba(0,0,0,.2), 0 4px 8px -4px rgba(0,0,0,.4), 0 16px 24px -8px rgba(0,0,0,.5)`  |
| `--ran-shadow-modal`    | Diálogos que bloquean: `r-modal`                                                   | `0 4px 12px rgba(0,0,0,.08), 0 20px 48px -12px rgba(0,0,0,.22)` | `0 1px 1px rgba(0,0,0,.2), 0 8px 16px -4px rgba(0,0,0,.4), 0 24px 32px -8px rgba(0,0,0,.5)` |

Las capas sin borde confían solo en la sombra para separarse, así que los niveles de capa flotante llevan peso de verdad; una capa que cae al nivel elevado se ve plana y clavada a la página.

## Apilamiento {#stacking}

Las capas flotantes se portalizan a `<body>`, así que necesitan un nivel explícito:

| Token              | Por defecto | Sirve para                                                                                                                 |
| ------------------ | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| `--ran-z-modal`    | `1000`      | Diálogos que bloquean y su máscara                                                                                         |
| `--ran-z-dropdown` | `1100`      | Desplegable / menú de selección / popover: **por encima** del modal, para que un select dentro de un diálogo siga viéndose |
| `--ran-z-message`  | `1200`      | Avisos y notificaciones: siempre encima                                                                                    |

La escalera empieza en 1000 para superar el marco habitual de una página (las barras de navegación y los fondos suelen vivir en las decenas). Sobrescribe un nivel en `:root`, o por componente (`--ran-dropdown-host-z-index`, `--ran-modal-root-z-index`, `--ran-message-z-index`), nunca con `!important`.

## Movimiento

| Token                        | Valor   | Uso                                   |
| ---------------------------- | ------- | ------------------------------------- |
| `--ran-motion-duration-fast` | `0.15s` | Transiciones de hover y estado activo |
| `--ran-motion-duration-base` | `0.2s`  | Popovers, menús                       |
| `--ran-motion-duration-slow` | `0.35s` | Apariciones mayores                   |

| Token de aceleración         | Curva                               | Carácter                                     |
| ---------------------------- | ----------------------------------- | -------------------------------------------- |
| `--ran-motion-ease-standard` | `cubic-bezier(0.645,0.045,0.355,1)` | De entrada y salida, de uso general          |
| `--ran-motion-ease-snappy`   | `cubic-bezier(0.33,0,0.15,1)`       | Rápida, sin rebote: interruptores            |
| `--ran-motion-ease-spring`   | `cubic-bezier(0.34,1.26,0.5,1)`     | Rebote leve: botones, tarjetas               |
| `--ran-motion-ease-bouncy`   | `cubic-bezier(0.34,1.56,0.64,1)`    | Rebote juguetón: me gusta, añadir al carrito |
| `--ran-motion-ease-smooth`   | `cubic-bezier(0.4,0,0.2,1)`         | Serena, sin rebote: apariciones, maquetación |

La familia spring está destilada de muelles afinados de SwiftUI (response/damping reducidos a una bézier de un solo rebote).

**Combínalas solo con propiedades de movimiento**: `transform`, `opacity`, la geometría de la caja. Las propiedades de la paleta (`background-color`, `color`, `border-color`, `box-shadow`, `fill`, `stroke`) no llevan transición por defecto a propósito, porque el CSS no puede distinguir una interacción de un cambio de tema: cualquier fundido que añadas a un color se dispara también al pasar de claro a oscuro. Aun así, cada componente expone un gancho `--ran-*-transition` por si quieres volver a activarlo.

## Foco

| Token                            | Valor                                                                | Para                                                            |
| -------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| `--ran-focus-ring`               | `0 0 0 2px var(--ran-background-100), 0 0 0 4px var(--ran-blue-700)` | El anillo estándar, como `box-shadow`                           |
| `--ran-focus-ring-inverse-color` | `#fff`                                                               | El color del anillo para una superficie oscura en _ambos_ temas |

El anillo tiene dos capas: una interior del color del fondo y otra exterior azul, así que sigue viéndose sobre cualquier superficie, y se queda azul en vez de seguir al primario, ahora monocromo.

`--ran-focus-ring-inverse-color` **no se redefine en modo oscuro a propósito**: existe para un componente cuya propia superficie es oscura fija, sea cual sea el tema de la página (la barra de control de `r-player`, sobre un vídeo cualquiera), y esa superficie no cambia cuando cambia la página.

## Primitivas de piel

Los pocos valores estructurales que comparten los componentes y que no son color, tamaño ni tipografía. Se mantienen al mínimo a propósito: esta capa era mucho mayor y casi toda se retiró junto con los paquetes de tema.

| Token                           | Valor                        | Para                                                                                           |
| ------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------- |
| `--ran-skin-border-width`       | `1px`                        | El grosor de borde que dibujan los componentes                                                 |
| `--ran-skin-border-style`       | `solid`                      | El estilo de borde que dibujan los componentes                                                 |
| `--ran-skin-border-image-width` | `4px`                        | El margen interior de `border-image-slice`, compartido por button/checkbox/input/modal/message |
| `--ran-skin-raised-shadow`      | `var(--ran-shadow-elevated)` | La sombra de superficie elevada, indirecta para que una piel pueda cambiarla                   |
| `--ran-skin-font-family`        | `var(--ran-font-family)`     | La familia que usan los componentes, indirecta del mismo modo                                  |

## Qué redefine el modo oscuro

`data-ran-theme="dark"` en `<html>` (o en cualquier subárbol, véase [tematización](/es/src/ranui/theme/)) redefine **la paleta base y nada más**, con tres excepciones que no pueden resolverse a través de una escala:

- toda la capa 1: cada peldaño de gris, gris alfa, azul, rojo, ámbar y verde, y los dos fondos;
- `--ran-color-bg-elevated`, que en oscuro apunta a `--ran-gray-100` para que una tarjeta se levante de una página negra en vez de desaparecer en ella;
- `--ran-color-primary-hover` / `-active`, que son literales y no referencias a una escala;
- los tres niveles de sombra, reafinados para un fondo oscuro.

Todo lo demás (cualquier otro token semántico, cada tamaño, cada duración) se define una sola vez.

## Tokens de componente

Por debajo de la capa semántica, cada componente expone sus propios ganchos, con este nombre:

```
--ran-{component}-{element}[-{state}]-{property}
```

por ejemplo `--ran-btn-hover-background`, `--ran-select-search-active-border-width`. Por defecto recurren a los tokens semánticos: `var(--ran-btn-background, var(--ran-color-primary, #171717))`, así que sobrescribir un token semántico llega a todos ellos, y sobrescribir uno de componente reduce el cambio a un solo elemento.

La lista completa, generada, es [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md) en el repositorio; la API por elemento está [aquí](/es/src/ranui/api). Para saber cómo aplicarlos, véase [Tematización](/es/src/ranui/theme/#customizing-tokens).

## Usar los tokens en tu propio CSS {#using-tokens-in-your-own-css}

```css
.panel {
  background: var(--ran-color-bg-elevated);
  color: var(--ran-color-text);
  border: var(--ran-skin-border-width) var(--ran-skin-border-style) var(--ran-color-border);
  border-radius: var(--ran-radius-md);
  padding: var(--ran-space-4);
  box-shadow: var(--ran-shadow-elevated);
}
```

Tres reglas mantienen eso a salvo en oscuro:

1. **Nada de hex crudo** para algo que deba seguir al tema.
2. **Un respaldo debe nombrar un token que cambie**: `var(--ran-color-text, var(--ran-gray-1000))`, nunca `var(--ran-color-text, #171717)`.
3. **Un respaldo debe nombrar un token que exista**, o la declaración se descarta y el elemento se queda en silencio con lo que heredó.

> Todos los tokens globales que declara la biblioteca están listados en esta página, y una prueba unitaria falla si se añade uno sin documentarlo aquí. Los tokens de ámbito de componente se generan aparte, en [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md).
