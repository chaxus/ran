---
description: 'Una superficie de vidrio líquido: elige un material y esmerila y curva lo que tiene detrás en un borde de lente. Sobre una imagen o un vídeo refracta los propios píxeles con WebGL2.'
---

# Glass

Una superficie de vidrio líquido. Elige un `material` y el panel está listo: esmerila lo que tiene detrás, lo curva en un borde redondeado como lo haría una lente, separa ligeramente los colores en el filo e ilumina el borde. Cualquier valor suelto se puede sobrescribir con un atributo del mismo nombre. El contenido va en el slot por defecto y toma un color de tinta legible sobre el vidrio.

> **Úsalo cuando** un panel quede sobre contenido rico y colorido: una tarjeta destacada, una barra de herramientas flotante, una capa sobre un vídeo. Sobre un fondo plano no hay nada que curvar y el efecto desaparece.

## Campo de pruebas

Arrastra el vidrio, cambia el material y el fondo, y copia el marcado. El fragmento solo lleva lo que difiere del material.

<GlassPlayground />

```html
<r-glass material="clear" backdrop>
  <div class="panel">…</div>
</r-glass>
```

## Materiales

Cuatro materiales cubren la mayoría de los usos. `regular` es el predeterminado.

<ran-demo>
  <div style="position: relative; display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/aurora.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="thin"><div style="padding: 24px;">thin</div></r-glass>
    <r-glass><div style="padding: 24px;">regular</div></r-glass>
    <r-glass material="thick"><div style="padding: 24px;">thick</div></r-glass>
    <r-glass material="clear"><div style="padding: 24px;">clear</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="thin">…</r-glass>
<r-glass>…regular…</r-glass>
<r-glass material="thick">…</r-glass>
<r-glass material="clear">…</r-glass>
```

| Material  | `blur` | `saturate` | `displace` | `bevel` | `dispersion` | `specular` |
| --------- | ------ | ---------- | ---------- | ------- | ------------ | ---------- |
| `thin`    | 8      | 160        | 12         | 20      | 20           | 80         |
| `regular` | 16     | 180        | 18         | 28      | 25           | 100        |
| `thick`   | 28     | 200        | 22         | 32      | 25           | 100        |
| `clear`   | 2      | 130        | 28         | 40      | 40           | 120        |

## Sobre una imagen

Añade `backdrop` cuando el vidrio esté sobre un `<img>` o un `<video>`. Sin valor usa la primera imagen o vídeo del padre del vidrio; un selector nombra otro. El vidrio lee entonces los píxeles de ese elemento con WebGL2 y refracta cada longitud de onda en su propia medida, en cualquier motor con WebGL2, mientras que la vía CSS solo curva la luz en Chromium. La imagen sigue en la página, así que su texto alternativo y el contenido de alrededor no cambian.

<ran-demo>
  <div style="position: relative; height: 280px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" backdrop rim style="position: absolute; left: 32px; top: 48px; width: 320px;">
      <div style="padding: 32px;">Refracted with WebGL2</div>
    </r-glass>
  </div>
</ran-demo>

```html
<div class="hero">
  <img src="hero.jpg" alt="…" />
  <r-glass material="clear" backdrop rim>…</r-glass>
</div>
```

Una imagen de otro origen necesita `crossorigin` y una respuesta CORS para poder leerse; si no, el vidrio conserva su esmerilado CSS.

## Tono y tinta

`tone` indica qué hay detrás del vidrio. Sobre un fondo oscuro o colorido el borde se ilumina y el contenido es blanco; sobre uno claro un borde blanco desaparece, así que el borde se sombrea y el contenido pasa a ser oscuro. Sobre una imagen `backdrop` el tono sigue el brillo de la zona cubierta, salvo que lo fijes. El tono en vigor está disponible como `:state(light)` y `:state(dark)`, y `--ran-glass-ink` sustituye el color del contenido.

<ran-demo>
  <div style="position: relative; height: 240px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/paper.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass backdrop rim style="position: absolute; left: 32px; top: 40px; width: 300px;">
      <div style="padding: 32px;">The tone follows the image</div>
    </r-glass>
  </div>
</ran-demo>

```css
r-glass:state(light) .badge {
  border-color: rgb(0 0 0 / 0.2);
}
```

## Anidamiento

`<r-glass>` se compone: anida uno dentro de otro para tener materiales en capas, como una barra de herramientas de vidrio sobre un panel de vidrio. Cada capa curva lo que tiene detrás.

<ran-demo>
  <div style="position: relative; padding: 48px; border-radius: 16px; background: radial-gradient(circle at 25% 25%, #f9d423, #ff4e50 55%, #7b4397); overflow: hidden;">
    <r-glass radius="28" style="width: 340px;">
      <div style="padding: 28px;">
        <div style="font-weight: 700; margin-bottom: 16px;">Outer panel</div>
        <r-glass material="thin" radius="16" style="display: block;">
          <div style="padding: 12px 16px; font-size: 13px;">Nested glass toolbar</div>
        </r-glass>
      </div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass radius="28">
  <div class="panel">
    Outer panel
    <r-glass material="thin" radius="16">
      <div class="toolbar">Nested glass toolbar</div>
    </r-glass>
  </div>
</r-glass>
```

