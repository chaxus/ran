---
description: 'O Modal do ranui (<r-modal>) é um diálogo para interações concentradas, com captura de foco, travamento da rolagem, inertização do fundo e uma API imperativa Modal.confirm.'
---

# Modal

Componente de diálogo para interações concentradas sobre a página atual, com captura de foco, travamento da rolagem e inertização do fundo.

> **Use quando** precisar de um diálogo para uma interação concentrada sobre a página, com captura de foco, travamento da rolagem e inertização do fundo. Conduza o `<r-modal>` pelo atributo `open` ou pelos auxiliares imperativos `Modal.confirm` / `Modal.info`.

## Início rápido

### Uso básico

A visibilidade do modal é controlada pelo atributo `open` (ou pela propriedade `open`). Ele começa fechado e não desenha nada até ser aberto, então ligue um gatilho que o alterne.

<ran-demo>
  <r-button onclick="document.getElementById('quickstart-modal').open = true">Abrir modal</r-button>
  <r-modal id="quickstart-modal" heading="Modal básico">
    <p>Este é o conteúdo do modal.</p>
    <div slot="footer">
      <r-button type="primary" onclick="document.getElementById('quickstart-modal').open = false">OK</r-button>
    </div>
  </r-modal>
</ran-demo>

```html
<r-button onclick="modal.open = true">Abrir modal</r-button>

<r-modal id="modal" heading="Modal básico">
  <p>Este é o conteúdo do modal.</p>
  <div slot="footer">
    <r-button type="primary" onclick="modal.open = false">OK</r-button>
  </div>
</r-modal>
```

## Referência da API

### Propriedades

| Propriedade    | Tipo      | Padrão  | Descrição                                                                    |
| -------------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `open`         | `boolean` | `false` | Se o modal está visível                                                      |
| `heading`      | `string`  | `''`    | Texto do título do cabeçalho (recai em `Modal` quando vazio)                 |
| `closable`     | `boolean` | `true`  | Se o botão de fechar (`x`) aparece                                           |
| `maskClosable` | `boolean` | `true`  | Se clicar na máscara de fundo fecha o modal                                  |
| `closeOnEsc`   | `boolean` | `true`  | Se pressionar `Escape` fecha o modal                                         |
| `lockScroll`   | `boolean` | `true`  | Se a rolagem do body fica travada enquanto o modal está aberto               |
| `autoFocus`    | `boolean` | `true`  | Se o primeiro elemento focável recebe foco ao abrir                          |
| `hideHeader`   | `boolean` | `false` | Elimina a barra de título por inteiro, deixando um botão de fechar flutuante |
| `sheet`        | `string`  | `''`    | CSS injetado no shadow DOM                                                   |

`closing` é um atributo somente leitura que o elemento reflete em si mesmo (não uma propriedade atribuível): fica presente desde o instante em que `close()` roda até a transição de desvanecer e encolher da máscara e do diálogo realmente terminar (~0,3 s depois, o mesmo momento do evento `afterclose`). É útil para uma página anfitriã que precisa que o modal ainda conte como "presente" ao longo desse rastro visual; veja as boas práticas abaixo.

### Título `title`

```html
<r-modal open heading="Excluir item">
  <p>Tem certeza de que quer excluir este item?</p>
</r-modal>
```

### Botão de fechar `closable`

Esconde o botão de fechar do cabeçalho, de modo que o modal só possa ser dispensado pelos seus próprios controles.

```html
<r-modal open heading="Termos" closable="false">
  <p>Você precisa aceitar os termos para continuar.</p>
  <div slot="footer">
    <r-button type="primary">Aceitar</r-button>
  </div>
</r-modal>
```

### Fechar pela máscara `maskClosable`

Por padrão, clicar no fundo fecha o modal. Coloque `false` para exigir uma ação explícita.

```html
<r-modal open heading="Alterações não salvas" maskClosable="false">
  <p>Clicar fora não vai dispensar este diálogo.</p>
</r-modal>
```

### Fechar com Escape `closeOnEsc`

```html
<r-modal open heading="Relatório" closeOnEsc="false">
  <p>A tecla Escape está desativada para este diálogo.</p>
</r-modal>
```

### Travar a rolagem `lockScroll`

```html
<r-modal open heading="Pré-visualização" lockScroll="false">
  <p>A página atrás do modal ainda pode rolar.</p>
</r-modal>
```

### Foco automático `autoFocus`

```html
<r-modal open heading="Buscar" autoFocus="false">
  <input type="text" placeholder="Digite para buscar" />
</r-modal>
```

### Modo sem cabeçalho `hideHeader`

Elimina a barra de título e sua borda por inteiro, deixando só um botão de fechar flutuante (canto superior direito) quando há `closable`. Serve para diálogos que são apenas conteúdo, como uma caixa de luz com imagem ou diagrama, em que uma barra de título só comeria o espaço do conteúdo. O diálogo mantém um nome acessível via `aria-label` (derivado de `title`) mesmo sem o `<h3>` visível, então defina `title` para dar um rótulo ao leitor de tela também nesse modo.

```html
<r-modal open hide-header>
  <img src="/diagram.png" alt="Diagrama de arquitetura" style="display: block; max-width: 100%;" />
</r-modal>
```

## Slots

| Slot     | Descrição                                                         |
| -------- | ----------------------------------------------------------------- |
| (padrão) | Conteúdo do corpo do modal                                        |
| `footer` | Ações do rodapé; a barra só aparece quando este slot tem conteúdo |

