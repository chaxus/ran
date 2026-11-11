---
title: 글래스 크롬 모션
description: 리퀴드 글래스에서 select·tabs·menubar 가 공유하는 슬라이딩 wash.
---

# Glass chrome motion

Under **Liquid glass**, list cursors share one sliding wash instead of flashing each row's own background. Selected uses weight; the wash owns hover and the open cursor. Set **Style → Liquid glass** in the header, then open the demos below.

Rules (from [Design · Motion](../design/) and [Surface language](../design/surface/)):

- One fill travels between rows; selected is not a second static fill.
- When a menu opens, the wash already sits on the selected row — no fade-in after the list appears.
- Travel between rows may ease; first place snaps.

## Select wash

Open the field; **Editor** should already show the wash. Move to another role to see it slide.

<ran-demo column align="start">
  <r-select label="Role" defaultValue="editor" style="width: 220px" dropdownclass="ran-chrome-menu">
    <r-option value="viewer">Viewer</r-option>
    <r-option value="editor">Editor</r-option>
    <r-option value="admin">Admin</r-option>
  </r-select>
</ran-demo>

## Tabs fill

The header fill is the same motion idea as the menu wash — one underline/hover plate that moves with the cursor.

<ran-demo>
  <r-tabs activeKey="design" type="line">
    <r-tab label="Design" key="design">Methods and surface language.</r-tab>
    <r-tab label="ranui" key="ranui">Components and tokens.</r-tab>
    <r-tab label="Agents" key="agents">Plugin skills and evals.</r-tab>
  </r-tabs>
</ran-demo>

## Menubar hop

Hover across peers; one shared viewport morphs between panels. After each hop, the wash settles on the selected option.

<ran-demo column align="start">
  <r-menubar style="display: flex; gap: 8px; align-items: center">
    <r-select aria-label="Language" defaultValue="en" trigger="hover click" dropdownclass="ran-chrome-menu" style="width: auto">
      <r-option value="en">English</r-option>
      <r-option value="zh">中文</r-option>
    </r-select>
    <r-theme-switch trigger="hover click"></r-theme-switch>
    <r-surface-switch trigger="hover click"></r-surface-switch>
  </r-menubar>
</ran-demo>

## References

- [Select](../ranui/select/) — glass list wash
- [Menubar](../ranui/menubar/) — shared viewport hop
- [Tabs](../ranui/tab/) — sliding header fill
- [ThemeSwitch](../ranui/theme-switch/) / [SurfaceSwitch](../ranui/surface-switch/) — chrome menus
- [Coding guidelines](../ranui/coding-guides/) — DSD keep + place wash after floating position