## Referencia de la API

### Propiedades

| Propiedad     | Tipo      | Por defecto  | Descripción                                                                                                                                                                                                           |
| ------------- | --------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `material`    | `string`  | `regular`    | `thin`, `regular`, `thick` o `clear`: fija de una vez todos los valores ópticos de abajo.                                                                                                                             |
| `blur`        | `number`  | del material | Radio del esmerilado, en px.                                                                                                                                                                                          |
| `saturate`    | `number`  | del material | Saturación de lo que hay detrás, en porcentaje.                                                                                                                                                                       |
| `displace`    | `number`  | del material | Cuánto tira el borde del fondo hacia dentro, en px. `0` es un cristal plano.                                                                                                                                          |
| `bevel`       | `number`  | del material | Ancho de la franja curva del borde que desvía la luz, en px.                                                                                                                                                          |
| `dispersion`  | `number`  | del material | Cuánto se separan los colores en el borde, como porcentaje de `displace`.                                                                                                                                             |
| `specular`    | `number`  | del material | Intensidad de los brillos, en porcentaje.                                                                                                                                                                             |
| `radius`      | `number`  | `20`         | Radio de las esquinas, en px.                                                                                                                                                                                         |
| `tint`        | `string`  | del material | Relleno sobre el esmerilado: cualquier valor CSS de fondo.                                                                                                                                                            |
| `tone`        | `string`  | `dark`       | `dark` o `light`: qué hay detrás del vidrio. Sin fijar sobre un `backdrop`, sigue a la imagen.                                                                                                                        |
| `backdrop`    | `string`  | —            | Refracta un `<img>` o `<video>` con WebGL2. Vacío usa el primero del padre; un selector nombra otro.                                                                                                                  |
| `rim`         | `boolean` | `false`      | Un borde iluminado por GPU: paredes exterior e interior, una luz principal y una de relleno, destellos. Solo depende de la forma del panel.                                                                           |
| `sheen`       | `boolean` | `false`      | Un brillo que barre la superficie.                                                                                                                                                                                    |
| `interactive` | `boolean` | `false`      | Elevación al pasar el cursor y respuesta al pulsar, para vidrio clicable. También convierte el host en un botón operable con teclado: `role="button"`, una parada de tabulación, Enter y Espacio actúan como un clic. |

### Refracción `displace`

`displace` fija cuánto tira el borde de lo que hay detrás hacia el centro, de modo que el fondo justo dentro del filo se estira sobre él, igual que aumenta un borde convexo grueso. `bevel` fija el ancho de esa franja curva. Por encima de la mitad del bevel, el borde vuelve a plegar la imagen sobre sí misma, como hace el filo de un vidrio grueso real.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; overflow: hidden;">
    <img src="/glass/grid.svg" alt="" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">
    <r-glass material="clear" displace="0" style="flex: 1;"><div style="padding: 24px;">displace = 0</div></r-glass>
    <r-glass material="clear" displace="40" style="flex: 1;"><div style="padding: 24px;">displace = 40</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass material="clear" displace="0">…flat…</r-glass> <r-glass material="clear" displace="40">…lensed edge…</r-glass>
```

### Brillo e interacción

`sheen` añade un brillo en movimiento; `interactive` añade una elevación al pasar el cursor y una pulsación que vuelve a su sitio sin rebote.

<ran-demo>
  <div style="position: relative; padding: 40px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass sheen interactive style="width: 260px;">
      <div style="padding: 20px; font-weight: 600;">Hover & press me</div>
    </r-glass>
  </div>
</ran-demo>

```html
<r-glass sheen interactive>
  <div>Hover &amp; press me</div>
