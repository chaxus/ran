---
description: 'Renderize componentes do ranui no servidor para shadow DOM declarativo com o ranui/ssr-stream, para que a primeira pintura esteja correta antes de qualquer JavaScript rodar.'
---

# Renderização no servidor

Os componentes do ranui são serializados para **shadow DOM declarativo**, então um servidor pode
emitir a marcação real e a primeira pintura fica correta antes de qualquer JavaScript rodar.

> **Use quando** você renderizar páginas num servidor ou em tempo de build (um SSG, uma rota
> Express/Hono/Workers, um job de pré-visualização de e-mail) e quiser que os elementos `<r-*>`
> cheguem como marcação visível, e não como tags vazias esperando hidratação.

## Início rápido

```js
import 'ranui'; // preenche o registro de SSR — faça isto primeiro
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

Cada tag `<r-*>` registrada é instanciada, seus atributos são aplicados, seus filhos são
renderizados recursivamente, e o resultado sai com um `<template shadowrootmode="closed">` dentro.
Tags desconhecidas passam intactas, então é seguro rodar sobre uma página inteira de HTML comum.

### Streaming

`renderToStream` é o mesmo renderizador como gerador assíncrono, de modo que blocos estáticos chegam
ao cliente enquanto outros componentes ainda estão renderizando:

```js
import { renderToStream } from 'ranui/ssr-stream';

for await (const chunk of renderToStream(pageHtml)) response.write(chunk);
```

### Um componente por vez

`ranui/ssr` renderiza uma instância que você mesmo construiu, útil quando você monta uma árvore no
Node em vez de montar uma string por template:

```js
import { renderToString } from 'ranui/ssr';
import { Button } from 'ranui';

const html = renderToString(new Button());
```

## Referência da API

| Export                     | Entrada            | Assinatura                                 | Descrição                                                |
| -------------------------- | ------------------ | ------------------------------------------ | -------------------------------------------------------- |
| `renderHTMLToString(html)` | `ranui/ssr-stream` | `(html: string) => Promise<string>`        | Expande cada tag `<r-*>` registrada numa string de HTML. |
| `renderToStream(html)`     | `ranui/ssr-stream` | `(html: string) => AsyncGenerator<string>` | O mesmo, bloco a bloco.                                  |
| `renderToString(el)`       | `ranui/ssr`        | `(component) => string`                    | Serializa a instância de um componente.                  |
| `RanElement`               | `ranui/ssr`        | classe                                     | `HTMLElement` num navegador, o mock de SSR no Node.      |
| `h(tag, props, …children)` | `ranui/ssr`        | `(tag, props?, ...children) => string`     | Pequeno auxiliar para montar marcação à mão.             |

## O que o servidor pode e não pode fazer

**O cliente reconstrói; ele não reaproveita.** O ranui anexa shadow roots **fechados**, e
`attachShadow` num elemento que já tem um shadow root declarativo _remove os filhos desse root_
quando o modo é fechado. Então a árvore renderizada no servidor pinta o primeiro quadro e depois é
substituída por uma idêntica montada no cliente. Duas consequências:

- Você ganha uma primeira pintura correta, não reaproveitamento de hidratação: shadow roots fechados
  não podem ser reaproveitados pelo cliente, pelo motivo acima. Veja as
  [diretrizes de código](/pt/src/ranui/coding-guides/#server-rendering).
- **Nunca guarde estado na marcação do shadow renderizada no servidor** esperando que o cliente o
  leia de volta. Passe-o por atributos, que sobrevivem.

**Nada medido existe no servidor.** Tudo que depende de `getBoundingClientRect` ou de `offsetWidth`
se resolve depois da montagem, no navegador. Os componentes são escritos para que o layout inicial
venha do CSS exatamente por isso.

**Hoje quatro elementos não renderizam no servidor**, cada um porque acessa uma API do navegador no
construtor: `<r-content>` (`MutationObserver`), `<r-link>` (`document`), `<r-modal>` (um método de
slot que o mock de SSR não implementa) e `<r-radar>` (`ResizeObserver`). Eles passam como tags
comuns e são atualizados no cliente. Todos os outros elementos têm um teste que falha se pararem de
renderizar, então esta lista não pode crescer em silêncio.

## Temas e lampejo

`initTheme()` não faz nada no servidor (todo acesso a `document` / `localStorage` / `matchMedia` é
protegido), então o tema é aplicado pelo cliente. Para evitar um lampejo com o tema errado, defina
`data-ran-theme` no `<html>` do seu template de servidor (a partir de um cookie, ou de um script
inline minúsculo que leia o `localStorage` antes da primeira pintura) e deixe o
[`initTheme`](/pt/src/ranui/theme/) assumir depois.

## Boas práticas

- **Importe `ranui` (ou as entradas específicas `ranui/<component>`) antes de renderizar.** O
  registro é preenchido pelo efeito colateral do import; sem ele, cada tag passa sem expandir e a
  página perde a marcação em silêncio.
- **Renderize a página, não o fragmento.** `renderHTMLToString` é seguro sobre HTML arbitrário, então
  não é preciso isolar as partes do ranui.
- **Entregue a folha de estilos.** A marcação DSD carrega os estilos do componente, mas os tokens em
  nível de página vêm de `ranui/style` (e de `ranui/fonts` para as fontes).
