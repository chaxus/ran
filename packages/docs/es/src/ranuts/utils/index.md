---
description: 'Panorama de las funciones de utilidad de ranuts: ayudas funcionales (debounce, throttle, memoize, compose) más utilidades de cadenas, objetos, números y color.'
---

# Funciones de utilidad

## Programación funcional

| Método   | Descripción                            | Detalle                   |
| -------- | -------------------------------------- | ------------------------- |
| debounce | Función de rebote (debounce)           | [debounce](./debounce.md) |
| throttle | Función de estrangulamiento (throttle) | [throttle](./throttle.md) |
| memoize  | Función de memoización                 | [memoize](./memoize.md)   |
| noop     | Función que no hace nada               | [noop](./noop.md)         |
| compose  | Compone funciones de middleware        | [compose](./compose.md)   |

## Cadenas de texto

| Método                         | Descripción                                                                  | Detalle                                             |
| ------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| md5                            | Función hash MD5                                                             | [md5](./md5.md)                                     |
| randomString / getRandomString | Genera una cadena aleatoria                                                  | [randomString](./random_string.md)                  |
| clearBr                        | Quita espacios, etiquetas HTML y saltos de línea de una cadena               | [clearBr](./clear_br.md)                            |
| clearStr                       | Quita espacios de los extremos, codificación de URL y comillas de una cadena | [clearStr](./clear_str.md)                          |
| truncate                       | Acorta una cadena con puntos suspensivos, sin romper Unicode                 | [truncate](./truncate.md)                           |
| strParse                       | Interpreta una cadena y la convierte en objeto                               | [strParse](./str_parse.md)                          |
| toString                       | Convierte un valor al tipo cadena                                            | [toString](./to_string.md)                          |
| transformText                  | Convierte un ArrayBuffer en texto                                            | [transformText](./transform_text.md)                |
| checkEncoding                  | Detecta la codificación de caracteres de datos Uint8Array                    | [checkEncoding](./check_encoding.md)                |
| getMatchingSentences           | Extrae oraciones completas que contienen palabras clave                      | [getMatchingSentences](./get_matching_sentences.md) |
| isString                       | Dice si un valor es del tipo cadena                                          | [isString](./is_string.md)                          |

## Objetos

| Método               | Descripción                                                  | Detalle                         |
| -------------------- | ------------------------------------------------------------ | ------------------------------- |
| merge / mergeExports | Fusiona objetos; objeto de exportación con getters perezosos | [merge](./merge.md)             |
| isEqual              | Compara dos valores en profundidad para ver si son iguales   | [isEqual](./is_equal.md)        |
| cloneDeep            | Clona objetos o arrays en profundidad                        | [cloneDeep](./clone_deep.md)    |
| querystring          | Convierte un objeto en la cadena de consulta de una URL      | [querystring](./querystring.md) |
| filterObj            | Filtra un objeto                                             | [filterObj](./filter_obj.md)    |
| formatJson           | JSON con formato                                             | [formatJson](./format_json.md)  |

## Números

| Método                                                             | Descripción                                      | Detalle                                  |
| ------------------------------------------------------------------ | ------------------------------------------------ | ---------------------------------------- |
| range                                                              | Sujeta un número dentro del rango indicado       | [range](./range.md)                      |
| clamp / lerp / inverseLerp / remap / fit / linearstep / smoothstep | Interpolación y remapeo al estilo de los shaders | [range](./range.md)                      |
| mathjs                                                             | Función de cálculo numérico exacto               | [mathjs](./mathjs.md)                    |
| perToNum                                                           | Convierte una cadena de porcentaje en número     | [perToNum](./per_to_num.md)              |
| transformNumber                                                    | Convierte un número en una cadena con unidades   | [transformNumber](./transform_number.md) |
| addNumSym                                                          | Añade el signo positivo o negativo a un número   | [addNumSym](./add_num_sym.md)            |

## Color

