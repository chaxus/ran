---
description: 'Um motor de internacionalização independente de framework: um núcleo pequeno com um singleton global opcional, sem acoplamento ao DOM.'
---

# i18n

Um motor de internacionalização independente de framework. Ele espelha o desenho do [roteador](/pt/src/ranui/router/): um núcleo pequeno (`I18nCore`) com um singleton global opcional (`createI18n` / `useI18n`) e sem acoplamento ao DOM, então você o liga à interface como preferir.

> **Use quando** precisar trocar de idioma em tempo de execução num aplicativo com ranui. Chame `createI18n` uma vez, depois leia as cadeias com `useI18n().t(key, params)` e troque de idioma com `setLocale`. Não depende de framework nem do DOM, então funciona em JS puro, em qualquer framework e em SSR.

O motor é publicado como a própria entrada **`ranui/i18n`**: importá-lo **não** registra nenhum elemento personalizado, então uma página que só precisa traduzir nunca puxa a biblioteca de componentes. As mesmas exportações também estão no barril `ranui` de nível superior.

## Início rápido

Crie o singleton do i18n uma vez na inicialização e traduza em qualquer lugar:

```js
import { createI18n, useI18n } from 'ranui/i18n';

createI18n({
  // Cada idioma é um dicionário PLANO — as chaves são buscadas literalmente, não aninhadas.
  messages: {
    en: { 'hero.title': 'Hi {name}', 'nav.home': 'Home' },
    zh: { 'hero.title': '你好 {name}', 'nav.home': '首页' },
  },
  fallbackLocale: 'en', // usado quando falta uma chave no idioma ativo
  persist: true, // lembra a escolha na chave 'ran-locale' do localStorage
  detectNavigator: true, // define o idioma inicial pelas preferências do navegador
});

const i18n = useI18n();

i18n.t('hero.title', { name: 'Ada' }); // → "Hi Ada"
i18n.setLocale('zh'); // persiste e avisa os assinantes
i18n.t('hero.title', { name: 'Ada' }); // → "你好 Ada"
```

`t(key)` procura `messages[activeLocale][key]`, depois `messages[fallbackLocale][key]` e, se nenhum existir, devolve a própria `key`. Os marcadores `{param}` na cadeia são preenchidos a partir do segundo argumento. Como a busca é um acesso a um mapa plano, **as chaves são cadeias literais**: escreva `'hero.title'` como uma única chave, não como um objeto aninhado `{ hero: { title } }`.

## Parâmetros (interpolação)

Sim, as mensagens aceitam parâmetros em tempo de execução. Ponha marcadores no estilo `{name}` na cadeia e passe os valores como segundo argumento de `t()`; cada `{param}` é substituído pelo valor correspondente:

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

Detalhes:

- A sintaxe do marcador é `{word}` (letras, dígitos, `_`). Os valores podem ser cadeias ou números: os números viram texto.
- Um marcador sem chave correspondente **fica como está** (`{oops}` permanece literalmente na saída), o que faz um parâmetro faltante saltar aos olhos em vez de sumir em silêncio.
- A interpolação corre depois do recurso ao idioma reserva, então os mesmos parâmetros funcionam seja qual for o idioma que de fato resolveu a cadeia.
- Não há pluralização nem formatação de números ou datas embutidas; monte isso com `Intl.NumberFormat` / `Intl.PluralRules` e passe a cadeia já formatada como parâmetro.

## Escapar chaves literais

Uma `{` ou `}` sozinha, ou um grupo com espaços como `{ color: red }`, **não** é um marcador e passa intacto, então CSS, JSON e trechos de código dentro de uma mensagem estão seguros por padrão. O único caso ambíguo é um `{word}` literal que você queira mostrar como está. Para escapá-lo, **duplique as chaves** (a mesma convenção do `format!` do Rust, do `str.format` do Python e do `String.Format` do .NET):

::: v-pre

```js
const i18n = useI18n(); // considera-se que as mensagens abaixo já estão registradas

i18n.t('use {{ and }} for literal braces'); // → "use { and } for literal braces"
i18n.t('the {{count}} token'); // → "the {count} token"  (sem interpolar)
i18n.t('{{{name}}}', { name: 'Ada' }); // → "{Ada}"  (o valor entre chaves literais)
```

| Na mensagem | Saída                                         |
| ----------- | --------------------------------------------- |
| `{{`        | `{`                                           |
| `}}`        | `}`                                           |
| `{name}`    | o parâmetro `name`, ou `{name}` se não houver |
| `{ name }`  | `{ name }` (com espaços → não é um marcador)  |
| `{`         | `{` (chave sozinha)                           |

O escape é aplicado na mesma passagem da esquerda para a direita que a interpolação e funciona passando parâmetros ou não, então `{{` e `}}` sempre significam chaves literais.

> Duplicar é a mesma convenção usada pelo `format!` do Rust, pelo `str.format` do Python e pelo `String.Format` do .NET, então não é preciso um caractere de escape novo. Se precisar de gramática real de plural, gênero ou número, formate com `Intl.*` e passe o resultado como parâmetro.

:::

## Reagir a mudanças de idioma

`onChange` dispara depois de cada `setLocale`; use-o para redesenhar as cadeias que você já pintou:

```js
const i18n = useI18n();

const unsubscribe = i18n.onChange((locale) => {
  document.documentElement.lang = locale;
  repaintStrings(); // roda de novo suas chamadas a t()
});

// mais tarde, quando a view é desmontada
unsubscribe();
```

## Acrescentar mensagens sob demanda

Carregue o dicionário de um idioma quando precisar (por exemplo, separando o código por idioma) e funda-o:

```js
const i18n = useI18n();

const { default: fr } = await import('./locales/fr.js');
i18n.addMessages('fr', fr); // funde-se a qualquer dicionário 'fr' existente
i18n.setLocale('fr');
```

## Localizar o texto dos componentes

Os componentes **não** leem deste motor por conta própria. Isso é proposital: um componente que lesse direto de um singleton global amarraria todo consumidor a uma única instância e a um único esquema de nomes de chave, e faria uma página que importa um só botão trazer junto a camada de tradução. Em vez disso, **toda cadeia visível é uma entrada**: um atributo, uma propriedade, uma opção ou conteúdo de slot. Localizar o ranui, então, é passar a saída de `t()` no lugar por onde a cadeia já entra:

```js
const i18n = useI18n(); // considera-se que as mensagens abaixo já estão registradas

modal.setAttribute('title', i18n.t('dialog.deleteProject.title'));
themeSwitch.setAttribute('label-dark', i18n.t('theme.dark'));
```

A maioria dos componentes não tem texto próprio: ele chega pelos slots e atributos que você já escreve. Uns poucos trazem um padrão em inglês para alguma cadeia que não tem de onde vir, quase sempre nomes acessíveis:

| Componente                                        | Inglês embutido                                                                                                         | Sobrescreve com                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `Modal.confirm` / `Modal.open`                    | título `Confirm`, botões `OK` / `Cancel`                                                                                | as opções `title`, `okText`, `cancelText`            |
| `Modal.info` / `.success` / `.warning` / `.error` | títulos `Info` / `Success` / `Warning` / `Error`                                                                        | a opção `title`                                      |
| `<r-theme-switch>`                                | aria-labels `Theme`, `System theme`, `Light theme`, `Dark theme`                                                        | `label`, `label-system`, `label-light`, `label-dark` |
| `<r-voice-button>`                                | aria-labels `Start voice input` / `Stop voice input`; dicas `Release to keep · slide up to cancel`, `Release to cancel` | `label`, `active-label`, `hold-hint`, `cancel-hint`  |
| `<r-reasoning>`                                   | rótulo do cabeçalho `Reasoning`                                                                                         | `label`                                              |
| `<r-token-meter>`                                 | rótulo `Context`                                                                                                        | `label`                                              |
| `<r-colorpicker>`                                 | aria-labels `Choose color`, `Hue`, `Alpha opacity`                                                                      | `label`, `hue-label`, `alpha-label`                  |

Um padrão prático é reaplicá-los a partir de um só lugar a cada mudança de idioma, para que o mesmo código rode na inicialização e depois de uma troca:

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

Lembre-se de manter o `document.documentElement.lang` em dia também: é por ele que o navegador, os leitores de tela e os seletores `:lang()` se guiam.

## API

`createI18n(config)` cria e registra o singleton global (chame uma vez); `useI18n()` o devolve, ou `null` se o `createI18n` ainda não tiver rodado.

### `I18nConfig`

| Campo             | Tipo             | Padrão         | Descrição                                                                                                                                                                                                              |
| ----------------- | ---------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`        | `LocaleMessages` | `{}`           | `locale → { key → string }`. Cada dicionário é plano.                                                                                                                                                                  |
| `locale`          | `string`         | o de reserva   | Idioma inicial (uma escolha persistida tem prioridade quando está ligada).                                                                                                                                             |
| `fallbackLocale`  | `string`         | `'en'`         | Idioma consultado quando falta uma chave no idioma ativo.                                                                                                                                                              |
| `persist`         | `boolean`        | `false`        | Guarda o idioma ativo no `localStorage`.                                                                                                                                                                               |
| `storageKey`      | `string`         | `'ran-locale'` | Chave do localStorage usada quando `persist` está ligado.                                                                                                                                                              |
| `detectNavigator` | `boolean`        | `false`        | Define o idioma inicial pelas preferências do navegador. Lê a lista ordenada `navigator.languages` inteira, então quem não tem dicionário para a primeira escolha ainda recebe a segunda, em vez do idioma de reserva. |

### Métodos de `I18nCore`

| Método                      | Retorna       | Descrição                                                       |
| --------------------------- | ------------- | --------------------------------------------------------------- |
| `t(key, params?)`           | `string`      | Traduz; recai no idioma de reserva e depois na própria chave.   |
| `setLocale(locale)`         | `void`        | Troca de idioma; persiste (se ligado) e avisa os assinantes.    |
| `getLocale()`               | `string`      | O idioma ativo.                                                 |
| `onChange(handler)`         | `() => void`  | Assina as mudanças de idioma; devolve uma função para cancelar. |
| `addMessages(locale, dict)` | `void`        | Funde mais mensagens em um idioma.                              |
| `getMessages(locale?)`      | `MessageDict` | Lê o dicionário de um idioma (por padrão, o ativo).             |
| `availableLocales`          | `string[]`    | Idiomas que têm um dicionário registrado.                       |
| `destroy()`                 | `void`        | Remove todos os assinantes.                                     |

**Tipos**

```ts
type MessageDict = Record<string, string>; // plano: 'hero.title' → 'Hi {name}'
type LocaleMessages = Record<string, MessageDict>; // locale → MessageDict
type TranslateParams = Record<string, string | number>;
```

## SSR

O núcleo é seguro em SSR: os acessos a `localStorage` e `navigator` são protegidos, então `createI18n` e `t` rodam sem lançar erro durante a renderização no servidor. A persistência e a detecção pelo navegador simplesmente não fazem nada no servidor e passam a valer assim que o código roda no navegador.
