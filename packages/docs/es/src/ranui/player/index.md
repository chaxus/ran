---
description: 'El Player de ranui (<r-player>) envuelve un <video> nativo con una barra de control unificada: reproducción, arrastre del progreso, volumen, velocidad y pantalla completa, con streaming HLS/DASH/FLV/WebRTC.'
---

# Player

Un elemento multimedia nativo `<r-player>` que envuelve un `<video>` con una barra de control unificada, arrastre del progreso, control de volumen, velocidad de reproducción, pantalla completa y streaming HLS/DASH/FLV/WebRTC.

> **Úsalo cuando** necesites un reproductor de vídeo con barra de control incorporada, arrastre del progreso, velocidad de reproducción, pantalla completa y streaming HLS/DASH/FLV/WebRTC. `<r-player>` envuelve un `<video>` y funciona igual en cualquier framework.

Construido sobre Web Components, con `hls.js`/`dashjs`/`mpegts.js` cargados bajo demanda para sus respectivos formatos, así que el mismo reproductor funciona igual en cualquier framework. Capacidades sacadas del código fuente:

- Barra de progreso arrastrable con indicador de búfer y tooltip de tiempo al pasar el cursor
- Control de volumen y silencio
- Selección de la velocidad de reproducción
- Pantalla completa (y `Esc` para salir)
- Imagen sobre imagen: el botón solo se dibuja cuando el navegador lo admite de verdad
- Botón de AirPlay / reproducción remota: el propio selector de dispositivos del navegador, detectado por características igual que la imagen sobre imagen
- Gestos móviles: doble toque en la mitad izquierda o derecha para saltar ∓10s, deslizamiento vertical en la mitad derecha para el volumen (solo táctil; la interacción con ratón o lápiz no se ve afectada)
- Arrastre con dedo, lápiz o ratón: el punto del progreso usa una única implementación de Pointer Events para los tres; si el navegador reclama el puntero a mitad del arrastre, este termina sin saltar, porque el puntero nunca se soltó en una posición que la persona eligiera
- Vista previa en miniatura al arrastrar: pon en `thumbnails` la URL de un manifiesto WebVTT de hoja de sprites y aparecerá una miniatura recortada sobre el tooltip de la barra
- `poster` / `autoplay` / `loop` / `muted`: atributos estándar de `<video>`, pasados tal cual
- Subtítulos: pon la propiedad `tracks`, el navegador dibuja las señales de forma nativa y un selector de idioma recuerda la elección de quien mira
- Error y reintento: un diálogo `Modal.error()` en fallos fatales de reproducción, activo por defecto, se desactiva con `disable-error-modal`
- Retomar la reproducción: se activa con `remember-position`, se guarda en `localStorage` con clave por `src`
- Métricas QoE: `getMetrics()` deriva del flujo de eventos ya existente el número y la duración de los rebuffers, el tiempo hasta el primer fotograma, el número de cambios de calidad y el de errores
- Reproducción HLS (`.m3u8`) y DASH (`.mpd`) con cambio automático de bitrate y selector manual de calidad; reproducción FLV / MPEG-TS crudo (`.flv`/`.ts`) mediante `mpegts.js`. Cada motor se carga bajo demanda, sin configuración. Fuerza un motor concreto (o vuelve al `<video src>` simple) con el atributo `format` cuando no se pueda olfatear la extensión de la URL.
- Reproducción en directo de baja latencia por WebRTC vía WHEP (`format="webrtc"`, `src` es la URL de un endpoint WHEP): sin dependencias de biblioteca, `RTCPeerConnection` es una API nativa del navegador.
- Atajos de teclado: `Espacio` reproducir/pausar, `Flecha izquierda` / `Flecha derecha` saltar 5s, `Escape` salir de pantalla completa, `Inicio`/`Fin`/flechas sobre la barra enfocada

## Inicio rápido

<ran-demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</ran-demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

> El elemento se dibuja como `display: block`. Dale un ancho y un alto explícitos (con estilo en línea o CSS) para que el vídeo tenga una caja que llenar.

## Referencia de la API

### Propiedades