| Método                                                                                      | Descripción                                                              | Detalle                          |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------- |
| hexToRgb                                                                                    | Convierte un color hexadecimal a RGB                                     | [hexToRgb](./hex_to_rgb.md)      |
| rgbToHex                                                                                    | Convierte valores RGB a un color hexadecimal                             | [rgbToHex](./rgb_to_hex.md)      |
| randomColor                                                                                 | Genera un objeto de color aleatorio                                      | [randomColor](./random_color.md) |
| Color / ColorScheme                                                                         | Clase Color, clases de valor, conversiones y generador de paletas        | [Color](./color.md)              |
| blendScreen / blendMultiply / blendOverlay / luma / vibrance / cosinePalette / srgbToLinear | Mezcla y corrección de color al estilo de los shaders (canales de 0 a 1) | [Color](./color.md)              |

## Tiempo

| Método                                | Descripción                                               | Detalle                                   |
| ------------------------------------- | --------------------------------------------------------- | ----------------------------------------- |
| formatDuration                        | Convierte un tiempo en segundos en una cadena con formato | [formatDuration](./time_format.md)        |
| formatRelative                        | Describe un momento respecto de ahora («hace 3 días»)     | [formatRelative](./time_format.md)        |
| parseVttTimestamp / parseVttCueTiming | Interpreta las líneas de tiempos de subtítulos WebVTT     | [parseVttTimestamp](./time_format.md)     |
| timestampToTime                       | Convierte una marca de tiempo en un objeto Date           | [timestampToTime](./timestamp_to_time.md) |
| performanceTime                       | Obtiene una marca de tiempo de alta precisión             | [performanceTime](./performance_time.md)  |

## Detección de dispositivo

| Método        | Descripción                           | Detalle                              |
| ------------- | ------------------------------------- | ------------------------------------ |
| isMobile      | Dice si el dispositivo es móvil       | [isMobile](./is_mobile.md)           |
| isWeiXin      | Dice si el navegador es el de WeChat  | [isWeiXin](./is_weixin.md)           |
| isClient      | Dice si el entorno es el del cliente  | [isClient](./is_client.md)           |
| isSafari      | Dice si el navegador es Safari        | [isSafari](./is_safari.md)           |
| currentDevice | Obtiene el tipo de dispositivo actual | [currentDevice](./current_device.md) |

## Manipulación del DOM

| Método                                 | Descripción                                                    | Detalle                                                 |
| -------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------- |
| addClassToElement                      | Añade una clase CSS a un elemento del DOM                      | [addClassToElement](./add_class_to_element.md)          |
| removeClassToElement                   | Quita una clase CSS de un elemento del DOM                     | [removeClassToElement](./remove_class_to_element.md)    |
| createDocumentFragment                 | Crea un DocumentFragment                                       | [createDocumentFragment](./create_document_fragment.md) |
| escapeHtml                             | Escapa los caracteres especiales de HTML                       | [escapeHtml](./escape_html.md)                          |
| Chain                                  | Clase encadenable para manipular el DOM                        | [Chain](./chain.md)                                     |
| create                                 | Función auxiliar para crear elementos del DOM                  | [create](./create.md)                                   |
| EventManager / createDoubleTapDetector | Registro de escuchadores con ámbito y detección de doble toque | [EventManager](./event_manager.md)                      |
| adoptStyles                            | Inyecta texto de hoja de estilos en un shadow root             | [adoptStyles](./adopt_styles.md)                        |
| computePlacement                       | Voltea o desplaza un panel flotante respecto de su ancla       | [computePlacement](./placement.md)                      |
| setFontSize2html                       | Escalado del viewport con rem flexible para diseños móviles    | [setFontSize2html](./set_font_size.md)                  |

## Medios

| Método                 | Descripción                               | Detalle                               |
| ---------------------- | ----------------------------------------- | ------------------------------------- |
| AudioRecorder          | Graba el audio del micrófono en un `Blob` | [AudioRecorder](./audio_recorder.md)  |
| createSpeechRecognizer | Voz a texto mediante la Web Speech API    | [createSpeechRecognizer](./speech.md) |

## Almacenamiento

| Método              | Descripción                     | Detalle                                   |
| ------------------- | ------------------------------- | ----------------------------------------- |
| localStorageGetItem | Lee un valor de localStorage    | [localStorageGetItem](./local_storage.md) |
| localStorageSetItem | Guarda un valor en localStorage | [localStorageSetItem](./local_storage.md) |

## URL y parámetros

