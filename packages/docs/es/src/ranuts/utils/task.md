# Medir el tiempo de ejecución

A veces hace falta medir cuánto tarda una función para analizar el rendimiento, y para eso están `startTask` y `taskEnd`. También se presentan otras tres formas de medir el tiempo:

1. `new Date().getTime()`,
2. `console.time()` , `console.timeEnd()`,
3. `performance.now()`

## I. `startTask` y `taskEnd`

### 1. startTask

Se llama antes de que empiece la tarea.

#### Devuelve

| Parámetro | Descripción               | Tipo            |
| --------- | ------------------------- | --------------- |
| taskId    | Identificador de la tarea | `unique symbol` |

### 2. taskEnd

Se llama cuando la tarea termina; necesita el identificador que devolvió `startTask`.

#### Opciones

| Parámetro | Descripción               | Tipo            | Por defecto |
| --------- | ------------------------- | --------------- | ----------- |
| taskId    | Identificador de la tarea | `unique symbol` | Obligatorio |

#### Devuelve

| Parámetro | Descripción           | Tipo     |
| --------- | --------------------- | -------- |
| `time`    | Lo que tardó la tarea | `number` |

### 3. Ejemplo de uso

```js
const taskId = startTask();

// hacer algo

const time = taskEnd(taskId);

console.log('La tarea tardó:', time);
```

## II. new Date().getTime()

`new Date().getTime()` devuelve un número: los milisegundos transcurridos desde el 1 de enero de 1970 a las 00:00:00 UTC (tiempo universal coordinado) hasta el instante que representa el objeto de fecha. Usarlo para medir cuánto tarda el JS tiene dos pegas:

1. En algunos casos, la precisión de milisegundo no basta.
2. El instante que interpreta `new Date()` puede no ser el mismo en distintos navegadores o dispositivos. [Documentación de MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Date)
   > Por las diferencias e incoherencias entre navegadores, se recomienda encarecidamente no usar el constructor Date para interpretar cadenas de fecha (ni Date.parse, que es equivalente). Solo hay soporte convencional para las fechas en formato RFC 2822. En cuanto al formato ISO 8601, las cadenas que solo llevan fecha (por ejemplo «1970-01-01») se tratan como UTC y no como hora local, a diferencia de lo que ocurre con las demás.

## III. `console.time()`, `console.timeEnd()`

Arranca un cronómetro para seguir cuánto dura una operación. Cada cronómetro necesita un nombre único, y una página puede tener hasta 10 000 en marcha a la vez. Cuando se llama a `console.timeEnd()` con el nombre del cronómetro, el navegador escribe en milisegundos lo que ha transcurrido. Frente a `new Date().getTime()`, esta forma es más fina: llega a los 0,001 milisegundos (por ejemplo, 0.134ms).

## IV. `performance.now()`

`performance.now()` devuelve el tiempo con precisión de microsegundos y no depende de la hora del sistema (el reloj del sistema puede cambiarse a mano o alterarlo NTP y otros programas). Además, `performance.timing.navigationStart + performance.now()` viene a ser `Date.now()`. Por eso, para medir cuánto tarda el JS, `performance.now()` es la opción más recomendable.

> Nota: para protegerse de los ataques por medición de tiempos y de la creación de huellas, la precisión de `performance.now()` puede recortarse según los ajustes del navegador. En `Firefox`, la preferencia `privacy.reduceTimerPrecision` viene activada con un valor por defecto de `1ms`. Activar `privacy.resistFingerprinting` cambia la precisión a 100 ms o al valor de `privacy.resistFingerprinting.reduceTimerPrecision.microseconds`, el que sea mayor.