| Propiedad             | Tipo                  | Por defecto | Descripción                                                                                                                                                                                                                                                                                      |
| --------------------- | --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src`                 | `string`              | `''`        | URL del recurso de vídeo. Cambiarla recarga el reproductor. El motor (HLS/nativo) se detecta solo a partir de la extensión.                                                                                                                                                                      |
| `format`              | `string`              | `''`        | Fuerza un motor concreto (`hls` / `dash` / `flv` / `webrtc` / `native`) en vez de detectarlo por la extensión de `src`. Útil para URL de streaming sin extensión o firmadas; **obligatorio** para `webrtc` (un endpoint WHEP no tiene extensión que detectar). Cambiarlo recarga el reproductor. |
| `volume`              | `string`              | `''`        | Volumen inicial en una escala de `0` a `100`, la misma que usan `setVolume()`/`getVolume()`.                                                                                                                                                                                                     |
| `currentTime`         | `string`              | `''`        | Posición inicial de reproducción, en segundos. También se acepta en minúsculas como `currenttime`.                                                                                                                                                                                               |
| `playbackRate`        | `string`              | `''`        | Multiplicador de velocidad (por ejemplo `1`, `1.5`, `2`). También se acepta en minúsculas como `playbackrate`.                                                                                                                                                                                   |
| `debug`               | `string`              | `''`        | Cuando es un valor verdadero, registra en la consola cada evento `change` interno y los avisos.                                                                                                                                                                                                  |
| `sheet`               | `string`              | `''`        | Texto CSS inyectado en el shadow DOM del componente para darle estilos propios.                                                                                                                                                                                                                  |
| `poster`              | `string`              | `''`        | URL de la imagen que se muestra antes de empezar. Se pasa directa a `<video poster>`.                                                                                                                                                                                                            |
| `autoplay`            | `boolean`             | `false`     | Atributo booleano: su presencia significa `true`, igual que `<video autoplay>` nativo. Los navegadores suelen exigir `muted` para que la reproducción automática arranque sin un gesto de la persona.                                                                                            |
| `loop`                | `boolean`             | `false`     | Atributo booleano: repite la reproducción al terminar, igual que `<video loop>` nativo.                                                                                                                                                                                                          |
| `muted`               | `boolean`             | `false`     | Atributo booleano: empieza sin sonido. Por dentro pone el volumen a `0` (para que el icono y el deslizador coincidan) **y** la bandera nativa `<video>.muted` (para satisfacer la política de autoplay silenciado del navegador). Quitar el atributo restaura el volumen anterior.               |
| `thumbnails`          | `string`              | `''`        | URL de un manifiesto WebVTT de hoja de sprites; muestra una miniatura recortada sobre el tooltip de la barra. Véase [Vista previa en miniatura](#thumbnail-scrubbing-preview-thumbnails) más abajo. Independiente de `src`: solo se vuelve a pedir cuando cambia este atributo.                  |
| `disable-error-modal` | `boolean`             | `false`     | Desactiva el diálogo incorporado de error y reintento. Los errores te siguen llegando por los eventos `change` `error`/`sourceerror`, así que puedes montar tu propia interfaz encima.                                                                                                           |
| `remember-position`   | `boolean`             | `false`     | Activa retomar la reproducción: guarda la posición actual en `localStorage` (con clave por `src`) al pausar o cuando la pestaña se oculta, la restaura en la siguiente carga del mismo `src` y la borra cuando termina la reproducción.                                                          |
| `tracks`              | `PlayerTrackConfig[]` | `[]`        | Pistas de subtítulos. **Solo propiedad de JS, sin atributo equivalente** (el reproductor limpia su propio DOM ligero en cada carga, así que unos `<track>` hijos declarativos se borrarían antes de hacer efecto). Véase [Subtítulos](#subtitles-cc-tracks) más abajo.                           |

> Atributos observados (según `observedAttributes`): `src`, `format`, `volume`, `currentTime` / `currenttime`, `playbackRate` / `playbackrate`, `debug`, `sheet`, `poster`, `thumbnails`, `autoplay`, `loop`, `muted`, `disable-error-modal`, `remember-position`.

### Fuente de vídeo `src`

<ran-demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</ran-demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

### Directo por WebRTC `format="webrtc"`

```html
<r-player format="webrtc" src="https://stream.example.com/whep/room123"></r-player>
```

Para directos de baja latencia, pon `format="webrtc"` y apunta `src` a un endpoint **WHEP** (WebRTC-HTTP Egress Protocol), de los que exponen Cloudflare Stream, el egress de LiveKit, Millicast y plataformas parecidas. No hay dependencias de biblioteca: `RTCPeerConnection` y `fetch` son API nativas del navegador, así que, a diferencia de HLS/DASH/FLV, este motor no tiene ningún trozo que descargar. Un endpoint WHEP no tiene extensión de archivo que detectar, así que `format="webrtc"` es **obligatorio**; nunca se deduce de `src`.

Por dentro: crea una `RTCPeerConnection` con transceptores de audio y vídeo `recvonly`, espera a que se reúnan los candidatos ICE, hace `POST` de la oferta SDP a `src` (`Content-Type: application/sdp`), aplica la respuesta SDP del cuerpo y conecta el flujo entrante con `video.srcObject`. Al terminar la reproducción hace `DELETE` del recurso de sesión que el servidor devolvió en la cabecera `Location`. El alcance es deliberadamente modesto: ICE sin trickle (con un tope de unos segundos, y luego sigue con los candidatos que tenga) en vez del mecanismo de trickle por PATCH de WHEP, y sin leer la cabecera `Link: rel="ice-server"` para las pistas de STUN/TURN que da el servidor; la mayoría de despliegues WHEP directamente accesibles funcionan sin ninguna de las dos. Como en FLV, no hay selector de calidad: WHEP no tiene una selección multi-bitrate estándar del lado del cliente, así que el `qualitySwitchCount` de `getMetrics()` se queda en `0` con este motor.

### Volumen inicial `volume`

El valor va en una escala de `0` a `100`.

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" volume="30"></r-player>
```

