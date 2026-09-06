# Processamento de imagens

Auxiliares de imagem apoiados em canvas. Cada transformação devolve um **canvas fora da tela** em vez de uma data URL, então dá para encadear várias sem codificar e decodificar um PNG a cada passo.

## Uso

```ts
import { getImage, cutRound, opacity } from 'ranuts/utils';

const img = await getImage('/avatar.png');
const rounded = cutRound(img, 24);
const faded = opacity(rounded, 0.5);
document.body.appendChild(faded as HTMLCanvasElement);
```

## API

### getImage

Carrega uma imagem pelo caminho; resolve assim que ela é decodificada.

#### Parâmetros

| Parâmetro | Descrição         | Tipo     | Padrão      |
| --------- | ----------------- | -------- | ----------- |
| `src`     | Caminho da imagem | `string` | Obrigatório |

#### Retorna

| Argumento | Descrição                         | Tipo                 |
| --------- | --------------------------------- | -------------------- |
| `promise` | O elemento de imagem já carregado | `Promise<ImgSource>` |

::: tip
A rejeição carrega o **evento** `error` cru, não um objeto `Error`. O `onerror` de uma `<img>` não traz motivo nenhum — os navegadores o escondem de propósito quando a falha é de origem cruzada —, então embrulhá-lo num `Error` só fabricaria uma mensagem falsa.
:::

### cutRound

Recorta uma imagem com cantos arredondados.

#### Parâmetros

| Parâmetro | Descrição        | Tipo        | Padrão      |
| --------- | ---------------- | ----------- | ----------- |
| `img`     | Imagem de origem | `ImgSource` | Obrigatório |
| `radius`  | Raio do canto    | `number`    | Obrigatório |

#### Retorna

| Argumento | Descrição           | Tipo        |
| --------- | ------------------- | ----------- |
| `canvas`  | Canvas fora da tela | `ImgSource` |

### opacity

Aplica uma opacidade uniforme a uma imagem.

Prefere o `ctx.filter` (que roda na GPU); onde ele não existe, recorre a reescrever o canal alfa pixel a pixel. Esse caminho alternativo pula os pixels cujo alfa já é `0`, de modo que as regiões totalmente transparentes não acabam com um valor diferente de zero.

#### Parâmetros

| Parâmetro | Descrição           | Tipo        | Padrão      |
| --------- | ------------------- | ----------- | ----------- |
| `img`     | Imagem de origem    | `ImgSource` | Obrigatório |
| `opacity` | Opacidade, de 0 a 1 | `number`    | Obrigatório |

#### Retorna

| Argumento | Descrição           | Tipo        |
| --------- | ------------------- | ----------- |
| `canvas`  | Canvas fora da tela | `ImgSource` |

### getMatrix

Monta uma matriz gaussiana de pesos em duas dimensões, normalizada para que somem `1`.

A normalização é indispensável: sem ela, convolver com a matriz muda o brilho geral da imagem. `sigma` vale por padrão `radius / 3`; com esse valor a gaussiana já decaiu para quase zero ao chegar ao raio, então o erro de truncamento é desprezível.

#### Parâmetros

| Parâmetro | Descrição        | Tipo     | Padrão       |
| --------- | ---------------- | -------- | ------------ |
| `radius`  | Raio do desfoque | `number` | Obrigatório  |
| `sigma`   | Desvio padrão    | `number` | `radius / 3` |

#### Retorna

| Argumento | Descrição                                                   | Tipo       |
| --------- | ----------------------------------------------------------- | ---------- |
| `matrix`  | Array plano de `(2r+1)²` elementos, por linhas, somando `1` | `number[]` |

## Tipos

```ts
type ImgSource = HTMLImageElement | HTMLCanvasElement;
```

## Relacionado

- [convertImageToBase64](/pt/src/ranuts/utils/convert_image_to_base64): de `File` para data URL em base64
- [isImageSize](/pt/src/ranuts/utils/is_image_size): validar as dimensões de uma imagem
