---
description: 'Un motor de internacionalización independiente del framework: un núcleo pequeño con un singleton global opcional, sin acoplamiento al DOM.'
---

# i18n

Un motor de internacionalización independiente del framework. Sigue el mismo diseño que el [router](/es/src/ranui/router/): un núcleo pequeño (`I18nCore`) con un singleton global opcional (`createI18n` / `useI18n`) y sin acoplamiento al DOM, así que lo enlazas con la interfaz como prefieras.

> **Úsalo cuando** necesites cambiar de idioma en tiempo de ejecución en una aplicación con ranui. Llama a `createI18n` una vez, luego lee las cadenas con `useI18n().t(key, params)` y cambia de idioma con `setLocale`. No depende de ningún framework ni del DOM, así que funciona en JS a secas, en cualquier framework y en SSR.

El motor se publica como su propia entrada **`ranui/i18n`**: importarlo **no** registra ningún elemento personalizado, así que una página que solo necesita traducir nunca arrastra la biblioteca de componentes. Las mismas exportaciones están también en el barril `ranui` de nivel superior.

## Inicio rápido

Crea el singleton de i18n una vez al arrancar y traduce desde cualquier parte:

```js
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // Cada idioma es un diccionario PLANO: las claves se buscan tal cual, no anidadas.
  messages: {
    en: { 'hero.title': 'Hi {name}', 'nav.home': 'Home' },
    zh: { 'hero.title': '你好 {name}', 'nav.home': '首页' },
  },
  fallbackLocale: 'en', // se usa cuando falta una clave en el idioma activo
  persist: true, // recuerda la elección bajo la clave de localStorage 'ran-locale'
  detectNavigator: true, // toma el idioma inicial de las preferencias del navegador
});

const i18n = useI18n();

i18n.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
i18n.setLocale('zh'); // persiste y avisa a los suscriptores
i18n.t('hero.title', { name: 'Ada' }); // → "你好 Ada"
```

`t(key)` busca `messages[activeLocale][key]`, después `messages[fallbackLocale][key]` y, si no hay ninguno, devuelve la propia `key`. Los marcadores `{param}` de la cadena se rellenan con el segundo argumento. Como la búsqueda es un acceso a un mapa plano, **las claves son cadenas literales**: escribe `'hero.title'` como una sola clave, no como un objeto anidado `{ hero: { title } }`.

## Parámetros (interpolación)

Sí, los mensajes admiten parámetros en tiempo de ejecución. Pon marcadores del estilo `{name}` en la cadena y pasa los valores como segundo argumento de `t()`; cada `{param}` se sustituye por el valor que le corresponda:

```js
createI18n({
  messages: {
    en: {
      'cart.summary': '{count} items · ${total}',
      greeting: 'Welcome back, {user}!',
    },
    zh: {
      'cart.summary': '{count} 件商品 · ¥{total}',
      greeting: '欢迎回来，{user}！',
    },
  },
});

const i18n = useI18n();
i18n.t('cart.summary', { count: 3, total: 59.9 }); // → "3 items · $59.9"
i18n.t('greeting', { user: 'Ada' }); // → "Welcome back, Ada!"
```

Detalles:

- La sintaxis del marcador es `{word}` (letras, dígitos, `_`). Los valores pueden ser cadenas o números: los números se convierten a texto.
- Un marcador sin clave que le corresponda **se deja tal cual** (`{oops}` se queda literalmente en la salida), lo que hace que un parámetro que falta salte a la vista en vez de quedar en blanco sin más.
- La interpolación ocurre después del recurso al idioma de reserva, así que los mismos parámetros funcionan sea cual sea el idioma que acabó resolviendo la cadena.
- No hay pluralización ni formato de números o fechas incorporados; compón eso con `Intl.NumberFormat` / `Intl.PluralRules` y pasa la cadena ya formateada como parámetro.

## Escapar llaves literales