### Posición inicial `currentTime`

Segundos desde el comienzo del medio.

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" currentTime="15"></r-player>
```

### Velocidad de reproducción `playbackRate`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" playbackRate="1.5"></r-player>
```

### Registro de depuración `debug`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" debug="true"></r-player>
```

### Póster, autoplay, bucle y silencio

```html
<r-player
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  poster="/ran/hls/poster.jpg"
  autoplay
  muted
  loop
></r-player>
```

### Imagen sobre imagen

El botón de PiP en la barra de control solo aparece cuando `document.pictureInPictureEnabled` es verdadero. No queda un botón muerto en los navegadores que no lo admiten. Actívalo desde el código con `togglePip()`.

### AirPlay / reproducción remota

El botón de emitir aparece cuando el navegador expone la Remote Playback API estandarizada (`videoElement.remote.prompt()`, Chrome/Edge) o el `webkitShowPlaybackTargetPicker()` de Safari (AirPlay); en los demás casos se oculta, no se deshabilita, la misma regla de mejora progresiva que la imagen sobre imagen. Abre el selector de dispositivos desde el código con `showRemotePlaybackPicker()`.

### Gestos móviles

Solo táctil, activos por defecto y sin atributo que los habilite: doble toque en la mitad izquierda del vídeo para retroceder 10 segundos, doble toque en la mitad derecha para avanzar 10 (un breve `-10s`/`+10s` lo confirma), y arrastre vertical en la mitad derecha para ajustar el volumen. La interacción con ratón y lápiz queda intacta. Un toque simple sigue alternando reproducir y pausar, solo que con el mismo retardo que se usa para detectar el doble toque, de modo que un doble toque para saltar nunca deja que el toque intermedio haga parpadear la reproducción. Emite un evento `change` `gestureseek` (`{ direction, seconds }`) junto al ya existente `volume` del deslizamiento.

### Vista previa en miniatura `thumbnails` {#thumbnail-scrubbing-preview-thumbnails}

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" thumbnails="/ran/hls/thumbnails.vtt"></r-player>
```

`thumbnails` apunta a un manifiesto WebVTT cuyas señales siguen la convención de hoja de sprites que usan YouTube y Video.js: el texto de cada señal es una referencia a una imagen más un fragmento `#xywh=x,y,w,h` que identifica su recorte dentro de una hoja compartida:

```text
WEBVTT

00:00:00.000 --> 00:00:05.000
sprites.jpg#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
sprites.jpg#xywh=160,0,160,90
```

