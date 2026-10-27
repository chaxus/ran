<!-- source: a963396e1b2e40d4006461f2894dc37ba86beeb5 -->

# Patrones de flujo de trabajo opcionales

Estas recetas se aplican **solo cuando la tarea sale ganando con ellas**. Un formulario, una página de búsqueda o un
editor corrientes no necesitan colas, conexiones de cuentas ni historial de versiones por defecto.
[DESIGN.md](./DESIGN.md) se encarga de la apariencia; [INTERACTION.md](./INTERACTION.md), del comportamiento general.
El anfitrión se encarga de la ingeniería; [la ingeniería de ranui](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md)
es un adaptador de biblioteca opcional. Son decisiones de la aplicación anfitriona,
no API de componentes adicionales, garantías de almacenamiento ni servicios incluidos.

Cada regla lleva un ID y un nivel. Romper una **MUST** es un defecto, y la regla nombra su prueba;
**SHOULD** es lo predeterminado, y quien se desvía explica el motivo en ese caso; **MAY** es opcional.
El [índice de reglas](./RULES.md) recoge todas las reglas graduadas con su prueba.

- **W-RECIPE-1 · SHOULD** Para cada receta elegida, establece qué admite la aplicación antes de
  elegir los controles.
- **W-RECIPE-2 · SHOULD** Mantén el estado de los trabajos, la configuración, los orígenes seleccionados y las revisiones en
  sus dueños actuales. Las vistas leen ese estado y despachan comandos en lugar de duplicar clientes de servicio
  e indicadores de petición en cada panel.

## 1. Trabajo por lotes y colas

**Úsalo cuando:** a la gente le sirve preparar otra importación, subida o exportación mientras hay trabajo en curso.
**Contrato del anfitrión:** despacho, preparación, concurrencia/prioridad, confirmación de la cancelación,
escrituras parciales, prevención de duplicados y persistencia.

| Estado                     | Acción principal                  | Contrato que resolver                                                       |
| -------------------------- | --------------------------------- | --------------------------------------------------------------------------- |
| Listo                      | Subir archivos / Exportar informe | Alcance, destino y prevención de envíos duplicados                          |
| En curso                   | Cancelar, si se admite            | Qué se detiene, qué queda y si se confirmó una escritura                    |
| En curso con trabajo nuevo | Añadir a la cola, si se admite    | El trabajo activo sigue en marcha; la entrada nueva se conserva (W-QUEUE-2) |
| Cola en pausa              | Reanudar la cola                  | Editar un elemento pendiente no lo despacha ni la reanuda                   |
| Fallido                    | Reintentar / Restaurar entradas   | Usa los resultados distintos de INTERACTION §5                              |

- **W-QUEUE-1 · SHOULD** Resuelve el contrato de cada estado de la tabla de la cola de arriba.
- **W-QUEUE-2 · MUST** El trabajo nuevo nunca sustituye ni cancela en silencio el trabajo activo. Sin soporte de
  cola, conserva la entrada nueva y explica la restricción. _Proof: unit_
- **W-QUEUE-3 · MUST** Editar un elemento pendiente en una cola en pausa no lo despacha ni reanuda la
  cola. _Proof: unit_
- **W-QUEUE-4 · SHOULD** Resume el trabajo en cola en una línea, como «2 en cola» o «En pausa · 2 en cola».
- **W-QUEUE-5 · SHOULD** Contrae los detalles de la cola cuando no hacen falta; despliégalos en filas, no en tarjetas anidadas.
- **W-QUEUE-6 · MUST** Cada fila tiene un elemento identificable y ofrece solo acciones admitidas: Editar, Quitar
  o Ejecutar ahora. _Proof: browser_
- **W-QUEUE-7 · SHOULD** Define si Ejecutar ahora espera, se adelanta o se ejecuta en paralelo.
- **W-QUEUE-8 · SHOULD** Representa la preparación dentro de la fila en lugar de añadir un panel grande lleno de
  comandos deshabilitados.
- **W-QUEUE-9 · MUST** Editar la cola conserva el borrador actual, y cancelar la edición lo restaura.
  _Proof: unit_
- **W-QUEUE-10 · MUST** La reconexión no despacha automáticamente el trabajo en cola salvo que el usuario haya elegido esa
  política. _Proof: unit_
- **W-QUEUE-11 · SHOULD** Aplica las [reglas generales de foco y cancelación](./INTERACTION.md) al quitar una fila,
  contraer la cola o detener el trabajo.

## 2. Ajustes según capacidades y trabajo sin conexión

