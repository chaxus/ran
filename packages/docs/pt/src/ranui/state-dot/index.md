---
description: 'O StateDot do ranui (<r-state-dot>) é um indicador de ciclo de vida de 8px (idle, running, success, warning, error) desenhado como um halo e um núcleo num único elemento.'
---

# StateDot

Um indicador de ciclo de vida de 8px: um halo e um núcleo no mesmo elemento, ambos
`currentColor`, de modo que um estado é uma regra de cor e não dois tokens.

> **Use quando** uma linha precisar mostrar em que ponto está um trabalho (na fila, em
> execução, concluído, falhou) sem gastar uma linha inteira com isso. É o ponto que tanto o
> `<r-tool-card>` quanto o marcador de compactação usam.

## Início rápido

### Uso básico

<Demo>
  <r-state-dot state="idle"></r-state-dot>
  <r-state-dot state="running"></r-state-dot>
  <r-state-dot state="success"></r-state-dot>
  <r-state-dot state="warning"></r-state-dot>
  <r-state-dot state="error"></r-state-dot>
</Demo>

```html
<r-state-dot state="idle"></r-state-dot>
<r-state-dot state="running"></r-state-dot>
<r-state-dot state="success"></r-state-dot>
<r-state-dot state="warning"></r-state-dot>
<r-state-dot state="error"></r-state-dot>
```

`running` pulsa; os demais ficam parados. Um valor desconhecido é desenhado como `idle` em vez
de desaparecer, então um estado que o produtor adicionou e a página ainda não conhece continua
ocupando o seu lugar na linha.

### Ao lado de um rótulo

O ponto só codifica o estado pela cor; ele não explica o que a cor significa. Nunca deixe a
cor ser a única coisa que distingue duas linhas. Veja as
[diretrizes de design](/pt/src/ranui/design-guides/#accessibility).

<Demo column>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="running"></r-state-dot>
    <span>Executando testes</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="error"></r-state-dot>
    <span>2 testes falharam</span>
  </div>
</Demo>

## Referência da API

### Propriedades

| Propriedade | Atributo | Tipo                                                       | Padrão   | Descrição                                                   |
| ----------- | -------- | ---------------------------------------------------------- | -------- | ----------------------------------------------------------- |
| `state`     | `state`  | `'idle' \| 'running' \| 'success' \| 'warning' \| 'error'` | `'idle'` | Qual etapa do ciclo exibir. Valores desconhecidos → `idle`. |
| `label`     | `label`  | `string`                                                   | `''`     | Nome acessível. Veja abaixo.                                |
| `sheet`     | `sheet`  | `string`                                                   | `''`     | CSS injetado no shadow root.                                |

### Acessibilidade

**O ponto é `aria-hidden` até você dar a ele um `label`.** Um ponto ao lado de uma linha que já
declara o seu resultado em texto é ruído para um leitor de tela: anunciar "em execução" duas
vezes não ajuda ninguém. Defina `label` apenas quando o ponto for o _único_ portador do estado:

```html
<!-- O texto já diz: deixe o ponto em silêncio -->
<r-state-dot state="error"></r-state-dot> <span>A compilação falhou</span>

<!-- O ponto está sozinho na célula: dê um nome a ele -->
<r-state-dot state="error" label="A compilação falhou"></r-state-dot>
```

### Partes

| Parte | Elemento        |
| ----- | --------------- |
| `dot` | O próprio ponto |

### Estilos

Cada estado é **uma** cor: o halo é essa cor a 16% e o núcleo é uma redução de 60% dela, ambos
pintados a partir de `currentColor`. Assim, um estado é um token, não dois:

| Token                           | Padrão                             |
| ------------------------------- | ---------------------------------- |
| `--ran-state-dot-size`          | `8px`                              |
| `--ran-state-dot-color`         | `--ran-color-text-disabled` (idle) |
| `--ran-state-dot-running-color` | `--ran-color-primary`              |
| `--ran-state-dot-success-color` | `--ran-color-success`              |
| `--ran-state-dot-warning-color` | `--ran-color-warning`              |
| `--ran-state-dot-error-color`   | `--ran-color-danger`               |
| `--ran-state-dot-halo-opacity`  | `0.16`                             |

`running` pulsa o núcleo em vez de girá-lo (a 8px, um ícone girando é pequeno demais para ser
lido como rotação), e a pulsação para sob `prefers-reduced-motion`.
