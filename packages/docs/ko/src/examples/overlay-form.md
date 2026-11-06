---
title: 오버레이 폼
description: 모달 또는 팝오버에서 네이티브 폼 연동 ranui 필드로 입력을 받습니다.
---

# 오버레이 폼

집중 편집은 오버레이에 두어 아래 페이지가 계속 보이게 합니다. [`r-modal`](../ranui/modal/) traps focus and locks scroll; [`r-popover`](../ranui/popover/) suits lightweight panels anchored to a control. Both accept the same form fields—`r-input`, `r-select`, and `r-checkbox` participate in native `<form>` submission via [Form-Associated Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_form-associated_custom_elements).

## Modal with fields

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

Submit uses `serializeForm()` from `ranui` when you need a plain object; the demo closes on save without a network call.

## Popover variant

For a single field or a short confirm, anchor [`r-popover`](../ranui/popover/) to the trigger and keep the same `<form>` markup inside. Popovers do not lock the page; use a modal when the task needs uninterrupted focus or several fields.

## References

- [Form](../ranui/form/) — field layout and `serializeForm`
- [Modal](../ranui/modal/) — `open`, focus trap, imperative helpers
- [Popover](../ranui/popover/) — placement and dismissal
