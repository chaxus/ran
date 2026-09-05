# randomColor

Gera um objeto de cor aleatório.

## API

### randomColor

#### Retorna

| Argumento | Descrição               | Tipo    |
| --------- | ----------------------- | ------- |
| `Color`   | Objeto de cor aleatório | `Color` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { randomColor } from 'ranuts';

const color = randomColor();
console.log(color.hex); // '#a3f5c2' (aleatória)
console.log(color.rgb); // Rgb { r: 163, g: 245, b: 194 }
console.log(color.hsl); // Hsl { h: 150, s: 80, l: 80 }
```

### Ler os valores da cor aleatória

```js
import { randomColor } from 'ranuts';

const color = randomColor();
const hexColor = color.hex;
const rgbColor = color.rgb.toString();
const hslColor = color.hsl.toString();

console.log(hexColor); // '#a3f5c2'
console.log(rgbColor); // 'rgb(163,245,194)'
console.log(hslColor); // 'hsl(150,80%,80%)'
```

### Gerar várias cores aleatórias

```js
import { randomColor } from 'ranuts';

const colors = Array.from({ length: 5 }, () => randomColor());
colors.forEach((color, index) => {
  console.log(`Color ${index + 1}:`, color.hex);
});
```

### Aplicar uma cor aleatória

```js
import { randomColor } from 'ranuts';

const color = randomColor();
document.body.style.backgroundColor = color.hex;
```

## Notas

1. **Geração aleatória**: cada chamada produz uma cor hexadecimal ao acaso.
2. **Objeto completo**: devolve um objeto `Color` inteiro, com todas as propriedades: hex, rgb, hsl e as demais.
3. **Formato da cor**: o valor gerado inclui o símbolo `#`, então pode ir direto para o CSS.
4. **Quando usar**: é comum para gerar cores ao acaso, em seletores de cor e em visualização de dados.
