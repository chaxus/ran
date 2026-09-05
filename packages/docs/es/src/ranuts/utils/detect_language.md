# detectLanguage

Decide el idioma dominante de un texto por la proporción de caracteres. Pura estadística: ni modelo ni diccionario. Úsalo para ramificar entre «qué tokenizador / qué modelo específico de idioma / qué métricas tipográficas».

## API

### detectLanguage(text, sampleSize?)

| Parámetro | Descripción | Tipo | Por defecto |
| ------------ | -------------------- | -------- | -------- |
| `text` | Texto que se examina | `string` | Obligatorio |
| `sampleSize` | Caracteres que se muestrean | `number` | `20000` |

Devuelve `'zh' \| 'en' \| 'other'`.

### navigatorLanguage()

El idioma de la interfaz del navegador, llevado a esos mismos tres grupos. Es el valor por defecto cuando no hay contenido que examinar. Bajo SSR devuelve `'other'`.

## Ejemplo

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'chapter-title-zh-v1', en: 'chapter-title-en-v1' }[lang];
```

## Notas

1. **Solo se muestrea el principio.** El idioma de un texto se mantiene de cabo a rabo; recorrer un libro de un millón de caracteres para averiguar lo que su primer párrafo ya dice es tiempo perdido.
2. **Un texto en chino con algo de inglés sigue siendo chino.** El alfabeto latino tiene que dominar con claridad (más del triple) para que el veredicto pase a inglés. Mezclar inglés en un texto chino es corriente; al revés no.
3. **`'other'` significa «ni CJK ni latino».** El kana japonés, el cirílico, el árabe y los textos de solo dígitos caen aquí. Es un reparto grueso en tres grupos, no una identificación de idiomas.