La referencia a la imagen se resuelve respecto a la URL del propio archivo VTT, así que una hoja de sprites junto al manifiesto no necesita ruta absoluta. Al pasar el cursor (o arrastrar) por la barra se muestra la señal que cubre ese instante como miniatura recortada sobre el tooltip de tiempo; no se dibuja nada si `thumbnails` no está puesto, ni antes de que el manifiesto se haya cargado. El manifiesto se pide y se analiza una vez por cada cambio de `thumbnails`, con independencia de `src`: cambiar de calidad o de fuente no lo vuelve a pedir.

### Subtítulos `tracks` {#subtitles-cc-tracks}

```js
const player = document.createElement('r-player');
player.tracks = [
  { src: '/captions/en.vtt', srclang: 'en', label: 'English', default: true },
  { src: '/captions/fr.vtt', srclang: 'fr', label: 'Français' },
];
stage.append(player);
```

Cada entrada se convierte en un `<track>` nativo sobre el `<video>` subyacente; el dibujado de las señales es enteramente del navegador, el reproductor no pinta nada propio. En la barra de control aparece un selector de idioma (un `<r-select>`, con la misma interacción que el selector de calidad) con **Off** más una entrada por pista; el idioma elegido se recuerda en `localStorage` y se aplica solo la próxima vez que cualquier `<r-player>` de la página reciba pistas (preferencia global, no por vídeo), recurriendo a la pista con `default: true` si aún no hay nada guardado. Poner `tracks = []` elimina el selector y todas las pistas. `setSubtitleLanguage(lang)` fija el idioma activo desde el código (`lang` es un `srclang`, o `'off'`).

### Error y reintento

Activo por defecto. Un error fatal del motor de streaming o un evento `error` del `<video>` nativo abre un diálogo `Modal.error()` (cargado bajo demanda: `r-modal` ni siquiera se descarga hasta que algo falla de verdad) con un botón de **Reintentar** que recarga el reproductor. Pon `disable-error-modal` para apagarlo y manejar los errores tú mediante los eventos `change` `error`/`sourceerror`. Los errores no fatales del motor (que hls.js recupera por dentro) nunca abren el diálogo.

### Retomar la reproducción `remember-position`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" remember-position></r-player>
```

Guarda `getCurrentTime()` en `localStorage` (con clave por `src`) al hacer `pause` y siempre que la pestaña se oculta (`visibilitychange`, más fiable que `beforeunload`), lo restaura en la siguiente carga de ese mismo `src` y lo borra cuando el vídeo llega a `ended`. Se salta en silencio si la posición guardada está a menos de 2 segundos del final: un vídeo terminado vuelve a empezar en lugar de «retomarse» en su propio final. Solo se recuerda la posición; las preferencias de volumen, velocidad y subtítulos son opciones aparte.

### Métricas QoE {#qoe-metrics}

```js
const player = document.createElement('r-player');
player.addEventListener('change', () => {
  console.log(player.getMetrics());
  // { rebufferCount, rebufferDuration, firstFrameMs, qualitySwitchCount, errorCount }
});
stage.append(player);
```

`getMetrics()` devuelve una instantánea, como objeto plano, derivada del mismo flujo de eventos `change` que se documenta abajo; no hay ningún seguimiento aparte que activar:

| Campo                | Tipo             | Descripción                                                                                                  |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------ |
| `rebufferCount`      | `number`         | Número de transiciones `waiting`→`playing` (atascos que luego se recuperaron).                               |
| `rebufferDuration`   | `number`         | Tiempo total (ms) atascado en todos los rebuffers.                                                           |
| `firstFrameMs`       | `number \| null` | ms desde que el `src` actual empieza a cargar hasta el primer fotograma reproducible; `null` hasta entonces. |
| `qualitySwitchCount` | `number`         | Número de niveles de calidad que la persona ha elegido en el selector.                                       |
| `errorCount`         | `number`         | Número de eventos `error`/`sourceerror`.                                                                     |

La instantánea se reinicia cada vez que se carga un nuevo `src`/`format`. Siempre describe la fuente **actual**, no un acumulado entre fuentes.

## Métodos

El reproductor expone controles imperativos en la instancia del elemento:

| Método                                     | Descripción                                                                                                                              |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `play(time?)`                              | Inicia la reproducción, opcionalmente saltando a `time` (segundos).                                                                      |
| `pause()`                                  | Pausa la reproducción.                                                                                                                   |
| `getCurrentTime()`                         | Posición actual de reproducción, en segundos.                                                                                            |
| `setCurrentTime(seconds)`                  | Salta a una posición.                                                                                                                    |
| `getTotalTime()`                           | Duración total del medio, en segundos.                                                                                                   |
| `getVolume()` / `setVolume(v)`             | Lee o fija el volumen en una escala de `0` a `100`, la misma que el atributo `volume`.                                                   |
| `getPlaybackRate()` / `setPlaybackRate(n)` | Lee o fija el multiplicador de velocidad.                                                                                                |
| `customRequestFullscreen()`                | Entra en pantalla completa. Devuelve una `Promise`.                                                                                      |
| `customExitFullscreen()`                   | Sale de pantalla completa. Devuelve una `Promise`.                                                                                       |
| `togglePip()`                              | Entra o sale de imagen sobre imagen. No hace nada si no hay soporte o no hay fuente cargada.                                             |
| `setSubtitleLanguage(lang)`                | Fija la pista de subtítulos activa por `srclang`, o `'off'` para desactivarla.                                                           |
| `getMetrics()`                             | Lee la instantánea actual de [métricas QoE](#qoe-metrics).                                                                               |
| `showRemotePlaybackPicker()`               | Abre el selector de dispositivos de AirPlay / reproducción remota del navegador. No hace nada si no hay soporte o no hay fuente cargada. |

## Eventos

El reproductor despacha un único CustomEvent `change`. Cada transición interna de estado (los eventos multimedia nativos y las propias acciones de la interfaz del reproductor) desemboca ahí, así que te suscribes una vez y ramificas según `detail.type`.

```html
<r-player id="player" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>

