---
description: 'Una superficie de vidrio esmerilado líquido que combina desenfoque del fondo, desplazamiento SVG que curva la luz y un borde especular, degradando con elegancia donde backdrop-filter no existe.'
---

# Glass

Una superficie de vidrio líquido / esmerilado. `<r-glass>` esmerila y refracta lo que quede detrás: `backdrop-filter` con blur y saturate para el esmerilado, un `feDisplacementMap` SVG para la curvatura líquida de la luz, más un borde y un brillo especulares para que se lea como vidrio. Todo va guiado por tokens; el contenido entra en el slot por defecto.

> **Úsalo cuando** quieras un panel translúcido sobre contenido rico y colorido (una tarjeta destacada, una barra de herramientas flotante, una capa sobre un vídeo). El atributo `displace` decide cuán _líquido_ se ve (0 es un cristal esmerilado plano). Todos los efectos degradan a una superficie translúcida simple allí donde `backdrop-filter` no existe.

## Campo de pruebas

Arrastra el vidrio por el escenario, ajusta cada atributo y copia el marcado exacto. Los valores por defecto son el material esmerilado de iOS.

<GlassPlayground />

```html
<r-glass displace="8">
  <div class="panel">…</div>
</r-glass>
```

> Coloca `<r-glass>` sobre contenido colorido o movido: sobre un fondo plano el efecto no se ve.

## Anidamiento

`<r-glass>` compone: anida uno dentro de otro para materiales por capas (una barra de vidrio sobre un panel de vidrio, por ejemplo). Cada capa refracta lo que tiene detrás.

<Demo>
  <div style="position: relative; padding: 44px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="26" style="width: 340px;">
      <div style="padding: 26px;">
        <div style="color: #fff; font-weight: 700; margin-bottom: 16px;">Panel exterior</div>
        <r-glass radius="16" displace="6" style="display: block;">
          <div style="padding: 14px 16px; color: #fff; font-size: 13px;">Barra de vidrio anidada</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass radius="26">
  <div class="panel">
    Panel exterior
    <r-glass radius="16" displace="6">
      <div class="toolbar">Barra de vidrio anidada</div>
    </r-glass>
  </div>
</r-glass>
```

## Referencia de la API

### Propiedades

| Propiedad     | Tipo      | Por defecto | Descripción                                                                                                                                                                                                                                                             |
| ------------- | --------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `blur`        | `number`  | `16`        | Radio de desenfoque del fondo, en px (cuánto esmerilado).                                                                                                                                                                                                               |
| `saturate`    | `number`  | `180`       | Saturación del fondo, en porcentaje: levanta el color de lo que hay detrás del vidrio.                                                                                                                                                                                  |
| `displace`    | `number`  | `8`         | Fuerza de la refracción líquida (escala del desplazamiento SVG). `0` es un cristal esmerilado plano; más alto, más ondulado.                                                                                                                                            |
| `frequency`   | `number`  | `0.005`     | Frecuencia base de la turbulencia: valores menores dan ondas más grandes y suaves.                                                                                                                                                                                      |
| `radius`      | `number`  | `20`        | Radio de las esquinas, en px.                                                                                                                                                                                                                                           |
| `tint`        | `string`  | sutil       | Tinte del relleno del vidrio: cualquier valor CSS de background.                                                                                                                                                                                                        |
| `sheen`       | `boolean` | `false`     | Barrido especular animado sobre la superficie.                                                                                                                                                                                                                          |
| `interactive` | `boolean` | `false`     | Elevación al pasar el cursor y escala al pulsar, para vidrio en el que se hace clic. También convierte el host en un botón operable con teclado: `role="button"`, parada de tabulación, Enter/Espacio actúan como un clic.                                              |
| `rim`         | `boolean` | `false`     | Borde especular y filo cromático opcionales, para una luz de aspecto más físico. Primero WebGL (siempre, de forma síncrona), con paso transparente a WebGPU en segundo plano si está disponible. Cae en el degradado especular de CSS cuando no hay ninguno de los dos. |

### Refracción `displace`

`displace` gobierna la escala del `feDisplacementMap` SVG: con cuánta fuerza se curva la luz al atravesar la superficie. Ponlo a `0` para un cristal esmerilado sin más.

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: repeating-linear-gradient(45deg, #6366f1, #6366f1 12px, #ec4899 12px, #ec4899 24px); overflow: hidden;">
    <r-glass displace="0" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 0</div></r-glass>
    <r-glass displace="60" radius="14" style="flex: 1;"><div style="padding: 18px; color: #fff; font-size: 13px;">displace = 60</div></r-glass>
  </div>
</Demo>

```html
<r-glass displace="0">…esmerilado plano…</r-glass> <r-glass displace="60">…líquido…</r-glass>
```

### Brillo e interacción

`sheen` añade un reflejo especular en movimiento; `interactive` añade una elevación al pasar el cursor y una pulsación con rebote (usando el token compartido `--ran-motion-ease-spring`).

<Demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive displace="36" style="width: 260px;">
      <div style="padding: 20px; color: #fff; font-weight: 600;">Pasa el cursor y pulsa</div>
    </r-glass>
  </div>
</Demo>

```html
<r-glass sheen interactive displace="36">
  <div>Pasa el cursor y pulsa</div>
