# i18n

Um motor de internacionalização independente de framework: um núcleo reativo pequeno (`I18nCore`) com um singleton global opcional (`createI18n` / `useI18n`). Nada aqui toca no DOM: ligue-o à interface como preferir.

```ts
import { createI18n, useI18n } from 'ranuts/i18n';
```

Ele também é reexportado de `ranuts/utils`. Importe de `ranuts/i18n` quando a i18n for tudo de que você precisa: essa entrada leva só o motor e os dois auxiliares dele, em vez do que o largo barril de `utils` acabar puxando junto.

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

Os dicionários são **planos**: `t()` faz uma busca direta de `messages[locale][key]`, então as chaves são strings literais como `'hero.title'`, não objetos aninhados.

## Idioma inicial

Resolvido uma única vez no construtor, nesta ordem:

1. A escolha guardada no `localStorage` (só com `persist` ligado, e só se aquele idioma tiver dicionário)
2. `config.locale`
3. Os idiomas do navegador (só com `detectNavigator` ligado)
4. `fallbackLocale`

O passo 3 passa pelo [`resolveLocale`](/pt/src/ranuts/utils/resolve_locale), que lê a lista ordenada `navigator.languages` inteira em vez de só `navigator.language`: quem não tem a primeira escolha entre os seus dicionários ainda recebe a segunda, em vez de cair direto no idioma de reserva.

## Interpolação

`t(key, params)` substitui os marcadores `{param}` numa única passagem da esquerda para a direita, seguindo a convenção de strings de formato do `format!` do Rust, do `str.format` do Python e do `String.Format` do .NET:

::: v-pre

| Entrada                     | Saída                                                                   |
| --------------------------- | ----------------------------------------------------------------------- |
| `{{`                        | uma `{` literal                                                         |
| `}}`                        | uma `}` literal                                                         |
| `{name}`                    | `params.name`, convertido em texto                                      |
| `{name}` sem esse parâmetro | fica intacto, então um marcador solto aparece em vez de sumir em branco |

:::

Uma `{` / `}` sozinha, ou um grupo com espaços como `{ x }`, **não** é um marcador e sai como está, então CSS, JSON ou trechos de código dentro de uma mensagem passam ilesos. Para envolver um valor em chaves literais, duplique o par externo: <code v-pre>{{{name}}}</code>.

## Dicionários tipados

Passe o formato do seu dicionário como argumento de tipo e cada chamada a `t()` é conferida em tempo de compilação. Sem isso, uma chave renomeada ou digitada errado degrada em silêncio para "desenhe a própria chave": a pessoa vê `agentModelFirstDownlaod` onde deveria haver uma frase, e nada falha até ali.

```ts
interface Messages {
  save: string;
  cancel: string;
}

const i18n = createI18n<Messages>({
  messages: {
    en: { save: 'Save', cancel: 'Cancel' },
    'zh-CN': { save: '保存' }, // ainda em tradução — tudo bem
  },
  fallbackLocale: 'en',
});

i18n.t('save'); // ok
i18n.t('saev'); // erro de compilação

useI18n<Messages>()?.t('cancel'); // passe o mesmo tipo de volta para manter a conferência
```

Três detalhes fazem isso ser usável e não apenas possível:

1. **Cada idioma é `Partial`.** Uma tradução em andamento é o estado normal; o idioma de reserva cobre o que um idioma ainda não preencheu.
2. **O tipo vem do argumento de tipo, nunca dos dados.** `messages` é embrulhado em `NoInfer`, então idiomas com conjuntos de chaves diferentes não conseguem fazer o TypeScript inferir a _interseção_ deles. Do contrário, uma chave que só o idioma de reserva define seria rejeitada em cada ponto de chamada, e uma tradução incompleta quebraria a compilação em vez de recair na reserva em tempo de execução.
3. **Uma `interface` funciona, não só um `type`.** A restrição é `StringValues<T>` (`{ [K in keyof T]: string }`) e não `Record<string, string>`, porque o TypeScript só dá assinaturas de índice implícitas a apelidos de tipo: restringir do jeito óbvio teria obrigado todo mundo a reescrever o dicionário como um `type`.

Omitir o argumento de tipo mantém o comportamento sem tipos exatamente igual: o `MessageDict` padrão é `Record<string, string>`, cujo `keyof` é `string`.

## Configuração

| Campo             | Descrição                                                                     | Tipo             | Padrão         |
| ----------------- | ----------------------------------------------------------------------------- | ---------------- | -------------- |
| `locale`          | Idioma inicial. Uma escolha guardada o substitui quando `persist` está ligado | `string`         | `-`            |
| `fallbackLocale`  | Idioma usado quando falta uma chave no idioma ativo                           | `string`         | `'en'`         |
| `messages`        | Idioma → chave → string                                                       | `LocaleMessages` | `{}`           |
| `persist`         | Guarda o idioma ativo no `localStorage`                                       | `boolean`        | `false`        |
| `storageKey`      | Chave do `localStorage` usada quando `persist` está ligado                    | `string`         | `'ran-locale'` |
| `detectNavigator` | Define o idioma inicial pelas preferências do navegador                       | `boolean`        | `false`        |

## API

### createI18n

Cria e registra o singleton global.

#### Parâmetros

| Parâmetro | Descrição             | Tipo         | Padrão |
| --------- | --------------------- | ------------ | ------ |
| `config`  | Veja **Configuração** | `I18nConfig` | `{}`   |

#### Retorna

| Argumento | Descrição        | Tipo       |
| --------- | ---------------- | ---------- |
| `i18n`    | A nova instância | `I18nCore` |

### useI18n

Devolve a instância global ativa, ou `null` quando nenhuma foi criada.

#### Retorna

| Argumento | Descrição                   | Tipo               |
| --------- | --------------------------- | ------------------ |
| `i18n`    | A instância ativa ou `null` | `I18nCore \| null` |

### I18nCore

| Membro                      | Descrição                                                                  |
| --------------------------- | -------------------------------------------------------------------------- |
| `t(key, params?)`           | Traduz; recai no idioma de reserva e depois na própria chave               |
| `locale` / `getLocale()`    | O idioma ativo                                                             |
| `setLocale(locale)`         | Troca de idioma, guarda (quando ligado) e avisa. Não faz nada se não mudar |
| `addMessages(locale, dict)` | Funde um dicionário num idioma, criando-o se preciso                       |
| `getMessages(locale?)`      | O dicionário de um idioma, ou `{}`                                         |
| `availableLocales`          | Os idiomas que têm um dicionário registrado                                |
| `onChange(fn)`              | Assina as mudanças de idioma; devolve uma função para cancelar             |
| `destroy()`                 | Remove todos os assinantes                                                 |

## SSR

Seguro. Todo acesso a `localStorage` e a `navigator` é protegido, então construir uma instância durante a renderização no servidor recai em `config.locale` ou no `fallbackLocale`.
