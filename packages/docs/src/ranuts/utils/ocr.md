# OCR

Pass in the image and the corresponding language type, and return the text in the image.

## API

### Return

| argument  | Instructions                               | type      |
| --------- | ------------------------------------------ | --------- |
| `success` | Whether the resolution is successful       | `boolean` |
| `data`    | The object is parsed successfully          | `obj`     |
| `message` | Analyze the reasons for success or failure | `string`  |

### Options

| argument | Instructions                                                                                                                                                                                                                                | type            | Default value                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------------------------------------- |
| images   | An array of images, supporting 'url' and 'base64'                                                                                                                                                                                           | `Array<string>` | null                                                              |
| language | Specify the language in which the text will be generated[lang-code](#lang-code)                                                                                                                                                             | `string`        | Required                                                          |
| langPath | When using it, you need to be able to access cdn.jsdelivr.net, which will download the corresponding language package, if you cannot access it, you can also put the language package locally, passing the corresponding **directory** path | `string`        | This parameter is optional. By default, download from the network |

## Example

```js
import { ocr } from 'ranuts';

const images = ['https://chaxus.github.io/ran/ocr/eng.png'];
const languages = 'eng';
ocr({ images, language }).then((res) => {
  console.log(res.data?.[0].data.text);
});
// Mild Splendour of the various-vested Night!
// Mother of wildly-working visions! hail
// I watch thy gliding, while with watery light
// Thy weak eye glimmers through a fleecy veil;
// And when thou lovest thy pale orb to shroud
// Behind the gather’d blackness lost on high;
// And when thou dartest from the wind-rent cloud
// Thy placid lightning o’er the awaken’d sky.
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