</r-glass>
```

### Rim — filo especular por GPU (opcional)

`rim` añade una segunda capa de reflejo: un borde especular iluminado desde una dirección fija arriba a la izquierda, más un sutil filo cromático (RGB) en el borde redondeado del panel. A diferencia de la refracción de `displace`, **nunca muestrea el fondo**: el shader solo conoce el ancho, el alto y el radio de esquina del propio panel, así que no cuesta ninguna de las renuncias en interactividad y accesibilidad que traería un enfoque de GPU que capturase el fondo entero (véanse las [notas](#notes)). Es una capa puramente decorativa sobre el mismo esmerilado de `backdrop-filter`; activarla o desactivarla nunca cambia lo que hay detrás del vidrio ni cómo se muestrea.

Se dibuja primero con WebGL (síncrono, funciona en prácticamente todos los navegadores, así que el borde nunca retrasa su propio primer pintado) y pasa de forma transparente a WebGPU en segundo plano si el navegador lo tiene (mismo efecto, salida idéntica al píxel). Cae en el degradado especular de CSS cuando no hay ninguna de las dos API de GPU (navegadores muy antiguos, GPU deshabilitada, SSR); no hay ningún estado roto o en blanco que haya que contemplar en el diseño.

<Demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass radius="20" style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">sin rim</div></r-glass>
    <r-glass radius="20" rim style="flex: 1;"><div style="padding: 20px; color: #fff; font-size: 13px;">rim</div></r-glass>
  </div>
</Demo>

```html
<r-glass>…especular de CSS a secas…</r-glass>
<r-glass rim>…borde por GPU + filo cromático (WebGL, pasa a WebGPU)…</r-glass>
```

### Parts y tokens CSS

Da estilo a las piezas internas con `::part(glass)`, `::part(specular)` y (cuando `rim` está puesto) `::part(rim)`, o sobrescribe las propiedades personalizadas `--ran-glass-*`:

| Token                                         | Para qué sirve                                                                           |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `--ran-glass-blur`                            | Radio de desenfoque del fondo.                                                           |
| `--ran-glass-saturate`                        | Saturación del fondo.                                                                    |
| `--ran-glass-radius`                          | Radio de las esquinas.                                                                   |
| `--ran-glass-tint`                            | Fondo del relleno.                                                                       |
| `--ran-glass-border`                          | Línea del borde.                                                                         |
| `--ran-glass-shadow`                          | Pila de sombras (especular + profundidad).                                               |
| `--ran-glass-specular-background`             | Fondo del reflejo especular.                                                             |
| `--ran-glass-specular-opacity`                | Intensidad del especular.                                                                |
| `--ran-glass-reduced-transparency-background` | Superficie alternativa cuando el ajuste «reducir transparencia» del sistema está activo. |
| `--ran-glass-reduced-transparency-shadow`     | Sombra alternativa en ese mismo estado.                                                  |

```css
r-glass::part(glass) {
  --ran-glass-tint: linear-gradient(135deg, rgba(0, 0, 0, 0.2), transparent);
}
```

## Notas {#notes}

- **Muestreo del fondo.** `<r-glass>` refracta el DOM que tiene detrás mediante `backdrop-filter`, así que el texto seleccionable, el vídeo en reproducción y los elementos interactivos que quedan detrás siguen funcionando. `rim` (arriba) es una capa GPU puramente decorativa calculada a partir de la forma del propio panel: nunca muestrea el fondo.
- **Legibilidad.** Mantén el texto de lectura sobre una superficie interior opaca; no confíes el contraste solo al vidrio.
- **Transparencia reducida.** `<r-glass>` responde al ajuste del sistema «reducir transparencia» / «aumentar contraste» (`prefers-reduced-transparency: reduce`): cambia a una superficie sólida y consciente del tema (`--ran-color-bg-elevated` por defecto) en lugar de esmerilar y refractar. Los controles nativos lo hacen solos; esto es el equivalente para un elemento personalizado.
- **Refracción entre navegadores.** El efecto líquido de `feDisplacementMap` hoy solo se dibuja en Chromium: Safari y Firefox descartan esa parte del valor de `backdrop-filter` y conservan el esmerilado de blur / saturate / brightness, que es una alternativa legítima —más plana, eso sí—, no un estado roto.
- **Movimiento.** La superficie solo transiciona `transform`, nunca el color, así que los cambios de tema claro/oscuro se resuelven en un fotograma. El brillo y la pulsación respetan `prefers-reduced-motion`.
