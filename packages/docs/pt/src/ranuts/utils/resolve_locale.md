# resolveLocale

Escolhe qual das localidades que você atende deve ser usada, seguindo a cadeia de sempre: **consulta → cookie → localStorage → navigator → recurso final**.

O catálogo de mensagens é seu; isto só escolhe a chave.

## API

### resolveLocale(options)

| Opção          | Descrição                                                                             | Tipo                | Padrão              |
| -------------- | ------------------------------------------------------------------------------------- | ------------------- | ------------------- |
| `supported`    | As localidades que você de fato publica, da mais específica para a menos              | `readonly string[]` | Obrigatório         |
| `fallback`     | O que volta quando nada casa                                                          | `string`            | `supported[0]`      |
| `query`        | Parâmetro de consulta que traz uma escolha explícita, por exemplo `lang`              | `string`            | —                   |
| `cookie`       | Nome do cookie que traz a escolha                                                     | `string`            | —                   |
| `storageKey`   | Chave do localStorage com a última escolha da pessoa                                  | `string`            | —                   |
| `useNavigator` | Consultar `navigator.languages` e `navigator.language` antes de cair no recurso final | `boolean`           | `true`              |
| `url`          | URL de onde a consulta é lida                                                         | `string`            | A localização atual |

#### Retorna

A entrada de `supported` que casar: sempre uma delas, nunca uma string qualquer.

## Exemplo

### A cadeia inteira

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

### As variantes regionais caem no idioma base

```js
import { resolveLocale } from 'ranuts';

const supported = ['en', 'zh-CN'];

resolveLocale({ supported, query: 'lang', url: '?lang=en-GB' }); // 'en'
resolveLocale({ supported, query: 'lang', url: '?lang=zh' }); // 'zh-CN'
resolveLocale({ supported, query: 'lang', url: '?lang=de' }); // 'en'  (não atendido → recurso final)
```

### Junto com as URLs por idioma

```js
import { resolveLocale, createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }],
});

// Prefira o que a URL já diz; se não houver, a preferência da própria pessoa.
const locale = paths.localeFromPath(location.pathname) ?? resolveLocale({ supported: ['en', 'zh-CN'] });
```

## Notas

1. **A ordem é o que importa.** Um `?lang=` na URL é explícito, pode ser compartilhado e vale para aquela vez, então ganha de tudo. Um cookie é uma decisão que o servidor enxerga, então ganha do estado que só o cliente conhece. O localStorage é a última escolha feita dentro do app. `navigator.language` não passa de um palpite sobre quem chega pela primeira vez. Inverter isso produz o bug clássico: um link compartilhado com `?lang=en` que continua sendo exibido no idioma guardado de quem recebeu.

2. **O resultado é sempre um dos `supported`.** Um valor fora da lista é ignorado em vez de devolvido, então dá para indexar um catálogo de mensagens com ele sem risco.

3. **A comparação não diferencia maiúsculas e cai para o idioma base.** Com `supported: ['en', 'zh-CN']`, `en-GB` casa com `en` e `zh` casa com `zh-CN`.

4. **`navigator.languages` é percorrido em ordem**, não apenas `navigator.language`: essa lista é a preferência real e ordenada da pessoa, e o primeiro item muitas vezes não é a melhor correspondência disponível.

5. **Cada fonte se retira em silêncio.** Sem `window`, sem `document.cookie`, sem localStorage: cada uma simplesmente não contribui com nada, de modo que a cadeia funciona no servidor e em scripts de build.
