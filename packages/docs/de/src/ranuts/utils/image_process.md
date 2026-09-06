# Bildbearbeitung

Bildhelfer auf Canvas-Basis. Jede Umformung gibt ein **Offscreen-Canvas** zurück statt einer Data-URL; mehrere lassen sich also aneinanderhängen, ohne bei jedem Schritt ein PNG zu kodieren und wieder zu dekodieren.

## Verwendung

```ts
import { getImage, cutRound, opacity } from 'ranuts/utils';

const img = await getImage('/avatar.png');
const rounded = cutRound(img, 24);
const faded = opacity(rounded, 0.5);
document.body.appendChild(faded as HTMLCanvasElement);
```

## API

### getImage

Lädt ein Bild über seinen Pfad; erfüllt sich, sobald es dekodiert ist.

#### Parameter

| Parameter | Beschreibung    | Typ      | Standard     |
| --------- | --------------- | -------- | ------------ |
| `src`     | Pfad des Bildes | `string` | Erforderlich |

#### Rückgabe

| Argument  | Beschreibung             | Typ                  |
| --------- | ------------------------ | -------------------- |
| `promise` | Das geladene Bildelement | `Promise<ImgSource>` |

::: tip
Bei einer Ablehnung kommt das rohe `error`-**Ereignis** durch, kein `Error`-Objekt. Das `onerror` eines `<img>` trägt keinen Grund mit sich — bei Fehlschlägen über Ursprungsgrenzen hinweg halten die Browser ihn absichtlich zurück —, es in einen `Error` zu packen würde also nur eine erfundene Meldung herstellen.
:::

### cutRound

Schneidet ein Bild mit abgerundeten Ecken zu.

#### Parameter

| Parameter | Beschreibung | Typ         | Standard     |
| --------- | ------------ | ----------- | ------------ |
| `img`     | Ausgangsbild | `ImgSource` | Erforderlich |
| `radius`  | Eckenradius  | `number`    | Erforderlich |

#### Rückgabe

| Argument | Beschreibung     | Typ         |
| -------- | ---------------- | ----------- |
| `canvas` | Offscreen-Canvas | `ImgSource` |

### opacity

Legt eine gleichmäßige Deckkraft über ein Bild.

Bevorzugt `ctx.filter` (läuft auf der GPU); wo es das nicht gibt, weicht es darauf aus, den Alphakanal Pixel für Pixel neu zu schreiben. Dieser Ausweichpfad überspringt Pixel, deren Alpha bereits `0` ist — vollständig durchsichtige Bereiche können also keinen Wert ungleich null bekommen.

#### Parameter

| Parameter | Beschreibung       | Typ         | Standard     |
| --------- | ------------------ | ----------- | ------------ |
| `img`     | Ausgangsbild       | `ImgSource` | Erforderlich |
| `opacity` | Deckkraft, 0 bis 1 | `number`    | Erforderlich |

#### Rückgabe

| Argument | Beschreibung     | Typ         |
| -------- | ---------------- | ----------- |
| `canvas` | Offscreen-Canvas | `ImgSource` |

### getMatrix

Baut eine zweidimensionale Gauß-Gewichtsmatrix, normiert, sodass die Gewichte sich zu `1` summieren.

Die Normierung ist unerlässlich: Ohne sie verändert die Faltung mit der Matrix die Gesamthelligkeit des Bildes. `sigma` ist standardmäßig `radius / 3`; bei diesem Wert ist die Gaußkurve am Radius bereits fast auf null abgeklungen, der Abschneidefehler fällt also nicht ins Gewicht.

#### Parameter

| Parameter | Beschreibung         | Typ      | Standard     |
| --------- | -------------------- | -------- | ------------ |
| `radius`  | Radius der Unschärfe | `number` | Erforderlich |
| `sigma`   | Standardabweichung   | `number` | `radius / 3` |

#### Rückgabe

| Argument | Beschreibung                                               | Typ        |
| -------- | ---------------------------------------------------------- | ---------- |
| `matrix` | Flaches Array aus `(2r+1)²` Werten, zeilenweise, Summe `1` | `number[]` |

## Typen

```ts
type ImgSource = HTMLImageElement | HTMLCanvasElement;
```

## Verwandtes

- [convertImageToBase64](/de/src/ranuts/utils/convert_image_to_base64): von `File` zur Base64-Data-URL
- [isImageSize](/de/src/ranuts/utils/is_image_size): die Maße eines Bildes prüfen
