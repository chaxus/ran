# createLocalePath

Las cuentas de URL de un sitio multilingüe. Funciones puras, sin estado global ni DOM: valen igual en un script de compilación (mapa del sitio, `hreflang`) que en el navegador.

Usa **subdirectorios** (`/zh/book/`) en lugar de subdominios (`zh.example.com/book/`): los buscadores tratan un subdominio como un sitio aparte cuya autoridad empieza de cero, mientras que un subdirectorio hereda la del sitio principal. La configuración regional por defecto vive en la raíz; todas las demás llevan prefijo.

## API

### createLocalePath(config)

| Parámetro       | Descripción                                                                                      | Tipo            | Por defecto            |
| --------------- | ------------------------------------------------------------------------------------------------ | --------------- | ---------------------- |
| `locales`       | `{ code, prefix? }[]`; sin prefijo significa «la configuración por defecto, que vive en la raíz» | `LocaleRoute[]` | Obligatorio            |
| `defaultLocale` | Código de la configuración regional por defecto                                                  | `string`        | la primera sin prefijo |
| `base`          | Subruta del despliegue, por ejemplo `/weread`; la barra final se ignora                          | `string`        | `''`                   |

Devuelve:

| Miembro                         | Descripción                                                                         |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `base` / `defaultLocale`        | La configuración normalizada, de solo lectura                                       |
| `localeFromPath(pathname)`      | Detecta la configuración regional; las rutas desconocidas caen en la de por defecto |
| `stripLocale(pathname)`         | Quita el prefijo: la ruta sin idioma que usa el enrutador                           |
| `href(path, code?)`             | Construye un enlace para una configuración regional                                 |
| `hrefForLocale(pathname, code)` | Reapunta la ruta actual a otra configuración regional (el selector de idioma)       |
| `alternates(pathname)`          | La URL de cada configuración regional, para `<link rel="alternate" hreflang>`       |

## Ejemplo

```js
import { createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }, { code: 'zh-HK', prefix: 'zh-hant' }],
  base: '/docs',
});

paths.href('/book/walden/'); // '/docs/book/walden/'
paths.href('/book/walden/', 'zh-CN'); // '/docs/zh/book/walden/'
paths.localeFromPath('/docs/zh/book/'); // 'zh-CN'
paths.stripLocale('/docs/zh/book/'); // '/docs/book/'
paths.hrefForLocale('/docs/zh/book/', 'zh-HK'); // '/docs/zh-hant/book/'

// etiquetas hreflang
paths.alternates(location.pathname).forEach(({ code, href }) => {
  head.append(link({ rel: 'alternate', hreflang: code, href }));
});
```

## Notas

1. **`href` es idempotente.** Quita el prefijo que hubiera antes de poner el nuevo, así que darle una ruta ya localizada no lo duplica; y `hrefForLocale` no es más que `href`.
2. **Gana el prefijo más largo**, de modo que `zh` no se traga `/zh-hant/...`.
3. **`base` solo se quita del principio.** Con `replace(base, '')` se quitaría la primera aparición esté donde esté, lo que se rompe cuando la ruta contiene esa misma cadena por el medio.
4. **La consulta y el fragmento se conservan**: las cuentas solo tocan la parte de la ruta.
5. **No hay una «configuración regional actual» global.** Pasa el código explícitamente o deja el de por defecto. Cuál está activa es cosa del entorno de i18n, no de este módulo.