</r-glass>
```

### Rim — filo especular por GPU (opcional)

`rim` dibuja el borde en la GPU: una pared exterior brillante y una interior más tenue donde el bevel se une con la cara plana, iluminadas por una luz principal desde arriba a la izquierda y un relleno tenue desde abajo a la derecha, con un grosor que varía a lo largo del borde y destellos ocasionales. Con un tono `light` las paredes se sombrean en su lugar. Nunca muestrea el fondo: el shader solo conoce el tamaño, el radio y el bevel del panel. Se dibuja primero con WebGL, pasa a WebGPU en segundo plano cuando el navegador lo tiene y deja intacto el brillo CSS cuando no hay ninguno de los dos.

<ran-demo>
  <div style="position: relative; display: flex; gap: 16px; padding: 32px; border-radius: 16px; background: radial-gradient(circle at 30% 30%, #f9d423, #ff4e50 60%, #7b4397); overflow: hidden;">
    <r-glass style="flex: 1;"><div style="padding: 20px; font-size: 13px;">no rim</div></r-glass>
    <r-glass rim style="flex: 1;"><div style="padding: 20px; font-size: 13px;">rim</div></r-glass>
  </div>
</ran-demo>

```html
<r-glass>…CSS highlight…</r-glass> <r-glass rim>…GPU-lit edge…</r-glass>
```

### Parts y tokens CSS

Da estilo al interior con `::part(glass)`, `::part(specular)`, `::part(refraction)` y, cuando `rim` está activo, `::part(rim)`, o sobrescribe las propiedades personalizadas `--ran-glass-*`:

| Token                                         | Para qué sirve                                                                           |
| --------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `--ran-glass-ink`                             | Color del contenido. Blanco por defecto, o casi negro en un tono claro.                  |
| `--ran-glass-tint`                            | Relleno sobre el esmerilado.                                                             |
| `--ran-glass-border`                          | Borde del filo.                                                                          |
| `--ran-glass-shadow`                          | Pila de sombras (especular y profundidad).                                               |
| `--ran-glass-brightness`                      | Brillo de lo que hay detrás.                                                             |
| `--ran-glass-specular-background`             | Fondo del brillo CSS.                                                                    |
| `--ran-glass-specular-opacity`                | Intensidad del brillo CSS; sustituye a `specular` en esa capa.                           |
| `--ran-glass-reduced-transparency-background` | Superficie de respaldo cuando el ajuste del sistema «reducir transparencia» está activo. |
| `--ran-glass-reduced-transparency-shadow`     | Sombra de respaldo en ese mismo estado.                                                  |

```css
r-glass {
  --ran-glass-tint: linear-gradient(135deg, rgb(0 0 0 / 0.2), transparent);
}
```

## Notas {#notes}

- **Dos vías.** Sin `backdrop`, `backdrop-filter` esmerila la página real que hay detrás del vidrio, así que el texto, el vídeo y los controles de detrás siguen funcionando; el borde de lente con colores separados es un filtro SVG que se dibuja en Chromium, y Safari y Firefox conservan el esmerilado. Con `backdrop`, WebGL2 refracta esa única imagen o vídeo en cualquier motor que tenga WebGL2.
- **Legibilidad.** El contenido toma `--ran-glass-ink`. Mantén el texto largo sobre una superficie interior opaca en lugar de confiar el contraste al vidrio.
- **Transparencia reducida.** Con el ajuste del sistema «reducir transparencia» o «aumentar contraste» (`prefers-reduced-transparency: reduce`), el vidrio pasa a ser una superficie sólida que sigue el tema (`--ran-color-bg-elevated`), sin esmerilado, refracción ni brillos.
- **Movimiento.** La superficie solo transiciona `transform`, así que un cambio de tema se resuelve en un fotograma. El brillo y la pulsación respetan `prefers-reduced-motion`.
- **Coste.** El mapa de lente SVG se reconstruye cuando cambian el tamaño, el radio o el bevel del panel. La refracción WebGL comprueba el panel y la imagen una vez por fotograma mientras está visible y solo dibuja cuando alguno de los dos se ha movido.
