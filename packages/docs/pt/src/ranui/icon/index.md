---
description: 'O Icon do ranui (<r-icon>) desenha gráficos vetoriais semânticos (SVG) com controle de tamanho e cor.'
---

# Icon

Desenha gráficos vetoriais semânticos (SVG) com controle de tamanho e cor.

> **Use quando** precisar de um ícone vetorial nomeado, redimensionável e recolorível (com animação de giro opcional) embutido na sua interface: o `<r-icon>` desenha por `name` um SVG registrado.

## Como usar os ícones

### O mais fácil: use um nome incluído (sem configuração)

O ranui traz o conjunto de ícones **embutido no pacote**. Um `name` incluído **carrega a si mesmo sob demanda**: sem registro, sem imports, sem ligar caminhos de recursos. Só o SVG que você de fato usa é buscado (cada um é um bloco assíncrono separado), então referenciar um ícone nunca puxa o conjunto inteiro:

```html
<r-icon name="lock"></r-icon> <r-icon name="eye"></r-icon>
```

Os nomes incluídos válidos são a união `RanIconName` / a tupla `RAN_ICON_NAMES` (veja abaixo). Um nome **personalizado** que nunca foi registrado continua desenhando **nada** (um espaço em branco); isso vale apenas para os seus próprios SVGs, tratados em [Ícones personalizados](#custom-icons).

### Opcional: registrar todo o conjunto de uma vez

Se preferir ter todos os ícones incluídos disponíveis **de forma síncrona** (sem carga assíncrona por ícone, por exemplo para evitar um lampejo em telas cheias de ícones, ou num ambiente sem divisão de código), chame `registerBuiltinIcons()` uma vez, o mais cedo possível:

```ts
import { registerBuiltinIcons } from 'ranui'; // ou 'ranui/icons'

registerBuiltinIcons(); // registra de antemão todos os nomes de RAN_ICON_NAMES (~15 KB)
```

Os nomes válidos são exportados como o tipo união `RanIconName` e a tupla `RAN_ICON_NAMES` (assim seu editor os completa e erros de digitação são pegos):

`add-user`, `arrow-down`, `book`, `check-circle`, `check-circle-fill`, `close`, `close-circle`, `close-circle-fill`, `drop`, `eye`, `eye-close`, `github`, `globe`, `home`, `info-circle`, `info-circle-fill`, `issue`, `loading`, `loading-scene`, `lock`, `menu`, `message`, `more`, `plus`, `power-off`, `preview`, `search`, `setting`, `sort`, `team`, `unlock`, `user`, `warning-circle`, `warning-circle-fill`, `without-content`

### Ícones personalizados {#custom-icons}

Para registrar os seus SVGs (de qualquer biblioteca de ícones ou do pipeline de recursos do seu build), passe as strings SVG cruas para `registerIcons` / `registerIcon`:

```ts
import { registerIcon, registerIcons } from 'ranui';
import lock from './icons/lock.svg?raw'; // conforme seu bundler expõe SVG como string crua

registerIcons({
  lock,
  logo: '<svg viewBox="0 0 24 24"><path d="…" /></svg>', // string inline — sem arquivo de recurso
});
registerIcon('star', '<svg viewBox="0 0 24 24">…</svg>');
```

Você também pode pular o registro por completo passando a marcação SVG crua direto para `name` (é desenhada como está quando começa com `<svg`):

```html
<r-icon name='<svg viewBox="0 0 24 24">…</svg>'></r-icon>
```

> **Nota:** os arquivos `assets/icons/*.svg` crus **não** fazem parte do pacote npm publicado (só `dist/` é publicado), então `import '…/lock.svg?raw'` a partir do `ranui` não resolve; use `registerBuiltinIcons()` para o conjunto embutido, ou registre as suas próprias strings SVG.

> **SSR e momento do registro.** O registro precisa rodar no navegador. Se um `<r-icon>` conectar antes de o ícone dele estar registrado, ele fica em branco e depois se preenche sozinho quando o registro termina (o elemento escuta o evento `ranui-icon-registered`). Para evitar um lampejo de ícones vazios, registre no topo do seu módulo de entrada, de modo que o registro esteja preenchido antes de o primeiro componente ser desenhado. Em desenvolvimento, um nome não registrado imprime `[ranui-icon] icon not registered: <name>`.

## Demonstração

<ran-demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</ran-demo>

```xml
 <r-icon name="lock"  ></r-icon>
 <r-icon name="eye"  ></r-icon>
 <r-icon name="user"  ></r-icon>
```

## Atributos

### `name`

Escolhe um ícone diferente pelo nome.

<ran-demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</ran-demo>

```html
<r-icon name="lock"></r-icon>
<r-icon name="eye"></r-icon>
<r-icon name="user"></r-icon>
```

### `size`

<ran-demo align="end">
  <r-icon name="lock" size="30"></r-icon>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="lock" size="70"></r-icon>
</ran-demo>

```html
<r-icon name="lock" size="30"></r-icon>
<r-icon name="lock" size="50"></r-icon>
<r-icon name="lock" size="70"></r-icon>
```

### `color`

<ran-demo>
  <r-icon name="lock" size="50" color="red"></r-icon>
  <r-icon name="lock" size="50" color="#1E90FF"></r-icon>
  <r-icon name="lock" size="50" color="#F44336"></r-icon>
  <r-icon name="lock" size="50" color="#3F51B5"></r-icon>
</ran-demo>

```html
<r-icon name="lock" size="50" color="red"></r-icon>
<r-icon name="lock" size="50" color="#1E90FF"></r-icon>
<r-icon name="lock" size="50" color="#F44336"></r-icon>
<r-icon name="lock" size="50" color="#3F51B5"></r-icon>
```

### `spin`

Defina spin para ligar a rotação e passe um número para controlar a velocidade. Quanto menor o número, mais rápido gira.

<ran-demo>
  <r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
</ran-demo>

```html
<r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
```

## Lista de ícones

Clique em qualquer ícone para copiar a marcação dele.

<IconGallery />

## Estilos

O `<r-icon>` expõe **6 propriedades personalizadas de CSS** próprias, além dos tokens semânticos
que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um contêiner ou o
próprio elemento:

```css
r-icon {
  --ran-icon-color: var(--ran-color-text-secondary);
}
```

Partes: `ran-icon`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#icon); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).