```html
<r-modal open heading="Confirmar">
  <p>O conteúdo do corpo vai no slot padrão.</p>
  <div slot="footer">
    <r-button onclick="modal.open = false">Cancelar</r-button>
    <r-button type="primary">Confirmar</r-button>
  </div>
</r-modal>
```

## Eventos

Todos os eventos ligados ao fechamento levam um `trigger` em `event.detail` descrevendo o que causou o fechamento: `'mask'`, `'button'`, `'escape'` ou `'program'`.

| Evento        | Cancelável | `detail`      | Descrição                                               |
| ------------- | ---------- | ------------- | ------------------------------------------------------- |
| `beforeopen`  | Sim        | —             | Antes de abrir; chame `preventDefault()` para cancelar  |
| `open`        | Não        | —             | Disparado quando o modal abre                           |
| `afteropen`   | Não        | —             | Disparado depois que a transição de abertura termina    |
| `beforeclose` | Sim        | `{ trigger }` | Antes de fechar; chame `preventDefault()` para cancelar |
| `close`       | Não        | `{ trigger }` | Disparado quando o modal fecha                          |
| `afterclose`  | Não        | `{ trigger }` | Disparado depois que a transição de fechamento termina  |

```html
<r-modal id="modal" heading="Exemplo"></r-modal>

<script>
  const modal = document.getElementById('modal');

  modal.addEventListener('beforeclose', (e) => {
    if (!confirm('Descartar as alterações?')) e.preventDefault();
  });

  modal.addEventListener('close', (e) => {
    console.log('fechado por', e.detail.trigger); // 'mask' | 'button' | 'escape' | 'program'
  });
</script>
```

## API programática

A classe `Modal` expõe auxiliares estáticos que criam, montam e resolvem um modal sem marcação. Cada um devolve uma `Promise<{ action, trigger }>` em que `action` é `'confirm'`, `'cancel'` ou `'dismiss'`.

| Método                | Descrição                                      |
| --------------------- | ---------------------------------------------- |
| `Modal.open(opts)`    | Abre um modal com um único botão de OK         |
| `Modal.confirm(opts)` | Abre um modal com botões de OK e cancelar      |
| `Modal.info(opts)`    | Modal informativo (o título recai em `Info`)   |
| `Modal.success(opts)` | Modal de sucesso (o título recai em `Success`) |
| `Modal.warning(opts)` | Modal de aviso (o título recai em `Warning`)   |
| `Modal.error(opts)`   | Modal de erro (o título recai em `Error`)      |

Opções (todas opcionais): `title`, `content`, `okText`, `cancelText`, `showCancel`, `maskClosable`, `closeOnEsc`, `lockScroll`, `autoFocus`, `closable`, `onConfirm`, `onCancel`. `onConfirm` / `onCancel` podem devolver `false` (ou uma promessa que resolva para `false`) para manter o modal aberto.

```js
import { Modal } from 'ranui/modal';

const result = await Modal.confirm({
  title: 'Excluir projeto',
  content: 'Esta ação não pode ser desfeita.',
  okText: 'Excluir',
  cancelText: 'Manter',
  onConfirm: async () => {
    await deleteProject();
  },
});

if (result.action === 'confirm') {
  // excluído
}
```

## Parts CSS

Estilize as peças internas com `::part()`.

| Part     | Descrição                   |
| -------- | --------------------------- |
| `root`   | Contêiner externo da camada |
| `mask`   | Fundo atrás do diálogo      |
| `dialog` | A caixa do diálogo          |
| `header` | Barra de cabeçalho          |
| `title`  | Título                      |
| `close`  | Botão de fechar (`x`)       |
| `body`   | Região do corpo, rolável    |
| `footer` | Barra de ações do rodapé    |

```css
r-modal::part(dialog) {
  border-radius: 8px;
}
r-modal::part(mask) {
  background: rgba(0, 0, 0, 0.6);
}
```

## Estilos

O `<r-modal>` expõe **23 propriedades personalizadas de CSS** próprias, além dos tokens semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um contêiner ou o próprio elemento:

```css
r-modal {
  --ran-modal-mask-background: var(--ran-color-bg-subtle);
}
```

Partes: `body` · `close` · `dialog` · `footer` · `header` · `mask` · `root` · `title`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#modal); qual usar é assunto do [design system](/pt/src/ranui/design-system/).

## Boas práticas

- **Gatilho e alternância**: abra com `modal.open = true` e feche com `modal.open = false`, ou chame `close()`.
- **Proteja fechamentos destrutivos**: escute `beforeclose` e chame `preventDefault()` para confirmar antes de descartar trabalho não salvo.
- **Ações do rodapé**: coloque os botões primário e secundário em `slot="footer"`; a barra do rodapé só aparece quando o slot tem conteúdo.
- **Fluxos que não se dispensam**: defina `closable="false"` e `maskClosable="false"` para forçar uma escolha explícita.
- **Diálogos pontuais**: use `Modal.confirm` / `Modal.info` para perguntas rápidas, em vez de escrever marcação.
- **Elevar a página anfitriã acima do modal enquanto ele está aberto**: case `:has(r-modal[open]), :has(r-modal[closing])`, não apenas `[open]`. O `open` some no instante em que `close()` roda, mas a transição da máscara e do diálogo continua pintando por cerca de 0,3 s; retirar a elevação de `z-index` no meio do desvanecimento deixa a máscara, ainda visível, repintar por baixo daquilo sobre o que estava erguida.
