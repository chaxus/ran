# EventManager / createDoubleTapDetector

Um registro de eventos preso ao ciclo de vida e apoiado no `AbortController`, mais um pequeno detector de toque duplo, indiferente ao tipo de ponteiro, para gestos de toque.

O problema que ele resolve é _tirar os ouvintes de volta_. O `removeEventListener` só funciona se você entregar a ele **exatamente a mesma** referência de função e as mesmas opções com que registrou. Embrulhe o manipulador numa arrow function na hora de passar e nunca mais conseguirá removê-lo. Componentes que montam e desmontam repetidas vezes passam então a vazar um ouvinte por ciclo. O `AbortController` transforma tudo isso num único `abort()`.

## Uso

### Dentro de um Web Component

```ts
import { EventManager } from 'ranuts/utils';

class MyElement extends HTMLElement {
  private _events = new EventManager();

  connectedCallback() {
    this._events.on(this._input, 'input', this.handleInput).on(this, 'click', this.handleClick, { capture: true });
  }

  disconnectedCallback() {
    this._events.abort(); // tira todos os ouvintes e deixa tudo limpo para a próxima conexão
  }
}
```

### No código comum de uma página

```ts
function initSection(container: HTMLElement) {
  const scope = new EventManager();

  scope.on(input, 'input', handleSearch).delegate(container, '[data-action]', 'click', (ev, target) => {
    handleAction(target.getAttribute('data-action'));
  });

  return () => scope.abort(); // chame quando a seção for desmontada
}
```

## API

### on

Registra um ouvinte preso a este gerenciador. Dá para encadear.

#### Parâmetros

| Parâmetro | Descrição                                      | Tipo                                     | Padrão      |
| --------- | ---------------------------------------------- | ---------------------------------------- | ----------- |
| `target`  | O alvo do evento                               | `EventTarget`                            | Obrigatório |
| `type`    | Nome do evento                                 | `string`                                 | Obrigatório |
| `handler` | A função manipuladora                          | `EventListener`                          | Obrigatório |
| `options` | As opções do `addEventListener` menos `signal` | `Omit<AddEventListenerOptions,'signal'>` | `-`         |

#### Retorna

| Argumento | Descrição                            | Tipo           |
| --------- | ------------------------------------ | -------------- |
| `this`    | O próprio gerenciador, para encadear | `EventManager` |

### delegate

Delegação de eventos: põe **um só** ouvinte no `parent` e chama o `handler` apenas quando o evento nasceu de um descendente que casa com `selector`. Dá para encadear.

O manipulador recebe o evento original e o elemento que casou.

```ts
scope.delegate(list, '.item', 'click', (ev, item) => {
  console.log(item.getAttribute('data-id'));
});
```

#### Parâmetros

| Parâmetro  | Descrição                                      | Tipo                                     | Padrão      |
| ---------- | ---------------------------------------------- | ---------------------------------------- | ----------- |
| `parent`   | O elemento ao qual esse único ouvinte é preso  | `HTMLElement`                            | Obrigatório |
| `selector` | O seletor com que o descendente precisa casar  | `string`                                 | Obrigatório |
| `type`     | Nome do evento                                 | `string`                                 | Obrigatório |
| `handler`  | `(event, matchedElement) => void`              | `Function`                               | Obrigatório |
| `options`  | As opções do `addEventListener` menos `signal` | `Omit<AddEventListenerOptions,'signal'>` | `-`         |

#### Retorna

| Argumento | Descrição                            | Tipo           |
| --------- | ------------------------------------ | -------------- |
| `this`    | O próprio gerenciador, para encadear | `EventManager` |

### abort

Tira todos os ouvintes registrados e renova o `AbortController` interno. Dá para chamar mais de uma vez sem problema; as chamadas seguintes a `on()` ou `delegate()` partem de um escopo limpo.

#### Retorna

Sem valor de retorno (`void`)

### signal

O `AbortSignal` de baixo, caso você queira passá-lo você mesmo ao `addEventListener`.

| Argumento | Descrição                              | Tipo          |
| --------- | -------------------------------------- | ------------- |
| `signal`  | O sinal de cancelamento do gerenciador | `AbortSignal` |

## createDoubleTapDetector

Detecção de toque duplo a partir de amostras cruas de `(x, y, tempo)`. É indiferente ao tipo de ponteiro, então funciona igual sendo alimentada por eventos Pointer, Touch ou Mouse. Foi feita para gestos de toque (toque duplo para avançar, para dar zoom, para curtir), onde refazer em cada lugar a lógica do limiar de tempo e distância é fácil de errar de um jeito sutil: comparar só um eixo, ou esquecer de reiniciar depois de um acerto e fazer três toques rápidos contarem como dois toques duplos sobrepostos.

```ts
import { createDoubleTapDetector } from 'ranuts/utils';

const detector = createDoubleTapDetector();
el.addEventListener('pointerup', (e) => {
  if (detector.check(e.clientX, e.clientY)) seek();
});
```

### `createDoubleTapDetector(options?)`

#### Parâmetros (`DoubleTapDetectorOptions`)

| Opção           | Descrição                                             | Tipo     | Padrão |
| --------------- | ----------------------------------------------------- | -------- | ------ |
| `windowMs`      | Intervalo máximo entre os dois toques, em ms          | `number` | `300`  |
| `maxDistancePx` | Distância máxima no plano entre os dois toques, em px | `number` | `60`   |

#### `DoubleTapDetector`

| Membro  | Descrição                                                                                                                                                                                                                                    | Tipo                                              |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `check` | Anota um toque em `(x, y)` e diz se ele forma um toque duplo com o imediatamente anterior. Ao detectar um, o rastreio é reiniciado, de modo que um terceiro toque rápido começa um par novo em vez de contar como parte do mesmo toque duplo | `(x: number, y: number, now?: number) => boolean` |
| `reset` | Esquece o último toque anotado; chame quando começar um gesto que não seja um toque (um arrasto)                                                                                                                                             | `() => void`                                      |
