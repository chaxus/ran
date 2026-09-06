# createSpeechRecognizer / isSpeechRecognitionSupported

Una envoltura sobre el `SpeechRecognition` de la Web Speech API, la contraparte de [`AudioRecorder`](./audio_recorder.md), que captura **bytes** de audio; esta le pide a la plataforma que convierta el habla en **texto**.

Merece la pena envolver la API nativa una vez en lugar de tocarla directamente: en WebKit sigue llevando prefijo (`webkitSpeechRecognition`), no aparece en `lib.dom.d.ts` y avisa de sucesos que no son tales (una pausa en silencio, un `stop()` que tú mismo llamaste) por el mismo canal de errores que un micrófono denegado.

## Uso

```ts
import { createSpeechRecognizer } from 'ranuts/utils';

const mic = createSpeechRecognizer({
  lang: () => currentLocale(), // se relee en cada captura, no una sola vez
  onResult: (text, isFinal) => {
    input.value = text;
  },
  onError: (e) => {
    if (e.kind === 'denied') toast('Se denegó el acceso al micrófono');
  },
  onStart: () => button.classList.add('recording'),
  onEnd: () => button.classList.remove('recording'),
});

if (!mic.supported) button.style.display = 'none'; // esconder de entrada el botón del micrófono
button.addEventListener('click', () => mic.toggle());
```

## API

### `isSpeechRecognitionSupported()`

Devuelve `boolean`. La comprobación se hace al llamar, no se guarda al cargar el módulo, así que puedes importar este módulo mientras se renderiza en el servidor y hacer la comprobación cuando la página se hidrate.

### `createSpeechRecognizer(options?)`

Construye un `SpeechRecognizer` reutilizable. `start()` levanta cada vez una instancia nativa nueva, de modo que toda opción que le pases como **función** (`lang`, sobre todo) se relee al empezar cada captura en lugar de quedar congelada al crearlo.

#### Parámetros (`SpeechRecognizerOptions`)

| Opción           | Descripción                                                                                   | Tipo                                             | Por defecto |
| ---------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------ | ----------- |
| `lang`           | Etiqueta BCP 47 (`'en-US'`, `'zh-CN'`), o una función que se lee al empezar cada captura      | `string \| (() => string)`                       | `''`        |
| `continuous`     | Seguir escuchando entre pausas en vez de parar en la primera                                  | `boolean`                                        | `true`      |
| `interimResults` | Emitir resultados parciales mientras la persona habla                                         | `boolean`                                        | `true`      |
| `onResult`       | Se llama con la transcripción de **toda la captura hasta ese momento** y con si es definitiva | `(transcript: string, isFinal: boolean) => void` | `-`         |
| `onError`        | Se llama con un error ya clasificado                                                          | `(error: SpeechError) => void`                   | `-`         |
| `onStart`        | Se dispara cuando empieza una captura                                                         | `() => void`                                     | `-`         |
| `onEnd`          | Se dispara una vez por captura, acabe como acabe (parada, vencida o con error)                | `() => void`                                     | `-`         |

#### `SpeechRecognizer`

| Miembro     | Descripción                                                                                    | Tipo                 |
| ----------- | ---------------------------------------------------------------------------------------------- | -------------------- |
| `supported` | `false` cuando la plataforma no tiene reconocimiento de voz; entonces ningún método hace nada  | `boolean` (captador) |
| `active`    | Si hay una captura en marcha                                                                   | `boolean` (captador) |
| `start()`   | Empieza una captura. Se ignora si ya hay una en marcha                                         | `() => void`         |
| `stop()`    | Termina la captura actual; lo ya reconocido se conserva y después llega `onEnd`                | `() => void`         |
| `abort()`   | Termina la captura actual y descarta los resultados pendientes                                 | `() => void`         |
| `toggle()`  | Empieza si está parado y para si está en marcha: justo lo que pide un único botón de micrófono | `() => void`         |

#### `SpeechError`

| Campo    | Descripción                                                                                                                                                  | Tipo              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `kind`   | `'denied'` (micrófono denegado, conviene mostrarlo), `'noSpeech'` / `'aborted'` (rutina, normalmente no vale la pena mostrarlos), `'failed'` (todo lo demás) | `SpeechErrorKind` |
| `detail` | La cadena `error` en crudo del evento de la plataforma                                                                                                       | `string`          |

## Notas

1. **No está en todas partes.** Firefox no implementa `SpeechRecognition` en absoluto; comprueba siempre `recognizer.supported` (o `isSpeechRecognitionSupported()`) antes de ofrecer un micrófono, en lugar de dar por hecho que el constructor existe.
2. **`supported` y `active` son captadores que se reevalúan en cada acceso**, no valores tomados una vez al crear el objeto. Eso importa si `createSpeechRecognizer()` corre antes de que existan `window` o el constructor con prefijo del fabricante (renderizado en servidor, una llamada temprana en el ámbito del módulo, antes de hidratar): el reconocedor toma la API de verdad en cuanto aparece, en vez de quedarse para siempre diciendo `supported === false`.
3. **La transcripción de `onResult` es acumulativa**, no incremental: es el texto completo de la captura hasta ese momento, revisado a medida que los resultados provisionales se afianzan. No los concatenes tú.
4. Instanciar el reconocedor nativo o llamar a su `start()` puede lanzar de forma síncrona (por una restricción de Permissions-Policy, o por el `InvalidStateError` de Chrome cuando ya hay una captura en marcha); `createSpeechRecognizer` lo captura y lo comunica por `onError` y `onEnd` en lugar de dejarlo escapar.