Una `{` o `}` suelta, o un grupo con espacios como `{ color: red }`, **no** es un marcador y pasa intacto, así que el CSS, el JSON y los fragmentos de código dentro de un mensaje están a salvo por defecto. El único caso ambiguo es un `{word}` literal que quieras mostrar tal cual. Para escaparlo, **duplica las llaves** (la misma convención que `format!` de Rust, `str.format` de Python y `String.Format` de .NET):

::: v-pre

```js
const i18n = useI18n(); // se dan por registrados los mensajes de abajo

i18n.t('use {{ and }} for literal braces'); // → "use { and } for literal braces"
i18n.t('the {{count}} token'); // → "the {count} token"  (sin interpolar)
i18n.t('{{{name}}}', { name: 'Ada' }); // → "{Ada}"  (el valor entre llaves literales)
```

| En el mensaje | Salida                                        |
| ------------- | --------------------------------------------- |
| `{{`          | `{`                                           |
| `}}`          | `}`                                           |
| `{name}`      | el parámetro `name`, o `{name}` si no está    |
| `{ name }`    | `{ name }` (con espacios → no es un marcador) |
| `{`           | `{` (llave suelta)                            |

El escapado se aplica en la misma pasada de izquierda a derecha que la interpolación y funciona pases parámetros o no, así que `{{` y `}}` siempre significan llaves literales.

> Duplicar es la misma convención de `format!` de Rust, `str.format` de Python y `String.Format` de .NET, así que no hace falta un carácter de escape nuevo. Si necesitas gramática real de plural, género o número, formatea con `Intl.*` y pasa el resultado como parámetro.

:::

## Reaccionar a los cambios de idioma

`onChange` se dispara después de cada `setLocale`; úsalo para volver a pintar las cadenas que ya dibujaste:

```js
const i18n = useI18n();

const unsubscribe = i18n.onChange((locale) => {
  document.documentElement.lang = locale;
  repaintStrings(); // vuelve a ejecutar tus llamadas a t()
});

// más adelante, cuando la vista se desmonta
unsubscribe();
```

## Añadir mensajes bajo demanda

Carga el diccionario de un idioma cuando haga falta (por ejemplo, dividiendo el código por idioma) y fusiónalo:

```js
const i18n = useI18n();

const { default: fr } = await import('./locales/fr.js');
i18n.addMessages('fr', fr); // se fusiona con cualquier diccionario 'fr' existente
i18n.setLocale('fr');
```

## Localizar el texto de los componentes

Los componentes **no** leen de este motor por su cuenta. Es a propósito: un componente que leyera directamente de un singleton global ataría a todos sus consumidores a una única instancia y a un único esquema de nombres de claves, y haría que una página que importa un solo botón se trajera también la capa de traducción. En su lugar, **toda cadena visible es una entrada**: un atributo, una propiedad, una opción o contenido en un slot, así que localizar ranui consiste en pasar la salida de `t()` allí donde la cadena ya va:

```js
const i18n = useI18n(); // se dan por registrados los mensajes de abajo

modal.setAttribute('title', i18n.t('dialog.deleteProject.title'));
themeSwitch.setAttribute('label-dark', i18n.t('theme.dark'));
```

La mayoría de componentes no tienen texto propio: les llega por los slots y atributos que ya escribes. Un puñado trae un valor por defecto en inglés para alguna cadena que no tiene de dónde salir, casi siempre nombres accesibles:

| Componente                                        | Inglés incorporado                                                                                                       | Se sobrescribe con                                   |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `Modal.confirm` / `Modal.open`                    | título `Confirm`, botones `OK` / `Cancel`                                                                                | las opciones `title`, `okText`, `cancelText`         |
| `Modal.info` / `.success` / `.warning` / `.error` | títulos `Info` / `Success` / `Warning` / `Error`                                                                         | la opción `title`                                    |
| `<r-theme-switch>`                                | aria-labels `Theme`, `System theme`, `Light theme`, `Dark theme`                                                         | `label`, `label-system`, `label-light`, `label-dark` |
| `<r-voice-button>`                                | aria-labels `Start voice input` / `Stop voice input`; pistas `Release to keep · slide up to cancel`, `Release to cancel` | `label`, `active-label`, `hold-hint`, `cancel-hint`  |
| `<r-reasoning>`                                   | etiqueta de cabecera `Reasoning`                                                                                         | `label`                                              |
| `<r-token-meter>`                                 | etiqueta `Context`                                                                                                       | `label`                                              |
| `<r-colorpicker>`                                 | aria-labels `Choose color`, `Hue`, `Alpha opacity`                                                                       | `label`, `hue-label`, `alpha-label`                  |

