# detectLanguage

Decide a escrita dominante de um texto pela proporção de caracteres. Pura estatística: sem modelo e sem dicionário. Use para ramificar entre «qual tokenizador / qual modelo específico do idioma / quais métricas tipográficas».

## API

### detectLanguage(text, sampleSize?)

| Parâmetro    | Descrição             | Tipo     | Padrão      |
| ------------ | --------------------- | -------- | ----------- |
| `text`       | Texto a examinar      | `string` | Obrigatório |
| `sampleSize` | Caracteres amostrados | `number` | `20000`     |

Devolve `'zh' \| 'ja' \| 'ko' \| 'en' \| 'other'`.

### navigatorLanguage()

O idioma da interface do navegador, mapeado para esses mesmos grupos. É o valor padrão quando não há conteúdo a examinar. Sob SSR devolve `'other'`.

## Exemplo

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'title-zh-v1', ja: 'title-ja-v1', ko: 'title-ko-v1', en: 'title-en-v1' }[lang];
```

## Notas

1. **Só o começo é amostrado.** O idioma de um texto se mantém do início ao fim; varrer um livro de um milhão de caracteres para descobrir o que o primeiro parágrafo já diz é desperdício.
2. **Um texto em chinês com um pouco de inglês continua chinês.** O alfabeto latino precisa dominar com clareza (mais do que o triplo) para o veredicto virar inglês. Misturar inglês em texto chinês é comum; o contrário, não.
3. **Dentro do CJK, quem decide são o kana e o hangul.** Os ideogramas han sozinhos não separam o chinês do japonês, porque o japonês também escreve kanji. O kana separa: o japonês o usa em cada partícula e cada flexão, e o chinês não o usa de jeito nenhum; o hangul faz o mesmo papel no coreano. Um texto em han sem nenhuma escrita marcadora é lido como chinês, o único dos três que se escreve só com han.
4. **Um título citado não vira o veredicto.** A escrita marcadora precisa representar ao menos 5% dos caracteres CJK, então uma página em chinês que cite o título de um filme japonês continua chinesa.
5. **São escritas com nome de idioma.** Espanhol, português e alemão devolvem todos `'en'`: dividem o alfabeto latino, querem a mesma segmentação e o mesmo corte de linha, e nada abaixo desta função saberia distingui-los. Cirílico, árabe, tailandês e textos só de dígitos caem em `'other'`. É uma divisão grosseira por escrita, não uma identificação de idiomas.
