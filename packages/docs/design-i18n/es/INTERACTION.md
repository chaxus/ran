<!-- source: 2546d093271a44411b5a6a28a982efbdc0c4a805 -->

# Estándar de interacción

Este archivo se encarga del **comportamiento observable**, con independencia del dominio de la pantalla o de su tratamiento visual.
[DESIGN.md](./DESIGN.md) se encarga de la apariencia; el anfitrión, de la implementación. Para quienes contribuyen a ranui,
[CODING.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md) aporta el adaptador de ingeniería.
Usa [WORKFLOW_PATTERNS.md](./WORKFLOW_PATTERNS.md) solo para una tarea de varios pasos en la que sea relevante.
Estas reglas generales no presuponen ninguna infraestructura de flujos de trabajo.

Cada regla lleva un ID y un nivel. Romper una **MUST** es un defecto, y la regla nombra su prueba;
**SHOULD** es lo predeterminado, y quien se desvía explica el motivo en ese caso; **MAY** es opcional.
El [índice de reglas](./RULES.md) recoge todas las reglas graduadas con su prueba.

## 1. Entradas, borradores e intención

- **X-INPUT-1 · MUST** Mantén las etiquetas, los requisitos previos y los mensajes de validación cerca del campo al que afectan.
  _Proof: browser_
- **X-INPUT-2 · SHOULD** Distingue un valor que falta de un servicio no disponible, y explica por qué no se puede
  enviar cuando el requisito previo no es evidente.
- **X-INPUT-3 · SHOULD** Usa la semántica de entrada nativa y el autocompletado adecuados, y respeta las convenciones de
  edición de la plataforma; ofrece atajos de teclado donde ayuden.

| Transición                        | Comportamiento esperado                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------- |
| Vacío → formulario válido         | Habilita la acción de envío correspondiente; deja utilizables los controles de contexto        |
| Enviar → en curso                 | Despacha una sola vez; muestra el estado ocupado sin mover el foco de forma inesperada         |
| En curso → nuevas ediciones       | Especifica si las ediciones afectan a este trabajo, a uno posterior o a un borrador conservado |
| Fallido → restaurar               | Restaurar solo vuelve a rellenar los campos; no los envía                                      |
| Fallido → reintentar              | Reintentar vuelve a despachar; conserva el alcance original o pregunta si cambió el contexto   |
| Cambio de ajustes/origen → volver | Conserva la entrada sin terminar y la selección del usuario siempre que se pueda               |

- **X-INPUT-4 · MUST** Enviar despacha una vez por activación, y Restaurar solo vuelve a rellenar los campos sin
  enviarlos. _Proof: unit_
- **X-INPUT-5 · SHOULD** Sigue el resto de filas de la tabla de transiciones de entrada.
- **X-INPUT-6 · MUST** Enter envía solo donde la convención documentada del campo lo prevé, y nunca
  durante una composición IME (comprueba `isComposing`). La entrada multilínea sigue funcionando. _Proof: browser_
- **X-INPUT-7 · MUST** El dictado actualiza el texto y nunca envía por sí solo; el texto anterior a la
  captura se conserva. _Proof: browser_
- **X-INPUT-8 · MUST** No reconstruyas una entrada con el foco por una respuesta de búsqueda, una actualización del stream, un
  cambio de tamaño o un cambio de estado. _Proof: browser_
- **X-INPUT-9 · MUST** Gana la intención más reciente: una consulta antigua nunca sustituye a resultados más nuevos, y la vista
  previa de un archivo nunca aparece bajo otro. _Proof: unit_
