# resolveLocale

Elige cuál de las configuraciones regionales que admites hay que usar, siguiendo la cadena de siempre: **consulta → cookie → localStorage → navigator → recurso final**.

El catálogo de mensajes es cosa tuya; esto solo elige la clave.

## API

### resolveLocale(options)

| Opción | Descripción | Tipo | Por defecto |
| -------------- | ------------------------------------------------------------------------ | ------------------- | ---------------- |
| `supported` | Las configuraciones que realmente publicas, de la más específica a la menos | `readonly string[]` | Obligatorio |
| `fallback` | Lo que se devuelve cuando nada coincide | `string` | `supported[0]` |
| `query` | Parámetro de consulta que lleva una elección explícita, por ejemplo `lang` | `string` | — |
| `cookie` | Nombre de la cookie que lleva la elección | `string` | — |
| `storageKey` | Clave de localStorage con lo último que la persona eligió | `string` | — |
| `useNavigator` | Consultar `navigator.languages` y `navigator.language` antes de recurrir al último recurso | `boolean` | `true` |
| `url` | URL de la que se lee la consulta | `string` | La ubicación actual |

#### Devuelve

La entrada de `supported` que coincida: siempre una de ellas, nunca una cadena cualquiera.

## Ejemplo

### La cadena completa

```js
import { resolveLocale } from 'ranuts';

const locale = resolveLocale({
  supported: ['en', 'zh-CN'],
  query: 'lang',
  cookie: 'lang',
  storageKey: 'app-lang',
});

document.documentElement.lang = locale;
render(messages[locale]);
```

### Las variantes regionales caen en el idioma base

```js
import { resolveLocale } from 'ranuts';

const supported = ['en', 'zh-CN'];

resolveLocale({ supported, query: 'lang', url: '?lang=en-GB' }); // 'en'
resolveLocale({ supported, query: 'lang', url: '?lang=zh' }); // 'zh-CN'
resolveLocale({ supported, query: 'lang', url: '?lang=de' }); // 'en'  (no admitido → último recurso)
```

### Combinado con las URL por idioma

```js
import { resolveLocale, createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }],
});

// Prefiere lo que ya dice la URL; si no, la preferencia de la propia persona.
const locale = paths.localeFromPath(location.pathname) ?? resolveLocale({ supported: ['en', 'zh-CN'] });
```

## Notas

1. **El orden es lo importante.** Un `?lang=` en la URL es explícito, se puede compartir y vale para esa vez, así que gana a todo lo demás. Una cookie es una decisión que el servidor ve, así que gana al estado que solo conoce el cliente. localStorage es lo último que la persona eligió dentro de la aplicación. `navigator.language` no es más que una conjetura sobre quien llega por primera vez. Invertir este orden produce el fallo clásico: un enlace compartido con `?lang=en` que se sigue mostrando en el idioma guardado de quien lo recibe.

2. **El resultado siempre es uno de `supported`.** Un valor que no esté en la lista se ignora en vez de devolverse, así que con el resultado se puede indexar un catálogo de mensajes sin riesgo.

3. **La coincidencia no distingue mayúsculas y cae al idioma base.** Con `supported: ['en', 'zh-CN']`, `en-GB` casa con `en` y `zh` casa con `zh-CN`.

4. **Se recorre `navigator.languages` en orden**, no solo `navigator.language`: esa lista es la preferencia real y ordenada de la persona, y su primer elemento a menudo no es la mejor coincidencia disponible.

5. **Cada fuente se retira sin ruido.** Sin `window`, sin `document.cookie`, sin localStorage: cada una simplemente no aporta nada, de modo que la cadena funciona en el servidor y en scripts de compilación.
