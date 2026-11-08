---
title: Agents
---

# Agents

一个 ran 插件提供三个 skill：design 指导产品设计，ranui 指导组件使用，ranuts 指导工具选择。

按眼前的决策选 skill：

- **design** — 布局、交互、动效，或界面能否通过验收
- **ranui** — 用哪个 `<r-*>`、它的属性，或主题令牌
- **ranuts** — 该 import 哪个工具，或问题落在哪个入口

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

从 GitHub 安装插件。

## Codex

```sh
codex plugin marketplace add chaxus/ran
codex plugin add ran@ran
```

## Claude Code

```sh
claude plugin marketplace add chaxus/ran
claude plugin install ran@ran
```

新建会话后，Codex 使用 `$design`、`$ranui` 或 `$ranuts`；Claude Code 使用 `/ran:design`、`/ran:ranui` 或 `/ran:ranuts`。

想试用本地克隆的版本，就在仓库根目录执行市场命令，把 `chaxus/ran` 换成 `.`。

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
