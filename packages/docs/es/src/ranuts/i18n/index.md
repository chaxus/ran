# i18n

Un motor de internacionalización independiente del framework: un núcleo reactivo pequeño (`I18nCore`) con un singleton global opcional (`createI18n` / `useI18n`). Nada de esto toca el DOM: enlázalo con la interfaz como prefieras.

```ts
import { createI18n, useI18n } from 'ranuts/i18n';
```

También se reexporta desde `ranuts/utils`. Importa desde `ranuts/i18n` cuando la i18n sea todo lo que necesitas: esa entrada lleva solo el motor y sus dos ayudantes, en vez de lo que el amplio barril de `utils` acabe arrastrando.

## Uso

```ts
import { createI18n, useI18n } from 'ranuts/i18n';

createI18n({
  messages: {
    en: { 'hero.title': 'Hello, {name}', 'nav.docs': 'Docs' },
    zh: { 'hero.title': '你好，{name}', 'nav.docs': '文档' },
  },
  fallbackLocale: 'en',
  persist: true,
  detectNavigator: true,
});

const i18n = useI18n()!;
i18n.t('hero.title', { name: 'Ada' }); // "Hello, Ada"
i18n.setLocale('zh');
i18n.t('hero.title', { name: 'Ada' }); // "你好，Ada"
```

Los diccionarios son **planos**: `t()` hace una búsqueda directa de `messages[locale][key]`, así que las claves son cadenas literales como `'hero.title'`, no objetos anidados.

## Idioma inicial

Se resuelve una sola vez en el constructor, en este orden:

1. La elección guardada en `localStorage` (solo con `persist` activo, y solo si ese idioma tiene diccionario)
2. `config.locale`
3. Los idiomas del navegador (solo con `detectNavigator` activo)
4. `fallbackLocale`

El paso 3 pasa por [`resolveLocale`](/es/src/ranuts/utils/resolve_locale), que lee la lista ordenada `navigator.languages` completa en vez de solo `navigator.language`: quien no tenga su primera opción entre tus diccionarios recibe igualmente la segunda, en lugar de caer directo al idioma de reserva.

## Interpolación

`t(key, params)` sustituye los marcadores `{param}` en una sola pasada de izquierda a derecha, siguiendo la convención de cadenas de formato de `format!` de Rust, `str.format` de Python y `String.Format` de .NET:

::: v-pre

| Entrada                    | Salida                                                                       |
| -------------------------- | ---------------------------------------------------------------------------- |
| `{{`                       | una `{` literal                                                              |
| `}}`                       | una `}` literal                                                              |
| `{name}`                   | `params.name`, convertido a texto                                            |
| `{name}` sin ese parámetro | se deja intacto, así que un marcador suelto se ve en vez de quedar en blanco |

:::

Una `{` / `}` suelta, o un grupo con espacios como `{ x }`, **no** es un marcador y se emite tal cual, así que el CSS, el JSON o los fragmentos de código dentro de un mensaje pasan ilesos. Para envolver un valor en llaves literales, duplica el par exterior: <code v-pre>{{{name}}}</code>.

## Diccionarios tipados

Pasa la forma de tu diccionario como argumento de tipo y cada llamada a `t()` se comprueba en tiempo de compilación. Sin eso, una clave renombrada o mal escrita degrada en silencio a «dibuja la clave misma»: quien lee ve `agentModelFirstDownlaod` donde debería haber una frase, y nada falla hasta entonces.

```ts
interface Messages {
  save: string;
  cancel: string;
}

const i18n = createI18n<Messages>({
  messages: {
    en: { save: 'Save', cancel: 'Cancel' },
    'zh-CN': { save: '保存' }, // aún en traducción — no pasa nada
  },
  fallbackLocale: 'en',
});

i18n.t('save'); // ok
i18n.t('saev'); // error de compilación

useI18n<Messages>()?.t('cancel'); // pasa el mismo tipo de vuelta para mantener la comprobación
```

