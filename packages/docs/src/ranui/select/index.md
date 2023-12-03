# Select

A regular pull-down selector.

## Code demo

<r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

## Attribute

### `defaultValue`

Sets the currently selected value

<r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
</r-select>

```xml
    <r-select style="width: 120px; height: 40px" defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

### `disabled`

Adding the disabled attribute makes the selection box unavailable and changes the style.

<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
</r-select>

```xml
    <r-select style="width: 120px; height: 40px" disabled defaultValue="185">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

### `type`

You can set the text type without borders and drop-down ICONS

<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
    >
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
    >
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

### `placement`

Drop-down box display direction default down, set to 'top' can go up

<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
      placement="top"
    >
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select
      style="width: 120px; height: 40px"
      type="text"
      defaultValue="185"
      placement="top"
    >
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

### `getPopupContainerId`

The drop-down box is mounted to document.body by default, and can be mounted to the specified element by passing in the element's id
`
<r-select style="width: 120px; height: 40px">
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select getPopupContainerId="elementid">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```

### `dropdownclass`

If you need to customize the style of the drop-down box, you can pass in a 'class' name to customize

### action

'select' The method that the component triggers. Default 'click', click trigger. You can set 'hover', or 'click,hover', which means that both click and mouse move trigger.

If it is set to none, it will not trigger.

<r-select style="width: 120px; height: 40px" action="click,hover">
<r-option value="185">Mike</r-option>
<r-option value="186">Tom</r-option>
<r-option value="187">Lucy</r-option>
</r-select>

```xml
<r-select getPopupContainerId="elementid" action="click,hover">
      <r-option value="185">Mike</r-option>
      <r-option value="186">Tom</r-option>
      <r-option value="187">Lucy</r-option>
    </r-select>
```
