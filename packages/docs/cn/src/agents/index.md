---
title: Agents
---

# Agents

一个 ran 插件提供三个 skill：design 指导产品设计，ranui 指导组件使用，ranuts 指导工具选择。

[design](../design/) · [ranui](../ranui/) · [ranuts](../ranuts/)

在仓库根目录注册当前工作副本并安装插件。

## Codex

```sh
codex plugin marketplace add .
codex plugin add ran@ran
```

## Claude Code

```sh
claude plugin marketplace add .
claude plugin install ran@ran
```

新建会话后，Codex 使用 `$design`、`$ranui` 或 `$ranuts`；Claude Code 使用 `/ran:design`、`/ran:ranui` 或 `/ran:ranuts`。

发布后，将市场命令中的 `.` 替换为 `chaxus/ran`。下方仓库链接指向合并后 main 分支的正式位置。

[plugins/ran](https://github.com/chaxus/ran/tree/main/plugins/ran)
