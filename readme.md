# 🚀 Ran - Exploration & Learning

<p align="center">
  <a href="https://chaxus.github.io/ran/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://chaxus.github.io/ran/icon.png" alt="ran logo">
  </a>
</p>

<p align="center">
  <strong>A monorepo for technology exploration and learning, featuring experimental UI libraries, utilities, and various tools.</strong>
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
  <a href="#-features">Features</a> •
  <a href="#-packages">Packages</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-documentation">Documentation</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

English · [中文](./readme-zh_CN.md)

## ✨ Features

- 🎨 **UI Libraries**: web components
- 🛠️ **Utility Libraries**: TypeScript utilities
- 🤖 **Machine Learning**: Basic ML tools and experiments
- 📱 **Web Applications**: IM chat app (prototype)
- 🔧 **Development Tools**: Build tools and debug utilities
- 🌐 **Web3**: Smart contract experiments
- 🎯 **Visual Tools**: Data visualization experiments

## 📦 Packages

This monorepo contains various experimental packages:

### Core Libraries (Alpha Stage)

| Package                   | Version                                                                                           | Downloads                                                                                  | Description           |
| ------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | --------------------- |
| [ranui](packages/ranui)   | [![ranui version](https://img.shields.io/npm/v/ranui.svg?label=%20)](packages/ranui/readme.md)    | [![npm-d](https://img.shields.io/npm/dt/ranui.svg)](https://www.npmjs.com/package/ranui)   | web component library |
| [ranuts](packages/ranuts) | [![ranuts version](https://img.shields.io/npm/v/ranuts.svg?label=%20)](packages/ranuts/readme.md) | [![npm-d](https://img.shields.io/npm/dt/ranuts.svg)](https://www.npmjs.com/package/ranuts) | Utility library       |

### Experimental Projects

| Package                                 | Description                     |
| --------------------------------------- | ------------------------------- |
| [im](packages/im)                       | Chat application prototype      |
| [ml](packages/ml)                       | Machine learning experiments    |
| [visual](packages/visual)               | Data visualization experiments  |
| [solidity](packages/solidity)           | Web3 smart contract experiments |
| [ranite](packages/ranite)               | Development tooling experiments |
| [debug](packages/debug)                 | Debug utilities                 |
| [image-process](packages/image-process) | Image processing experiments    |

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/chaxus/ran.git
cd ran

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### Using Core Packages

```bash
# Install ranui (web components)
npm install ranui

# Install utilities
npm install ranuts
```

### Development

```bash
# Start development server
pnpm dev

# Run tests
pnpm test

# Build specific package
pnpm --filter ranui build
```

## 📚 Documentation

- **📖 Blog & Articles**: [Design Patterns & More](https://chaxus.github.io/ran/src/article/design_mode.html)
- **🎨 RanUI Documentation**: [UI Library Guide](https://chaxus.github.io/ran/src/ranui/)
- **🛠️ RanUTS Documentation**: [Utility Library Guide](https://chaxus.github.io/ran/src/ranuts/)
- **📝 Project Documentation**: [docs](packages/docs)

## ⚠️ Important Notice

This is a **technology exploration and learning project** in early development. Most packages are in alpha stage or experimental phase.

**Key points:**

- 🚧 **Early Development**: Most features are still being developed
- 🧪 **Experimental**: APIs may change frequently
- 📚 **Learning Focus**: Primarily for learning and experimentation

## 🤝 Contributing

We welcome contributions from learners and developers! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features when possible
- Update documentation as needed
- Be patient with experimental features

## 🌟 Why Open Source?

I believe in the power of open source to accelerate learning and innovation. Throughout my development journey, I've been greatly influenced by countless open-source projects. By open-sourcing this experimental code, I hope to:

- Share learning experiences with the community
- Enable others to learn from and experiment with this code
- Foster collaboration and knowledge sharing
- Create a platform for continuous learning and improvement

## 📊 Project Stats

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" alt="Contributors" />
</a>

![](http://profile-counter.glitch.me/chaxus-ran/count.svg)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the Ran community</p>
  <p>If this project helps you learn, please give it a ⭐️</p>
</div>
