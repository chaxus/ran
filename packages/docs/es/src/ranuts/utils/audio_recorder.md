# AudioRecorder

Graba el audio del micrófono en un `Blob`, y de paso sortea un fallo real del navegador en vez de limitarse a envolver `MediaRecorder`.

Chrome (y los navegadores basados en Chromium) escribe los archivos WEBM de `MediaRecorder` sin los metadatos de duración: el archivo suena, pero ni se puede saltar por él ni mostrar cuánto dura hasta que el blob entero se ha descodificado una vez. `AudioRecorder` pide el micrófono, graba y, en el `stop()`, parchea sobre la marcha el campo de duración del contenedor WEBM antes de devolver el `Blob`, de modo que la grabación se comporta desde el primer momento como un archivo de audio normal.

Grabar bytes y reconocer el habla son dos asuntos distintos. Mira [`createSpeechRecognizer`](./speech.md) si lo que quieres de verdad es una transcripción y no un archivo de audio.

## Uso

```ts
import { AudioRecorder } from 'ranuts/utils';

const recorder = new AudioRecorder(); // pide acceso al micrófono de inmediato

startButton.addEventListener('click', () => recorder.start());
pauseButton.addEventListener('click', () => recorder.pause());

stopButton.addEventListener('click', () => {
  const blob = recorder.stop();
  if (blob) audioEl.src = URL.createObjectURL(blob);
});
```

## API

### `new AudioRecorder()`

Pide `getUserMedia({ audio: true })` nada más construirse, y empieza a grabar en cuanto se concede el permiso. No hay un paso aparte para «prepararlo»: construirlo **es** pedir el permiso.

### `start()`

Reanuda la grabación si estaba en `pause()`. Devuelve el `MediaRecorder` subyacente, o `undefined` mientras el flujo del micrófono no esté listo.

### `pause()`

Pausa una grabación en marcha. Devuelve el `MediaRecorder` subyacente, o `undefined`.

### `stop()`

Detiene la grabación y devuelve el `Blob` grabado de forma síncrona, antes de que el arreglo del contenedor (`fixDuration`) haya llegado a ejecutarse. Parchear la duración necesita el búfer completo, y ese solo está disponible cuando el evento `stop` del `MediaRecorder` subyacente ya se ha disparado. En la práctica esto solo importa si lees el valor que devuelve `recorder.stop()` justo en ese instante en lugar de un momento después; esperar al siguiente microtarea, o leer `recorder.blob` una vez que la secuencia `dataavailable`/`stop` se ha asentado, es el orden seguro.

## Notas

1. **Un grabador, un flujo.** No hay `destroy()` ni desmontaje; una vez concedido el permiso, la pista del micrófono queda abierta mientras viva el componente. No construyas un `AudioRecorder` por grabación: reutiliza uno y llama a `start()` y `stop()`.
2. **El permiso se pide al construir, no en `start()`.** Si quieres retrasar la pregunta del navegador hasta que la persona pulse grabar de verdad, retrasa la construcción del propio `AudioRecorder`, no solo la llamada a `start()`.
3. **El arreglo de la duración solo toca `audio/webm`.** Los demás tipos MIME que el navegador pueda elegir (`audio/mp4`, `audio/ogg`, `audio/wav`, `audio/aac`) se devuelven tal cual.
4. Los errores durante `getUserMedia` (permiso denegado, sin micrófono) se escriben en la consola en vez de lanzarse o avisarse por un callback. Comprueba en tu propia interfaz que aparezca de verdad la pregunta de `MediaDevices`, en lugar de confiar en que esta clase te informe de la negativa.
