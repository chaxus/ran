---
description: 'Reglas de diseño para construir pantallas con ranui: elige un rol y deja que el token ponga el valor, diseña todos los estados alcanzables y verifica lo que de verdad se dibujó.'
---

# Pautas de diseño

Las reglas que debe seguir una pantalla hecha con componentes de ranui para que se lea como **un sistema** y no como un montón de piezas.

Esta página trata del **criterio**: a qué token echar mano, qué comprobar antes de publicar. El catálogo de tokens en sí es el [sistema de diseño](/es/src/ranui/design-system/); cambiar y sobrescribir en tiempo de ejecución es la [tematización](/es/src/ranui/theme/). La versión completa de estas reglas, la que se comprueba automáticamente, vive en el repositorio como [`packages/ranui/docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md).

> **Úsalas cuando** estés maquetando una página o construyendo un componente propio a partir de elementos `<r-*>` y tengas que decidir un color, un espacio, un tamaño de texto, una sombra o una duración de animación. La respuesta corta es siempre la misma: **elige un rol y deja que el token ponga el valor.**

## Principios

1. **Claridad antes que personalidad.** La tarea principal y la acción principal deben ser inconfundibles antes de considerar ninguna otra cosa.
2. **Compón, no reinventes.** Echa mano de `r-button`, `r-input`, `r-select` y `r-modal` antes de construir una primitiva a base de `div`: esos componentes ya traen el foco, el teclado y el comportamiento ARIA que si no tendrías que volver a deducir.
3. **Tokens, nunca valores crudos.** Un código hexadecimal, un espacio de `20px` o una sombra elegida a mano son decisiones que no van a seguir al tema.
4. **Decide por rol y por estado, no a ojo.** «¿Qué es este texto?» (título / etiqueta / cuerpo / botón) tiene respuesta; «¿qué tamaño se ve bien?» no la tiene.
5. **Diseña todos los estados alcanzables.** Normal, hover, activo, foco, deshabilitado, cargando, vacío, error: el estado normal es uno de ocho.
6. **Verifica lo que se dibujó.** En claro _y_ oscuro, estrecho _y_ ancho, con ratón _y_ con dedo. Una revisión no atrapa una sombra que no se ve.

Orden de prioridad cuando dos reglas tiran en direcciones distintas: **objetivos de quien usa → evidencia verificada → estas pautas → patrones ya publicados → heurísticas generales.**

## Elegir un color

El color se asigna por **rol y estado**, nunca se escoge a ojo. La [escalera](/es/src/ranui/design-system/#the-ladder) ya fija cómo se ven el hover y el estado activo; tu trabajo es nombrar el rol.

| El elemento es…                          | Usa                                                            |
| ---------------------------------------- | -------------------------------------------------------------- |
| El fondo de una página o superficie      | `--ran-color-bg` / `-bg-subtle` / `-bg-elevated` / `-bg-muted` |
| Algo bajo el puntero o siendo pulsado    | `--ran-color-bg-hover` / `-bg-active`                          |
| Texto                                    | `--ran-color-text` / `-text-secondary` / `-text-disabled`      |
| Un borde                                 | `--ran-color-border` / `-hover` / `-active`                    |
| La acción para la que existe la pantalla | `--ran-color-primary` (con `--ran-color-primary-text` encima)  |
| Un estado                                | `--ran-color-success` / `-warning` / `-danger`                 |
| Un enlace                                | `--ran-color-link`                                             |

**Cada acento tiene un solo significado.** El primario es monocromo (negro sobre blanco en claro, blanco sobre negro en oscuro), así que no uses azul para él: el azul es de los enlaces y del anillo de foco. El verde es éxito, el ámbar advertencia y el rojo peligro; usar el rojo para enfatizar te deja sin manera de usarlo luego para el peligro.

**Tres reglas que evitan roturas silenciosas:**

- Nunca escribas a mano un hexadecimal o un `rgb()` para un valor que debería seguir al tema.
- Un respaldo debe nombrar **un token que cambie con el tema**: `var(--ran-color-text, var(--ran-gray-1000))`, nunca `var(--ran-color-text, #171717)`: un literal pensado solo para el modo claro desaparece en oscuro.
- Un respaldo debe nombrar un token que **exista**. Un `var()` sobre una propiedad no declarada se resuelve en nada, la declaración entera se descarta y el elemento se queda con lo que heredó, que normalmente se ve _casi_ bien. (`--ran-color-error` no existe; es `--ran-color-danger`.)

## Espacio y ritmo

Toma cada espacio de la [escala de nueve valores](/es/src/ranui/design-system/#spacing) y deja que la distancia signifique algo:

- **8px** entre elementos dentro de un grupo.
- **16px** entre grupos.
- **32–40px** entre secciones.

No inventes `20px` ni `28px`. El conjunto limitado es lo que produce el ritmo de la página; un solo espacio fuera de la escala es lo que lo rompe. Mantén ejes compartidos entre regiones (bordes, líneas base y columnas que se alinean) y comprueba la alineación contra los píxeles dibujados, no a ojo.

## Elegir la tipografía

Pregunta qué **rol** cumple el texto (título, etiqueta, cuerpo, botón, monoespaciado) y la fuente, el tamaño, el grosor y la altura de línea salen todos de la [escala tipográfica](/es/src/ranui/design-system/#typography). No elijas píxeles crudos caso por caso.

Un rol es una herramienta, no una ley: un texto decorativo genuinamente irrepetible (una capa de destello para un gesto, un grosor extra en el enlace activo) queda mejor con su propio token de componente que forzado dentro del rol más cercano.

## Profundidad: sombra y apilamiento

**Elige el nivel de sombra por lo que es el elemento** (superficie en el flujo, capa flotante o diálogo que bloquea) y asegúrate de que se percibe de verdad. Una sombra que no se ve no da ninguna pista de profundidad, y una capa flotante que cae al nivel de tarjeta parece clavada a la página.

**Incrustar capas de ranui en tu propio marco.** La [escalera de z-index](/es/src/ranui/design-system/#stacking) empieza en 1000 justamente para superar el marco habitual de una página. Una capa portalizada no necesita ayuda tuya. Pero una capa con `position: fixed` que se queda dentro de su propio shadow DOM (el diálogo de `r-modal`) solo escapa hasta su **contexto de apilamiento** ancestro más cercano, así que si envuelves el contenido incrustado en algo que cree uno (`isolation`, `opacity < 1`, `transform`, `filter`, `will-change`), hay que subir el nivel de apilamiento de ese envoltorio para que el diálogo vuelva a quedar por encima. Acota la subida a cuando una capa está _de verdad_ abierta:

```css
.embed {
  isolation: isolate; /* barato: no tiene z-index propio, así que no promueve nada */
}
/* Sube solo mientras haya una capa real abierta, nunca «por si acaso» */
.embed:has(r-modal[open]),
.embed:has(r-modal[closing]) {
  position: relative;
  z-index: 100;
}
```

Un `z-index` general en el envoltorio eleva _todo_ lo que hay dentro (incluido el contenido totalmente estático) por encima de tu cabecera fija durante toda la vida del desplazamiento. Ese fallo llegó a publicarse en este mismo sitio. Haz coincidir también `closing`, no solo `open`: la máscara sigue pintando lo que dure su transición después de que `open` desaparezca.

## Movimiento {#motion}

Cuanto mayor es el cambio, más tiempo recibe; por debajo de ese umbral, no animes. La respuesta al hover y al estado activo ronda los 150ms, los menús los 200ms, los diálogos los 300ms, y un cambio que ya es obvio recibe 0ms. Respeta `prefers-reduced-motion`.

**Nunca dejes que una propiedad de la paleta haga transición.** El CSS no puede saber _por qué_ cambió un color, así que una `transition` sobre `background-color`, `color`, `border-color`, `box-shadow`, `fill` o `stroke` también se dispara cuando cambia el **tema**, y cada elemento se funde a su propio ritmo mientras el resto de la página ya ha cambiado. Anima propiedades de movimiento (`transform`, `opacity`, geometría) en su lugar. `transition: all` y atajos pelados como `transition: 0.2s` significan _todo_, propiedades de la paleta incluidas; ambos están prohibidos en los estilos de ranui y son mala idea en los tuyos.

## Estados y textos

Todo estado alcanzable forma parte del diseño: **hover, activo, foco, deshabilitado, cargando, vacío, error**. Trasládalos a la escalera: hover → `bg-hover` / `border-hover`; activo → `bg-active`; deshabilitado → `text-disabled` más opacidad reducida; foco → el anillo de foco.

Nada que no sea interactivo puede parecerlo. `r-card` solo reacciona al hover con el atributo `hoverable`; déjalo sin poner en las tarjetas que no se pulsan.

El texto también es parte del sistema:

- **Los botones** llevan una acción **y** un objeto. ✅ «Eliminar miembro» ❌ «Eliminar», «Aceptar».
- **Los errores** dicen qué pasó y luego cómo arreglarlo. ✅ «La compilación falló: el paquete supera el límite de tamaño. Redúcelo o sube el límite.» ❌ «La operación falló, inténtalo de nuevo.»
- **Las confirmaciones y los avisos** enuncian el cambio, no el éxito. ✅ «Proyecto eliminado» ❌ «Eliminado con éxito» (que el aviso aparezca ya dice que salió bien).
- Deja que el contexto quite lo redundante: un diálogo titulado «Eliminar proyecto» no necesita un botón que diga «Eliminar el proyecto permanentemente, para siempre».

## Accesibilidad {#accessibility}

- Cumple el contraste **WCAG AA** del texto contra su fondo.
- **Nunca señales un estado solo con color**: acompáñalo de un icono, una etiqueta o texto.
- Todo elemento interactivo conserva un **anillo de foco visible** (`--ran-focus-ring`, o `outline: 2px solid var(--ran-color-primary); outline-offset: 2px`). Nunca lo quites por pulcritud.
- **Todo se alcanza con el teclado.** Nada es solo de ratón.
- Respeta `prefers-reduced-motion` y `prefers-color-scheme`.

## Ratón y dedo, estrecho y ancho

Ni la forma de apuntar ni el tamaño de la ventana son el objetivo secundario.

- Los arrastres, los deslizadores y los gestos usan **Pointer Events** (`pointerdown` / `pointermove` / `pointerup` / `pointercancel`), nunca `mouse*` a secas, junto con `touch-action: none` en la superficie exacta que se arrastra. Un CSS que declara `touch-action: none` sin un manejador de puntero detrás es un control roto, no una línea inofensiva.
- **Una afordancia que solo aparece al pasar el cursor necesita un recurso para el dedo.** `trigger="hover"` en `r-select` o `r-popover` degrada a clic en dispositivos táctiles; lo que construyas debe hacer lo mismo.
- Prefiere **medidas relativas a la ventana** (`%`, `min()`, `max()`, `clamp()`, `vw`/`vh`, por ejemplo `min(560px, calc(100vw - 32px))`) a inventar un punto de ruptura. ranui no tiene un token compartido de puntos de ruptura, así que cada corte fijo es un número suelto que alguien tendrá que mantener.
- **Nunca escondas en móvil la única manera de hacer algo.** Reordena en vez de recurrir a `display: none`.
- **Una posición medida solo es correcta hasta el siguiente reflujo.** Todo lo derivado de `getBoundingClientRect()` caduca al redimensionar, al reflujo del contenedor y (para un panel portalizado) al desplazarse. Vuelve a medir en esos eventos, no solo en la interacción que provocó la primera medición. Cargar la página en un ancho estrecho ejercita la maquetación inicial; no ejercita el _redimensionar hasta_ ese ancho, que es donde esta clase de fallo aparece de verdad.

## Lo que la biblioteca comprueba de forma mecánica

Nueve de estas reglas las comprueba `pnpm -F ranui verify:design`, que CI ejecuta sobre el código de la propia ranui: respaldos de color inseguros en modo oscuro, literales de color crudos, la escala de espacios, la escala de tamaños, bucles de arrastre solo para ratón, reglas de `display` en `:host` que rompen `hidden`, respaldos que nombran tokens no declarados, componentes que consultan su propio árbol shadow y árboles shadow construidos fuera del constructor. Las infracciones conocidas quedan fijadas en un archivo de referencia, así que no se puede añadir una nueva ni deshacer una corrección en silencio.

Esa verificación cubre la biblioteca, no tu aplicación, pero los fallos que atrapa (un respaldo que nombra un token inexistente; un color que solo funciona en modo claro) son exactamente los que se ven bien en una revisión, así que vale la pena aplicar las mismas reglas a tu propio CSS.

## Lista antes de publicar interfaz

- [ ] La tarea principal y la acción principal son inconfundibles.
- [ ] Funciona en **claro y oscuro**, con anchos **estrechos y amplios**.
- [ ] Funciona con **ratón y dedo**; todo disparador por hover tiene alternativa táctil.
- [ ] Todos los estados probados: hover, activo, foco, deshabilitado, cargando, vacío, error.
- [ ] Teclado y foco verificados; el foco se ve en todas partes.
- [ ] Casos límite: textos largos, números grandes, ambos idiomas.
- [ ] Espacios de la escala, tipografía por rol, color de tokens semánticos.
- [ ] Ninguna propiedad de la paleta en una `transition`; ningún `transition: all`.
- [ ] El texto nombra el objeto; nada señala un estado solo con color.