- **X-INPUT-10 · SHOULD** Implementa X-INPUT-9 con los mecanismos de identidad asíncrona y cancelación del anfitrión;
  quienes contribuyen a ranui pueden consultar
  [CODING §3](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#3-state-and-ownership).
- **X-INPUT-11 · MUST** Promete la persistencia solo después de que se logre; un borrador conservado no es un borrador guardado.
  _Proof: unit_
- **X-INPUT-12 · MUST** Resalta las coincidencias de búsqueda con nodos de texto seguros o un escapado equivalente, nunca
  insertando la consulta como HTML. _Proof: unit_
- **X-INPUT-13 · SHOULD** Deja suficiente texto alrededor de una coincidencia resaltada para explicar por qué coincidió el elemento.

## 2. Controles alcanzables y foco predecible

- **X-FOCUS-1 · SHOULD** Construye los controles con semántica nativa y contratos de componente admitidos.
- **X-FOCUS-2 · MUST** Toda acción que solo tiene icono tiene un nombre accesible. _Proof: browser_
- **X-FOCUS-3 · MUST** Una acción secundaria que aparece al hacer hover también aparece con el foco de teclado y tiene una
  vía persistente por toque en entrada gruesa. _Proof: browser_
- **X-FOCUS-4 · SHOULD** Mantén visibles las acciones de recuperación esenciales en lugar de mostrarlas solo con hover.
- **X-FOCUS-5 · MUST** Los controles deshabilitados no reaccionan al hover y no pueden despachar. _Proof: browser_
- **X-FOCUS-6 · MUST** La caja del destino y el anillo de foco mantienen su tamaño y posición mientras cambia una etiqueta o un
  estado. _Proof: browser_
- **X-FOCUS-7 · MUST** Integra a través de atributos, eventos, slots, variables y parts públicos; no
  parchees shadow roots privados. _Proof: review_
- **X-FOCUS-8 · MUST** No añadas paradas de tabulación en el host que no lleven a ninguna parte o dupliquen un control interior.
  _Proof: browser_
- **X-FOCUS-9 · MUST** Un diálogo compuesto coloca el foco inicial dentro de sí mismo, mantiene Tab y Shift+Tab
  dentro de él, se cierra con Escape y con Cancelar, activa su acción predeterminada con Enter y devuelve el foco a
  quien lo abrió al cerrarse. _Proof: browser_
- **X-FOCUS-10 · SHOULD** Cuando una trampa de foco no puede alcanzar un control (por ejemplo, un botón en un shadow cerrado de
  un pie), corrige la integración admitida o coloca botones nativos en su slot admitido.
- **X-FOCUS-11 · MUST** Una región contraída sigue identificando su contenido y su estado, y el plegado nunca
  oculta un error accionable sin resolver. _Proof: browser_
- **X-FOCUS-12 · MUST** Contraer una región que contiene el foco devuelve el foco a su conmutador; eliminar el
  objeto con el foco lo mueve a la siguiente acción con sentido o a un control padre estable. _Proof: browser_
- **X-FOCUS-13 · MUST** No muevas el foco solo porque haya terminado una petición en segundo plano. _Proof: browser_
- **X-FOCUS-14 · SHOULD** Redacta el resumen contraído para ayudar a decidir si conviene desplegar; cuando el
  cuerpo desplegado ya muestra ese contenido, omite el resumen repetido y conserva el título y el estado.

Una primitiva segura con teclado no hace seguro un diálogo compuesto; X-FOCUS-9 trata de la composición.

## 3. Respuesta y posición de lectura

- **X-FEEDBACK-1 · SHOULD** Muestra la respuesta junto al objeto sobre el que se actuó. Un «Copiado» junto a
  Copiar se asocia mejor que una notificación global sin relación; un toast conviene para cambios que van más allá del
  objeto actual o para respuestas que de otro modo pasarían desapercibidas.
- **X-FEEDBACK-2 · MUST** Muestra una confirmación de éxito solo después de que la operación haya tenido éxito (para Copiar,
  tras el éxito del portapapeles), y gestiona el rechazo en el sitio manteniendo la geometría del botón y el foco.
  _Proof: browser_
- **X-FEEDBACK-3 · MUST** La respuesta asíncrona pertenece a la instantánea de origen de la operación: cuando el contenido cambia
  mientras Copiar está pendiente, la finalización antigua nunca marca el contenido nuevo como «Copiado», y la respuesta obsoleta
  se borra o se identifica como obsoleta. _Proof: unit, browser_
- **X-FEEDBACK-4 · MUST** No anuncies a las tecnologías de apoyo cada carácter que llega en streaming.
  _Proof: browser_
- **X-FEEDBACK-5 · MUST** Los registros en vivo y los resultados en streaming siguen el contenido solo mientras el lector está en lo
  más reciente; desplazarse fuera suspende el seguimiento, y «Ir a lo más reciente» lo restablece sin robar la
  posición de lectura. _Proof: recording_
- **X-FEEDBACK-6 · SHOULD** Usa un contrato de seguimiento/fijado admitido por el anfitrión o el componente elegido, y mantén
  el estado de los trabajos y de la persistencia en la aplicación; un registro de lectura que solo añade no es un gestor de trabajos.

Para X-FEEDBACK-3, prueba el éxito y el fallo retrasados con una actualización del stream de por medio, no solo un
retardo aislado.

## 4. Progreso, fallo y recuperación

- **X-RECOVER-1 · SHOULD** Nombra una fase conocida («Leyendo archivos», «Comprobando permisos», «Escribiendo la exportación»)
  en lugar de mostrar solo un indicador giratorio, y anuncia los cambios de fase con sentido, no cada tic del temporizador.
- **X-RECOVER-2 · MUST** Muestra un porcentaje solo con un denominador medible; el tiempo transcurrido es secundario
  y nunca se presenta como una estimación de finalización. _Proof: review_
- **X-RECOVER-3 · MUST** Un error responde qué falló, si cambió algo y qué hacer a continuación, y
  promete solo lo que el anfitrión puede establecer. _Proof: review_
- **X-RECOVER-4 · MUST** Conserva la entrada en memoria cuando falla el almacenamiento, e informa del fallo de persistencia
  por separado. _Proof: unit_
- **X-RECOVER-5 · SHOULD** Pon los diagnósticos sin credenciales en detalles opcionales.
- **X-RECOVER-6 · SHOULD** Da a un fallo una sola recuperación coherente, no filas y toasts duplicados.
- **X-RECOVER-7 · MUST** Un tiempo de espera agotado no demuestra una reversión: averigua si una operación que modifica datos
  se confirmó antes de reintentar, usando el contrato de idempotencia o deduplicación del anfitrión cuando exista.
  _Proof: unit_

Por ejemplo: «La importación se detuvo antes de guardar. Los archivos que seleccionaste siguen aquí. Reintenta la importación.»

| Condición                           | Respuesta útil                                                       | Evitar                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Ningún contenido de archivo legible | Elegir otro archivo, o continuar sin él si se admite                 | Tratar cada acción como si necesitara el texto del documento                           |
| Red interrumpida                    | Conservar entradas/salida parcial; reintentar cuando haya conexión   | Vaciar el formulario o declarar inutilizable toda la aplicación                        |
| Permiso o configuración rechazados  | Explicar la categoría; enlazar con la cuenta/los ajustes pertinentes | Bucles de reintento automático ante un permiso que falta o una configuración no válida |
| El usuario canceló                  | Marcar como cancelado; conservar la salida recuperable               | Estilo rojo de fallo o reanudar trabajo en pausa                                       |
| El contexto cambió                  | Identificar la salida obsoleta; actualizar con los datos actuales    | Aplicar en silencio un resultado antiguo a un documento más nuevo                      |

## 5. Cancelar, reintentar y completar son resultados distintos

- **X-CANCEL-1 · MUST** Mantén Cancelar y Enviar alcanzables de forma independiente cuando se admiten ambos, con
  nombres accesibles claros y posiciones estables. _Proof: browser_
- **X-CANCEL-2 · MUST** Una solicitud de cancelación no es una cancelación confirmada: muestra su estado pendiente
  hasta que se confirme, y cuando el cliente solo puede dejar de esperar, dilo en lugar de afirmar que el trabajo se detuvo.
  _Proof: unit_
- **X-CANCEL-3 · MUST** La cancelación no se muestra como un fallo. _Proof: browser_
- **X-CANCEL-4 · MUST** Reintentar vuelve a despachar el trabajo sin ampliar en silencio el alcance ni cambiar de
  destino; Restaurar solo vuelve a rellenar las entradas editables. _Proof: unit_
- **X-CANCEL-5 · MUST** Informa de que se ha guardado o aplicado con éxito solo después de que la escritura esté confirmada, y conserva
  la salida parcial recuperable. _Proof: unit_
- **X-CANCEL-6 · MUST** Ofrece Deshacer solo cuando el anfitrión puede revertir de verdad la operación, y nunca prometas
  que Cancelar deshace una escritura ya completada. _Proof: review_

## 6. Verifica lo que una persona puede observar

- **X-VERIFY-1 · SHOULD** Elige la evidencia según el defecto, usando las capas de abajo, en lugar de ejecutar todas
  las pruebas posibles para un cambio pequeño.
- **X-VERIFY-2 · SHOULD** Incluye los caminos sin conexión y de fallo cuando la tarea depende de trabajo externo.
- **X-VERIFY-3 · SHOULD** Indica el commit probado y cualquier requisito externo que quede pendiente.

| Capa de evidencia | Regresión relevante                                                                                                |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| Unidad/estado     | Cancelación, respuestas tardías, identidad del alcance y reintentar frente a restaurar                             |
| Integración       | El borrador sobrevive a un ida y vuelta de contexto; un único fallo coherente; ruta de teclado de la superposición |
| Navegador real    | Dimensiones/líneas base/desbordamiento calculados, cajas de destino, foco, hover deshabilitado e IME               |
| Entre superficies | Formularios, búsqueda, historial, ajustes, importación/exportación, vistas previas y confirmaciones afectados      |
| Variantes         | Temas, anchos, redimensionado, teclado/entrada gruesa, traducciones/RTL y movimiento reducido relevantes           |

Las auditorías estáticas no pueden demostrar la restauración del foco, la cascada ganadora ni una posición de lectura conservada.
Quienes contribuyen a la biblioteca usan [la lista de CODING](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#checklist-before-opening-a-pull-request);
las aplicaciones consumidoras usan los comandos pertinentes del anfitrión, no los comandos de una copia del código fuente de ranui.
