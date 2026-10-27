<!-- source: 59d6fe1249b0ecc5391f8f7b84c17470a00a3023 -->

# Ran Design

Métodos de diseño para el producto anfitrión y su tecnología actual. Lee solo las secciones relevantes a
través del [índice de tareas](./INTERFACE_GUIDE.md). Los tokens de una biblioteca y la mecánica de su API
corresponden a su adaptador de implementación, no a este método portable.

Cada regla lleva un ID y un nivel. Romper una **MUST** es un defecto, y la regla nombra su prueba;
**SHOULD** es lo predeterminado, y quien se desvía explica el motivo en ese caso; **MAY** es opcional.
El [índice de reglas](./RULES.md) recoge todas las reglas graduadas con su prueba.

## 1. Color: una escalera de estados, no una paleta

- **D-COLOR-1 · SHOULD** Elige roles semánticos para el contenido, las superficies, los límites, las acciones y el estado.
- **D-COLOR-2 · SHOULD** Define a la vez los estados predeterminado, hover, activo, deshabilitado y de foco.
- **D-COLOR-3 · SHOULD** Resuelve los valores claros y oscuros a través de los tokens autorizados del anfitrión, y comprueba
  el contraste en la composición real.

Los acentos de marca dependen del contexto.

## 2. Espaciado: una escala limitada y con ritmo

- **D-SPACE-1 · SHOULD** Usa la escala de espaciado que ya tiene el anfitrión.
- **D-SPACE-2 · SHOULD** Usa separaciones estrechas para agrupar partes relacionadas y separaciones mayores para separar tareas o
  regiones.
- **D-SPACE-3 · SHOULD** Fija el relleno interior antes que las separaciones exteriores.
- **D-SPACE-4 · SHOULD** No copies las dimensiones de un producto de referencia sin evaluar el contenido, la densidad
  y el método de entrada.

## 3. Tipografía: elige un rol, no un tamaño

- **D-TYPE-1 · SHOULD** Elige roles de título, etiqueta, cuerpo, acción y código con tamaño, grosor y
  altura de línea coherentes, y mantén una sola fuente de verdad para cada rol.
- **D-TYPE-2 · SHOULD** Comprueba los sistemas de escritura reales, las métricas de las fuentes de respaldo y el contenido largo.
- **D-TYPE-3 · SHOULD** Establece la jerarquía con la tipografía antes de recurrir a contenedores decorativos.

## 4. Radio y elevación

- **D-ELEV-1 · SHOULD** Coordina los radios de esquina anidados con su margen interior real: radio interior = radio exterior −
  margen interior. Cuando el resultado es de 2px o menos, las formas ya no se leen como concéntricas; dale a la forma
  interior el radio de su propio rol, o ninguno.

Una tarjeta de 16px con 8px de relleno le da a su panel interior un radio de 8px. La misma tarjeta con 16px de relleno
no deja nada que heredar, así que el panel toma el radio que use su propio rol.

- **D-ELEV-2 · SHOULD** Usa la elevación para explicar una capa flotante, no la importancia, mediante los roles de
  apilamiento del anfitrión, y comprueba las superposiciones frente al marco de la interfaz que las rodea.

## 5. Movimiento: mejor ninguno

Los tiempos de abajo son una heurística de partida.

- **D-MOTION-1 · SHOULD** Usa los tokens de movimiento del sistema anfitrión y comprueba la frecuencia, la continuidad y el
  movimiento reducido en la tarea real.

| Duración | Uso                                                                              |
| -------- | -------------------------------------------------------------------------------- |
| 0ms      | Respuesta frecuente a hover, foco y teclado; cambios que ya se entienden         |
| ~150ms   | Movimiento pequeño, opcional y con propósito, no un retardo obligatorio en hover |
| ~200ms   | Movimiento de menú/popover cuando aclara el cambio de capa                       |
| ~300ms   | Movimiento de diálogo cuando ayuda a orientarse                                  |

**Principio:** el propósito y la frecuencia deciden si el movimiento se gana su tiempo.

- **D-MOTION-2 · SHOULD** Por defecto, da respuesta inmediata a la interacción repetida; un cambio mayor no es
  automáticamente un motivo para animar.
- **D-MOTION-3 · SHOULD** Usa los tokens existentes para el movimiento con propósito y mantenlo rápido e interrumpible.
  El movimiento reducido se gradúa en D-MOTION-10 y D-ACCESS-5.

### Contrato del movimiento funcional

- **D-MOTION-4 · SHOULD** Especifica el disparador, el cambio de estado y el destino antes de elegir un efecto.
- **D-MOTION-5 · MUST** El movimiento conserva el contenido no relacionado, los borradores y la posición de lectura. _Proof: recording_
- **D-MOTION-6 · SHOULD** Da a los componentes hermanos con el mismo significado de interacción un lenguaje de movimiento
  común; la coherencia no exige que todos los componentes se animen.
- **D-MOTION-7 · MUST** Cuando se usa movimiento, una nueva intención puede interrumpirlo o invertirlo desde la presentación
  actual, sin saltos, finalizaciones obsoletas ni activaciones duplicadas. _Proof: recording_
- **D-MOTION-8 · MUST** La respuesta sigue siendo inmediata; la animación no bloquea la entrada. _Proof: recording_
- **D-MOTION-9 · SHOULD** Al insertar o retirar elementos, evita comprimir el texto a la vista o hacer pasar controles que salen
  por encima de acciones activas; coordina la opacidad y el diseño para que el resultado siga siendo legible.
- **D-MOTION-10 · MUST** El movimiento reducido conserva un estado final visible y comprensible. _Proof: browser_
- **D-MOTION-11 · MAY** Usa un muelle (spring); no hace falta que se pase de largo.

