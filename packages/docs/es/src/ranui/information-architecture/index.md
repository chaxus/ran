---
description: 'Cómo dar forma a una página de alta densidad antes de elegir el primer token: las tres preguntas que fijan la página, el esqueleto que responde a la principal y dónde va cada tipo de información.'
---

# Arquitectura de información

Qué **forma** toma una página. Se decide antes que cualquier color o espacio.

Las demás páginas de esta sección responden preguntas sobre las piezas. Esta responde la que
viene antes: con todo lo que la pantalla tiene que sostener, ¿a qué vino quien la abre y qué
disposición le permite hacerlo?

| Página                                                    | Responde                                        |
| ---------------------------------------------------------- | ------------------------------------------------ |
| **Arquitectura de información** (esta página)             | _Qué forma_ debe tomar la página                |
| [Sistema de diseño](/es/src/ranui/design-system/)         | _Qué_ son los tokens: el vocabulario            |
| [Pautas de diseño](/es/src/ranui/design-guides/)          | _Cómo elegir_ entre ellos al construir una pantalla |
| [Temas](/es/src/ranui/theme/)                             | _Cómo cambiarlos y sobrescribirlos_ en tiempo de ejecución |

> **Úsalo cuando** empieces una pantalla que debe sostener varios objetos, varios estados y
> las relaciones entre ellos: una consola, un panel, un backoffice, un puesto de trabajo, una
> página de monitoreo. No una landing ni un formulario de conversión única, que se ganan o se
> pierden por persuasión y no por si alguien puede juzgar bien entre información densa.

Tener todos los datos no es tener la página diseñada. Una pantalla puede mostrar cada campo
que devuelve la API, con filtros, etiquetas de estado y acciones masivas, y aun así dejar a
quien la lee sin saber qué mirar primero. No falta información: falta el orden.

## Tres preguntas antes de cualquier componente {#three-questions}

1. **¿Qué es lo único que debe verse al llegar?** Esa es la información principal de la
   página.
2. **¿Qué más tiene que estar visible para entenderla?** Los recursos relacionados, los
   modelos relacionados, el contexto.
3. **¿Qué hará después?** Juzgar algo, actuar sobre algo o seguir pensando en algo.

Responde las tres antes de abrir la lista de componentes. Una página con esas tres respuestas
claras rara vez elige mal la forma; una que las saltea termina organizada alrededor de la
respuesta de la API.

**Una página, un modelo principal.** Los modelos de apoyo pueden ayudar a entender o a operar
el principal. No pueden disputarle la primera pantalla.

## La forma sigue a la tarea, no al payload {#shape}

Dos atajos producen casi todas las páginas mal formadas:

- El endpoint devolvió un array, así que se volvió una tabla.
- La ruta lleva un ID, así que se volvió una página de detalle.

Ninguno es una razón. El mismo objeto toma otra forma bajo otra tarea: un issue es una
**colección** mientras buscas, un **flujo de estados** mientras lo trabajas, un **hilo de
discusión** mientras colaboras y una **secuencia de eventos** mientras auditas. Que un
registro tenga fecha dice que hay una fecha en los datos. No dice que la página sea un
calendario.

## Cómo elegir el esqueleto {#skeletons}

Elige la disposición que responde la pregunta principal con menos conversiones mentales.

| La pregunta que tiene delante                          | Qué debe quedar junto                                | Esqueleto                  |
| -------------------------------------------------------- | ----------------------------------------------------- | --------------------------- |
| ¿En qué se diferencian estos?                          | Los campos comparados, en columnas fijas             | Tabla de comparación       |
| ¿Cuál es, para poder abrirlo?                          | Nombre, identificador, estado                        | Lista / catálogo de recursos |
| ¿Cuál es, si la imagen me lo dice?                     | Primero la imagen, alrededor el nombre y los campos  | Rejilla de tarjetas        |
| ¿Qué es este objeto y cómo está ahora?                 | Identidad, estado, acción principal y luego atributos | Detalle por secciones      |
| ¿A qué pertenece?                                      | Ruta, padre, hermanos                                | Árbol jerárquico           |
| ¿Qué depende de esto y qué se rompe si cambia?         | Aguas arriba y aguas abajo, radio de impacto         | Lista de adyacencia        |
| ¿En qué paso voy y qué sigue?                          | Etapa, entrada actual, los pasos posteriores         | Flujo por pasos            |
| ¿En qué etapa está cada ítem, si moverlo _es_ el trabajo | La etapa como columna, identidad y bloqueos en la tarjeta | Kanban                     |
| ¿Por qué se detuvo?                                    | Resumen de etapa, luego resultado por paso, luego el log crudo | Traza con profundización   |
| ¿Está sano y hasta dónde llega el daño?                | Nombre del objeto, estado y el evento que lo cambió  | Muro de estado             |
| ¿Qué pasó, en qué orden y por obra de quién?           | Momento, actor, tipo de evento                       | Línea de tiempo de eventos |
| ¿Quién dijo qué y cómo se respondió?                   | Autor, mensaje, estructura de respuestas             | Hilo de discusión          |
| ¿Qué cambió, antes contra después?                     | Las dos versiones, lado a lado                       | Vista de diferencias       |
| ¿Cuál es la tendencia y dónde está la anomalía?        | La métrica, su línea base, la entrada al detalle     | Panel de indicadores       |
| ¿Cuándo está ocupado y cuándo choca?                   | Inicio, fin y duración sobre un mismo eje            | Calendario / agenda        |
| ¿Qué atiendo a continuación?                           | La cola de un lado, el ítem del otro                 | Banco de trabajo maestro-detalle |
| ¿Qué reglas aplican y qué afectan?                     | El ajuste, su alcance, su consecuencia               | Formulario de configuración |
| ¿Qué dice este texto?                                  | El cuerpo en orden, con un índice al lado            | Documento continuo         |
| ¿Dónde está?                                           | Posición, límites, distribución                      | Mapa / lienzo              |

