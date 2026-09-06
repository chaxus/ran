# DOM virtual (vnode)

Um DOM virtual leve ao estilo do Snabbdom. Ele representa sua interface com objetos JavaScript comuns (os `VNode`), compara uma árvore velha com uma nova e aplica ao DOM real só as diferenças.

- `init()` monta o reconciliador e devolve uma função `patch`. Os módulos que vêm junto (class / props / attrs / style / events) se registram sozinhos.
- `patch(oldVnode, newVnode)` monta uma árvore (quando `oldVnode` é um elemento real do DOM) ou compara duas árvores de vnodes e atualiza o DOM ali mesmo.
- `h(sel, dataOrChildren?, children?)` é o auxiliar de hyperscript que constrói os `VNode`.

## Importar

```js
import { init, h, classModule, propsModule, styleModule, eventListenersModule } from 'ranuts/vnode';
```

> Nota: nesta implementação o `init()` **não recebe argumentos**: o conjunto de módulos é fixo e se registra por dentro, então não é preciso passar cada `*Module` para o `init`. Eles são exportados para consulta e inspeção.

## Exemplo

### Primeiros passos

```js
import { init, h } from 'ranuts/vnode';

// init() devolve uma função `patch`.
// Os módulos que vêm junto (class, props, attrs, style, events) se registram sozinhos.
const patch = init();

const container = document.getElementById('app');

// Monta uma árvore de vnodes
let vnode = h('div#app.container', { style: { color: 'red' } }, [
  h('h1', 'Hello vnode'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Click me'),
]);

// Primeiro desenho: passe um elemento real do DOM como vnode velho para montar dentro dele
patch(container, vnode);

// Depois: monte a árvore atualizada e aplique sobre ela o vnode anterior.
// Ao DOM chegam só as diferenças (texto, estilo, ouvintes).
const newVnode = h('div#app.container', { style: { color: 'green' } }, [
  h('h1', 'Hello again'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Updated'),
]);

patch(vnode, newVnode);
vnode = newVnode; // guarde a última árvore para o próximo patch
```

### Construir nós com `h`

```js
// só a tag
h('div');

// tag + data
h('div', { class: { active: true } });

// tag + um único filho de texto
h('span', 'hello');

// tag + array de filhos
h('ul', [h('li', 'one'), h('li', 'two')]);

// tag + data + filhos
h('a', { attrs: { href: '/home' } }, 'Home');

// Seletores ao estilo do CSS definem o id e as classes
h('div#main.card.large', 'content'); // <div id="main" class="card large">content</div>

// O espaço de nomes do SVG entra sozinho quando o seletor começa com "svg"
h('svg', { attrs: { width: 100, height: 100 } }, [h('circle', { attrs: { cx: 50, cy: 50, r: 40 } })]);
```

## API

### `init()`

Cria o reconciliador e devolve uma função `patch`. Os módulos que vêm junto são registrados por dentro; ele não recebe argumentos.

#### Retorna

| Valor   | Descrição                                                | Tipo                                                  |
| ------- | -------------------------------------------------------- | ----------------------------------------------------- |
| `patch` | Monta árvores de vnodes contra o DOM real, ou as compara | `(oldVnode: VNode \| Element, vnode: VNode) => VNode` |

### `patch(oldVnode, vnode)`

É o que o `init()` devolve. Na primeira chamada, passe um `Element` real do DOM como `oldVnode` para montar a árvore dentro dele. Nas seguintes, passe o `VNode` anterior para comparar e atualizar ali mesmo. Devolve o novo `VNode`, que você guarda como valor «velho» para a chamada seguinte.

#### Parâmetros

| Parâmetro  | Descrição                                                    | Tipo               |
| ---------- | ------------------------------------------------------------ | ------------------ |
| `oldVnode` | O vnode anterior, ou um elemento do DOM na primeira montagem | `VNode \| Element` |
| `vnode`    | A nova árvore de vnodes a desenhar                           | `VNode`            |

### `h(sel, dataOrChildren?, children?)`

Auxiliar de hyperscript que constrói um `VNode`. Ele é sobrecarregado:

| Assinatura               | Descrição                                                        |
| ------------------------ | ---------------------------------------------------------------- |
| `h(sel)`                 | Elemento a partir de um seletor, e mais nada                     |
| `h(sel, data)`           | Elemento com `VNodeData` (o `data` pode ser `null`)              |
| `h(sel, children)`       | Elemento com filhos: um texto ou número, um `VNode`, ou um array |
| `h(sel, data, children)` | Elemento com dados e filhos                                      |

#### Parâmetros

| Parâmetro  | Descrição                                                                                                                               | Tipo                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `sel`      | Seletor ao estilo do CSS: `tag`, `tag#id`, `tag.class`, ou combinados (`div#id.a.b`). Com `svg…` o espaço de nomes do SVG entra sozinho | `string`            |
| `data`     | Dados do nó: class / props / attrs / style / ouvintes / key / hook. Pode ser `null`                                                     | `VNodeData \| null` |
| `children` | Um texto ou número (que vira um nó de texto), um único `VNode`, ou um array deles                                                       | `VNodeChildren`     |

#### Campos de `VNodeData`

