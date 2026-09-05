---
description: 'El sistema de temas en tiempo de ejecución de ranui: initTheme / setTheme / getTheme, modo claro, oscuro y de sistema, ámbitos acotados y sobrescritura de tokens en caliente.'
---

# Theming

La mitad **en tiempo de ejecución** del estilo de ranui: cambiar entre modo claro, oscuro y de
sistema, guardar la elección y sobrescribir tokens sobre la marcha.

Los tokens en sí (cómo se llaman y para qué sirve cada uno) son el
[sistema de diseño](/es/src/ranui/design-system/); las reglas para elegir entre ellos son la
[guía de diseño](/es/src/ranui/design-guides/). Esta página trata solo de _aplicarlos_.

> **Úsalo cuando** necesites tema claro y oscuro en una aplicación con ranui: llama a `initTheme`
> una vez al cargar, a `setTheme` para cambiar, y a `setThemeToken(s)` si quieres sobrescribir
> tokens sueltos sin enviar CSS adicional.

Hay exactamente dos temas: **light** y **dark**, más un modo **system** que sigue la preferencia
del sistema operativo. (Las antiguas API de «paquetes de tema» se eliminaron; `setThemePack` y
`RanThemePackName` ya no existen.)

## Inicio rápido

```js
import { initTheme, setTheme, getTheme } from 'ranui/theme';

// Restaura el tema guardado ('light' | 'dark' | 'system') desde localStorage
initTheme();

// Cambiar de tema — se guarda automáticamente
setTheme('dark');
setTheme('system'); // sigue prefers-color-scheme y se actualiza en vivo

getTheme(); // → 'light' | 'dark' | 'system' | ''
```

La entrada específica **`ranui/theme`** trae solo el motor de temas: importarla no registra ningún
custom element, así que una página que solo quiere tokens y modo oscuro nunca arrastra la biblioteca
de componentes. Las mismas funciones se reexportan también desde el barril `ranui` de primer nivel.

`setTheme` escribe un atributo `data-ran-theme` (y el heredado `theme`) en `<html>`; todos los
estilos de los componentes reaccionan a él. La elección se guarda bajo la clave de localStorage
`ran-theme`.

Para una interfaz de cambio ya hecha, usa [`<r-theme-switch>`](/es/src/ranui/theme-switch/): un
control segmentado de sistema, claro y oscuro ya conectado a esta API, sincronizado entre
instancias y que actualiza los metas `theme-color`.

## API

| Función           | Firma                                                                   | Descripción                                                                             |
| ----------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `initTheme`       | `(target?: ThemeTarget) => void`                                        | Restaura el tema guardado en `localStorage`. Llámala una vez al cargar. Inerte en SSR.  |
| `setTheme`        | `(name: RanThemeName, target?: ThemeTarget) => void`                    | Aplica `'light'` \| `'dark'` \| `'system'` y lo guarda. `'system'` sigue al SO en vivo. |
| `getTheme`        | `(target?: ThemeTarget) => RanThemeName \| ''`                          | Lee el tema activo. Devuelve `'system'` en modo de sistema y `''` si no hay ninguno.    |
| `setThemeToken`   | `(name: string, value: string \| number, target?: HTMLElement) => void` | Sobrescribe un token en tiempo de ejecución (estilo en línea sobre el objetivo).        |
| `setThemeTokens`  | `(tokens: ThemeTokenMap, target?: HTMLElement) => void`                 | Sobrescribe muchos tokens a la vez. Un valor `null` / `undefined` borra ese token.      |
| `clearThemeToken` | `(name: string, target?: HTMLElement) => void`                          | Quita una sobrescritura de token en tiempo de ejecución.                                |

**Tipos**

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type ThemeTarget = HTMLElement | Document; // por defecto document.documentElement
type ThemeTokenMap = Record<string, string | number | null | undefined>;
```

**`target`**: todas las funciones apuntan por defecto a `<html>` (`document.documentElement`). Pasa
un elemento para acotar un tema o una sobrescritura de token a un subárbol en lugar de a toda la
página.

**Seguro en SSR**: todos los accesos a `document`, `localStorage` y `matchMedia` están protegidos,
así que estas funciones no hacen nada (ni lanzan) durante el renderizado en servidor.

## Cómo funciona el modo oscuro

`setTheme('dark')` pone `data-ran-theme="dark"` en `<html>`. La hoja de estilos redefine entonces
**solo la paleta base** para oscuro, desde una única fuente de verdad; cada token semántico
`--ran-color-*` referencia esa paleta mediante `var()`, así que cambia solo y ningún componente
lleva su propia sobrescritura para modo oscuro.

Dos consecuencias que conviene conocer:

- **Tu propio CSS recibe el modo oscuro gratis** si consume tokens semánticos, y lo recibe mal si
  codifica un color a mano o escribe un valor de reserva solo para el modo claro. Consulta
  [Usar tokens en tu propio CSS](/es/src/ranui/design-system/#using-tokens-in-your-own-css).
- **Nada debe hacer transición al cambiar de tema.** El CSS no puede saber por qué cambió un color,
  así que una `transition` sobre una propiedad de la paleta hace que cada elemento se funda a su
  propio ritmo cuando cambias de tema. Los componentes de ranui no lo hacen a propósito; los tuyos
  tampoco deberían.

## Personalizar tokens {#customizing-tokens}

### En tiempo de ejecución (JS)

```js
import { setThemeToken, setThemeTokens, clearThemeToken } from 'ranui/theme';

// Un token, en <html> (afecta a todo)
setThemeToken('--ran-color-primary', '#7c3aed');

// Muchos a la vez
setThemeTokens({
  '--ran-color-primary': '#7c3aed',
  '--ran-radius-md': '8px',
});

// Acotar a un subárbol
setThemeToken('--ran-color-primary', '#e11d48', document.querySelector('#panel'));

// Quitar una sobrescritura
clearThemeToken('--ran-color-primary');
```

### En tiempo de compilación (CSS)

Sobrescribe tokens bajo `:root`, o en el ámbito que prefieras:

```css
:root {
  --ran-color-primary: #7c3aed;
  --ran-radius-md: 8px;
}
```

### Qué capa sobrescribir

Como el modo oscuro solo redefine la paleta base:

- Sobrescribe un token **semántico** (`--ran-color-primary`) para un cambio que deba ser igual en
  ambos temas.
- Sobrescribe un escalón de la escala **base** (`--ran-blue-700`) cuando el cambio deba girar con el
  tema: todo lo semántico que lo referencia lo sigue.
- Sobrescribe un token de **componente** (`--ran-btn-hover-background`) para cambiar exactamente un
  elemento.

Esa estratificación se describe por completo en la página del
[sistema de diseño](/es/src/ranui/design-system/#two-layers). Ten en cuenta que una sobrescritura en
tiempo de ejecución es un estilo en línea sobre el objetivo: gana a las reglas de la hoja de estilos
para ese subárbol, que es lo que hace posible el tema por paneles y lo que hace difícil detectar más
tarde una sobrescritura que olvidaste limpiar.

## Acotar un tema a parte de la página

Cada función acepta un objetivo, así que un panel de vista previa puede correr con un tema distinto
al de la página que lo rodea:

```js
const preview = document.querySelector('#preview');

setTheme('dark', preview); // solo este subárbol
getTheme(preview); // → 'dark'
```

El atributo cae sobre ese elemento en lugar de sobre `<html>`, y la cascada de tokens hace el resto.
