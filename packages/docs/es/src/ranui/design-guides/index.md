---
description: 'Cómo aplicar ranui en una pantalla: elige un rol y deja que el token ponga el valor, diseña todos los estados alcanzables y comprueba lo que de verdad se dibujó.'
---

# Pautas de diseño

Cómo aplicar ranui en una pantalla real: elige un rol y un estado, y deja que los tokens pongan los valores.

Las reglas en sí viven en dos sitios, y esta página enlaza a ellos en vez de repetirlas: la
[guía de diseño](/src/design/guide) para el método que vale en cualquier producto, y el
[adaptador de implementación de ranui](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/adapters/DESIGN.md)
para los tokens, niveles y reglas de componentes de ranui. Ambos se distribuyen en `node_modules/ranui/docs/DESIGN.md`. El
[sistema de diseño](/es/src/ranui/design-system/) lista cada token y su valor, la
[tematización](/es/src/ranui/theme/) cubre las sobrescrituras en tiempo de ejecución y la
[arquitectura de información](/es/src/ranui/information-architecture/) cubre la estructura de la página.

> **Úsalas cuando** elijas color, espacio, tipografía, profundidad o movimiento para una pantalla hecha con elementos `<r-*>`.

## Principios

1. **Claridad antes que personalidad.** Lo primero es que la tarea principal y la acción principal sean inconfundibles.
2. **Reutiliza los controles existentes.** `r-button`, `r-input`, `r-select` y `r-modal` ya traen el comportamiento de formulario,
   teclado y accesibilidad; cámbiales el estilo en vez de reconstruirlos.
3. **Decide por rol y por estado.** «¿Qué es este texto?» tiene respuesta; «¿qué tamaño se ve bien?» no
   la tiene. El token del rol pone el valor, y ese valor sigue al tema.
4. **Diseña todos los estados alcanzables y mira el resultado.** El estado normal es uno de ocho, y una
   sombra que nadie ve solo se descubre en un navegador.

Son puntos de partida. Apártate de uno cuando la pantalla gane con ello, y explica por qué.

## Elegir un color