### Pares que se confunden {#swapped-pairs}

- **Línea de tiempo o pasos.** La línea de tiempo cuenta lo que ya ocurrió, en orden. Los
  pasos dicen dónde estás y qué viene. Se parecen y apuntan en direcciones opuestas del tiempo.
- **Kanban o filtro.** El kanban corresponde cuando mover una tarjeta _es_ la acción. Si las
  columnas son condiciones de filtrado guardadas, construiste un filtro que cuesta un arrastre.
- **Calendario o línea de tiempo.** El calendario responde ocupación y choque; la línea de
  tiempo responde orden. La fecha del registro no elige entre ambos; la pregunta sí.
- **Rejilla de tarjetas o tabla.** O la imagen es el ancla de reconocimiento o no lo es. Si la
  elección se hace comparando números, una miniatura en la primera columna entierra los campos
  que deciden.
- **Grafo o lista de adyacencia.** Dibuja el grafo solo cuando el camino o la propagación sean
  el juicio en sí. Si no, una lista agrupada de aguas arriba y aguas abajo se lee más rápido.
- **Documento o cuadrícula de campos.** La prosa que se lee en orden sigue siendo prosa.
  Trocear cada párrafo en una tarjeta o en un par clave-valor destruye lo que la hacía legible.

No construyas las tres vistas porque puedes. Cada vista extra es otro juego de filtros, otro
mapeo de estados y otro conjunto de acciones que mantener en sincronía. Agrega la segunda
cuando el segundo uso sea realmente frecuente, no por si acaso.

## Dónde va cada tipo de información {#placement}

| Información        | Responde                       | Va en                                                              | No debe terminar en                             |
| ------------------- | ------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------ |
| **Identidad**      | ¿Qué es esto?                  | Título, resumen del objeto                                         | La última columna o detrás de una pestaña       |
| **Estado**         | ¿Cómo está ahora?              | Zona de título o de resumen                                        | Solo localizable en un campo de detalle         |
| **Atributos**      | ¿Cómo es?                      | Cuerpo del detalle, agrupado como lo piensa la gente               | Aplanado en el orden de los campos de la API    |
| **Relaciones**     | ¿Con qué se conecta?           | Su propia zona o pestaña, con pertenencia, dependencia y referencia distinguidas | Mezclado en la tabla de atributos               |
| **Cambios**        | ¿Qué difiere de antes?         | Zona de diferencias, línea de tiempo                               | Mostrado solo como el valor nuevo               |
| **Evidencia**      | ¿Por qué ese juicio es seguro? | Junto al juicio, desplegable                                       | Una página de logs en otra parte                |
| **Acciones**       | ¿Qué puedo hacer ahora?        | La principal en la zona de título, el resto junto a su objeto      | Enterradas bajo «más»                           |
| **Retroalimentación** | ¿Qué hizo eso?                 | Junto a la acción, conservando el contexto de la tarea             | Un aviso global desligado de aquello que trata  |

**Cada dato tiene exactamente un lugar autoritativo.** En los demás va un resumen o una
entrada que enlaza de vuelta.

## Orden de lectura {#reading-order}

```text
Identidad de la página
→ estado actual o excepción
→ tarea principal y acción principal
→ la información que el juicio necesita
→ relaciones, cambios, evidencia
→ información secundaria y acciones poco frecuentes
```

- **Un solo encabezado principal visual por página.** Los encabezados de sección avanzan por
  semántica, no por un tamaño de fuente que finge jerarquía.
- **Como mucho una acción principal por zona de tarea.** El botón principal es el siguiente
  paso más probable, no el más destructivo. Lo peligroso lleva semántica de peligro, no el
  mayor peso visual.
- El color de aviso y de peligro es para estados que de verdad requieren atención. Una página
  toda en verde ya gastó su señal.
- Insignias, etiquetas y banners comparten un mismo presupuesto de atención. Destaca solo lo
  que cambiaría una decisión.

## Densidad {#density}

La densidad no es cuántos controles caben por centímetro cuadrado, sino cuánta información
_utilizable_ se lleva alguien en una mirada. Apretar el espaciado sube la densidad visual y
deja la efectiva donde estaba; quitar campos irrelevantes y poner la comparación en un solo
sitio sube la de verdad.

