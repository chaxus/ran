
# OCR

传入图片和对应的语言类型，返回图片中的文本

## API

### Return

| 参数      | 说明                 | 类型      |
| --------- | -------------------- | --------- |
| `success` | 是否解析成功         | `boolean` |
| `data`    | 解析成功后的对象     | `obj`     |
| `message` | 解析成功或失败的原因 | `string`  |

### Options

| 参数      | 说明                                                  | 类型            | 默认值 |
| --------- | ----------------------------------------------------- | --------------- | ------ |
| images    | 图片的数组，支持`url`和`base64`                       | `Array<string>` | 无     |
| languages | 指定生成文本的语言，具体参数见[lang-code](#lang-code) | `Array<string>` | 无     |

## Example

```js
import { ocr } from 'ranuts'

orc({ images:[],languages:['eng','chi_sim']  }).then(res=>{
    console.log(res) 
})

```

## Lang Code

| Lang Code | Language                       |
| --------- | ------------------------------ |
| afr       | Afrikaans                      |
| amh       | Amharic                        |
| ara       | Arabic                         |
| asm       | Assamese                       |
| aze       | Azerbaijani                    |
| aze_cyrl  | Azerbaijani - Cyrillic         |
| bel       | Belarusian                     |
| ben       | Bengali                        |
| bod       | Tibetan                        |
| bos       | Bosnian                        |
| bul       | Bulgarian                      |
| cat       | Catalan; Valencian             |
| ceb       | Cebuano                        |
| ces       | Czech                          |
| chi_sim   | Chinese - Simplified           |
| chi_tra   | Chinese - Traditional          |
| chr       | Cherokee                       |
| cym       | Welsh                          |
| dan       | Danish                         |
| deu       | German                         |
| dzo       | Dzongkha                       |
| ell       | Greek, Modern (1453-)          |
| eng       | English                        |
| enm       | English, Middle (1100-1500)    |
| epo       | Esperanto                      |
| est       | Estonian                       |
| eus       | Basque                         |
| fas       | Persian                        |
| fin       | Finnish                        |
| fra       | French                         |
| frk       | German Fraktur                 |
| frm       | French, Middle (ca. 1400-1600) |
| gle       | Irish                          |
| glg       | Galician                       |
| grc       | Greek, Ancient (-1453)         |
| guj       | Gujarati                       |
| hat       | Haitian; Haitian Creole        |
| heb       | Hebrew                         |
| hin       | Hindi                          |
| hrv       | Croatian                       |
| hun       | Hungarian                      |
| iku       | Inuktitut                      |
| ind       | Indonesian                     |
| isl       | Icelandic                      |
| ita       | Italian                        |
| ita_old   | Italian - Old                  |
| jav       | Javanese                       |
| jpn       | Japanese                       |
| kan       | Kannada                        |
| kat       | Georgian                       |
| kat_old   | Georgian - Old                 |
| kaz       | Kazakh                         |
| khm       | Central Khmer                  |
| kir       | Kirghiz; Kyrgyz                |
| kor       | Korean                         |
| kur       | Kurdish                        |
| lao       | Lao                            |
| lat       | Latin                          |
| lav       | Latvian                        |
| lit       | Lithuanian                     |
| mal       | Malayalam                      |
| mar       | Marathi                        |
| mkd       | Macedonian                     |
| mlt       | Maltese                        |
| msa       | Malay                          |
| mya       | Burmese                        |
| nep       | Nepali                         |
| nld       | Dutch; Flemish                 |
| nor       | Norwegian                      |
| ori       | Oriya                          |
| pan       | Panjabi; Punjabi               |
| pol       | Polish                         |
| por       | Portuguese                     |
| pus       | Pushto; Pashto                 |
| ron       | Romanian; Moldavian; Moldovan  |
| rus       | Russian                        |
| san       | Sanskrit                       |
| sin       | Sinhala; Sinhalese             |
| slk       | Slovak                         |
| slv       | Slovenian                      |
| spa       | Spanish; Castilian             |
| spa_old   | Spanish; Castilian - Old       |
| sqi       | Albanian                       |
| srp       | Serbian                        |
| srp_latn  | Serbian - Latin                |
| swa       | Swahili                        |
| swe       | Swedish                        |
| syr       | Syriac                         |
| tam       | Tamil                          |
| tel       | Telugu                         |
| tgk       | Tajik                          |
| tgl       | Tagalog                        |
| tha       | Thai                           |
| tir       | Tigrinya                       |
| tur       | Turkish                        |
| uig       | Uighur; Uyghur                 |
| ukr       | Ukrainian                      |
| urd       | Urdu                           |
| uzb       | Uzbek                          |
| uzb_cyrl  | Uzbek - Cyrillic               |
| vie       | Vietnamese                     |
| yid       | Yiddish                        |