La [escalera](/es/src/ranui/design-system/#the-ladder) ya decide cómo se ven el hover y el estado activo;
tu trabajo es nombrar el rol.

| El elemento es…                          | Usa                                                            |
| ---------------------------------------- | -------------------------------------------------------------- |
| El fondo de una página o superficie      | `--ran-color-bg` / `-bg-subtle` / `-bg-elevated` / `-bg-muted` |
| Algo bajo el puntero o siendo pulsado    | `--ran-color-bg-hover` / `-bg-active`                          |
| Texto                                    | `--ran-color-text` / `-text-secondary` / `-text-disabled`      |
| Un borde                                 | `--ran-color-border` / `-hover` / `-active`                    |
| La acción para la que existe la pantalla | `--ran-color-primary` (con `--ran-color-primary-text` encima)  |
| Un estado                                | `--ran-color-success` / `-warning` / `-danger`                 |
| Un enlace                                | `--ran-color-link`                                             |

**Cada acento tiene un solo significado.** El primario es monocromo, así que el azul queda para los enlaces y el
anillo de foco; el verde es éxito, el ámbar advertencia y el rojo peligro. Usar rojo para resaltar te deja
sin nada con qué decir «peligro» más adelante.

Un hexadecimal crudo, un valor de reserva que no cambia con el tema o uno que nombra un token que no
existe se rompe sin avisar en modo oscuro o anula la declaración entera; las
[reglas de color](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md#ranui-color) del adaptador
explican cada caso, y `verify:design` los detecta en el código fuente de ranui.

## Espacio y ritmo

Toma los espacios de la [escala de 4px](/es/src/ranui/design-system/#spacing) y deja que la distancia signifique algo:

- **8px** entre elementos dentro de un grupo.
- **16px** entre grupos.
- **24–32px** entre regiones.

Un espacio menor significa una relación más estrecha, así que basta un espacio fuera de la escala para romper el ritmo. Da a cada
espacio un único responsable: cuenta el margen del hijo y el relleno del padre antes de añadir un tercer espacio entre
ellos.

## Elegir la tipografía

Pregunta qué **rol** cumple el texto (título, etiqueta, cuerpo, botón, monoespaciado); la fuente, el tamaño, el grosor y la
altura de línea salen de la [escala tipográfica](/es/src/ranui/design-system/#typography). Un texto de verdad excepcional,
como el aviso de un gesto sobre un vídeo, queda mejor con su propio token de componente que forzado al
rol más cercano.

## Profundidad: sombra y apilamiento

Elige el nivel de sombra según lo que es el elemento: una superficie dentro del flujo, una capa flotante o un diálogo
que bloquea. Una capa que cae al nivel de las tarjetas parece clavada a la página.

**Incrustar capas de ranui en tu propio marco.** La [escalera de z-index](/es/src/ranui/design-system/#stacking)
empieza en 1000, así que una capa portalizada supera por sí sola el marco habitual de la página. Una capa con `position: fixed`
que se queda dentro de su propio shadow DOM (el diálogo de `r-modal`) solo escapa hasta su
**contexto de apilamiento** ancestro más cercano. Si envuelves el contenido incrustado en algo que cree uno
(`isolation`, `opacity < 1`, `transform`, `filter`, `will-change`), sube ese envoltorio solo mientras una
capa esté realmente abierta:

```css
.embed {
  isolation: isolate; /* cheap: no z-index of its own, so nothing is promoted */
}
/* Escalate only while a real overlay is open — never "just in case" */
.embed:has(r-modal[open]),
.embed:has(r-modal[closing]) {
  position: relative;
  z-index: 100;
}
```

Un `z-index` permanente en el envoltorio sube todo lo que contiene, contenido estático incluido, por encima de tu
cabecera fija durante todo el desplazamiento; este sitio llegó a publicarse así una vez. Coincide con `closing` además
de con `open`: la máscara sigue pintándose durante su transición de cierre.

## Movimiento {#motion}

La respuesta frecuente (hover, foco, pulsación) es inmediata. Cuando el movimiento explica un cambio, la respuesta se queda
en 0–100ms, la entrada dura 250–400ms y desacelera, y la salida dura 150–200ms y acelera.
Permite interrumpirlo y respeta `prefers-reduced-motion`.

**Nunca dejes que una propiedad de color haga transición.** El CSS no puede saber _por qué_ cambió un color, así que una `transition`
sobre `background-color`, `color`, `border-color`, `box-shadow`, `fill` o `stroke` también se dispara cuando cambia el
**tema**: cada elemento se funde a su propio ritmo cuando la página ya ha cambiado. Anima
`transform` y `opacity` en su lugar. `transition: all` y un `transition: 0.2s` pelado también incluyen el color.

## Estados y textos

Todo estado alcanzable forma parte del diseño: hover, activo, foco, deshabilitado, cargando, vacío, error.
El hover corresponde a `bg-hover` / `border-hover`, el activo a `bg-active` y el foco al anillo de foco. Nada que no
se pulse debe parecer pulsable: `r-card` solo reacciona al hover con `hoverable`.

El texto también es parte del sistema:

- **Los botones** nombran el resultado, con el objeto cuando el contexto no lo aporta: «Eliminar miembro». Un
  diálogo con el objeto claro puede decir «Eliminar»; evita un «Aceptar» genérico.
- **Los errores** dicen qué pasó y luego cómo arreglarlo. ✅ «La compilación falló: el paquete supera el límite de
  tamaño. Redúcelo o sube el límite.» ❌ «La operación falló, inténtalo de nuevo.»
- **Las confirmaciones** describen el cambio, no el éxito, y aparecen solo cuando está confirmado.
  ✅ «Proyecto eliminado» ❌ «Operación exitosa».
- Deja que el contexto quite lo redundante: un diálogo titulado «Eliminar proyecto» no necesita un botón que diga
  «Eliminar el proyecto permanentemente, para siempre».

## Accesibilidad {#accessibility}

- Cumple el contraste **WCAG AA** del texto contra su fondo.
- **Nunca señales un estado solo con color**: acompáñalo de un icono, una etiqueta o texto.
- Todo elemento interactivo conserva un **anillo de foco visible** (`--ran-focus-ring`, o
  `outline: 2px solid var(--ran-color-focus); outline-offset: 2px`).
- **Todo se alcanza con el teclado.**
- Respeta `prefers-reduced-motion` y `prefers-color-scheme`.

## Ratón y dedo, estrecho y ancho

Ni la forma de apuntar ni el tamaño de la ventana son el objetivo secundario.

- Los arrastres, deslizadores y gestos usan **Pointer Events**, con `touch-action: none` en la superficie exacta de
  arrastre. Un `touch-action: none` sin ningún manejador de puntero detrás es un control roto.
- **Lo que solo aparece con hover necesita una alternativa táctil.** `trigger="hover"` en `r-select` o `r-popover`
  se convierte en un clic en dispositivos táctiles; todo lo que construyas debería hacer lo mismo.
- Prefiere **tamaños relativos al viewport** (`min(560px, calc(100vw - 32px))`, `clamp()`) a inventar un
  punto de corte: ranui no tiene token de punto de corte, así que cada punto de corte fijo es un número que alguien mantiene.
- **Nunca ocultes en móvil la única forma de hacer algo.** Reorganízalo en su lugar.
- **Una posición medida solo es correcta hasta el siguiente reflujo.** Todo lo que se derive de
  `getBoundingClientRect()` queda obsoleto al redimensionar, cuando el contenedor se reorganiza y, en un panel portalizado, al
  desplazarse. Cargar con un ancho estrecho no prueba _redimensionar hasta_ ese ancho, que es donde esto se rompe.

## Lo que la biblioteca comprueba de forma mecánica

`pnpm -F ranui verify:design` comprueba nueve reglas en el código fuente de ranui: valores de reserva de color que no
cambian con el tema, literales de color crudos, las escalas de espacio y de tamaño, arrastres solo para ratón, reglas de `:host` que rompen
`hidden`, valores de reserva que nombran tokens no declarados, componentes que buscan en su propio árbol shadow y árboles shadow
construidos fuera del constructor. Una línea que rompe una regla a propósito lo indica con
`design-ok: <rule> <reason>`. Las comprobaciones solo cubren las raíces de código configuradas; una aplicación que
usa ranui ejecuta sus propias comprobaciones y revisa sus propias páginas.

## Ejemplos de diseño {#design-examples}

<DesignIllustrations />

## Evidencia y aceptación {#evidence-and-acceptance}

El apartado [verificar un cambio](/src/design/guide#verifying-a-change) de la guía dice qué comprobar en un navegador
real y qué informar: lo que observaste, lo que solo dedujiste y lo que no pudiste comprobar.
La revisión de un agente no es la aceptación del usuario.