Un patrón práctico es volver a aplicarlas desde un único sitio en cada cambio de idioma, para que el mismo código corra al arrancar y después de un cambio:

```js
const i18n = useI18n();

const applyLabels = () => {
  document.querySelectorAll('r-voice-button').forEach((el) => {
    el.setAttribute('label', i18n.t('voice.start'));
    el.setAttribute('active-label', i18n.t('voice.stop'));
  });
};

applyLabels();
i18n.onChange(applyLabels);
```

Acuérdate de mantener también `document.documentElement.lang` al día: es lo que miran el navegador, los lectores de pantalla y los selectores `:lang()`.

## API

`createI18n(config)` crea y registra el singleton global (llámalo una vez); `useI18n()` lo devuelve, o `null` si `createI18n` todavía no se ha ejecutado.

### `I18nConfig`

| Campo             | Tipo             | Por defecto    | Descripción                                                                                                                                                                                                               |
| ----------------- | ---------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`        | `LocaleMessages` | `{}`           | `locale → { key → string }`. Cada diccionario es plano.                                                                                                                                                                   |
| `locale`          | `string`         | el de reserva  | Idioma inicial (una elección persistida tiene prioridad cuando está activada).                                                                                                                                            |
| `fallbackLocale`  | `string`         | `'en'`         | Idioma que se consulta cuando falta una clave en el idioma activo.                                                                                                                                                        |
| `persist`         | `boolean`        | `false`        | Guarda el idioma activo en `localStorage`.                                                                                                                                                                                |
| `storageKey`      | `string`         | `'ran-locale'` | Clave de localStorage usada cuando `persist` está activo.                                                                                                                                                                 |
| `detectNavigator` | `boolean`        | `false`        | Toma el idioma inicial de las preferencias del navegador. Lee la lista ordenada `navigator.languages` completa, así que quien no tenga diccionario para su primera opción recibe la segunda en vez del idioma de reserva. |

### Métodos de `I18nCore`

| Método                      | Devuelve      | Descripción                                                                   |
| --------------------------- | ------------- | ----------------------------------------------------------------------------- |
| `t(key, params?)`           | `string`      | Traduce; recurre al idioma de reserva y luego a la propia clave.              |
| `setLocale(locale)`         | `void`        | Cambia de idioma; persiste (si está activado) y avisa a los suscriptores.     |
| `getLocale()`               | `string`      | El idioma activo.                                                             |
| `onChange(handler)`         | `() => void`  | Se suscribe a los cambios de idioma; devuelve una función para darse de baja. |
| `addMessages(locale, dict)` | `void`        | Fusiona más mensajes en un idioma.                                            |
| `getMessages(locale?)`      | `MessageDict` | Lee el diccionario de un idioma (por defecto, el activo).                     |
| `availableLocales`          | `string[]`    | Idiomas que tienen un diccionario registrado.                                 |
| `destroy()`                 | `void`        | Elimina todos los suscriptores.                                               |

**Tipos**

```ts
type MessageDict = Record<string, string>; // plano: 'hero.title' → 'Hi {name}'
type LocaleMessages = Record<string, MessageDict>; // locale → MessageDict
type TranslateParams = Record<string, string | number>;
```

## SSR

El núcleo es seguro en SSR: los accesos a `localStorage` y `navigator` están protegidos, así que `createI18n` y `t` se ejecutan sin lanzar errores durante el renderizado en el servidor. La persistencia y la detección del navegador simplemente no hacen nada en el servidor y entran en juego cuando el código corre en el navegador.
