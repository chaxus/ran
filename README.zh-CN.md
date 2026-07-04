# 🚀 Ran - 技术探索与学习平台

<p align="center">
  <a href="https://chaxus.github.io/ran/" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://chaxus.github.io/ran/icon.png" alt="ran logo">
  </a>
</p>

<p align="center">
  <strong>一个用于技术探索和学习的单仓库项目，包含实验性的 UI 库、工具函数和各种工具。</strong>
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
  <a href="#-功能特性">功能特性</a> •
  <a href="#-项目包">项目包</a> •
  <a href="#-快速开始">快速开始</a> •
  <a href="#-文档">文档</a> •
  <a href="#-贡献指南">贡献指南</a>
</p>

---

[English](./README.md) · 中文

## ✨ 功能特性

- 🎨 **UI 库**: WebComponent 组件
- 🛠️ **工具库**: TypeScript 工具函数
- 🤖 **机器学习**: 基础的 ML 工具和实验
- 📱 **Web 应用**: IM 聊天应用（原型）
- 🔧 **开发工具**: 构建工具和调试工具
- 🌐 **Web3**: 智能合约实验
- 🎯 **可视化工具**: 数据可视化实验

## 📦 项目包

这个单仓库项目包含各种实验性包：

### 核心库（Alpha 阶段）

| 包名                      | 版本                                                                                              | 下载量                                                                                     | 描述       |
| ------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------- |
| [ranui](packages/ranui)   | [![ranui version](https://img.shields.io/npm/v/ranui.svg?label=%20)](packages/ranui/README.md)    | [![npm-d](https://img.shields.io/npm/dt/ranui.svg)](https://www.npmjs.com/package/ranui)   | Web 组件库 |
| [ranuts](packages/ranuts) | [![ranuts version](https://img.shields.io/npm/v/ranuts.svg?label=%20)](packages/ranuts/readme.md) | [![npm-d](https://img.shields.io/npm/dt/ranuts.svg)](https://www.npmjs.com/package/ranuts) | 工具函数库 |

### 实验性项目

| 包名                                    | 描述              |
| --------------------------------------- | ----------------- |
| [im](packages/im)                       | 聊天应用原型      |
| [visual](packages/visual)               | 数据可视化实验    |
| [ranite](packages/ranite)               | 开发工具实验      |
| [debug](packages/debug)                 | 调试工具          |
| [image-process](packages/image-process) | 图像处理实验      |
| [cpro](packages/cpro)                   | C/C++ 学习与实验  |
| [rust](packages/rust)                   | Rust 学习与实验   |

## 🚀 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/chaxus/ran.git
cd ran

# 安装依赖
pnpm install

# 构建所有包
pnpm build
```

### 使用核心包

```bash
# 安装 ranui (Web 组件)
npm install ranui

# 安装工具函数
npm install ranuts
```

### 开发

```bash
# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建特定包
pnpm --filter ranui build
```

## 📚 文档

- **📖 博客和文章**: [设计模式等](https://chaxus.github.io/ran/src/article/designMode.html)
- **🎨 RanUI 文档**: [UI 库指南](https://chaxus.github.io/ran/cn/src/ranui/)
- **🛠️ RanUTS 文档**: [工具函数库指南](https://chaxus.github.io/ran/cn/src/ranuts/)
- **📝 项目文档**: [docs](packages/docs)

## 🤖 AI / Claude Code

本仓库自带一个 Claude Code 插件 marketplace，让 AI 助手无需翻源码即可读懂并使用这些库。
先添加 marketplace，再按需安装你用到的库：

```bash
/plugin marketplace add chaxus/ran
/plugin install ranui@ran      # ranui —— Web 组件
/plugin install ranuts@ran     # ranuts —— 工具函数
```

每个 skill 覆盖 import map、清单、用法示例与约定，并指向该包随 npm 发布的 API 文档。
详见各库 README 里的 skill 小节：[ranui](packages/ranui/README.md#ai--claude-code-skill)、
[ranuts](packages/ranuts/readme.md)。

## ⚠️ 重要说明

这是一个**技术探索和学习项目**，处于早期开发阶段。大多数包都处于 alpha 阶段或实验阶段。

**关键要点：**

- 🚧 **早期开发**: 大多数功能仍在开发中
- 🧪 **实验性**: API 可能会频繁变化
- 📚 **学习导向**: 主要用于学习和实验

## 🤝 贡献指南

我们欢迎学习者和开发者的贡献！以下是您可以帮助的方式：

1. **Fork** 这个仓库
2. **创建** 功能分支 (`git checkout -b feature/amazing-feature`)
3. **提交** 您的更改 (`git commit -m '添加很棒的功能'`)
4. **推送** 到分支 (`git push origin feature/amazing-feature`)
5. **打开** Pull Request

### 开发指南

- 遵循现有的代码风格
- 尽可能为新功能添加测试
- 根据需要更新文档
- 对实验性功能保持耐心

## 🌟 为什么开源？

我相信开源的力量能够加速学习和创新。在我的开发学习过程中，我受到了无数开源项目的极大影响和帮助。通过开源这些实验性代码，我希望：

- 与社区分享学习经验
- 让其他人能够学习和实验这些代码
- 促进协作和知识分享
- 创建一个持续学习和改进的平台

## 📊 项目统计

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" alt="贡献者" />
</a>

![](http://profile-counter.glitch.me/chaxus-ran/count.svg)

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

<div align="center">
  <p>由 Ran 社区用 ❤️ 制作</p>
  <p>如果这个项目对您的学习有帮助，请给它一个 ⭐️</p>
</div>
