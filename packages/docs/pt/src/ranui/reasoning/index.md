---
description: 'Uma cadeia de raciocínio recolhível que se abre enquanto o raciocínio chega em streaming e se fecha quando termina, até que o leitor decida o contrário.'
---

# Reasoning

Uma cadeia de raciocínio recolhível.

> **Use quando** um modelo expuser o raciocínio separado da resposta e você quiser que o leitor
> o veja acontecer sem mantê-lo na tela depois.

O raciocínio é a única parte de uma resposta que o leitor quer ver enquanto acontece e quase
nunca quer guardar. Por isso o elemento se abre enquanto `streaming` está definido e se fecha
quando ele sai.

**Até o leitor tocá-lo.** Assim que ele mesmo abrir ou fechar, o comportamento automático para
de vez. A mesma regra de propriedade vale para a rolagem em
[`createBottomFollower`](../../ranuts/utils/), e pelo mesmo motivo: uma interface que fica
redecidindo algo que o leitor já decidiu é pior do que uma que nunca decidiu nada. Atribuir
`open` pelo código também conta como assumir o controle, porque o código age em nome de alguém
que já tem uma opinião.

## Início rápido

```html
<r-reasoning label="Thinking"></r-reasoning>
```

```ts
const reasoning = document.createElement('r-reasoning');

reasoning.streaming = true; // abre
reasoning.content += delta; // cresce à vista
reasoning.duration = 4200; // "4.2s" ao lado do rótulo
reasoning.streaming = false; // fecha, a menos que o leitor tenha intervindo

conversation.append(reasoning);
```

O `ranuts/stream` já mantém `reasoning-delta` separado de `text-delta`, então uma view pode
alimentar isto direto de um snapshot:

```ts
reasoning.content = snapshot.blocks
  .filter((block) => block.type === 'reasoning')
  .map((block) => block.text)
  .join('');
reasoning.streaming = !snapshot.done;
```

## Detalhes que vale conhecer

- **Durações abaixo de um segundo não aparecem.** O leitor se importa em ter sido rápido, não em
  ter sido 340 ms.
- **O rótulo pulsa durante o streaming**, então um pensamento longo e silencioso não é lido como
  travamento. `prefers-reduced-motion` desliga a animação sem remover a informação.
- **O slot padrão substitui o texto renderizado**, para quem quiser `<r-markdown>` no corpo em
  vez de texto puro.

## Referência da API

### Propriedades

| Propriedade | Tipo             | Padrão        | Descrição                                                            |
| ----------- | ---------------- | ------------- | -------------------------------------------------------------------- |
| `content`   | `string`         | `''`          | O texto do raciocínio. Atribuir repetidamente é o caminho streaming. |
| `streaming` | `boolean`        | `false`       | Se o raciocínio ainda está chegando.                                 |
| `open`      | `boolean`        | `false`       | Se o corpo está aberto.                                              |
| `label`     | `string`         | `'Reasoning'` | Texto do resumo.                                                     |
| `duration`  | `number \| null` | `null`        | Milissegundos pensando. Oculto abaixo de um segundo.                 |
| `sheet`     | `string`         | `''`          | CSS injetado no shadow DOM do elemento.                              |

Um `duration` que não seja um número finito e não negativo é lido de volta como `null`.

### Slots

| Slot     | Descrição                                                |
| -------- | -------------------------------------------------------- |
| (padrão) | Substitui o texto renderizado pelo seu próprio conteúdo. |

### Partes

`reasoning`, `summary`, `marker`, `label`, `meta`, `body`, `text`.

### Acessibilidade

O resumo é um `<button type="button">` de verdade com `aria-expanded`, então é alcançável e
operável pelo teclado sem fiação extra.

## Estilos

O `<r-reasoning>` expõe **4 propriedades personalizadas de CSS** próprias, além dos tokens
semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um
contêiner ou o próprio elemento:

```css
r-reasoning {
  --ran-reasoning-color: var(--ran-color-text-secondary);
}
```

Partes: `body` · `row` · `text`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#reasoning); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Veja também

- [Conversation](../conversation/): monte isto como a linha de raciocínio de uma transcrição
- [ranuts/stream](../../ranuts/stream/): de onde vem o `reasoning-delta`
