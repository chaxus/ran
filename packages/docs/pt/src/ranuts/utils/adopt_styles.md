# adoptStyles / adoptSheetText

Injeta CSS num Shadow DOM, preferindo as **Constructable Stylesheets**: um mesmo CSS é analisado uma única vez e depois compartilhado _por referência_ entre todas as instâncias do componente, de modo que mil instâncias continuam tendo um único resultado analisado. Onde elas não existem, ambas recorrem a injetar uma tag `<style>`.

As duas são seguras no servidor (retornam de imediato quando não há `document`) e idempotentes.

## Uso

```ts
import css from './index.less?inline';
import { adoptStyles } from 'ranuts/utils';

class MyElement extends HTMLElement {
  constructor() {
    super();
    const root = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(root, css);
  }
}
```

## API

### adoptStyles

Para os estilos **estáticos** de um componente. O caminho alternativo evita repetição por **raiz**: um shadow root guarda exatamente uma tag `<style>` marcada, e quem escreve primeiro fica. Os estilos estáticos de um componente devem existir uma vez por raiz, então uma segunda chamada significa que quem chamou errou.

#### Parâmetros

| Parâmetro    | Descrição                                      | Tipo         | Padrão                 |
| ------------ | ---------------------------------------------- | ------------ | ---------------------- |
| `shadowRoot` | O shadow root de destino                       | `ShadowRoot` | Obrigatório            |
| `cssText`    | O texto do estilo                              | `string`     | Obrigatório            |
| `marker`     | Atributo que marca a tag `<style>` alternativa | `string`     | `'data-adopted-style'` |

#### Retorna

Sem valor de retorno (`void`)

### adoptSheetText

Para os estilos **dinâmicos** que chegam em tempo de execução (a propriedade `sheet` de um componente, por exemplo). A única diferença em relação a `adoptStyles` é sobre o que o caminho alternativo evita repetição: aqui é o **cssText**, então uma mesma raiz pode empilhar várias folhas dinâmicas distintas, enquanto uma idêntica é injetada só uma vez.

#### Parâmetros

| Parâmetro    | Descrição                                      | Tipo         | Padrão                 |
| ------------ | ---------------------------------------------- | ------------ | ---------------------- |
| `shadowRoot` | O shadow root de destino                       | `ShadowRoot` | Obrigatório            |
| `cssText`    | O texto do estilo                              | `string`     | Obrigatório            |
| `marker`     | Atributo que marca a tag `<style>` alternativa | `string`     | `'data-adopted-sheet'` |

#### Retorna

Sem valor de retorno (`void`)

## Constantes

| Nome                   | Valor                  | Significado                                         |
| ---------------------- | ---------------------- | --------------------------------------------------- |
| `ADOPTED_STYLE_MARKER` | `'data-adopted-style'` | Marca padrão da tag alternativa de `adoptStyles`    |
| `ADOPTED_SHEET_MARKER` | `'data-adopted-sheet'` | Marca padrão da tag alternativa de `adoptSheetText` |

O parâmetro `marker` existe para que uma biblioteca possa assinar os estilos que injeta e reencontrá-los depois. O ranui, por exemplo, passa `data-ranui` e `data-ranui-sheet`.
