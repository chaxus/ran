---
title: 玻璃菜单动效
description: 在液态玻璃下，select、tabs 与 menubar 共用一条滑动选中 wash——打开首帧就在选中行上，再在行间滑动。
---

# 玻璃菜单动效

在 **液态玻璃** 下，列表光标用一条滑动 wash，而不是每行各自闪背景。选中用字重；wash 负责悬停与打开时的光标。先在页眉把 **样式 → 液态玻璃** 打开，再试下面的示例。

规则（见 [设计 · 动效](../design/) 与 [表面语言](/design/surface)）：

- 一条填充在行间移动；选中不是第二块静态底。
- 菜单打开时，wash 已在选中行上——列表出现后再淡入不算合格。
- 行间移动可以缓动；首次落位要瞬间贴上。

## Select wash

打开字段时，**Editor** 应立刻带 wash。移到其他角色可看到滑动。

<ran-demo column align="start">
  <r-select label="角色" defaultValue="editor" style="width: 220px" dropdownclass="ran-chrome-menu">
    <r-option value="viewer">Viewer</r-option>
    <r-option value="editor">Editor</r-option>
    <r-option value="admin">Admin</r-option>
  </r-select>
</ran-demo>

## Tabs 填充

页签头上的填充与菜单 wash 是同一套动效——一块板跟着光标走。

<ran-demo>
  <r-tabs activeKey="design" type="line">
    <r-tab label="设计" key="design">方法与表面语言。</r-tab>
    <r-tab label="ranui" key="ranui">组件与令牌。</r-tab>
    <r-tab label="Agents" key="agents">插件技能与评测。</r-tab>
  </r-tabs>
</ran-demo>

## Menubar hop

在同伴之间悬停；共享视口在面板间变形。每次 hop 后，wash 落在选中项上。

<ran-demo column align="start">
  <r-menubar style="display: flex; gap: 8px; align-items: center">
    <r-select aria-label="语言" defaultValue="zh" trigger="hover click" dropdownclass="ran-chrome-menu" style="width: auto">
      <r-option value="en">English</r-option>
      <r-option value="zh">中文</r-option>
    </r-select>
    <r-theme-switch trigger="hover click"></r-theme-switch>
    <r-surface-switch trigger="hover click"></r-surface-switch>
  </r-menubar>
</ran-demo>

## 参考

- [Select](../ranui/select/) — 玻璃列表 wash
- [Menubar](../ranui/menubar/) — 共享视口 hop
- [Tabs](../ranui/tab/) — 滑动页签填充
- [ThemeSwitch](../ranui/theme-switch/) / [SurfaceSwitch](../ranui/surface-switch/) — chrome 菜单
- [编码指南](../ranui/coding-guides/) — 保留 DSD，并在浮层定位后再贴 wash
