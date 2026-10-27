<!-- source: 28f660782f4b364a2424b4125d8920431adf8bac -->

# Validación de interfaz: evidencias y decisiones

Usa este contrato cuando cambie un resultado visual o de interacción. [DESIGN](./DESIGN.md) se encarga de la
apariencia y la composición; [INTERACTION](./INTERACTION.md), del comportamiento observable.
El [índice de la interfaz](./INTERFACE_GUIDE.md) orienta la tarea. Lee solo las secciones aplicables.

Cada regla lleva un ID y un nivel. Romper una **MUST** es un defecto, y la regla nombra su prueba;
**SHOULD** es lo predeterminado, y quien se desvía explica el motivo en ese caso; **MAY** es opcional.
El [índice de reglas](./RULES.md) recoge todas las reglas graduadas con su prueba.

## Acuerda el resultado observable

- **V-AGREE-1 · SHOULD** Antes de editar, resuelve el
  [brief de diseño](./DESIGN.md#style-coherence-across-components-and-pages), e indica en esa misma nota la
  tarea afectada, las vistas/estados y las expectativas independientes.
- **V-AGREE-2 · SHOULD** Nombra al responsable pertinente, la API pública admitida y los límites de capacidad del anfitrión.
- **V-AGREE-3 · SHOULD** Selecciona anchos, temas, idiomas y vías de entrada a partir del cambio real,
  sin inventar trabajo no relacionado.
- **V-AGREE-4 · SHOULD** Para la composición, indica los ejes de contenido/texto/iconos, las columnas de navegación
  intencionadas, los límites de las áreas activas y las relaciones verticales.
- **V-AGREE-5 · MUST** No derives el valor esperado de la implementación que se está probando.
  _Proof: review_
- **V-AGREE-6 · SHOULD** Revisa en este orden: tarea/jerarquía, composición estática, estados combinados
  alcanzables y, después, movimiento.
- **V-AGREE-7 · SHOULD** No añadas animación para compensar proporciones sin resolver o una navegación
  poco clara.
- **V-AGREE-8 · SHOULD** Cuando una revisión cambie el diseño previsto, actualiza primero el brief existente
  e identifica la evidencia que lo motivó.

Es un registro de decisiones, no una nueva ceremonia de aprobación para un trabajo que el usuario ya autorizó.

Una comprobación de API/tokens verifica contratos del código fuente; una comparación de imágenes verifica píxeles; una ejecución de un agente
verifica si se siguió la guía.

- **V-AGREE-9 · SHOULD** Mantén un único responsable por regla.
- **V-AGREE-10 · MUST** No dejes que un tipo de comprobación sustituya a otro: una comprobación de API/tokens, una
  comparación de imágenes y una ejecución de un agente establecen cada una solo su propio resultado. _Proof: review_
- **V-AGREE-11 · MUST** Un fixture demuestra su propio resultado, no la validación de una aplicación anfitriona
  que no renderizó; no lo presentes como validación del anfitrión. _Proof: review_

## Prueba en el navegador

- **V-PROOF-1 · MUST** Al reproducir un defecto visible, captura la superficie real en ejecución antes
  del arreglo. _Proof: browser_
- **V-PROOF-2 · MUST** Después del arreglo, captura el mismo estado relevante e inspecciona el panel completo con
  textos realistas y el marco de la interfaz que lo rodea. _Proof: browser_
- **V-PROOF-3 · MUST** No ofrezcas como prueba una maqueta, un diff del código fuente, una aserción modificada ni una captura de una
  compilación no relacionada. _Proof: review_
- **V-PROOF-4 · SHOULD** Inspecciona la composición además del número de enlaces: reetiquetar un retorno redundante
  como miga de pan puede seguir repitiendo el mismo contexto y añadir una fila de cabecera innecesaria.
- **V-PROOF-5 · SHOULD** Rastrea si los ancestros son alcanzables a través del padre antes de decidir que hace falta otro
  atajo visible.
- **V-PROOF-6 · MUST** Espera al registro de los componentes, el contenido pendiente, las fuentes y los fotogramas renderizados
  antes de medir. _Proof: browser_
- **V-PROOF-7 · MUST** Haz fallar la prueba ante destinos que faltan o de tamaño cero. _Proof: browser_
- **V-PROOF-8 · MUST** Anota cualquier tolerancia subpíxel, y mantenla por debajo de un píxel CSS completo para los ejes
  exactos (el ejemplo del código fuente usa 0.5px). _Proof: review_
- **V-PROOF-9 · MUST** En las superposiciones en vivo, comprueba que la captura conserva el viewport e incluye el
  disparador/panel completos; una captura de página completa puede invalidar un recorte al provocar una recolocación responsive
  o un reposicionamiento del portal. _Proof: browser_
- **V-PROOF-10 · MUST** Mide la capa del defecto: el envoltorio, el contenido interior, el `Range` del texto renderizado, el
  viewport del icono y el destino real del puntero son distintos. Un `Range` no es la tinta exacta del glifo.
  _Proof: browser_
- **V-PROOF-11 · MUST** Ten en cuenta las shadow parts mediante los puntos de prueba admitidos; no introduzcas
  consultas al shadow DOM en producción para la validación. _Proof: review_
- **V-PROOF-12 · SHOULD** Prueba la recolocación afectada, las traducciones con ajuste de línea, el contenido opcional y las vías
  de entrada.
- **V-PROOF-13 · MUST** No uses una captura estática como prueba del retorno del foco, la navegación por teclado,
  el descubrimiento táctil, la interrumpibilidad o el asentamiento asíncrono. _Proof: review_
- **V-PROOF-14 · MUST** Graba una interacción continua cuando el defecto se desarrolla en el tiempo.
  _Proof: recording_
- **V-PROOF-15 · MUST** Para una aserción de diseño, demuestra que rechaza el defecto relevante: mueve solo el texto
  de la etiqueta mientras el marco sigue fijo, introduce un margen duplicado o una ayuda fantasma, o amplía el destino
  de un título hasta el relleno. _Proof: browser_
- **V-PROOF-16 · MUST** Confirma que la mutación ganó la cascada, observa el fallo, restaura y observa el
  éxito. _Proof: browser_
- **V-PROOF-17 · SHOULD** Usa mutaciones relevantes para la tarea en lugar de repetir todo el conjunto de
  ejemplos para un arreglo mínimo.
- **V-PROOF-18 · MUST** Comprueba los datos en bruto cuando cambies la presentación. _Proof: browser, unit_
- **V-PROOF-19 · MUST** Para el código, copia el contenido de origen, no el texto del DOM resaltado: conserva tabulaciones,
  líneas en blanco, el salto de línea final y lo que se añade en streaming. _Proof: unit_
- **V-PROOF-20 · MUST** Comprueba de forma independiente el éxito/fallo del portapapeles, la selección nativa y el desplazamiento de
  líneas largas. _Proof: browser_
- **V-PROOF-21 · MUST** Documenta la normalización de la selección del navegador sin permitir que altere el contenido
  en bruto del portapapeles. _Proof: unit, review_

El [ejemplo de diseño](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md), disponible solo en el código fuente,
contiene comandos ejecutables y utilidades de geometría. Los consumidores adaptan sus relaciones a su
anfitrión; estas utilidades no son nuevas exportaciones de ranui.

- **V-PROOF-22 · MUST** No afirmes compatibilidad con el zoom nativo del navegador ni con la accesibilidad del tamaño de texto a partir de pruebas de
  estrés con zoom CSS. _Proof: review_
- **V-PROOF-23 · MUST** Indica qué caminos quedan sin verificar. _Proof: review_

### Revisa el movimiento en el tiempo

- **V-MOTION-1 · MUST** Para un movimiento modificado, inspecciona una acción continua a velocidad normal y después reprodúcela
  despacio donde se rompa una transición. _Proof: recording_
- **V-MOTION-2 · MUST** Incluye la activación, el estado intermedio, la finalización y el camino inverso;
  repite o invierte la entrada antes de que termine. _Proof: recording_
- **V-MOTION-3 · MUST** Comprueba el estado final, el foco, el número de eventos y la posición de lectura con independencia
  de la animación. _Proof: browser_
- **V-MOTION-4 · MUST** Usa la reproducción lenta para diagnosticar discontinuidades, no como prueba de rendimiento de fotogramas.
  _Proof: review_
- **V-MOTION-5 · MUST** Dale al movimiento reducido su propia comprobación del estado visible, no solo una grabación más corta.
  _Proof: browser_
- **V-MOTION-6 · SHOULD** Informa de un defecto temporal como
  `element → input → observed frame/state → expected continuity`.
- **V-MOTION-7 · SHOULD** Usa una tarea real representativa en todos los hermanos afectados para detectar un
  lenguaje de movimiento incoherente.
- **V-MOTION-8 · SHOULD** Vuelve a revisar la composición completa después de los arreglos locales.
- **V-MOTION-9 · SHOULD** Conserva las iteraciones fallidas como diagnóstico, separadas de las capturas aceptadas.

Estas comprobaciones complementan la vinculación de evidencias que se describe más abajo.

## Recorre la tarea

- **V-WALK-1 · SHOULD** Para un flujo o una composición modificados, empieza con un objetivo realista expresado
  sin nombrar el control que hay que usar.
- **V-WALK-2 · SHOULD** Completa el objetivo desde el punto de entrada real hasta el resultado, la recuperación y
  el regreso, según corresponda.
- **V-WALK-3 · SHOULD** Anota la primera elección, cualquier etiqueta ambigua, duda o marcha atrás, y
  si el resultado deja claro el siguiente paso.

Un camino con menos clics no sirve de nada si las opciones no están claras.

- **V-WALK-4 · SHOULD** Usa contenido realista, incluido un caso representativo largo o con fallo,
  y no solo un estado vacío pulido.
- **V-WALK-5 · SHOULD** Arregla la estructura de la tarea y la jerarquía del contenido antes de añadir efectos decorativos.
- **V-WALK-6 · SHOULD** Informa de los problemas observados más importantes (hasta tres), con el estado
  y la evidencia que muestran cada uno.
- **V-WALK-7 · MUST** No inventes hallazgos para cubrir un cupo. _Proof: review_
- **V-WALK-8 · SHOULD** Repite el camino afectado después de la corrección.
- **V-WALK-9 · MUST** Presenta el recorrido de un agente como una búsqueda de defectos, no como un estudio de usabilidad con personas.
  _Proof: review_
- **V-WALK-10 · SHOULD** Cuando observes a un participante real, deja que intente el objetivo antes de
  explicarle la interfaz, y mantén esa distinción en los resultados de abajo.

## Vincula las evidencias a lo que realmente se ejecutó

Cada estado revisado recibe un registro compacto con estos campos:

- **V-FRESH-1 · MUST** Runtime: anota la revisión del código fuente o la compilación probadas y las entradas modificadas relevantes o
  su huella, incluidos los estilos/componentes compartidos y los datos entrantes cuando afectan al
  resultado. Un HEAD de Git no basta si la compilación en ejecución o el árbol de trabajo difieren.
  _Proof: review_
- **V-FRESH-2 · MUST** Alcance/entorno: anota la pertenencia a vistas/grupos afectados, la ruta/el estado,
  el viewport, el tema, el idioma, el navegador y los ajustes de entrada o de movimiento reducido cuando sean relevantes.
  _Proof: review_
- **V-FRESH-3 · MUST** Medios: anota las ubicaciones de las capturas/grabaciones y la identidad de su contenido (por ejemplo,
  SHA-256), ligadas a ese runtime y a ese estado. _Proof: review_
- **V-FRESH-4 · MUST** Mantén separados el antes y el después; nunca sobrescribas la única imagen del antes.
  _Proof: review_
- **V-FRESH-5 · MUST** Revisión: anota lo que la comprobación automática y la inspección del agente establecieron
  realmente, separado de cualquier decisión humana y de cualquier estado sin verificar. _Proof: review_
- **V-FRESH-6 · MAY** Usa un registro breve en Markdown; un manifiesto existente puede aportar estos campos.
- **V-FRESH-7 · SHOULD** No añadas un nuevo servicio de evidencias ni un framework de configuración para un cambio
  corriente.
- **V-FRESH-8 · MUST** Guarda los hashes junto a los archivos o en un manifiesto referenciado para que la vinculación declarada
  pueda comprobarse de forma independiente. _Proof: review_

**Una revisión solo se aplica a las evidencias y al alcance de runtime que inspeccionó.**

- **V-FRESH-9 · MUST** Trata la revisión afectada como obsoleta tras sustituir una imagen, editar una
  grabación, cambiar la pertenencia a un grupo o cambiar entradas de runtime relevantes. _Proof: review_
- **V-FRESH-10 · MUST** Tras un cambio de estilo/componente compartido, actualiza todos los estados afectados, recompila si
  hace falta y después inspecciona las nuevas evidencias. _Proof: browser, review_
- **V-FRESH-11 · MUST** No presentes ninguna captura antigua como prueba actual. _Proof: review_
- **V-FRESH-12 · MUST** Al conservar evidencias de runtime tras una edición solo de documentación o un cambio de código no relacionado,
  anota por qué su alcance de dependencias no se ve afectado. _Proof: review_

Las capturas antiguas pueden quedarse como historial. Una edición solo de documentación o un cambio de código no relacionado dejan válidas
las evidencias de runtime idénticas, así que no hace falta volver a capturarlo todo solo porque cambió HEAD.

## Informa de la autoridad con veracidad

| Resultado                  | Quién/qué puede establecerlo                                                                        | Lo que no establece                           |
| -------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Comprobaciones automáticas | Salida reciente de comandos o aserciones del navegador para el runtime declarado                    | La calidad visual ni una decisión humana      |
| Revisión visual del agente | El agente inspeccionó las capturas actuales y la interacción afectada                               | La validación del usuario                     |
| Decisión humana            | La decisión de un usuario real, con la referencia de su mensaje/acción y el alcance de la evidencia | La validación de evidencias cambiadas después |

- **V-REPORT-1 · MUST** Mantén separados estos tres resultados, incluso en un informe de un párrafo.
  _Proof: review_
- **V-REPORT-2 · MUST** Afirma cada resultado solo a partir de la fuente que nombra la tabla de arriba, y nunca para
  lo que la tabla dice que no establece. _Proof: review_
- **V-REPORT-3 · SHOULD** Usa resultados explícitos como `automated: passed`,
  `agent review: passed with limits`, `human: not requested`.
- **V-REPORT-4 · MUST** Si se pidió una revisión humana y sigue pendiente, di `pending`.
  _Proof: review_
- **V-REPORT-5 · MUST** Si un usuario lo rechazó, conserva `rejected` y el hallazgo hasta que ese usuario
  revise el alcance actualizado. _Proof: review_
- **V-REPORT-6 · MUST** Un agente puede informar de su corrección y de comprobaciones recientes, pero nunca inventa una decisión
  del usuario ni anula un rechazo humano. _Proof: review_
- **V-REPORT-7 · MUST** Evita un «aceptado», «aprobado» o «验收通过» sin atribución. _Proof: review_

La autorización del usuario decide si hacer push, actualizar una PR o realizar otra acción externa.
Este documento no añade ninguna puerta general de aprobación humana.

- **V-REPORT-8 · SHOULD** Termina y entrega el trabajo autorizado informando con veracidad de
  `not requested`/`pending`.
- **V-REPORT-9 · SHOULD** Pregunta solo cuando falte la autorización real o una decisión de producto
  necesaria.
- **V-REPORT-10 · MUST** Nunca etiquetes la propia comprobación visual del agente como «aceptado por el usuario». _Proof: review_

Una nota de entrega mínima puede ser:

> Runtime y alcance: compilación/código fuente …; estado/entorno …; huella de las entradas relevantes …
> Evidencias: antes/después/interacción …; identidades registradas en …
> Automático: comandos/resultados …
> Revisión del agente: resultado observado, hallazgo o límite restante …
> Decisión humana: no solicitada / pendiente / decisión real y referencia …
> Sin verificar: …; PR/actualización autorizada: …

## Regresión de la propia guía

Los controles deterministas comprueban al evaluador sin llamadas al modelo; las ejecuciones en vivo necesitan un entorno de agentes
disponible y no son una puerta obligatoria para cada edición de texto.

- **V-EVAL-1 · SHOULD** Para una evaluación en vivo opcional o autorizada por la tarea de cambios en skills/enrutado/validación,
  usa los
  [seis escenarios de agente](https://github.com/chaxus/ran/tree/main/plugins/ran/evals), disponibles solo en el código fuente.
- **V-EVAL-2 · MUST** Congela las tareas, los fixtures, las herramientas y las rúbricas independientes antes de las ejecuciones en vivo.
  _Proof: review_
- **V-EVAL-3 · MUST** Usa sesiones nuevas con el mismo modelo y los mismos ajustes. _Proof: review_
- **V-EVAL-4 · MUST** Fija la guía de referencia y la candidata en espacios de trabajo separados. _Proof: review_
- **V-EVAL-5 · MUST** Conserva el trabajo real del agente, los prompts, las comprobaciones de resultado y las evidencias. _Proof: review_
- **V-EVAL-6 · MUST** Registra los aciertos de la referencia como controles y los fallos de la candidata como fallos.
  _Proof: review_
- **V-EVAL-7 · MUST** No muestres a los ejecutores los umbrales del evaluador ni los parches de reparación.
  _Proof: review_

Las comprobaciones de rechazo/restauración con defectos sembrados establecen la sensibilidad del evaluador.

- **V-EVAL-8 · MUST** Afirma el comportamiento en esas tareas solo a partir de ejecuciones en vivo de agentes; la coincidencia de texto,
  las respuestas escritas a mano o las expectativas de prueba corregidas no son evidencia de ello. _Proof: review_
- **V-EVAL-9 · MUST** Inspecciona el juicio visual con independencia de las comprobaciones mecánicas. _Proof: review_
- **V-EVAL-10 · MUST** Informa del tamaño de la muestra, las herramientas y las condiciones no cubiertas. _Proof: review_
- **V-EVAL-11 · MUST** Seis tareas con éxito no demuestran fiabilidad entre modelos; no lo afirmes a partir de
  ellas. _Proof: review_
