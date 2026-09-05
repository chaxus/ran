# detectLanguage

Decide o idioma dominante de um texto pela proporção de caracteres. Pura estatística: sem modelo e sem dicionário. Use para ramificar entre «qual tokenizador / qual modelo específico do idioma / quais métricas tipográficas».

## API

### detectLanguage(text, sampleSize?)

| Parâmetro    | Descrição             | Tipo     | Padrão      |
| ------------ | --------------------- | -------- | ----------- |
| `text`       | Texto a examinar      | `string` | Obrigatório |
| `sampleSize` | Caracteres amostrados | `number` | `20000`     |

Devolve `'zh' \| 'en' \| 'other'`.

### navigatorLanguage()

O idioma da interface do navegador, mapeado para esses mesmos três grupos. É o valor padrão quando não há conteúdo a examinar. Sob SSR devolve `'other'`.

## Exemplo

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'chapter-title-zh-v1', en: 'chapter-title-en-v1' }[lang];
```

## Notas

1. **Só o começo é amostrado.** O idioma de um texto se mantém do início ao fim; varrer um livro de um milhão de caracteres para descobrir o que o primeiro parágrafo já diz é desperdício.
2. **Um texto em chinês com um pouco de inglês continua chinês.** O alfabeto latino precisa dominar com clareza (mais do que o triplo) para o veredicto virar inglês. Misturar inglês em texto chinês é comum; o contrário, não.
3. **`'other'` quer dizer «nem CJK nem latino».** O kana japonês, o cirílico, o árabe e textos só de dígitos caem todos aqui. É uma divisão grosseira em três grupos, não uma identificação de idiomas.
