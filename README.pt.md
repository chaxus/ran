# ran — biblioteca de componentes web (ranui) e utilitários TypeScript (ranuts)

<p align="center">
  <a href="https://ran.chaxus.com/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://ran.chaxus.com/icon.png" alt="ran logo">
  </a>
</p>

<p align="center">
  <strong>Uma biblioteca de componentes web construída sobre custom elements nativos e independente de framework (ranui), e uma biblioteca de utilitários TypeScript preparada para tree-shaking (ranuts), com as ferramentas e a documentação bilíngue (inglês e chinês) que as acompanham.</strong>
</p>

<p align="center">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status">
  </a>
  <img src="https://badgen.net/npm/types/ranui" alt="Types Included">
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/forks/chaxus/ran" alt="forks">
  </a>
  <a href="https://github.com/chaxus/ran">
    <img src="https://img.shields.io/github/stars/chaxus/ran" alt="stars">
  </a>
</p>

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-pacotes">Pacotes</a> •
  <a href="#-início-rápido">Início rápido</a> •
  <a href="#-documentação">Documentação</a> •
  <a href="#-como-contribuir">Como contribuir</a>
</p>

---

[English](./README.md) | [中文](./README.zh-CN.md) | [日本語](./README.ja.md) | [Español](./README.es.md) | **Português** | [한국어](./README.ko.md) | [Deutsch](./README.de.md) | [فارسی](./README.fa.md)

## ✨ Funcionalidades

- 🎨 **Bibliotecas de UI**: componentes web
- 🛠️ **Bibliotecas de utilitários**: utilitários em TypeScript
- 🤖 **Aprendizado de máquina**: ferramentas básicas de ML e experimentos
- 📱 **Aplicações web**: aplicação de chat IM (protótipo)
- 🔧 **Ferramentas de desenvolvimento**: ferramentas de build e de depuração
- 🌐 **Web3**: experimentos com contratos inteligentes
- 🎯 **Ferramentas visuais**: experimentos de visualização de dados

## 📦 Pacotes

Este monorepo reúne vários pacotes experimentais:

### Bibliotecas principais (fase alfa)

| Pacote                    | Versão                                                                                               | Downloads                                                                                  | Descrição                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------- |
| [ranui](packages/ranui)   | [![ranui version](https://img.shields.io/npm/v/ranui.svg?label=%20)](packages/ranui/README.pt.md)    | [![npm-d](https://img.shields.io/npm/dt/ranui.svg)](https://www.npmjs.com/package/ranui)   | biblioteca de componentes web |
| [ranuts](packages/ranuts) | [![ranuts version](https://img.shields.io/npm/v/ranuts.svg?label=%20)](packages/ranuts/README.pt.md) | [![npm-d](https://img.shields.io/npm/dt/ranuts.svg)](https://www.npmjs.com/package/ranuts) | biblioteca de utilitários     |

### Projetos experimentais

| Pacote                                  | Descrição                               |
| --------------------------------------- | --------------------------------------- |
| [im](packages/im)                       | Protótipo de aplicação de chat          |
| [visual](packages/visual)               | Experimentos de visualização de dados   |
| [ranite](packages/ranite)               | Experimentos com ferramentas de build   |
| [debug](packages/debug)                 | Utilitários de depuração                |
| [image-process](packages/image-process) | Experimentos de processamento de imagem |
| [cpro](packages/cpro)                   | Aprendizado e experimentos em C/C++     |
| [rust](packages/rust)                   | Aprendizado e experimentos em Rust      |

Quais deles a CI de fato verifica está declarado em [packages/manifest.json](packages/manifest.json), e esse arquivo é executável em vez de descritivo: `bin/run-checks.mjs` roda cada verificação nos pacotes que a declaram, então um pacote listado ali como verificado realmente é, e o que não é diz o porquê. `pnpm run verify:packages` falha quando surge em `packages/` um diretório ausente do manifesto — nenhum pacote novo entra sem que alguém decida se ele é verificado.

## 🚀 Início rápido

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/chaxus/ran.git
cd ran

# Instalar as dependências
pnpm install

# Compilar todos os pacotes
pnpm build
```

### Usar os pacotes principais

```bash
# Instalar o ranui (componentes web)
npm install ranui

# Instalar os utilitários
npm install ranuts
```

### Desenvolvimento

```bash
# Subir o servidor de desenvolvimento
pnpm dev

# Rodar os testes
pnpm test

# Compilar um pacote específico
pnpm --filter ranui build
```

## 📚 Documentação

- **📖 Blog e artigos**: [pré-visualização de documentos web](https://ran.chaxus.com/src/article/doc_preview)
- **🎨 Documentação do RanUI**: [guia da biblioteca de UI](https://ran.chaxus.com/src/ranui/)
- **🛠️ Documentação do RanUTS**: [guia da biblioteca de utilitários](https://ran.chaxus.com/src/ranuts/)
- **📝 Documentação do projeto**: [docs](packages/docs)

## 🤖 IA / Claude Code

O repositório traz um marketplace de plugins do Claude Code para que assistentes de IA leiam e usem as bibliotecas sem vasculhar o código-fonte. Adicione o marketplace e depois instale a biblioteca que você usa:

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran      # ranui — componentes web
/plugin install ranuts@ran     # ranuts — utilitários
```

Cada skill cobre o import map, um inventário, exemplos de uso e as convenções, e aponta para a referência da API que vai junto com o pacote. Os detalhes estão na seção de cada biblioteca: [ranui](packages/ranui/README.pt.md) e [ranuts](packages/ranuts/README.pt.md).

## ⚠️ Aviso importante

Este é um **projeto de exploração técnica e aprendizado** em fase inicial. A maior parte dos pacotes está em fase alfa ou é experimental.

**Pontos principais:**

- 🚧 **Desenvolvimento inicial**: a maior parte das funcionalidades ainda está sendo feita
- 🧪 **Experimental**: as APIs podem mudar com frequência
- 📚 **Foco no aprendizado**: serve sobretudo para aprender e experimentar

## 🤝 Como contribuir

Toda contribuição é bem-vinda, seja de quem está aprendendo ou de quem já programa. Veja como ajudar:

1. Faça um **fork** do repositório
2. **Crie** um branch para a sua funcionalidade (`git checkout -b feature/amazing-feature`)
3. **Faça o commit** das suas mudanças (`git commit -m 'Add amazing feature'`)
4. **Envie** o branch (`git push origin feature/amazing-feature`)
5. **Abra** um pull request

### Diretrizes de desenvolvimento

- Siga o estilo de código existente
- Acrescente testes às funcionalidades novas sempre que der
- Atualize a documentação quando for preciso
- Tenha paciência com o que ainda é experimental

## 🌟 Por que código aberto?

Acredito na capacidade do código aberto de acelerar o aprendizado e a inovação. Ao longo do meu caminho como desenvolvedor, fui influenciado por incontáveis projetos abertos. Ao publicar este código experimental, espero:

- Compartilhar o que aprendi com a comunidade
- Permitir que outras pessoas aprendam com este código e experimentem
- Estimular a colaboração e a troca de conhecimento
- Criar um espaço para continuar aprendendo e melhorando

## 📊 Estatísticas do projeto

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" alt="Contributors" />
</a>

![](http://profile-counter.glitch.me/chaxus-ran/count.svg)

## 📄 Licença

Este projeto é licenciado sob a licença MIT — veja os detalhes no arquivo [LICENSE](LICENSE).

---

<div align="center">
  <p>Feito com ❤️ pela comunidade Ran</p>
  <p>Se o projeto te ajuda a aprender, deixe uma ⭐️</p>
</div>