Tres detalles hacen que esto sea usable y no solo posible:

1. **Cada idioma es `Partial`.** Una traducción a medias es el estado normal; el idioma de reserva cubre lo que un idioma todavía no ha rellenado.
2. **El tipo viene del argumento de tipo, nunca de los datos.** `messages` va envuelto en `NoInfer`, así que idiomas con conjuntos de claves distintos no pueden hacer que TypeScript infiera su _intersección_. De lo contrario, una clave que solo define el idioma de reserva sería rechazada en cada punto de llamada, y una traducción incompleta rompería la compilación en vez de recurrir a la reserva en tiempo de ejecución.
3. **Funciona con una `interface`, no solo con un `type`.** La restricción es `StringValues<T>` (`{ [K in keyof T]: string }`) y no `Record<string, string>`, porque TypeScript solo da firmas de índice implícitas a los alias de tipo: restringirlo de la manera obvia habría obligado a todo el mundo a reescribir su diccionario como un `type`.

Omitir el argumento de tipo conserva el comportamiento sin tipos exactamente igual: el `MessageDict` por defecto es `Record<string, string>`, cuyo `keyof` es `string`.

## Configuración

| Campo             | Descripción                                                                     | Tipo             | Por defecto    |
| ----------------- | ------------------------------------------------------------------------------- | ---------------- | -------------- |
| `locale`          | Idioma inicial. Lo sustituye una elección guardada cuando `persist` está activo | `string`         | `-`            |
| `fallbackLocale`  | Idioma usado cuando falta una clave en el idioma activo                         | `string`         | `'en'`         |
| `messages`        | Idioma → clave → cadena                                                         | `LocaleMessages` | `{}`           |
| `persist`         | Guarda el idioma activo en `localStorage`                                       | `boolean`        | `false`        |
| `storageKey`      | Clave de `localStorage` usada cuando `persist` está activo                      | `string`         | `'ran-locale'` |
| `detectNavigator` | Toma el idioma inicial de las preferencias del navegador                        | `boolean`        | `false`        |

## API

### createI18n

Crea y registra el singleton global.

#### Parámetros

| Parámetro | Descripción             | Tipo         | Por defecto |
| --------- | ----------------------- | ------------ | ----------- |
| `config`  | Véase **Configuración** | `I18nConfig` | `{}`        |

#### Devuelve

| Argumento | Descripción        | Tipo       |
| --------- | ------------------ | ---------- |
| `i18n`    | La nueva instancia | `I18nCore` |

### useI18n

Devuelve la instancia global activa, o `null` si no se creó ninguna.

#### Devuelve

| Argumento | Descripción                  | Tipo               |
| --------- | ---------------------------- | ------------------ |
| `i18n`    | La instancia activa o `null` | `I18nCore \| null` |

### I18nCore

| Miembro                     | Descripción                                                                    |
| --------------------------- | ------------------------------------------------------------------------------ |
| `t(key, params?)`           | Traduce; recurre al idioma de reserva y luego a la propia clave                |
| `locale` / `getLocale()`    | El idioma activo                                                               |
| `setLocale(locale)`         | Cambia de idioma, guarda (si está activado) y avisa. No hace nada si no cambia |
| `addMessages(locale, dict)` | Fusiona un diccionario en un idioma, creándolo si hace falta                   |
| `getMessages(locale?)`      | El diccionario de un idioma, o `{}`                                            |
| `availableLocales`          | Los idiomas que tienen un diccionario registrado                               |
| `onChange(fn)`              | Se suscribe a los cambios de idioma; devuelve una función para darse de baja   |
| `destroy()`                 | Elimina todos los suscriptores                                                 |

## SSR

Seguro. Todos los accesos a `localStorage` y a `navigator` están protegidos, así que construir una instancia durante el renderizado en el servidor recae en `config.locale` o en `fallbackLocale`.
