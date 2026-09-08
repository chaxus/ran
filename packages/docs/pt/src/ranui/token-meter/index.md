---
description: 'O TokenMeter do ranui (<r-token-meter>) mostra quanto da janela de contexto uma conversa está usando, antes de o provedor recusar a próxima requisição.'
---

# TokenMeter

Quanto da janela de contexto uma conversa está usando.

> **Use quando** estiver construindo uma interface de chat contra um modelo com limite de
> contexto. Um cliente que não mostra isso funciona bem no começo e depois falha: cada turno
> reenvia todo o histórico, a requisição só cresce e em algum momento o provedor a rejeita por
> exceder o limite. Este componente mostra esse crescimento antes da rejeição.

## Início rápido

### Uso básico

<ran-demo column>
  <r-token-meter limit="65536" used="12800"></r-token-meter>
  <r-token-meter limit="65536" used="54000"></r-token-meter>
  <r-token-meter limit="65536" used="69000"></r-token-meter>
</ran-demo>

```html
<r-token-meter limit="65536" used="12800"></r-token-meter>
```

```js
const meter = document.createElement('r-token-meter');
meter.limit = 65536;
meter.used = 41200; // o contexto que a próxima requisição vai carregar
meter.spent = 128431; // tokens cobrados ao longo da conversa, opcional
composer.append(meter);
```

A barra se enche até `used / limit` e escala por três níveis: **ok**, **warn** (a partir de 80% do
limite) e **over**. `level` é refletido no host, então a página pode reagir à mesma escalada que a
barra mostra:

```css
r-token-meter[level='warn'] ~ .composer-hint {
  display: block;
}
```

### `used` e `spent` são números diferentes

- **`used`**: o que a _próxima requisição_ vai carregar — o histórico, não a conversa inteira. É o
  número a que o limite se aplica e o que a barra desenha.
- **`spent`**: o que já foi cobrado _ao longo_ da conversa. Ele só cresce e não é limitado pela
  janela.

Truncar uma transcrição reduz `used` e deixa `spent` intacto. Mostrar apenas um deles responde só a
uma das duas perguntas que o usuário tem ("a próxima mensagem vai caber?" e "quanto isso já me
custou?").

### Sem limite

Com `limit` indefinido ou zero a barra some e restam apenas as contagens, útil enquanto o tamanho da
janela é desconhecido.

<ran-demo>
  <r-token-meter used="41200" spent="128431"></r-token-meter>
</ran-demo>

### Trocar o rótulo

<ran-demo>
  <r-token-meter label="Contexto" limit="65536" used="41200"></r-token-meter>
</ran-demo>

```html
<r-token-meter label="Contexto" limit="65536" used="41200"></r-token-meter>
<!-- label="" deixa apenas as contagens -->
```

## Referência da API

### Propriedades

| Propriedade | Atributo | Tipo                       | Padrão      | Descrição                                                                       |
| ----------- | -------- | -------------------------- | ----------- | ------------------------------------------------------------------------------- |
| `limit`     | `limit`  | `number`                   | `0`         | Tamanho da janela de contexto em tokens. Zero ou ausente esconde a barra.       |
| `used`      | `used`   | `number`                   | `0`         | Tokens que a próxima requisição vai carregar.                                   |
| `spent`     | `spent`  | `number`                   | `0`         | Tokens cobrados na conversa até agora.                                          |
| `label`     | `label`  | `string`                   | `'Context'` | Prefixo do texto; `''` deixa apenas as contagens.                               |
| `level`     | `level`  | `'ok' \| 'warn' \| 'over'` | derivado    | Quão cheia está a janela. **Definido pelo elemento**: escrevê-lo é sobrescrito. |
| `sheet`     | `sheet`  | `string`                   | `''`        | CSS injetado no shadow root.                                                    |

As contagens são formatadas para leitura rápida: exatas abaixo de mil (`847` é curto o bastante para
ser lido exato) e abreviadas acima (`41.2k`, `128k`); o terceiro dígito de `128.431` não muda o que o
leitor faz com ele.

### Partes

| Parte   | Elemento                |
| ------- | ----------------------- |
| `meter` | O elemento inteiro      |
| `track` | O fundo da barra        |
| `fill`  | A porção preenchida     |
| `text`  | O rótulo e as contagens |

## Acessibilidade

O elemento sempre carrega um `title` declarando os números, então **a cor nunca é a única
portadora** do aviso: a barra ficar âmbar é um segundo sinal, não o único. Mantenha assim se você
reestilizar os níveis.

## Estilos

O `<r-token-meter>` expõe **9 propriedades personalizadas de CSS** próprias, além dos tokens
semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um
contêiner ou o próprio elemento:

```css
r-token-meter {
  --ran-token-meter-fill-background: var(--ran-color-bg-subtle);
}
```

Partes: `fill` · `meter` · `text` · `track`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#token-meter); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Boas práticas

- **Atualize `used` no mesmo lugar em que você monta a requisição**, não numa passada de
  renderização: o número em que as pessoas confiam é o que a próxima requisição vai de fato enviar.
- **Escale em volta do medidor, não dentro dele.** Em `level="over"` a interface útil é uma sugestão
  (resumir, começar uma nova conversa), e isso pertence ao aplicativo.
- **Não anime o preenchimento numa troca de tema**: veja as
  [diretrizes de design](/pt/src/ranui/design-guides/#motion).