| Método            | Descripción                                  | Detalle                                        |
| ----------------- | -------------------------------------------- | ---------------------------------------------- |
| getAllQueryString | Extrae los parámetros de consulta de una URL | [getAllQueryString](./get_all_query_string.md) |
| encodeUrl         | Codifica una URL de forma segura             | [encodeUrl](./encode_url.md)                   |
| appendUrl         | Añade parámetros de consulta a una URL       | [appendUrl](./append_url.md)                   |

## Cookies

| Método          | Descripción                                              | Detalle                                    |
| --------------- | -------------------------------------------------------- | ------------------------------------------ |
| getCookie       | Obtiene el valor de la cookie indicada                   | [getCookie](./get_cookie.md)               |
| getCookieByName | Obtiene el valor de una cookie con una expresión regular | [getCookieByName](./get_cookie_by_name.md) |

## Imágenes

| Método               | Descripción                                    | Detalle                                              |
| -------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| convertImageToBase64 | Convierte un archivo de imagen a Base64        | [convertImageToBase64](./convert_image_to_base64.md) |
| isImageSize          | Valida las dimensiones de un archivo de imagen | [isImageSize](./is_image_size.md)                    |

## Rendimiento

| Método         | Descripción                                      | Detalle                                |
| -------------- | ------------------------------------------------ | -------------------------------------- |
| getPerformance | Obtiene las métricas de rendimiento de la página | [getPerformance](./get_performance.md) |
| getFrame       | Calcula los fotogramas por segundo               | [getFrame](./get_frame.md)             |
| getPixelRatio  | Obtiene la proporción de resolución del Canvas   | [getPixelRatio](./get_pixel_ratio.md)  |

## Red

| Método             | Descripción                                                      | Detalle                            |
| ------------------ | ---------------------------------------------------------------- | ---------------------------------- |
| imageRequest       | Mide la latencia de red mediante una petición de imagen          | [imageRequest](./image_request.md) |
| networkSpeed       | Mide el ping y la fluctuación de la red                          | [networkSpeed](./network_speed.md) |
| connection         | Obtiene información de la conexión de red actual                 | [connection](./connection.md)      |
| getStatus / status | Consulta en ambos sentidos entre código de estado HTTP y mensaje | [getStatus](./status.md)           |

## Navegador

| Método                               | Descripción                                               | Detalle                                   |
| ------------------------------------ | --------------------------------------------------------- | ----------------------------------------- |
| getWindow                            | Obtiene el tamaño de la ventana visible                   | [getWindow](./get_window.md)              |
| createObjectURL / requestUrlToBuffer | Crea una object URL; descarga una URL como bytes en crudo | [createObjectURL](./create_object_url.md) |

## Carga de scripts

| Método       | Descripción                                     | Detalle                             |
| ------------ | ----------------------------------------------- | ----------------------------------- |
| scriptOnLoad | Inserta etiquetas script o link sobre la marcha | [scriptOnLoad](./script_on_load.md) |

## Manejo de errores

| Método          | Descripción                                              | Detalle                                   |
| --------------- | -------------------------------------------------------- | ----------------------------------------- |
| handleConsole   | Intercepta y trata las llamadas a los métodos de console | [handleConsole](./handle_console.md)      |
| handleError     | Manejo global de errores                                 | [handleError](./handle_error.md)          |
| handleFetchHook | Intercepta y trata las peticiones fetch                  | [handleFetchHook](./handle_fetch_hook.md) |

## Otras

| Método             | Descripción                                                  | Detalle                                  |
| ------------------ | ------------------------------------------------------------ | ---------------------------------------- |
| TOTP               | Generador de contraseñas de un solo uso basadas en el tiempo | [TOTP](./totp.md)                        |
| createSignal       | Crea una señal reactiva                                      | [createSignal](./create_signal.md)       |
| setMime / MimeType | Define o actualiza la tabla de tipos MIME                    | [setMime](./set_mime.md)                 |
| getExtensions      | Obtiene las extensiones de un tipo MIME                      | [getExtensions](./get_extensions.md)     |
| SyncHook           | Clase de gancho de eventos síncrono                          | [SyncHook](./sync_hook.md)               |
| durationHandler    | Crea una función de ejecución diferida                       | [durationHandler](./duration_handler.md) |
