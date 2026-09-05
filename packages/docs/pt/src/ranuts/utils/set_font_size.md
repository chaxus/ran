# setFontSize2html

Define o `font-size` da raiz `<html>` em proporção à viewport, de modo que um design feito com largura fixa (375px, a largura típica em celular) escale junto com a tela real: a clássica técnica do «rem flexível» para layouts de celular construídos em `rem`.

## Uso

```ts
import { setFontSize2html } from 'ranuts/utils';

setFontSize2html(); // a largura de design é 375px por padrão
// ou, para um design feito em outra largura:
setFontSize2html(414);
```

Chame uma vez na inicialização. Ela mesma roda de novo ao redimensionar e ao girar a tela, então uma chamada basta para toda a vida da página.

```css
/* Uma caixa desenhada com 200px no layout de 375px de largura */
.box {
  width: 5.33333rem; /* 200 / 375 * 100 */
}
```

## API

### `setFontSize2html(designWidth?)`

#### Parâmetros

| Parâmetro     | Descrição                                   | Tipo     | Padrão |
| ------------- | ------------------------------------------- | -------- | ------ |
| `designWidth` | A largura, em px, em que o design foi feito | `number` | `375`  |

#### Retorna

Sem valor de retorno (`void`). Como efeito colateral, define `documentElement.style.fontSize` e instala os próprios ouvintes de `resize` e `orientationchange`.

## Notas

1. **O iPad ganha outra base automaticamente.** Quando `currentDevice()` acusa um iPad, a largura de design e a proporção passam a `768` / `1024:768` em vez de usar o `designWidth` que você passou. A função presume um layout de celular e corrige a única exceção frequente.
2. **Não há como desmontar.** Diferente de quase todos os auxiliares desta biblioteca que instalam ouvintes, `setFontSize2html` não devolve nada para cancelá-los. Ela foi feita para ser chamada uma vez durante toda a vida da página, não dentro de um componente que monta e desmonta.
3. Precisa de `document` e `window`; proteja a chamada se o código puder rodar durante a renderização no servidor.
4. Anda junto com um passo de build de CSS (postcss-pxtorem ou parecido) que converta para `rem` os valores em `px` do layout, na mesma base. `setFontSize2html` só define o tamanho de fonte da raiz; não converte sua folha de estilo.