Consulta la [investigación opcional sobre oficio de componentes](./REFERENCE_RESEARCH.md#component-craft-设计垂点--wxaddesign)
para ver ejemplos y límites, y la [validación temporal](./ACCEPTANCE.md#review-motion-over-time) para la prueba.

- **D-MOTION-12 · SHOULD** Deja que las paletas del tema se asienten de forma coherente. Evita los fundidos implícitos de paleta o
  `transition: all`; actívalos explícitamente solo donde el anfitrión pretenda y compruebe un efecto coordinado.
- **D-MOTION-13 · MUST** Los valores factuales y el contenido legible se muestran de inmediato al volver a una superficie de
  trabajo, sin contadores animados. _Proof: browser_
- **D-MOTION-16 · SHOULD** No repitas entradas decorativas de títulos cada vez que se vuelve a una superficie de trabajo.
- **D-MOTION-17 · SHOULD** Elige el movimiento de entrada según lo que contiene una región, a partir de la tabla de abajo. Escalona
  en orden de lectura dentro de una región, no a lo largo de la página.

| La región contiene                                                     | Entrada                                                                                             | Después                                                                     |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Texto, títulos, valores, formularios, navegación, llamadas a la acción | Ninguna: presente en el primer pintado (D-MOTION-13)                                                | Ninguno                                                                     |
| Un elemento visual decorativo junto al texto: iconos, diagrama, boceto | Solo transformación, una vez, la primera vez que entra en la vista; ninguna si es visible al cargar | Puede repetirse un bucle explicativo mientras esté en pantalla (D-CRAFT-19) |
| Una maqueta de producto o una demo en vivo                             | Ninguna para su contenido; una demostración de carga puede moverse (D-MOTION-14)                    | Lo dirige la propia interacción del lector                                  |
| Un indicador de estado                                                 | Ninguna                                                                                             | Un pulso solo mientras la actividad está en curso (D-MOTION-15)             |

Con movimiento reducido, todas las regiones empiezan en su estado final (D-MOTION-10).

- **D-MOTION-14 · MAY** Una demostración de carga puede moverse para mostrar que está cargando.
- **D-MOTION-15 · MUST** Un pulso de estado aparece solo mientras la actividad está en curso. _Proof: review_

## 6. Contenido: el texto forma parte del sistema

- **D-COPY-1 · SHOULD** Los botones nombran el resultado. Incluye el objeto cuando el contexto no lo deja claro:
  «Desplegar proyecto», «Eliminar miembro». En un objeto o diálogo bien identificado, «Guardar» o «Eliminar» basta;
  evita el genérico «Aceptar». Consulta [la redacción en contexto](#words-are-part-of-the-interface).
- **D-COPY-2 · SHOULD** Los errores dicen **qué ha pasado** y luego **cómo arreglarlo**. ✅ «La compilación ha fallado: el paquete
  supera el límite de tamaño. Redúcelo o sube el límite.» ❌ «La operación ha fallado; inténtalo de nuevo.»
- **D-COPY-3 · SHOULD** Las confirmaciones y los toasts indican el **cambio** completado. ✅ «Proyecto eliminado».
  ❌ «Operación realizada con éxito».
- **D-COPY-4 · MUST** Muestra la confirmación de finalización solo después de que la operación esté confirmada. _Proof: unit, browser_
- **D-COPY-5 · SHOULD** Sé concreto; cada frase elimina conjeturas en lugar de añadirlas.

## 7. Accesibilidad: el sistema sirve a todo el mundo

- **D-ACCESS-1 · MUST** El texto mantiene un contraste suficiente con su fondo (**WCAG AA**). _Proof: browser_
- **D-ACCESS-2 · MUST** Nunca indiques un estado solo con el color; acompáñalo de un icono o texto (por ejemplo, etiquetas ✓ / ✕,
  no solo verde/rojo). _Proof: review_
- **D-ACCESS-3 · MUST** Todo elemento interactivo tiene un **anillo de foco visible** adecuado a su superficie;
  nunca lo quites por «limpieza». _Proof: browser_
- **D-ACCESS-4 · MUST** **Navegación completa por teclado**: nada funciona solo con ratón. _Proof: browser_
- **D-ACCESS-5 · MUST** Respeta `prefers-reduced-motion`. _Proof: browser_
- **D-ACCESS-6 · MUST** Cuando el anfitrión admite ambos esquemas, el renderizado inicial sigue
  `prefers-color-scheme`. _Proof: browser_

## 8. Entrada y viewport: móvil y escritorio, ambos

- **D-INPUT-1 · MUST** Admite ratón, teclado y táctil en anchos estrechos y anchos. _Proof: browser_
- **D-INPUT-2 · MUST** Recoloca los controles en lugar de ocultar la única vía hacia una acción. _Proof: browser_
- **D-INPUT-3 · MUST** Una affordance de hover tiene una alternativa de clic/toque. _Proof: browser_
- **D-INPUT-4 · MUST** Los arrastres usan Pointer Events, incluida la cancelación. _Proof: browser_
- **D-INPUT-5 · MUST** Limita `touch-action` a la superficie de arrastre real y acompáñalo de un manejador real;
  el desplazamiento normal sigue funcionando en el resto. _Proof: browser_
- **D-INPUT-6 · SHOULD** Prefiere límites relativos al contenido o al viewport (`min()`, `max()`, `clamp()`) frente a puntos de
  corte arbitrarios.
- **D-INPUT-7 · SHOULD** Usa los puntos de corte que ya tiene el anfitrión, e introduce un rol compartido justificado solo cuando
  surjan necesidades repetidas.

Una posición medida queda obsoleta tras un cambio de tamaño, una recolocación del contenedor o un desplazamiento.

- **D-INPUT-8 · SHOULD** Prueba a redimensionar hasta un diseño estrecho, no solo a cargar ya en él.
- **D-INPUT-9 · MUST** La colocación de una superposición sigue a su disparador mientras está abierta. _Proof: browser_

El anfitrión se encarga de la mecánica del ciclo de vida; [la ingeniería de ranui](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#3-state-and-ownership) es un adaptador de implementación.

- **D-INPUT-10 · SHOULD** Prueba los gestos reales de puntero/táctiles, la alternativa al hover y las rutas de teclado donde
  se vean afectados; comprobar dos esquemas de color no demuestra la paridad de entrada.

## 9. Composición: la página, no el componente

- **D-COMP-1 · SHOULD** Elige primero la estructura de la página según el §10; después compón sus componentes con estas
  reglas.

### Coherencia de estilo entre componentes y páginas

- **D-COMP-2 · SHOULD** Antes de implementar, anota un brief de diseño en la nota de tarea existente o en el responsable de
  diseño del producto. Usa el sistema existente; un arreglo pequeño solo necesita las decisiones afectadas.
  El brief resuelve cada decisión aplicable de la tabla de abajo (D-COMP-2).

«Premium», «moderno» o «como Claude» es una dirección que investigar, no una especificación implementable.

| Decisión               | Qué resuelve el brief                                                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tarea y jerarquía      | El contenido real, la acción principal y el primer foco de lectura; qué puede pasar a segundo plano o desaparecer.                                         |
| Proporción             | Roles tipográficos/alturas de línea, longitud de línea, densidad de controles, grosor de iconos y ejes de alineación con tokens del anfitrión.             |
| Lenguaje de superficie | Qué regiones necesitan contención, relaciones de radio/margen interior anidados, roles semánticos de acento y de elevación.                                |
| Composición de estados | Un estado predeterminado representativo más contenido largo, pendiente/fallo y rutas de entrada estrechas; incluye estados combinados.                     |
| Movimiento             | El cambio de estado que explica, disparador y frecuencia, comportamiento al interrumpir/invertir y resultado con movimiento reducido; «ninguno» es válido. |
| Decisión de referencia | Donde se use una referencia, enlaza su fuente, el principio adoptado y la adaptación que necesita la tarea del anfitrión.                                  |
| Validación             | El resultado observable y las vistas/grabaciones reales que pueden demostrarlo o refutarlo.                                                                |

- **D-COMP-4 · SHOULD** Reutiliza el brief entre componentes hermanos y el marco de la documentación; cambia el énfasis
  según la tarea.

Uniformidad no significa controles del mismo tamaño ni secciones encajonadas en todas partes.

- **D-COMP-5 · SHOULD** Mantén una demo expresiva claramente diferenciada del marco de su documentación.
- **D-COMP-6 · SHOULD** Actualiza el brief antes de cambiar la dirección visual; no reescribas en silencio el
  estándar para justificar una implementación que no superó la revisión.
- **D-COMP-7 · SHOULD** Compara un fotograma compuesto representativo con distinto contenido real antes de
  animarlo, y después inspecciona el cambio de estado y el camino de vuelta a velocidad normal.

Un color compartido no basta para reconciliar proporciones, grosor de iconos, contención o movimiento incoherentes.

- **D-COMP-8 · SHOULD** Cuando un ejemplo parezca importado de otro producto, corrige esa relación en el
  token/componente/estilo que la posee en lugar de añadir un parche específico de la página.
- **D-COMP-9 · SHOULD** Guarda las observaciones de referencias y los límites de validación en el
  [índice de investigación](./REFERENCE_RESEARCH.md#style-coherence-and-transition-research) opcional.

### Estructura antes que contenedores

- **D-BOX-1 · SHOULD** **Recurre al espaciado, la alineación, el grosor y una línea fina antes que a una caja.**

Un contenedor afirma que su contenido es un objeto aparte. La mayoría de las regiones necesitan un fondo, una
línea fina y un espaciado intencionado; nada más.

- **D-BOX-2 · SHOULD** Reserva la caja para **un objeto realmente separado**: el escenario de una demo en vivo, una superposición,
  un panel flotante. No para un bloque de código, una tabla, una fila de lista, un enlace de anterior/siguiente ni una celda
  de una galería.
- **D-BOX-3 · SHOULD** **Evita contenedores anidados redundantes y rellenos duplicados.** Una tarjeta dentro de un panel con
  relleno no necesita otro marco decorativo ni otro margen interior.
- **D-BOX-4 · SHOULD** Conserva los controles o superficies anidados que la función requiere, y coordina sus radios
  con el margen interior real; la contención por sí sola no es motivo para añadir una caja.
- **D-BOX-5 · SHOULD** **Cada límite persistente necesita una función propia.** Empieza por los títulos, la alineación
  y la proximidad para agrupar el contenido. Añade un borde, un relleno de superficie o una elevación solo cuando esa
  estructura deje poco claro un límite real.
- **D-BOX-6 · SHOULD** No repitas la misma agrupación con un marco de panel, una tarjeta anidada, líneas entre filas y
  otro margen interior a la vez.

Las líneas tenues siguen siendo jerarquía añadida; bajar su contraste o acortarlas no hace menos redundante un
cerramiento redundante.

La tabla de abajo aplica D-BOX-5 y D-BOX-8.

- **D-BOX-8 · MUST** Conserva el foco de teclado y las señales de selección persistente; nunca las quites para que el
  diseño en reposo se vea más tranquilo. _Proof: browser_

| Límite                     | Mantenlo cuando comunica                                                               | Quítalo cuando solo repite                                                            |
| -------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Marco de campo/control     | Dónde se pueden introducir valores o hacer una selección                               | Un envoltorio decorativo alrededor de comandos que ya se leen bien                    |
| Marco o divisor de región  | Un viewport independiente, un límite de redimensionado o un cambio de tarea importante | Un título y una separación que ya dejan claro el mismo grupo                          |
| Superficie anidada         | Una capa flotante, vista previa, zona de soltado o límite de interacción distintos     | Otro contenedor dentro de un panel de ajustes ya establecido                          |
| Contorno de foco/selección | El foco de teclado o un estado de selección persistente                                | Mantén esta señal de estado aunque el diseño en reposo parezca más tranquilo sin ella |

- **D-BOX-9 · SHOULD** Revisa el panel o la página entera, no solo el grupo recortado. Para cada contorno, relleno o
  separador estable que quede, nombra la relación o la interacción que comunica y comprueba qué se vuelve
  ambiguo si se elimina.

Un marco es opcional; un control alcanzable y reconocible no lo es.

### El énfasis es un presupuesto

**El color, el grosor, las insignias, los rellenos y la elevación son escasos.** Si todo está enfatizado,
nada se lee como importante.

- **D-COMP-10 · SHOULD** Establece la prioridad primero con la estructura y la proximidad, y gasta el énfasis en lo
  único que lo merece.

**La elevación explica el apilamiento, no la importancia.**

- **D-ELEV-3 · SHOULD** Reserva las sombras para superficies que de verdad flotan sobre el contenido: popovers, menús,
  diálogos, notificaciones. No pongas sombra a cada tarjeta.

### El espaciado tiene significado

La escala del §2 no es solo un ritmo; cada escalón expresa una relación.

Elige el escalón por lo que la separación _significa_ (D-SPACE-2):

| Relación                       | Espaciado relativo                    |
| ------------------------------ | ------------------------------------- |
| Partes de un mismo control     | La separación deliberada más estrecha |
| Controles muy relacionados     | Separación de grupo compacto          |
| Un grupo de contenido          | Ritmo de grupo                        |
| Grupos separados               | Separación mayor                      |
| Límite de una región principal | La separación deliberada más fuerte   |

**Dentro antes que fuera:** el relleno propio de un componente se decide antes que la separación entre
componentes (D-SPACE-3). **Menor separación significa relación más estrecha**: es lo único que comunica el ritmo
vertical.

- **D-SPACE-6 · SHOULD** No deshagas la relación que expresa una separación con un divisor decorativo.

### Ritmo vertical entre vistas hermanas

- **D-SPACE-7 · SHOULD** Repite relaciones, no alturas fijas. Elige las separaciones entre título/descripción, campo/pista,
  grupo y región de la escala del anfitrión según su relación.

Son decisiones de composición, no dimensiones universales de los componentes.

- **D-SPACE-8 · SHOULD** Deja que las traducciones crezcan con naturalidad, y no dejes una fila vacía cuando falta una
  descripción.
- **D-SPACE-9 · SHOULD** Dale a cada separación un único dueño: la pila padre o un margen explícito del hijo. Restablece los
  márgenes locales escritos en títulos/párrafos en lugar de sumarlos a la separación del padre.
- **D-SPACE-10 · SHOULD** Ten en cuenta el relleno propio de los controles, el colapso de márgenes y el espacio de la línea base en línea;
  no lo compenses con transformaciones ni con texto más pequeño.
- **D-SPACE-11 · SHOULD** Coloca las pistas junto al campo o la acción que explican.
- **D-SPACE-12 · MUST** Los textos de ayuda ocultos no dejan separaciones accidentales. _Proof: browser_
- **D-SPACE-16 · SHOULD** Una línea de estado asíncrono reservada tiene un propósito y unos límites declarados.
  Mide ambos ejes cuando el contenido se haya asentado; [ACCEPTANCE](./ACCEPTANCE.md) lo gradúa como V-PROOF-6.

`next.top - previous.bottom` mide la separación entre marcos, no el espacio de los glifos o de la caja de línea.

- **D-SPACE-14 · SHOULD** Mantén separados el interlineado, el relleno y las líneas finas: 16px de relleno más una línea de 1px
  no son un token de espaciado de 17px.
- **D-SPACE-15 · SHOULD** Usa expectativas independientes y prueba el ajuste de línea, el redimensionado, la visibilidad de
  ayudas/errores y la densidad relevante.

[ACCEPTANCE](./ACCEPTANCE.md#browser-proof) se encarga de las comprobaciones de asentamiento y mutación para márgenes duplicados,
filas fantasma y desplazamientos que solo afectan al texto.

### La longitud de línea rige el texto, no la columna

- **D-TYPE-4 · SHOULD** **Elige una longitud de línea legible para el sistema de escritura y la fuente reales.**

Para prosa en alfabeto latino, 60–75 caracteres por línea es una heurística de partida, no un rango universal para
todos los sistemas de escritura.

- **D-TYPE-5 · SHOULD** Revisa texto realista en los anchos, niveles de zoom y fuentes de respaldo admitidos; el texto CJK y
  el que mezcla escrituras necesitan su propio criterio.

[La presentación visual de WCAG](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
también distingue el CJK en su criterio de nivel AAA; no es un valor predeterminado obligatorio de la biblioteca.

- **D-TYPE-6 · SHOULD** Deja que una tabla, un bloque de código, el escenario de una demo o una imagen conserven el ancho que
  necesita su contenido. Limita los elementos de texto, no la columna que los contiene.
- **D-TYPE-7 · SHOULD** **Declara la longitud de línea en `rem`, nunca en `em`.**

`em` se resuelve contra el tamaño de fuente del propio elemento, así que cuanto mayor es el texto, más larga es la línea:
justo al revés.

- **D-TYPE-8 · SHOULD** **Construye la jerarquía con la tipografía antes de echar mano de una caja.**

Un escalón de tamaño y un escalón menos de color convierten un título y su primera frase en un título y una
entradilla, sin contenedor nuevo y sin borde nuevo.

### Si el diseño dice que dos cosas son un solo objeto, el espaciado debe estar de acuerdo

**Un borde compartido, un radio compartido y una separación entre ellos son una contradicción.**

- **D-ALIGN-1 · SHOULD** Decide si los elementos son un objeto o dos, y haz que todas las propiedades digan
  lo mismo.
- **D-ALIGN-2 · SHOULD** **Cuando un valor debe ser igual a otro, ponle nombre.** Una separación que un hijo tiene que
  restar no es un literal en dos sitios; es una propiedad personalizada referenciada dos veces.

### Reserva una columna solo cuando existe su contenido

**Una columna declarada sin condiciones sigue siendo una columna, incluso en las páginas que no tienen nada
que poner en ella.**

- **D-ALIGN-3 · SHOULD** Condiciona la pista a que el elemento esté realmente presente (`:has()`), no a un
  tipo de página que supones que lo implica.

### La alineación es estructura, no pulido

- **D-ALIGN-4 · SHOULD** **Nombra cada eje de alineación y la geometría que alinea.** Indica qué hermanos
  comparten cada uno; incluye cabeceras, texto del cuerpo, filas, acciones y contenido vacío, de carga o de error.

El eje del contenido de la página, la columna de navegación y el eje de etiquetas de un formulario anidado pueden diferir a propósito.

- **D-ALIGN-5 · SHOULD** Un botón de volver más su separación puede establecer una columna de título aparte: no
  trates en silencio ese título como alineado con el texto del cuerpo.
- **D-ALIGN-6 · MUST** La ausencia de un icono o una insignia opcionales nunca saca las etiquetas de su columna declarada.
  _Proof: browser_
- **D-ALIGN-7 · SHOULD** Un nivel anidado vuelve exactamente al eje de su padre cuando termina.
  Compara las cajas correctas. Son mediciones distintas, aunque coincidan; medir la capa del defecto se gradúa en
  [ACCEPTANCE](./ACCEPTANCE.md) como V-PROOF-10.

| Geometría          | Qué medir                                                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Marco              | La caja de borde del envoltorio/host según `getBoundingClientRect()`                                                                        |
| Contenido          | El borde interior tras el borde y el relleno reales, incluidos los envoltorios anidados                                                     |
| Texto              | Un `Range` del DOM alrededor de los nodos de texto de la etiqueta renderizada; usa los rectángulos de la primera/última línea si hay ajuste |
| Viewport del icono | La caja del SVG/viewbox o de la imagen; la tinta del glifo pintado puede ser asimétrica dentro de ella                                      |
| Área activa        | El destino real del evento y su superficie de hover/foco; comprueba puntos cerca de sus bordes                                              |

Que el marco de un botón esté alineado con un párrafo no demuestra que su texto lo esté: el relleno interno puede
mover la etiqueta mientras el marco sigue fijo. `Range` da geometría tipográfica, no la tinta exacta del glifo.

- **D-ALIGN-9 · SHOULD** Inspecciona por separado las correcciones ópticas de glifos.
  En los web components, mide el host, las shadow parts documentadas y el texto en slots mediante los puntos de prueba
  admitidos. V-PROOF-11 en [ACCEPTANCE](./ACCEPTANCE.md) se encarga de esto, incluida la prohibición de consultas al shadow DOM
  en producción y de dar por hecho que el CSS del documento cruza la frontera.
- **D-ALIGN-11 · SHOULD** **Separa el área activa de un comando de cabecera del relleno del diseño.** Un disparador de
  título/menú se ajusta a su contenido más un relleno deliberado, limitado por el ancho disponible. Deja que una pista
  flex/grid aparte absorba el espacio sobrante.
- **D-ALIGN-12 · SHOULD** Define el truncado/ajuste de línea y el comportamiento de las acciones adyacentes con traducciones largas.
- **D-ALIGN-13 · MUST** El área activa del disparador del título no abarca espacio de cabecera sin usar (por ejemplo con
  `flex: 1` en el botón del título) salvo que se aplique D-ALIGN-14. _Proof: browser_
- **D-ALIGN-14 · SHOULD** Una fila que a propósito se selecciona en todo su ancho es un rol distinto; deja constancia
  explícita de ese contrato.
- **D-ALIGN-15 · MAY** Los destinos para punteros gruesos pueden crecer.
- **D-ALIGN-22 · SHOULD** El relleno de hover de un destino ampliado se queda en el contenido propio del control, no se extiende por
  contenido no relacionado.
- **D-ALIGN-16 · SHOULD** **Cuenta cada margen interior desde el ancestro común hasta el texto visible.** El relleno del
  padre, el relleno de paneles anidados, el relleno interno de un control, los bordes y las columnas de navegación
  suman todos.
- **D-ALIGN-17 · SHOULD** Elimina un margen interior redundante en su dueño en lugar de anularlo con un
  margen negativo sin explicación.
- **D-ALIGN-18 · SHOULD** Los estados vacíos conservan el eje de contenido y el ancho de su región; el aire extra
  nunca introduce un segundo borde izquierdo ni hace que una acción compacta ocupe toda la región.
- **D-ALIGN-19 · SHOULD** Mantén los márgenes interiores y tamaños de destino propios del producto como alias de la aplicación, no como
  nuevos valores base ni valores predeterminados universales de los componentes.
- **D-ALIGN-20 · SHOULD** **Cuando dos bordes o separaciones del diseño deben ser iguales, una diferencia de un píxel es un
  defecto.** La corrección óptica de glifos (D-ALIGN-21) es la única tolerancia.
- **D-ALIGN-21 · SHOULD** Trata la corrección óptica de un glifo asimétrico como una decisión aparte y documentada de
  recurso/componente, reutilizada en los tamaños admitidos mientras las separaciones, líneas base y ejes hermanos siguen siendo exactos.

La corrección óptica no es un permiso para empujar los márgenes de la página hasta que una captura parezca equilibrada.

### Selección, enlaces y otras mentiras semánticas

- **D-SEM-1 · MUST** **La selección es un estado persistente y nunca se parece al hover.** _Proof: browser_

El hover es transitorio; si el elemento actual se marca con el mismo relleno que usa el hover, la interfaz tiene dos
nombres para una sola apariencia.

- **D-SEM-2 · MUST** **Los roles de acción y de enlace siguen siendo distinguibles.** _Proof: browser_
- **D-SEM-3 · SHOULD** Comprueba los enlaces en línea frente a la prosa que los rodea, incluidos los temas en los que el color de
  acción y el del cuerpo coinciden.

**Un enlace se va; un botón actúa.**

- **D-SEM-4 · MUST** Todo lo que cambia el estado de la aplicación es un botón, tenga el aspecto que tenga.
  _Proof: review, browser_
- **D-SEM-5 · SHOULD** Un enlace con forma de botón no lleva subrayado.

### Jerarquía de comandos en paneles reducidos

- **D-CMD-1 · SHOULD** **Elimina los cerramientos de grupo redundantes sin borrar la affordance de los controles.**

Los títulos, la alineación y la proximidad establecen grupos dentro de un panel de ajustes; por sí solos dejan un
icono y una etiqueta sin aspecto de cosa pulsable.

- **D-CMD-2 · SHOULD** Usa filas planas cuando un patrón reconocible de menú/lista ya transmite que hay una acción; no
  las exijas en todos los contextos.
- **D-CMD-3 · SHOULD** Dale a un comando independiente que lo necesite su propia superficie de botón contenida o un
  trazo funcional, visible antes del hover en todos los temas admitidos.
- **D-CMD-4 · SHOULD** Deja que la propia forma de un botón identifique su destino; una tarjeta envolvente, un relleno de grupo
  apagado y líneas entre filas siguen sometidos a la prueba del límite con función propia (D-BOX-5).
- **D-CMD-5 · MUST** El descubrimiento inicial no depende solo del hover, del cursor de puntero, de etiquetas con verbos ni del
  foco de teclado. _Proof: browser_
- **D-CMD-6 · SHOULD** Inspecciona el panel completo en reposo con el puntero fuera, incluido el uso táctil.
- **D-CMD-7 · MUST** Hover, pulsado, deshabilitado y foco de teclado siguen siendo distinguibles una vez descubierto
  el control. _Proof: browser_
- **D-CMD-8 · SHOULD** Ajusta las etiquetas traducidas largas dentro de una sola columna de comandos en lugar de una nube horizontal
  irregular de botones.
- **D-CMD-9 · MUST** No añadas chevrones de navegación a comandos inmediatos. _Proof: review_
- **D-CMD-10 · SHOULD** Declara qué columnas visibles se comparten con casillas o controles adyacentes:
  mide los bordes de iconos/casillas y los `Range` del texto, no solo los rectángulos de los botones o la alineación dentro del
  grupo de comandos.
- **D-CMD-11 · MAY** Un área activa puede extenderse hacia un margen propio para preservar esas columnas; nombra la
  extensión.
- **D-CMD-12 · MUST** Un área activa extendida se queda dentro de su panel, no se solapa con otros destinos y
  mantiene visible el foco. _Proof: browser_
- **D-CMD-13 · SHOULD** Separa los comandos destructivos de las acciones de recuperación y de transferencia.
- **D-CMD-14 · SHOULD** Deja que la etiqueta y el icono de peligro comuniquen la intención sin un gran contorno rojo en
  cada comando en reposo; reserva el relleno de peligro más fuerte para la confirmación explícita.
- **D-CMD-15 · MUST** Los comandos destructivos conservan la confirmación, la cancelación, el retorno del foco y las protecciones
  mientras están ocupados. _Proof: browser_
- **D-CMD-16 · SHOULD** Valida un panel de comandos en su estado de reposo, no solo en su estado de hover.

La validación cubre la capacidad de descubrimiento en reposo, las columnas compartidas declaradas, la jerarquía de límites del
panel completo, los límites de los destinos, el recorte de etiquetas, el contraste y los estados de interacción.

- **D-CMD-17 · SHOULD** Inspecciona también el renderizado real: una comprobación automática de diferencias de superficie detecta
  rellenos de control invisibles, pero no demuestra que los usuarios reconozcan la acción.
- **D-CMD-18 · SHOULD** Reutiliza los roles base y los requisitos de destino para entrada gruesa; esta guía no cambia
  ningún valor predeterminado de los componentes.

### Un producto, un conjunto de tokens

- **D-TOKEN-1 · SHOULD** Usa los tokens semánticos autorizados del producto. Los alias pueden mejorar la legibilidad,
  pero se resuelven desde esa fuente en lugar de inventar una paleta competidora.
- **D-TOKEN-2 · SHOULD** Coordina los componentes de terceros mediante las API de tema admitidas y comprueba el
  resultado compuesto.

### La densidad sigue a los roles de los controles

El espaciado, las dimensiones intrínsecas y las áreas activas resuelven problemas distintos. Un glifo pequeño puede tener
un destino de botón nativo mayor.

- **D-TOKEN-3 · SHOULD** Mide los límites reales del área activa, el foco y las separaciones adyacentes.
- **D-TOKEN-4 · SHOULD** Deriva los alias repetidos del anfitrión de los tokens base, no de las dimensiones de una aplicación
  copiadas en toda la biblioteca.
- **D-TOKEN-5 · SHOULD** Elige los límites de los destinos para el método de entrada real sin agrandar cada glifo ni
  reservar espacio para controles ocultos. Usa las API públicas de tema admitidas.
- **D-TOKEN-6 · MUST** Da un nombre accesible a los controles que solo tienen icono. _Proof: browser_
- **D-TOKEN-7 · SHOULD** Documenta las excepciones legítimas de geometría de viewport, líneas finas, ilustraciones y correcciones ópticas.

### Evalúa el oficio con evidencias

El pulido sigue a la claridad de la tarea, no a un repertorio de tarjetas, desenfoques o entradas.

- **D-CRAFT-1 · SHOULD** Elige una dirección visual deliberada con objetos, textos y estados realistas; un
  armazón vacío genérico no puede establecer la calidad de un producto.

Las interfaces de trabajo necesitan lectura sostenida y acciones frecuentes; las páginas de marketing pueden necesitar una
composición distinta.

- **D-CRAFT-2 · SHOULD** Evalúa la intervención más pequeña con contenido, idioma, dispositivo y uso repetido
  reales.

Las referencias principales responden a preguntas concretas:
[la jerarquía de Linear](https://linear.app/now/behind-the-latest-design-refresh),
[la tipografía de Geist](https://vercel.com/geist/typography),
[la alineación óptica](https://craft.gustavofior.com/optical-alignment) y
[la interrumpibilidad](https://craft.gustavofior.com/interruptibility).

- **D-CRAFT-3 · SHOULD** Adapta sus principios con los tokens y las capacidades reales del anfitrión; no
  copies los tamaños en píxeles de un producto ni importes recetas como reglas.
- **D-CRAFT-4 · SHOULD** Trata las referencias como entradas para decidir, no como conjuntos de instrucciones adicionales; por
  ejemplo, [Don't Make Me Think](https://sensible.com/dont-make-me-think/) orienta el escaneo, la jerarquía y las
  opciones claras.

[taste-skill](https://github.com/leonxlnx/taste-skill) orienta la dirección deliberada y la crítica;
[ryugi](https://github.com/Innei/ryugi) orienta el trabajo ejecutable y la evidencia reciente.

- **D-CRAFT-5 · SHOULD** Una preferencia estilística necesita contexto; un requisito identifica la tarea o el
  contrato observable que protege.
- **D-CRAFT-6 · SHOULD** Elige las referencias según el trabajo que apoyan: la identidad de un logotipo o una app, la composición
  de marketing y las interacciones de trabajo frecuentes resuelven problemas distintos.
- **D-CRAFT-7 · SHOULD** Anota el patrón observado y su adaptación; comprueba el resultado con contenido
  real.

El [índice de investigación](./REFERENCE_RESEARCH.md) opcional relaciona fuentes con preguntas y muestra esta
traducción sin añadir otro conjunto de reglas.

- **D-CRAFT-8 · SHOULD** Cuando la dirección no esté resuelta, compara dos variantes pequeñas en el anfitrión real con el mismo
  contenido, ancho y tema, cambiando una sola dimensión cada vez. Explica qué aporta cada diferencia a la
  tarea.

Una dirección clara o una corrección pequeña siguen adelante directamente; no hay un ritual de aprobación obligatorio.

- **D-CRAFT-9 · SHOULD** Equilibra los títulos cortos de forma progresiva con `text-wrap: balance`, conservando el ajuste de línea
  normal.
- **D-CRAFT-10 · MUST** Los títulos no contienen saltos de línea manuales que dependan del idioma ni se recortan para
  preservar una captura. _Proof: browser_
- **D-CRAFT-11 · SHOULD** Comprueba el coste y la compatibilidad antes de usar `pretty` en contenido vivo largo.
- **D-CRAFT-12 · SHOULD** Usa cifras tabulares para estabilizar el avance de los dígitos si la fuente las admite.
- **D-CRAFT-13 · SHOULD** Reserva una columna con sentido para cambios en el número de dígitos, como 99 → 100.
- **D-CRAFT-14 · MUST** Un cambio en el número de dígitos nunca trunca el valor. _Proof: browser_
- **D-CRAFT-15 · SHOULD** Corrige los glifos asimétricos en un recurso/componente reutilizable, conservando exactos los ejes
  del diseño.
- **D-CRAFT-16 · SHOULD** Deriva la geometría de las esquinas anidadas del margen interior real; elimina primero una superficie
  anidada innecesaria.
- **D-CRAFT-17 · SHOULD** Dale un trabajo al movimiento: respuesta inmediata a lo frecuente, transiciones interrumpibles,
  movimiento reducido y temas instantáneos. Consulta el §5.
- **D-CRAFT-18 · MUST** El deleite opcional nunca retrasa la escritura ni oculta el estado. _Proof: recording_
- **D-CRAFT-19 · SHOULD** Pausa la decoración fuera de pantalla y perfila con contenido realista antes de adoptar efectos
  costosos.

### Las palabras forman parte de la interfaz

- **D-COPY-6 · SHOULD** Evita etiquetas y descripciones secundarias innecesarias. Deja que el diseño se encargue de
  explicar.
- **D-COPY-7 · SHOULD** Un título, una agrupación, la proximidad o un control evidente no necesitan otra frase que
  repita su propósito.
- **D-COPY-8 · SHOULD** Elimina el texto que no aporta ninguna decisión, restricción o consecuencia nueva; no lo sustituyas
  por una insignia o un tooltip decorativos.
- **D-COPY-9 · MUST** Conserva los nombres accesibles, las etiquetas de los campos, las unidades, los errores y los avisos de riesgo.
  _Proof: browser_
- **D-COPY-10 · SHOULD** Conserva la orientación útil para el primer uso, y comprueba si la tarea sigue siendo
  comprensible.
- **D-COPY-11 · SHOULD** Deja que el contexto aporte el contexto: `Users` en lugar de `User Management`; no repitas la
  pregunta de un diálogo en su cuerpo.
- **D-COPY-12 · SHOULD** Nombra resultados (`Save`, `Move`, `Delete`), no gestos (`Click to save`). Incluye
  el objeto solo cuando el contexto no lo deja claro.
- **D-COPY-13 · MUST** `Cancel` sale sin confirmar nada. _Proof: browser_
- **D-COPY-14 · SHOULD** Usa mayúscula solo al inicio de la frase, sin punto en las etiquetas cortas y con punto en las frases
  explicativas.
- **D-COPY-15 · SHOULD** Usa un solo `…` cuando una acción necesita más datos antes de completarse; reserva las MAYÚSCULAS
  para estados cortos, antetítulos y siglas.

### Lista de revisión para una superficie compuesta

- **D-REVIEW-1 · SHOULD** Aplica estas preguntas a la superficie afectada y a los estados modificados que se puedan alcanzar.
  Omite las variantes irrelevantes; un parche pequeño no exige rediseñar páginas no relacionadas. Un «no» dentro del
  alcance es un hallazgo.

1. ¿Puede un lector nuevo reconocer el propósito y la acción principal sin adivinar?
2. ¿La etiqueta, el estado y el resultado de cada control describen un único resultado coherente?
3. ¿Es escaso el énfasis: lo esencial se lleva el peso mientras el color, las insignias y los botones principales siguen siendo raros?
4. ¿Podría hacer menos: hay algún punto de entrada, opción o estado que se pueda quitar sin debilitar la tarea?
5. ¿Son exactos los ejes nombrados en la capa de texto/contenido visible, incluidos los estados anidados y vacíos, con columnas de navegación intencionadas y sin rellenos duplicados?
6. ¿Los controles adyacentes comparten sus columnas declaradas de icono/texto?
7. ¿Las áreas activas de los títulos se ajustan a su contenido?
8. ¿Las relaciones verticales repetidas usan separaciones coherentes con un único dueño, incluido el texto con ajuste de línea y el contenido oculto de ayuda/error?
9. ¿Es cómodo el texto corrido en sus sistemas de escritura, fuentes y niveles de zoom reales, y todo lo que **no** es texto corrido está libre de ese límite de longitud de línea?
10. ¿Concuerda todo lo que parece formar parte de un mismo objeto (borde, radio **y** espaciado) y cada columna reservada tiene de verdad contenido? ¿Cada marco, relleno o divisor persistente comunica un límite distinto en lugar de volver a anidar el mismo grupo?
11. ¿Se sostiene en los estados modificados relevantes: vacío, cargando, fallo, traducciones largas, ancho estrecho, temas admitidos, movimiento reducido y **RTL**, donde se vean afectados?
12. Para cambios de diseño o de interacción, ¿se ha comprobado la superficie afectada en un navegador real en los anchos y temas relevantes? ¿Las acciones independientes se reconocen antes del hover, incluido el uso táctil, sin cerramientos de grupo redundantes?

Una captura del camino feliz no demuestra el comportamiento del teclado, el foco, el contenido dinámico,
el redimensionado ni la recuperación de fallos.

- **D-REVIEW-2 · SHOULD** Sigue [ACCEPTANCE](./ACCEPTANCE.md) para las expectativas independientes, la identidad real del
  runtime y de la captura, las mediciones en el navegador y la separación de los resultados automáticos, del agente y humanos.

El [ejemplo de navegador](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md), disponible solo en el código fuente,
contiene comandos de preparación y detalles de utilidades de prueba; no son API públicas del paquete.

## 10. Arquitectura de información: la forma antes que la composición

- **D-IA-1 · SHOULD** Elige la estructura antes que la composición en consolas, paneles de control y
  bancos de trabajo con mucha información.

Tener todos los datos de la API no es diseñar una página: el lector sigue necesitando un orden claro para entender
los objetos, su estado y sus relaciones, y después actuar.

- **D-IA-2 · SHOULD** Dale a las páginas de conversión única y de aterrizaje su propia estructura de tarea en lugar de una
  plantilla de consola densa.

### Responde a tres preguntas antes de nombrar un componente

- **D-IA-3 · SHOULD** Resuelve las tres respuestas antes de elegir componentes.

1. **¿Qué necesita ver el lector al llegar?** Esa es la información principal.
2. **¿Qué más tiene que estar visible para que tenga sentido?** Recursos relacionados, modelos relacionados, contexto.
3. **¿Qué hace a continuación?** Juzgar, actuar o seguir pensando.

- **D-IA-4 · SHOULD** **Una página tiene exactamente un modelo principal.** Los modelos de apoyo pueden ayudar al lector
  a entenderlo o manejarlo; no pueden competir por la primera pantalla.
- **D-IA-5 · SHOULD** Prefiere una siguiente opción clara e inequívoca a un presupuesto arbitrario de clics. Comprueba si
  los lectores reconocen la siguiente acción, no solo si el destino es alcanzable.

### La forma sigue a la tarea, no a los datos

- **D-IA-6 · SHOULD** Elige un esqueleto a partir de la pregunta del lector, no de un array de la API ni de un ID de ruta, usando
  la tabla de abajo.

| Tarea                                                   | Forma útil                                                            |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| Comparar valores/diferencias                            | Tabla o diff                                                          |
| Reconocer/abrir un recurso                              | Lista; cuadrícula de imágenes solo cuando las imágenes lo identifican |
| Entender el estado actual de un objeto                  | Detalle por secciones                                                 |
| Entender la propiedad/las dependencias                  | Árbol o lista de adyacencia; grafo solo cuando importa el camino      |
| Planificar el siguiente paso / mover trabajo por etapas | Flujo por pasos / kanban cuando mover es el trabajo real              |
| Auditar qué pasó, cuándo y quién                        | Línea de tiempo o traza navegable                                     |
| Debatir o leer texto continuo                           | Hilo o documento                                                      |
| Juzgar salud, tendencias o anomalías                    | Muro de estado o panel de control                                     |
| Encontrar ocupación/conflictos o ubicación              | Calendario o mapa/lienzo                                              |
| Trabajar en el siguiente elemento / cambiar reglas      | Banco de trabajo maestro-detalle / formulario de configuración        |

- **D-IA-7 · SHOULD** No confundas eventos históricos con pasos futuros, un filtro con un kanban ni prosa ordenada
  con una cuadrícula de campos. Una fecha por sí sola no justifica un calendario.
- **D-IA-8 · SHOULD** Ofrece varias vistas solo cuando cada una sirve a una tarea distinta que compense el mantenimiento de
  sus filtros, estado y acciones.

### Cada tipo de información tiene su sitio

- **D-IA-9 · SHOULD** Empieza por la identidad y el estado en la región del título o del resumen, y mantén las acciones,
  la respuesta y la evidencia junto a su objeto, como indica la tabla de abajo.

| Información | Dónde va                                                                   | Lugar equivocado                           |
| ----------- | -------------------------------------------------------------------------- | ------------------------------------------ |
| Identidad   | Título, resumen del objeto                                                 | La última columna, o detrás de una pestaña |
| Estado      | Región del título o del resumen                                            | Solo localizable en un campo de detalle    |
| Atributos   | Cuerpo del detalle, agrupados como la gente piensa en ellos                | Aplanados en el orden de campos de la API  |
| Relaciones  | Región o pestaña propia; propiedad, dependencia y referencia diferenciadas | Mezcladas en la tabla de atributos         |
| Cambios     | Región de diff, línea de tiempo                                            | Mostrados solo como el valor nuevo         |
| Evidencia   | Junto al juicio, desplegable                                               | Una página de registros en otro sitio      |
| Acciones    | La principal en la región del título, el resto junto a su objeto           | Enterradas bajo «más»                      |
| Respuesta   | Junto a la acción, manteniendo el contexto de la tarea                     | Un toast global desligado de su objeto     |

- **D-IA-10 · SHOULD** **Cada dato tiene exactamente una ubicación de referencia.** En otros lugares se muestra un resumen o
  un punto de entrada que enlaza con ella.
- **D-IA-11 · SHOULD** Sigue el orden de lectura predeterminado: identidad de la página → estado actual o excepción →
  tarea principal y acción principal → la información que necesita el juicio → relaciones, cambios,
  evidencia → información secundaria y acciones poco frecuentes.
- **D-IA-12 · SHOULD** **Una acción principal por región de tarea**, y es el siguiente paso más probable, no
  el más destructivo (el §9, «El énfasis es un presupuesto», rige cuánto peso puede llevarse).

### La densidad es información útil, no controles por centímetro

Apretar el espaciado sube la densidad visual y deja la densidad útil donde estaba. Quitar
campos irrelevantes y poner la comparación en un solo sitio sube la densidad real.

- **D-IA-13 · SHOULD** **Usa como mucho dos niveles de densidad contiguos en una página**: amplio para el primer uso y
  las confirmaciones arriesgadas, estándar para la mayoría de listas y detalles, compacto para bancos de trabajo expertos.
- **D-IA-14 · MAY** El relleno de los contenedores y la altura de línea pueden reducirse.
- **D-IA-15 · MUST** El texto de cuerpo legible, un anillo de foco visible y el tamaño de los destinos del puntero no se reducen con
  la densidad (§7, §8). _Proof: browser_

### Los contenedores no arreglan la estructura

- **D-IA-16 · SHOULD** **Un solo retorno contextual por vista.** No muestres a la vez un «Volver al chat» exterior y un
  «Volver a los artefactos» interior.
- **D-IA-17 · SHOULD** La vista de detalle vuelve a su padre inmediato.
- **D-IA-18 · MUST** Los ancestros siguen siendo alcanzables a través de la jerarquía de rutas o de migas de pan con nombres claros.
  _Proof: browser_
- **D-IA-19 · SHOULD** Comprueba el recorrido completo, incluido el retorno del foco y los nombres largos de destino
  traducidos.
- **D-IA-27 · MUST** Al volver al padre, el foco vuelve al elemento de origen. _Proof: browser_
- **D-IA-20 · MUST** Si el texto no cabe, recolócalo o usa un destino más corto con sentido; una elipsis o un
  tooltip nunca ocultan la única pista del destino. _Proof: browser_
- **D-IA-21 · SHOULD** Elige una sola composición para el contexto padre. No añadas una miga de pan solo para
  reetiquetar un atajo de retorno redundante, ni repitas ese padre como miga inerte encima de su comando de retorno.

Cuando volver a través del padre ya lleva al ancestro, ese recorrido conserva el acceso
sin añadir otra fila a la cabecera del detalle.

- **D-IA-22 · SHOULD** Usa migas de pan cuando la propia jerarquía ayuda a la tarea.

**Un modal no es una capa de navegación.**

- **D-IA-23 · SHOULD** Dale una ruta a todo lo que necesite un enlace copiable, historial, una comparación
  lado a lado o trabajo que sobreviva a una recarga.
- **D-IA-24 · SHOULD** Reserva el modal para una confirmación breve o un solo campo, el popover o el menú para
  contexto transitorio, y una fila desplegable para la revelación progresiva.
- **D-IA-25 · SHOULD** **Las pestañas contienen vistas pares de un mismo objeto** (su conversación, sus comprobaciones, su diff),
  nunca módulos no relacionados; eso es trabajo de la navegación.
- **D-IA-26 · SHOULD** Si la biblioteca elegida no tiene una primitiva adecuada, usa elementos semánticos existentes
  y los tokens del anfitrión; comprueba la interacción requerida en lugar de inventar API no admitidas.

## Lista de verificación (antes de publicar una interfaz)

- **D-VERIFY-1 · SHOULD** Selecciona las comprobaciones según la superficie afectada, las variantes admitidas y el comportamiento modificado;
  no crees flujos no relacionados solo para cumplir la lista.

La CI del repositorio sigue ejecutando todas sus puertas.

- **D-VERIFY-2 · SHOULD** La tarea principal y la acción principal son inconfundibles.

Los cambios de diseño o de tema afectados funcionan en los anchos **estrechos y anchos** relevantes y en los temas admitidos (D-INPUT-1).
Ratón y táctil funcionan: los arrastres usan Pointer Events y cualquier `trigger="hover"` tiene una alternativa por toque (D-INPUT-3,
D-INPUT-4). El teclado y el foco visible están cubiertos por D-ACCESS-3 y D-ACCESS-4.

- **D-VERIFY-5 · SHOULD** Prueba todos los **estados** modificados (hover, activo, foco, deshabilitado, cargando, vacío,
  error).
- **D-VERIFY-7 · SHOULD** Cubre los casos límite relevantes: texto largo, números grandes y los sistemas de escritura/idiomas
  que admite el anfitrión.
- **D-VERIFY-8 · SHOULD** El espaciado sale de la escala; la tipografía usa un rol; el color usa tokens semánticos.
- **D-VERIFY-9 · SHOULD** Ejecuta las comprobaciones aplicables del anfitrión e inspecciona evidencias reales del navegador.
- **D-VERIFY-10 · SHOULD** El texto sigue el §6.

Las señales de estado basadas solo en el color están cubiertas por D-ACCESS-2.

- **D-VERIFY-12 · SHOULD** Para una superficie densa: un modelo principal, el esqueleto elegido a partir de la pregunta
  y no de los datos, y cada dato con una única ubicación de referencia (§10).
