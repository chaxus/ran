---
title: 浮层表单
description: 在对话框或气泡层中用原生表单关联的 ranui 字段收集输入。
---

# 浮层表单

需要专注编辑的任务适合放在浮层上，底层页面仍可见。[`r-modal`](../ranui/modal/) 会 trap 焦点并锁定滚动；[`r-popover`](../ranui/popover/) 适合锚在控件上的轻量面板。两者都可放入相同的表单字段——`r-input`、`r-select`、`r-checkbox` 通过 [Form-Associated Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_form-associated_custom_elements) 参与原生 `<form>` 提交。

## 对话框表单

<ran-demo column align="start">
  <r-button onclick="document.getElementById('example-settings-modal').open = true">Edit settings</r-button>
  <r-modal id="example-settings-modal" heading="Settings">
    <form id="example-settings-form" style="display: flex; flex-direction: column; gap: 16px; min-width: 280px" onsubmit="event.preventDefault(); document.getElementById('example-settings-modal').open = false">
      <r-input name="displayName" label="Display name" placeholder="Your name"></r-input>
      <r-select name="role" label="Role" style="width: 100%" defaultValue="member">
        <r-option value="member">Member</r-option>
        <r-option value="admin">Admin</r-option>
      </r-select>
      <r-checkbox name="notify">Email me about updates</r-checkbox>
    </form>
    <div slot="footer" style="display: flex; gap: 8px; justify-content: flex-end; width: 100%">
      <r-button type="button" onclick="document.getElementById('example-settings-modal').open = false">Cancel</r-button>
      <button class="demo-submit" type="submit" form="example-settings-form">Save</button>
    </div>
  </r-modal>
</ran-demo>

需要普通对象时可使用 `ranui` 的 `serializeForm()`；此演示在保存时仅关闭对话框，不发请求。

## 气泡层变体

单字段或短确认可锚在 [`r-popover`](../ranui/popover/) 上，内部仍用相同 `<form>`。气泡层不锁页；多字段或需要 uninterrupted 专注时用对话框。

## 参考

- [Form](../ranui/form/) — 字段布局与 `serializeForm`
- [Modal](../ranui/modal/) — `open`、焦点 trap、命令式 API
- [Popover](../ranui/popover/) — 定位与关闭