| Campo   | Descrição                                                                                 | Tipo                                          | Quem aplica                 |
| ------- | ----------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------- |
| `props` | Propriedades do DOM atribuídas com `elm[key] = value`                                     | `Record<string, any>`                         | `propsModule`               |
| `attrs` | Atributos HTML postos com `setAttribute` (`true` e `false` põem e tiram o atributo)       | `Record<string, string \| number \| boolean>` | `attributesModule`          |
| `class` | Classes condicionais: uma correspondência `name → boolean`                                | `Record<string, boolean>`                     | `classModule`               |
| `style` | Estilos em linha: uma correspondência `name → value` (chaves `--var` viram variáveis CSS) | `Record<string, any>`                         | `styleModule`               |
| `on`    | Ouvintes de evento: `event → handler` (ou um array de manipuladores)                      | `Record<string, Function \| Function[]>`      | `eventListenersModule`      |
| `key`   | Identidade estável que o algoritmo de comparação usa para casar e reordenar os filhos     | `string \| number`                            | (o núcleo da comparação)    |
| `ns`    | URI do espaço de nomes (posta sozinha nas subárvores SVG)                                 | `string`                                      | (o núcleo da comparação)    |
| `hook`  | Ganchos de ciclo de vida por vnode (`Hooks`)                                              | `Hooks`                                       | (só como tipo: veja a nota) |

> Nota: o `hook` e o tipo `Hooks` fazem parte da superfície pública de tipos. Esta implementação enxuta move o DOM pelo ciclo de vida dos **módulos** (`create` / `update` / `destroy`); o laço atual do `patch` não chama os `data.hook` de cada vnode.

### Módulos

Cada módulo cuida de uma fatia do `VNodeData`. O `init()` registra todos eles; além disso, são exportados um a um.

| Exportação             | Cuida de     | Descrição                                                               |
| ---------------------- | ------------ | ----------------------------------------------------------------------- |
| `classModule`          | `data.class` | Põe e tira classes a partir de uma correspondência `name → boolean`     |
| `propsModule`          | `data.props` | Atribui propriedades do DOM diretamente (`elm[key] = value`)            |
| `attributesModule`     | `data.attrs` | Põe e tira atributos HTML com `setAttribute` (inclusive xml e xlink)    |
| `styleModule`          | `data.style` | Aplica estilos em linha e propriedades personalizadas do CSS            |
| `eventListenersModule` | `data.on`    | Prende e solta ouvintes de evento                                       |
| `modules`              | —            | O objeto de registro padrão, que liga cada nome de módulo ao seu módulo |

### Exportações de nível mais baixo

| Exportação   | Tipo                                        | Descrição                                                                                                                                |
| ------------ | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `vnode`      | `(sel, data, children, text, elm) => VNode` | Fábrica de `VNode` de baixo nível que o `h` usa por dentro. No código da aplicação, prefira o `h`.                                       |
| `addNS`      | `(data, children, sel) => void`             | Aplica o espaço de nomes do SVG a uma subárvore inteira. O `h` a chama sozinho para seletores `svg…`.                                    |
| `htmlDomApi` | `DOMAPI`                                    | O adaptador de DOM de navegador padrão que o `patch` usa por dentro (criar, inserir, remover, nós de texto etc.).                        |
| `is`         | `{ array, isStr, primitive, isVnode }`      | Pequenos auxiliares de verificação de tipo usados por todo o interior do vnode.                                                          |
| `Chain`      | `class Chain`                               | Um construtor de DOM imperativo e encadeável (`setAttribute`, `append`, `setTextContent`, …). Nada tem a ver com a comparação de vnodes. |
| `create`     | `(tagName, options?) => Chain`              | Fábrica de conveniência que devolve um `Chain` novo.                                                                                     |

### Tipos

| Tipo                | Formato e sentido                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `VNode`             | `{ sel, data, children, elm, text, key, listener? }`: um nó virtual                           |
| `VNodeData`         | `{ props?, attrs?, class?, style?, on?, key?, ns?, hook? }`: veja os campos acima             |
| `VNodes`            | `VNode[]`                                                                                     |
| `VNodeChildElement` | `VNode \| string \| number`                                                                   |
| `VNodeChildren`     | `VNodeChildElement \| VNodeChildElement[]`                                                    |
| `ArrayOrElement<T>` | `T \| T[]`                                                                                    |
| `Key`               | `string \| number`                                                                            |
| `Hooks`             | `{ pre?, init?, create?, insert?, prepatch?, update?, postpatch?, destroy?, remove?, post? }` |
| `DOMAPI`            | Interface que descreve as operações de DOM que o `patch` usa (veja `htmlDomApi`)              |
| `Fragment`          | Extensão de `DocumentFragment` usada no trato com fragmentos                                  |
| `Modules`           | `Record<string, Record<string, ModuleHook>>`: o formato do registro de módulos                |
| `ModuleHook`        | Uma única chamada do ciclo de vida de um módulo                                               |

## Notas

1. **Só navegador.** O `ranuts/vnode` mexe com `document` e com as APIs do DOM; importe-o em código de navegador, não no Node.
2. **Guarde o último vnode.** O `patch` devolve o novo `VNode`. Guarde-o e passe-o como `oldVnode` na atualização seguinte, para que as diferenças sejam calculadas contra a árvore vigente.
3. **Num `VNode`, `text` e `children` se excluem**: um nó é ou um nó de texto, ou um elemento com filhos.
4. **Use `key` nas listas.** Ao desenhar listas que mudam, dê aos irmãos valores de `key` estáveis, para que a comparação possa casar e reordenar os nós em vez de refazê-los.