<script>
  const player = document.getElementById('player');
  player.addEventListener('change', (e) => {
    const { type, data, currentTime, duration, tag } = e.detail;
    console.log(type, currentTime, duration);
    // `tag` es la propia instancia de <r-player>
  });
</script>
```

### Contenido de `detail`

| Propiedad     | Tipo      | Descripción                               |
| ------------- | --------- | ----------------------------------------- |
| `type`        | `string`  | El nombre del cambio que ocurrió.         |
| `data`        | `unknown` | El valor o evento asociado al cambio.     |
| `currentTime` | `number`  | Tiempo de reproducción actual (segundos). |
| `duration`    | `number`  | Duración total del medio (segundos).      |
| `tag`         | `Element` | La instancia de `<r-player>`.             |

### Valores de `detail.type`

Estados multimedia nativos reenviados desde el `<video>` subyacente:

| Tipo             | Descripción                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `canplay`        | Hay datos suficientes para empezar a reproducir.                                                                         |
| `canplaythrough` | Puede reproducirse hasta el final sin pararse a cargar.                                                                  |
| `complete`       | Dibujado completado.                                                                                                     |
| `durationchange` | El valor de `duration` cambió.                                                                                           |
| `emptied`        | El medio se vació o se recargó.                                                                                          |
| `ended`          | La reproducción llegó al final.                                                                                          |
| `error`          | Ocurrió un error multimedia (también abre el diálogo incorporado de error y reintento, salvo con `disable-error-modal`). |
| `loadstart`      | El navegador empezó a cargar el medio.                                                                                   |
| `loadedmetadata` | Los metadatos se han cargado.                                                                                            |
| `loadeddata`     | El primer fotograma se ha cargado.                                                                                       |
| `progress`       | Se dispara periódicamente mientras el recurso se carga.                                                                  |
| `ratechange`     | La velocidad de reproducción cambió.                                                                                     |
| `seeking`        | Empezó un salto.                                                                                                         |
| `seeked`         | Terminó un salto.                                                                                                        |
| `stalled`        | El navegador intenta traer datos pero no llega ninguno.                                                                  |
| `suspend`        | La carga del medio se suspendió.                                                                                         |
| `timeupdate`     | `currentTime` cambió.                                                                                                    |
| `volumechange`   | El volumen del elemento de vídeo cambió.                                                                                 |
| `waiting`        | La reproducción se detuvo esperando datos.                                                                               |
| `play`           | La reproducción empezó.                                                                                                  |
| `playing`        | La reproducción se reanudó tras una carga o una pausa.                                                                   |
| `pause`          | La reproducción se pausó.                                                                                                |

Acciones propias del reproductor:

| Tipo               | `data`                   | Descripción                                                                                                                                                                                                                           |
| ------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `volume`           | `number` (`0`–`100`)     | El volumen cambió desde la barra de control o el botón de silencio.                                                                                                                                                                   |
| `speed`            | `number`                 | La velocidad cambió desde el selector de velocidad.                                                                                                                                                                                   |
| `fullscreen`       | `boolean`                | Se entró (`true`) o se salió (`false`) de pantalla completa.                                                                                                                                                                          |
| `pictureinpicture` | `boolean`                | Se entró (`true`) o se salió (`false`) de imagen sobre imagen; se dispara tanto si lo provocó `togglePip()` como los propios controles de la ventana PiP del navegador.                                                               |
| `subtitlechange`   | `string`                 | El idioma de los subtítulos cambió desde el selector o con `setSubtitleLanguage()`: un `srclang`, o `'off'`.                                                                                                                          |
| `resume`           | `number`                 | Una posición guardada se restauró en silencio al cargar (`remember-position`); `data` es el tiempo restaurado, en segundos.                                                                                                           |
| `levelsready`      | `{ levels }`             | Se analizó el manifiesto del motor de streaming; ya hay niveles de calidad disponibles.                                                                                                                                               |
| `sourceerror`      | `{ fatal, detail }`      | Ocurrió un error del motor de streaming (recurre al `src` crudo; un error **fatal** además abre el diálogo de error y reintento salvo con `disable-error-modal`; los no fatales son la recuperación interna del motor y no lo abren). |
| `qualityswitch`    | `{ level }`              | La persona eligió un nivel de calidad en el selector.                                                                                                                                                                                 |
| `gestureseek`      | `{ direction, seconds }` | Se disparó un gesto de doble toque para saltar (`direction` es `'forward'`/`'backward'`).                                                                                                                                             |

## Slots

El reproductor no acepta contenido en slots: limpia sus propios hijos del DOM ligero (`this.innerHTML = ''`) en el constructor y otra vez en cada carga de fuente. Para superponer elementos propios, dale estilo al reproductor con el atributo `sheet`.

## Estilos

`<r-player>` expone **136 propiedades personalizadas de CSS** propias, además de los tokens semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio elemento:

```css
r-player {
  --ran-player-tip-background: var(--ran-color-bg-subtle);
}
```

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#player); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Buenas prácticas

- **Tamaño**: el host es `display: block` y no tiene tamaño propio; dale siempre un ancho y un alto explícitos, o el vídeo se colapsa.
- **Motores de streaming**: las fuentes `.m3u8` (HLS), `.mpd` (DASH) y `.flv`/`.ts` (FLV/MPEG-TS vía `mpegts.js`) cargan su motor bajo demanda y de forma automática; no hace falta configurar nada. Si no se puede olfatear la extensión de la URL (URL de CDN sin extensión o firmadas), pon el atributo `format` de forma explícita (por ejemplo `format="dash"`) en vez de fiarte de la detección. WebRTC (`format="webrtc"`) siempre es explícito: un endpoint WHEP no tiene nada que olfatear.
- **Un solo escuchador**: prefiere un único escuchador de `change` con un `switch (detail.type)` antes que intentar enganchar muchos manejadores; todo el estado fluye por `change`.
- **Unidades de volumen**: `volume` (el atributo), `setVolume()`/`getVolume()` y la carga del cambio `volume` usan todos una única escala de `0` a `100`. Solo el `<video>.volume` nativo subyacente va de `0` a `1`; el reproductor convierte en esa única frontera.
- **La imagen sobre imagen es mejora progresiva**: el botón se oculta, no se deshabilita, cuando el navegador no la admite; no des por hecho que siempre está en el DOM.
- **Estilos propios**: usa el atributo `sheet` para inyectar CSS en el shadow DOM; el reproductor no expone identificadores `::part()` propios.

## Hoja de ruta

`<r-player>` está en desarrollo activo; en [`PLAYER_ROADMAP.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/PLAYER_ROADMAP.md), dentro del repositorio, está lo que viene a continuación.