| Nivel         | Dónde corresponde                                   | Qué compra                                                       |
| -------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| **Holgada**   | Primer uso, configuración poco frecuente, confirmación de riesgo | Espacio para explicar, grupos más separados, vista previa del impacto |
| **Estándar**  | La mayoría de listas, detalles y formularios         | El equilibrio por defecto entre escaneo e información por pantalla |
| **Compacta**  | Puestos de trabajo expertos: monitoreo, operación, auditoría | Anchos de columna estables, textos cortos, eficiencia de teclado, vistas guardadas |

- Usa **como mucho dos niveles contiguos** en una página. Una tabla compacta dentro de una
  página estándar está bien; que cada zona invente su propia escala, no.
- Compacto no es «encoger el texto y las zonas de toque a la vez». El relleno del contenedor y
  la altura de línea pueden ajustarse; la legibilidad del cuerpo, el anillo de foco visible y
  el tamaño del objetivo puntero, no.
- Para usuarios expertos, la gestión de columnas, las vistas guardadas, las acciones masivas y
  los atajos rinden más que mostrar más de una vez.

## Mantener el contexto de la tarea {#context}

Con el esqueleto elegido, decide dónde vive el contenido de apoyo:

| Quien lee está…                                        | Dale                                                             |
| -------------------------------------------------------- | ----------------------------------------------------------------- |
| Alternando entre objetos o evidencias una y otra vez    | Una división maestro-detalle: la cola a un lado, el ítem al otro  |
| Echando un vistazo a algo ligero y pasajero             | Una fila desplegable (`r-disclosure-row`) o un popover (`r-popover`) |
| Trabajando en algo compartible o que necesita espacio   | Su propia ruta                                                    |
| Confirmando, o escribiendo un solo campo                | Un modal (`r-modal`)                                              |

**Un modal no es una capa de navegación.** Todo lo que necesite un enlace copiable, historial,
una comparación lado a lado o trabajo que sobreviva a una recarga, lleva ruta.

## Qué aporta ranui en esta capa {#with-ranui}

ranui es deliberadamente neutral sobre la forma de la página: entrega primitivas y tokens, no
plantillas. Lo que sí te da aquí:

- `r-section` para las bandas en que se divide un esqueleto y `r-card` para una entrada
  repetida genuinamente independiente. Nunca una tarjeta dentro de otra; agrupa campos de
  formulario con un encabezado o un separador.
- `r-tabs` para **vistas pares de un mismo objeto** (su conversación, sus verificaciones, su
  diff), nunca para módulos sin relación: de eso se encarga la navegación.
- `r-disclosure-row` para la divulgación progresiva, `r-popover` y `r-dropdown` para contexto
  pasajero, y `r-modal` solo para lo que la tabla anterior le permite.
- `r-state-dot` para el estado, siempre con su etiqueta:
  [nunca solo color](/es/src/ranui/design-guides/#accessibility).
- `r-skeleton` mientras carga la primera pantalla, `r-progress` para lo bastante largo como
  para hacer dudar a alguien, `r-message` para el resultado.

En ranui **no hay tabla, árbol, calendario, kanban ni línea de tiempo**. Cuando construyas
una, hazlo sobre [los tokens](/es/src/ranui/design-system/) y las
[pautas de diseño](/es/src/ranui/design-guides/) en lugar de levantar un segundo sistema
visual: el espaciado de la escala, la tipografía por rol, el color de los tokens semánticos y
todos los estados alcanzables diseñados.

## Antipatrones {#anti-patterns}

- Cada campo que devuelve el endpoint se convierte en una fila de detalle, así que identidad,
  estado, relaciones y evidencia llegan con el mismo peso.
- Jerarquía fabricada con tarjetas, color y espaciado decorativo, sin decir nada sobre qué
  leer primero.
- Varias acciones compartiendo el estilo principal, o una acción poco frecuente instalada en
  la zona de título.
- Estado, atributos, relaciones y cambios mezclados en una tabla, de modo que no se puede
  formar ninguna comparación.
- Un grafo de relaciones cuando solo se quería consultar un nombre y un estado.
- Un modal cargando un flujo largo, una comparación o algo cuyo enlace alguien querrá enviar.
- La misma frase repetida en el título, el resumen, la pestaña y la tabla, sin aportar nada
  nuevo en ninguno.

## Lista de verificación antes de publicar una página

- [ ] La información principal, la de apoyo y la siguiente acción están escritas.
- [ ] El esqueleto se eligió desde la pregunta, no desde la forma de la respuesta.
- [ ] La página tiene un modelo principal y las vistas de apoyo lo sirven en vez de competir.
- [ ] Sin leer la especificación, el objeto, su estado y la acción principal se entienden en
      cinco segundos.
- [ ] La comparación ocurre en un solo sitio; nada obliga a recordar algo entre pestañas o
      páginas.
- [ ] Cada dato tiene un lugar autoritativo y los demás enlazan a él.
- [ ] La densidad corresponde a la frecuencia de uso y no aparecen más de dos niveles contiguos.
- [ ] Textos largos, números grandes y un viewport angosto no rompen el orden de la información.
- [ ] Se eliminó todo bloque, campo, etiqueta y botón que no ayuda a juzgar.