**Úsalo cuando:** una tarea ofrece proveedores, modos, dispositivos o capacidades dependientes de la red distintos.
**Contrato del anfitrión:** almacenamiento de la configuración, una operación de verificación real, la conectividad y las
dependencias locales de ejecución.

- **W-SETTINGS-1 · MUST** Guardar la configuración y comprobar la disponibilidad son acciones separadas con
  resultados separados, y cada una muestra lo que ha conseguido. _Proof: unit, browser_
- **W-SETTINGS-2 · SHOULD** Deriva los controles de la capacidad y el estado, no de un único booleano `connected`.

Una cuenta de almacenamiento remoto, un servicio de base de datos o un conversor local pueden estar configurados sin
ser utilizables en ese momento.

| Estado                          | Lo que entiende el usuario                                                               |
| ------------------------------- | ---------------------------------------------------------------------------------------- |
| Sin configurar                  | Falta una elección o una credencial obligatoria                                          |
| Configurado, sin verificar      | Los ajustes están guardados; la disponibilidad no se ha establecido                      |
| Verificado                      | Una comprobación real tuvo éxito con esta configuración; anota cuándo                    |
| Autorización necesaria/caducada | Volver a conectar la cuenta sin descartar el trabajo guardado                            |
| Servicio inalcanzable           | Una configuración guardada no demuestra que haya conectividad ahora                      |
| Dispositivo sin conexión        | Las operaciones de red no están disponibles; el trabajo local disponible puede continuar |

- **W-SETTINGS-3 · SHOULD** Haz que el usuario pueda distinguir cada estado de la tabla de ajustes de arriba.
- **W-SETTINGS-4 · MUST** Volver a conectar una cuenta cuya autorización es necesaria o ha caducado conserva el trabajo
  guardado. _Proof: unit_
- **W-SETTINGS-5 · MUST** Invalida la verificación cuando cambian los ajustes relevantes de endpoint, cuenta o
  credenciales. _Proof: unit_
- **W-SETTINGS-6 · SHOULD** Trata los eventos online/offline del navegador como pistas, no como prueba de que un endpoint
  concreto funciona.
- **W-SETTINGS-7 · SHOULD** Muestra los ajustes del camino elegido. Un camino de conversión local puede necesitar
  controles de caché/descarga/dispositivo; un camino remoto puede necesitar controles de endpoint/cuenta.
