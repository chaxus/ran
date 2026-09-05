---
description: 'O sistema de temas em tempo de execução do ranui: initTheme / setTheme / getTheme, modo claro, escuro e de sistema, escopos delimitados e sobrescrita de tokens em tempo real.'
---

# Theming

A metade **em tempo de execução** da estilização do ranui: alternar entre modo claro, escuro e de
sistema, guardar a escolha e sobrescrever tokens na hora.

Os tokens em si (como se chamam e para que serve cada um) são o
[design system](/pt/src/ranui/design-system/); as regras para escolher entre eles são as
[diretrizes de design](/pt/src/ranui/design-guides/). Esta página trata só de _aplicá-los_.

> **Use quando** precisar de tema claro e escuro num aplicativo com ranui: chame `initTheme` uma vez
> no carregamento, `setTheme` para alternar, e `setThemeToken(s)` se quiser sobrescrever tokens
> individuais sem entregar CSS extra.

Há exatamente dois temas: **light** e **dark**, mais um modo **system** que segue a preferência do
sistema operacional. (As antigas APIs de "pacotes de tema" foram removidas; `setThemePack` e
`RanThemePackName` não existem mais.)

## Início rápido

```js
import { initTheme, setTheme, getTheme } from 'ranui/theme';

// Restaura o tema salvo ('light' | 'dark' | 'system') do localStorage
initTheme();

// Trocar de tema — salvo automaticamente
setTheme('dark');
setTheme('system'); // acompanha prefers-color-scheme e atualiza ao vivo

getTheme(); // → 'light' | 'dark' | 'system' | ''
```

A entrada dedicada **`ranui/theme`** entrega apenas o motor de temas: importá-la não registra nenhum
custom element, então uma página que só quer tokens e modo escuro nunca puxa a biblioteca de
componentes. As mesmas funções também são reexportadas pelo barril `ranui` de primeiro nível.

`setTheme` escreve um atributo `data-ran-theme` (e o legado `theme`) no `<html>`; todos os estilos
dos componentes reagem a ele. A escolha é salva na chave de localStorage `ran-theme`.

Para uma interface de troca pronta, use [`<r-theme-switch>`](/pt/src/ranui/theme-switch/): um
controle segmentado de sistema, claro e escuro já ligado a esta API, sincronizado entre instâncias e
que atualiza as metas `theme-color`.

## API

| Função            | Assinatura                                                              | Descrição                                                                                 |
| ----------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `initTheme`       | `(target?: ThemeTarget) => void`                                        | Restaura o tema salvo no `localStorage`. Chame uma vez no carregamento. Inerte no SSR.    |
| `setTheme`        | `(name: RanThemeName, target?: ThemeTarget) => void`                    | Aplica `'light'` \| `'dark'` \| `'system'` e persiste. `'system'` acompanha o SO ao vivo. |
| `getTheme`        | `(target?: ThemeTarget) => RanThemeName \| ''`                          | Lê o tema ativo. Devolve `'system'` no modo de sistema e `''` se nenhum estiver definido. |
| `setThemeToken`   | `(name: string, value: string \| number, target?: HTMLElement) => void` | Sobrescreve um token em tempo de execução (estilo inline no alvo).                        |
| `setThemeTokens`  | `(tokens: ThemeTokenMap, target?: HTMLElement) => void`                 | Sobrescreve vários tokens de uma vez. Um valor `null` / `undefined` limpa aquele token.   |
| `clearThemeToken` | `(name: string, target?: HTMLElement) => void`                          | Remove uma sobrescrita de token em tempo de execução.                                     |

**Tipos**

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type ThemeTarget = HTMLElement | Document; // padrão document.documentElement
type ThemeTokenMap = Record<string, string | number | null | undefined>;
```

**`target`**: todas as funções miram por padrão o `<html>` (`document.documentElement`). Passe um
elemento para delimitar um tema ou uma sobrescrita de token a uma subárvore em vez da página inteira.

**Seguro em SSR**: todo acesso a `document`, `localStorage` e `matchMedia` é protegido, então essas
funções ficam inertes (sem lançar) durante a renderização no servidor.

## Como o modo escuro funciona

`setTheme('dark')` define `data-ran-theme="dark"` no `<html>`. A folha de estilos então redefine
**apenas a paleta base** para o escuro, a partir de uma única fonte de verdade; cada token semântico
`--ran-color-*` referencia essa paleta via `var()`, então ele vira sozinho e nenhum componente
carrega uma sobrescrita própria de modo escuro.

Duas consequências que vale conhecer:

- **O seu próprio CSS ganha modo escuro de graça** se consumir tokens semânticos, e o ganha errado
  se fixar uma cor na mão ou escrever um valor de reserva só para o claro. Veja
  [Usar tokens no seu próprio CSS](/pt/src/ranui/design-system/#using-tokens-in-your-own-css).
- **Nada deve fazer transição numa troca de tema.** O CSS não tem como saber por que uma cor mudou,
  então uma `transition` numa propriedade da paleta faz cada elemento desvanecer no próprio ritmo
  quando o tema muda. Os componentes do ranui deliberadamente não fazem isso; os seus também não
  deveriam.

## Personalizar tokens {#customizing-tokens}

### Em tempo de execução (JS)

```js
import { setThemeToken, setThemeTokens, clearThemeToken } from 'ranui/theme';

// Um token, no <html> (afeta tudo)
setThemeToken('--ran-color-primary', '#7c3aed');

// Vários de uma vez
setThemeTokens({
  '--ran-color-primary': '#7c3aed',
  '--ran-radius-md': '8px',
});

// Delimitar a uma subárvore
setThemeToken('--ran-color-primary', '#e11d48', document.querySelector('#panel'));

// Remover uma sobrescrita
clearThemeToken('--ran-color-primary');
```

### Em tempo de build (CSS)

Sobrescreva tokens em `:root`, ou no escopo que preferir:

```css
:root {
  --ran-color-primary: #7c3aed;
  --ran-radius-md: 8px;
}
```

### Qual camada sobrescrever

Como o modo escuro redefine apenas a paleta base:

- Sobrescreva um token **semântico** (`--ran-color-primary`) para uma mudança que deva ser igual nos
  dois temas.
- Sobrescreva um degrau da escala **base** (`--ran-blue-700`) quando a mudança deva virar junto com o
  tema: tudo que for semântico e o referencie acompanha.
- Sobrescreva um token de **componente** (`--ran-btn-hover-background`) para mudar exatamente um
  elemento.

Essa estratificação está descrita por inteiro na página do
[design system](/pt/src/ranui/design-system/#two-layers). Note que uma sobrescrita em tempo de
execução é um estilo inline no alvo: ela vence as regras da folha de estilos naquela subárvore, o que
é justamente o que faz o tema por painel funcionar — e o que torna difícil, mais tarde, notar uma
sobrescrita que você esqueceu de limpar.

## Delimitar um tema a parte da página

Cada função aceita um alvo, então um painel de pré-visualização pode rodar com um tema diferente do
da página ao redor:

```js
const preview = document.querySelector('#preview');

setTheme('dark', preview); // só esta subárvore
getTheme(preview); // → 'dark'
```

O atributo cai naquele elemento em vez do `<html>`, e a cascata de tokens faz o resto.
