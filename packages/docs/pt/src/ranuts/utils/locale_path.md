# createLocalePath

As contas de URL de um site multilíngue. Funções puras, sem estado global nem DOM: servem igualmente num script de build (mapa do site, `hreflang`) e no navegador.

Usa **subdiretórios** (`/zh/book/`) em vez de subdomínios (`zh.example.com/book/`): os buscadores tratam um subdomínio como um site à parte, cuja autoridade começa do zero, enquanto um subdiretório herda a do site principal. A localidade padrão fica na raiz; todas as outras levam prefixo.

## API

### createLocalePath(config)

| Parâmetro       | Descrição                                                                             | Tipo            | Padrão                 |
| --------------- | ------------------------------------------------------------------------------------- | --------------- | ---------------------- |
| `locales`       | `{ code, prefix? }[]`; sem prefixo quer dizer «a localidade padrão, que fica na raiz» | `LocaleRoute[]` | Obrigatório            |
| `defaultLocale` | Código da localidade padrão                                                           | `string`        | a primeira sem prefixo |
| `base`          | Subcaminho da implantação, por exemplo `/weread`; a barra final é ignorada            | `string`        | `''`                   |

Devolve:

| Membro                          | Descrição                                                             |
| ------------------------------- | --------------------------------------------------------------------- |
| `base` / `defaultLocale`        | A configuração normalizada, somente leitura                           |
| `localeFromPath(pathname)`      | Detecta a localidade; caminhos desconhecidos caem na padrão           |
| `stripLocale(pathname)`         | Tira o prefixo da localidade: o caminho sem idioma que o roteador usa |
| `href(path, code?)`             | Monta um link para uma localidade                                     |
| `hrefForLocale(pathname, code)` | Reaponta o caminho atual para outra localidade (o seletor de idioma)  |
| `alternates(pathname)`          | A URL de cada localidade, para `<link rel="alternate" hreflang>`      |

## Exemplo

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

// tags hreflang
paths.alternates(location.pathname).forEach(({ code, href }) => {
  head.append(link({ rel: 'alternate', hreflang: code, href }));
});
```

## Notas

1. **`href` é idempotente.** Ele tira qualquer prefixo existente antes de pôr o novo, então dar a ele um caminho já localizado não duplica nada; e `hrefForLocale` nada mais é que `href`.
2. **O prefixo mais longo vence**, de modo que `zh` não engole `/zh-hant/...`.
3. **`base` só é tirado do começo.** Com `replace(base, '')` sairia a primeira ocorrência onde quer que estivesse, o que quebra quando o caminho contém essa mesma string no meio.
4. **A consulta e o fragmento são preservados**: as contas só mexem no caminho.
5. **Não existe uma «localidade atual» global.** Passe o código explicitamente ou deixe o padrão. Qual delas está ativa é assunto do runtime de i18n, não deste módulo.
