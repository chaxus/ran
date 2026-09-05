---
description: 'Un botón de micrófono para un compositor de texto que informa de lo que ha oído, deja que la aplicación decida dónde va ese texto y nunca envía en nombre de quien habla.'
---

# Voice Button

Dictado para un compositor de texto, sobre la API Web Speech.

> **Úsalo cuando** quieras el habla como _otra_ manera de rellenar un campo de texto, no como
> sustituto. Escribir tiene que seguir disponible: un camino solo por voz excluye a quien tiene
> una diferencia del habla, a quien está en una sala ruidosa y a quien usa un navegador sin
> reconocimiento alguno.

Un botón de micrófono, y nada más. Se ocupa de la captura e informa de lo que ha oído; dónde va
ese texto lo decide quien lo usa, porque un componente que además escribiera en un campo tendría
que saber en cuál, si añadir o reemplazar, y qué hacer con el cursor: tres respuestas que cambian
en cada aplicación.

## Inicio rápido

```html
<r-voice-button label="Iniciar dictado" active-label="Detener dictado"></r-voice-button>
```

```ts
const mic = document.createElement('r-voice-button');
mic.label = 'Iniciar dictado';
mic.activeLabel = 'Detener dictado';
const input = document.querySelector('textarea');
let base = '';

mic.addEventListener('voicestart', () => {
  // Un espacio entre lo escrito y lo dicho, salvo que ya haya uno.
  base = input.value === '' || /\s$/.test(input.value) ? input.value : `${input.value} `;
});

mic.addEventListener('voiceresult', (event) => {
  input.value = base + event.detail.transcript;
});

composer.append(mic);
```

## Las decisiones que hay detrás

### Informa de la captura entera, no del fragmento más reciente

Los resultados provisionales se **revisan** según avanza el reconocimiento: «你好» pasa a ser
«你好世界», no llega un segundo evento con «世界». Quien añadiera cada evento acabaría con
`你好你好世界`. Recuerda el texto que ya había en el campo y concaténalo una sola vez.

### No envía

El reconocimiento se equivoca con suficiente frecuencia como para que confirmar en nombre de quien
habla le quite la revisión que necesita. Esto rellena el cuadro y ahí se detiene. Enviar sigue
siendo un acto deliberado.

### Se oculta donde no existe el reconocimiento

Firefox no trae reconocimiento de voz, ni lo trae ningún navegador al que le falte la API. Cuando el
reconocimiento no está soportado, el elemento se oculta con `hidden` en lugar de inhabilitarse con
`disabled`: `disabled` da a entender que la función existe pero no está disponible ahora mismo,
mientras que quitar el botón es exacto cuando la función no existe en esta plataforma. Enseñar un
botón que jamás puede funcionar invitaría a una pulsación que no hace nada, y luego exigiría una
explicación.

### Solo dos de los cuatro errores merecen mostrarse

| Tipo       | Qué es                    | ¿Mostrarlo?              |
| ---------- | ------------------------- | ------------------------ |
| `denied`   | se denegó el micrófono    | **sí** (se puede actuar) |
| `failed`   | falló cualquier otra cosa | **sí**                   |
| `noSpeech` | una pausa en silencio     | no                       |
| `aborted`  | una detención por código  | no                       |

Los dos últimos llegan por el mismo canal que un fallo real y no lo son. Sacarlos a la luz mostraría
un error después de cada captura corriente, no solo tras los fallos de verdad.

### Accesibilidad

El **nombre accesible cambia con el estado**, no solo el icono, y `aria-pressed` lleva la
conmutación: un lector de pantalla anuncia «Detener dictado, pulsado», no un icono. **Escape
descarta** una captura en lugar de confirmarla, que es lo que quiere quien se da cuenta a media
frase de que ha dicho algo equivocado.

El estado de escucha se transmite mediante borde, relleno _y_ un anillo, así que no depende solo del
color. El anillo es el único movimiento y es decoración; `prefers-reduced-motion` lo quita sin
perder información.

### El idioma sigue a la página

`lang` se lee **en cada captura** y por defecto toma el del documento, así que una aplicación que
cambia de idioma a mitad de sesión dicta en el idioma que está mostrando.

## Referencia de la API

### Propiedades

| Propiedad     | Tipo      | Por defecto           | Descripción                                                                                                       |
| ------------- | --------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `lang`        | `string`  | el del documento      | Etiqueta BCP 47 del idioma que se habla. Se lee en cada captura.                                                  |
| `continuous`  | `boolean` | `true`                | Sigue escuchando entre pausas en vez de parar en la primera.                                                      |
| `disabled`    | `boolean` | `false`               | Deshabilita el botón: `start()` se ignora y el botón interno queda inhabilitado. No detiene una captura en curso. |
| `label`       | `string`  | `'Start voice input'` | Nombre accesible mientras está en reposo.                                                                         |
| `activeLabel` | `string`  | `'Stop voice input'`  | Nombre accesible mientras escucha.                                                                                |
| `listening`   | `boolean` | `false`               | Solo lectura, reflejado: dale estilo con `:host([listening])`.                                                    |
| `supported`   | `boolean` | —                     | Solo lectura. Si esta plataforma puede reconocer el habla.                                                        |
| `sheet`       | `string`  | `''`                  | CSS inyectado en el shadow DOM del elemento.                                                                      |

### Métodos

`start()` · `stop()` (conserva lo reconocido) · `abort()` (lo descarta) · `toggle()`.

`toggle()` lee el estado del propio reconocedor y no el atributo reflejado: una captura que hubiera
empezado sin informarlo dejaría a los dos en desacuerdo, y la siguiente activación intentaría abrir
una segunda captura, sería rechazada y no haría nada.

### Eventos

| Evento        | Detalle                   | Se dispara cuando                      |
| ------------- | ------------------------- | -------------------------------------- |
| `voicestart`  | —                         | empieza una captura                    |
| `voiceresult` | `{ transcript, isFinal }` | llega texto o se revisa                |
| `voiceerror`  | `{ kind, detail }`        | la plataforma informa de un problema   |
| `voiceend`    | —                         | la captura termina, sea por lo que sea |

### Partes

`button`, `icon`.

## Estilos

`<r-voice-button>` expone **20 propiedades personalizadas de CSS** propias, además de los tokens
semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio
elemento:

```css
r-voice-button {
  --ran-voice-background: var(--ran-color-bg-subtle);
}
```

Partes: `button` · `hint` · `icon`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#voice-button); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Véase también

- [`createSpeechRecognizer`](../../ranuts/utils/): el reconocedor que esto envuelve
- [Conversation](../conversation/): la transcripción en la que aterriza un mensaje dictado
