# detectLanguage

Decide la escritura dominante de un texto por la proporción de caracteres. Pura estadística: ni modelo ni diccionario. Úsalo para ramificar entre «qué tokenizador / qué modelo específico de idioma / qué métricas tipográficas».

## API

### detectLanguage(text, sampleSize?)

| Parámetro    | Descripción                 | Tipo     | Por defecto |
| ------------ | --------------------------- | -------- | ----------- |
| `text`       | Texto que se examina        | `string` | Obligatorio |
| `sampleSize` | Caracteres que se muestrean | `number` | `20000`     |

Devuelve `'zh' \| 'ja' \| 'ko' \| 'en' \| 'other'`.

### navigatorLanguage()

El idioma de la interfaz del navegador, llevado a esos mismos grupos. Es el valor por defecto cuando no hay contenido que examinar. Bajo SSR devuelve `'other'`.

## Ejemplo

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'title-zh-v1', ja: 'title-ja-v1', ko: 'title-ko-v1', en: 'title-en-v1' }[lang];
```

## Notas

1. **Solo se muestrea el principio.** El idioma de un texto se mantiene de cabo a rabo; recorrer un libro de un millón de caracteres para averiguar lo que su primer párrafo ya dice es tiempo perdido.
2. **Un texto en chino con algo de inglés sigue siendo chino.** El alfabeto latino tiene que dominar con claridad (más del triple) para que el veredicto pase a inglés. Mezclar inglés en un texto chino es corriente; al revés no.
3. **Dentro del CJK, quienes deciden son el kana y el hangul.** Los ideogramas han por sí solos no separan el chino del japonés, porque el japonés también escribe kanji. El kana sí: el japonés lo usa en cada partícula y cada flexión, y el chino no lo usa en absoluto; el hangul cumple ese mismo papel en coreano. Un texto en han sin ninguna escritura marcadora se lee como chino, que es el único de los tres que se escribe solo con han.
4. **Un título citado no da la vuelta al veredicto.** La escritura marcadora tiene que suponer al menos el 5% de los caracteres CJK, así que una página en chino que cite el título de una película japonesa sigue siendo china.
5. **Son escrituras con nombre de idioma.** El español, el portugués y el alemán devuelven todos `'en'`: comparten el alfabeto latino, quieren la misma segmentación y el mismo corte de línea, y nada por debajo de esta función sabría distinguirlos. El cirílico, el árabe, el tailandés y los textos de solo dígitos caen en `'other'`. Es un reparto grueso por escritura, no una identificación de idiomas.