- **W-SETTINGS-8 · MUST** Oculta los campos irrelevantes **y sus mensajes de estado obsoletos**. _Proof: browser_
- **W-SETTINGS-9 · SHOULD** Las cabeceras de ajustes, los grupos de campos, las filas de cuentas y los estados no disponibles/vacíos
  conservan los ejes de contenido y de navegación nombrados en
  [el contrato de alineación de DESIGN](./DESIGN.md#alignment-is-structure-not-polish).
- **W-SETTINGS-10 · SHOULD** Mantén un comando de título/menú ajustado a su contenido; una pista aparte absorbe el relleno de
  la cabecera.
- **W-SETTINGS-11 · SHOULD** Cuenta el relleno de los paneles anidados y de los controles hasta las etiquetas visibles antes de
  declarar alineadas las regiones.
- **W-SETTINGS-12 · MUST** Cambiar de modo conserva la configuración de los demás modos. _Proof: unit_
- **W-SETTINGS-13 · SHOULD** Mantén fácil de encontrar el camino de vuelta a otro modo.
- **W-SETTINGS-14 · SHOULD** Explica el destino de los datos antes de revelarlos.
- **W-SETTINGS-15 · MUST** Un endpoint de API configurado no se presenta como una cuenta autorizada.
  _Proof: review_
- **W-SETTINGS-16 · MUST** Sin conexión, conserva el contenido guardado y los borradores cuando sus datos y su implementación
  están disponibles. _Proof: unit, browser_
- **W-SETTINGS-17 · SHOULD** Sin conexión, mantén disponibles las vistas previas, la edición y las exportaciones cuando sus datos y su
  implementación están disponibles.
- **W-SETTINGS-18 · SHOULD** Sin conexión, oculta el descubrimiento o la promoción que solo funcionan con red y no ofrecen ningún camino
  útil; conserva los objetos conectados existentes con un estado no disponible comprensible.
- **W-SETTINGS-19 · SHOULD** No tomes un recurso en caché como prueba de que están presentes todas las dependencias de
  ejecución.
- **W-SETTINGS-20 · SHOULD** Ofrece un punto de continuación deliberado tras volver a conectar.

## 3. Conexiones de cuentas y orígenes externos

**Úsalo cuando:** el trabajo lee o escribe datos fuera de su objeto actual, ya sean locales o remotos.
**Contrato del anfitrión:** ámbitos de autorización, identidad, comprobaciones de acceso, revocación, credenciales,
procedencia y conservación de las copias importadas. La dirección de un endpoint no establece el acceso a una cuenta.

Las primitivas de presentación no aportan ningún despliegue de OAuth, almacén de credenciales, backend de conectores
ni garantías de almacenamiento. Una pantalla de conexión pulida no puede sustituir el contrato de autorización del anfitrión.

- **W-ACCOUNT-1 · SHOULD** Distingue la autorización de la cuenta, el acceso al origen seleccionado y el uso por parte de una
  operación concreta.
- **W-ACCOUNT-2 · SHOULD** Pide solo los permisos necesarios.
- **W-ACCOUNT-3 · SHOULD** Explica las lecturas, las escrituras y el destino antes de la autorización o de revelar datos.
- **W-ACCOUNT-4 · MUST** La identidad de la cuenta, la reconexión y la revocación/desconexión son alcanzables desde la
  interfaz de conexión. _Proof: browser_
- **W-ACCOUNT-5 · MUST** Desconectar detiene el acceso futuro. _Proof: unit_
- **W-ACCOUNT-6 · SHOULD** Explica por separado qué pasa con las copias importadas al desconectar.
- **W-ACCOUNT-7 · MUST** Mantén las credenciales fuera de las URL, los registros y las vistas previas. _Proof: review_
- **W-ACCOUNT-8 · SHOULD** Muestra la procedencia y la actualidad de los orígenes seleccionados, ya sean un archivo local,
  un registro de base de datos o un documento en la nube.
- **W-ACCOUNT-9 · MUST** Quitar un origen afecta al trabajo posterior, no a la evidencia histórica. _Proof: unit_
- **W-ACCOUNT-10 · MUST** Los errores de permiso, los datos obsoletos y las copias en caché sin conexión tienen estados distintos.
  _Proof: unit_
- **W-ACCOUNT-11 · MUST** Trata el contenido importado como datos no fiables, no como permiso para ejecutar comandos.
  _Proof: review_
- **W-ACCOUNT-12 · MUST** Haz explícitas las escrituras y sus destinos antes de que ocurran.
  _Proof: browser_
- **W-ACCOUNT-13 · SHOULD** Ajusta el paso de revisión previo a una escritura a su impacto.

## 4. Resultados, vistas previas y revisiones

**Úsalo cuando:** una exportación, un documento transformado o un borrador tienen una identidad y un destino que van más allá de un
mensaje de estado pasajero.
**Contrato del anfitrión:** identidad del resultado/la revisión, versión de origen, alcance del destino, confirmación de la escritura,
gestión de conflictos y cualquier historial reversible.

- **W-REVISION-1 · SHOULD** Prefiere una vista previa o un editor adecuados para el contenido sustancial.
- **W-REVISION-2 · MUST** Ofrece Comparar, Aplicar o Deshacer solo cuando el anfitrión lo admite. _Proof: review_
- **W-REVISION-3 · SHOULD** Resume el resultado e identifica su revisión, su origen y su destino cuando
  sea relevante.
- **W-REVISION-4 · SHOULD** Mantén las acciones admitidas de Copiar, Exportar, Comparar o Aplicar junto al resultado
  correspondiente.
- **W-REVISION-5 · MUST** Separa la vista previa de la aplicación, y nombra el destino y el alcance antes de la
  modificación. _Proof: browser_
- **W-REVISION-6 · MUST** Si los datos de origen cambiaron, compara/rebasa o regenera antes de aplicar; las ediciones
  más nuevas nunca se sobrescriben en silencio. _Proof: unit_
- **W-REVISION-7 · SHOULD** Confirma el estado guardado/aplicado y la salida recuperable según
  [el estándar de interacción](./INTERACTION.md).

## Aplicar una receta

- **W-APPLY-1 · MUST** Conserva solo los estados y las acciones que el anfitrión puede cumplir. _Proof: review_
- **W-APPLY-2 · SHOULD** Una pantalla pulida no puede sustituir un contrato de servicio que falta; indica ese
  requisito previo con claridad.

Las transiciones clave ya llevan reglas MUST con prueba unitaria: el trabajo en pausa sigue en pausa (W-QUEUE-3),
la configuración modificada invalida la verificación (W-SETTINGS-5), quitar un origen solo afecta al trabajo
futuro (W-ACCOUNT-9) y las revisiones obsoletas no pueden sobrescribir ediciones nuevas (W-REVISION-6). Sus pruebas cubren
el trabajo interrumpido y sin conexión donde corresponde.
