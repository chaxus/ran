---
description: 'El Icon de ranui (<r-icon>) dibuja gráficos vectoriales semánticos (SVG) con control de tamaño y color.'
---

# Icon

Dibuja gráficos vectoriales semánticos (SVG) con control de tamaño y color.

> **Úsalo cuando** necesites un icono vectorial con nombre, redimensionable y recoloreable (con una animación de giro opcional) en línea en tu interfaz: `<r-icon>` dibuja por `name` un SVG registrado.

## Cómo usar los iconos

### Lo más fácil: usa un nombre incluido (sin configuración)

ranui trae su conjunto de iconos **incorporado dentro del paquete**. Un `name` incluido **se carga solo cuando hace falta**: sin registro, sin imports, sin cablear rutas de recursos. Solo se descarga el SVG que realmente usas (cada uno es un fragmento asíncrono aparte), así que referenciar un icono nunca arrastra el conjunto entero:

```html
<r-icon name="lock"></r-icon> <r-icon name="eye"></r-icon>
```

Los nombres válidos incluidos son la unión `RanIconName` / la tupla `RAN_ICON_NAMES` (más abajo). Un nombre **personalizado** que nunca se registró sigue sin dibujar **nada** (un hueco en blanco); eso solo afecta a tus propios SVG, y se trata en [Iconos personalizados](#custom-icons).

### Opcional: registrar todo el conjunto por adelantado

Si prefieres tener cada icono incluido disponible **de forma síncrona** (sin carga asíncrona por icono, por ejemplo para evitar un destello en vistas densas de iconos, o en un entorno sin división de código), llama a `registerBuiltinIcons()` una vez, lo antes posible:

```ts
import { registerBuiltinIcons } from 'ranui'; // o 'ranui/icons'

registerBuiltinIcons(); // registra por adelantado cada nombre de RAN_ICON_NAMES (~15 KB)
```

Los nombres válidos se exportan como el tipo unión `RanIconName` y la tupla `RAN_ICON_NAMES` (así tu editor los autocompleta y las erratas se detectan):

`add-user`, `arrow-down`, `book`, `check-circle`, `check-circle-fill`, `close`, `close-circle`, `close-circle-fill`, `drop`, `eye`, `eye-close`, `github`, `globe`, `home`, `info-circle`, `info-circle-fill`, `issue`, `loading`, `loading-scene`, `lock`, `menu`, `message`, `more`, `plus`, `power-off`, `preview`, `search`, `setting`, `sort`, `team`, `unlock`, `user`, `warning-circle`, `warning-circle-fill`, `without-content`

### Iconos personalizados {#custom-icons}

Para registrar tus propios SVG (de cualquier biblioteca de iconos o del canal de recursos de tu build), pasa las cadenas SVG en crudo a `registerIcons` / `registerIcon`:

```ts
import { registerIcon, registerIcons } from 'ranui';
import lock from './icons/lock.svg?raw'; // como tu bundler exponga el SVG como cadena en crudo

registerIcons({
  lock,
  logo: '<svg viewBox="0 0 24 24"><path d="…" /></svg>', // cadena en línea: no hace falta archivo
});
registerIcon('star', '<svg viewBox="0 0 24 24">…</svg>');
```

También puedes saltarte el registro por completo pasando el marcado SVG en crudo directamente a `name` (se dibuja tal cual cuando empieza por `<svg`):

```html
<r-icon name='<svg viewBox="0 0 24 24">…</svg>'></r-icon>
```

> **Nota:** los archivos `assets/icons/*.svg` en crudo **no** forman parte del paquete npm publicado (solo se publica `dist/`), así que `import '…/lock.svg?raw'` desde `ranui` no resolverá; usa `registerBuiltinIcons()` para el conjunto incluido, o registra tus propias cadenas SVG.

> **SSR y momento del registro.** El registro debe ejecutarse en el navegador. Si un `<r-icon>` se conecta antes de que su icono esté registrado, se queda en blanco y luego se rellena solo cuando el registro termina (el elemento escucha el evento `ranui-icon-registered`). Para evitar un destello de iconos vacíos, registra en lo más alto de tu módulo de entrada, de modo que el registro esté lleno antes de que se dibuje el primer componente. En desarrollo, un nombre sin registrar imprime `[ranui-icon] icon not registered: <name>`.

## Demostración

<Demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</Demo>

```xml
 <r-icon name="lock"  ></r-icon>
 <r-icon name="eye"  ></r-icon>
 <r-icon name="user"  ></r-icon>
```

## Atributos

### `name`

Selecciona un icono distinto según el nombre.

<Demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</Demo>

```html
<r-icon name="lock"></r-icon>
<r-icon name="eye"></r-icon>
<r-icon name="user"></r-icon>
```

### `size`

<Demo align="end">
  <r-icon name="lock" size="30"></r-icon>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="lock" size="70"></r-icon>
</Demo>

```html
<r-icon name="lock" size="30"></r-icon>
<r-icon name="lock" size="50"></r-icon>
<r-icon name="lock" size="70"></r-icon>
```

### `color`

<Demo>
  <r-icon name="lock" size="50" color="red"></r-icon>
  <r-icon name="lock" size="50" color="#1E90FF"></r-icon>
  <r-icon name="lock" size="50" color="#F44336"></r-icon>
  <r-icon name="lock" size="50" color="#3F51B5"></r-icon>
</Demo>

```html
<r-icon name="lock" size="50" color="red"></r-icon>
<r-icon name="lock" size="50" color="#1E90FF"></r-icon>
<r-icon name="lock" size="50" color="#F44336"></r-icon>
<r-icon name="lock" size="50" color="#3F51B5"></r-icon>
```

### `spin`

Define spin para activar la rotación y pasa un número para controlar su velocidad. Cuanto menor sea el número, más rápido gira.

<Demo>
  <r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
</Demo>

```html
<r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
```

## Lista de iconos

Haz clic en cualquier icono para copiar su marcado.

<IconGallery />

## Estilos

`<r-icon>` expone **6 propiedades personalizadas de CSS** propias, además de los tokens semánticos
que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio elemento:

```css
r-icon {
  --ran-icon-color: var(--ran-color-text-secondary);
}
```

Partes: `ran-icon`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#icon); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).
