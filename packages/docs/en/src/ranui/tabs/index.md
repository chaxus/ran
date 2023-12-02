# Tab

## Code demo

<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>

```xml
<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>
```

## Attribute

### `label`

Each 'r-tab' needs to specify a name 'label', which is used to display the label header.

<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>

```xml
<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2">tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>
```

### `disabled`

Each 'r-tab' can be specified with the 'disabled' attribute to disable the TAB.

<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab id="tab-content-disabled" label="tab2" disabled>tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>

```xml
<r-tabs>
    <r-tab label="tab1">tab1</r-tab>
    <r-tab label="tab2" disabled>tab2</r-tab>
    <r-tab label="tab3">tab3</r-tab>
</r-tabs>
```

### Identifies' key ', 'active'

Each 'r-tab' needs to specify an identifier 'key', no default sequence number is' key ',

'active' works on 'r-tabs' and can specify a switch to a specific TAB or an initial value.

<r-tabs active="B">
    <r-tab label="tab1" r-key="A">tab1</r-tab>
    <r-tab label="tab2" r-key="B">tab2</r-tab>
    <r-tab label="tab3" r-key="C">tab3</r-tab>
</r-tabs>

```html
<r-tabs active="B">
  <r-tab label="tab1" r-key="A">tab1</r-tab>
  <r-tab label="tab2" r-key="B">tab2</r-tab>
  <r-tab label="tab3" r-key="C">tab3</r-tab>
</r-tabs>
```

### `icon`

Each 'r-tab' can specify 'icon', with 'label' to achieve the effect of icon plus text.

<r-tabs>
    <r-tab label="home" icon="home">tab1</r-tab>
    <r-tab label="message" icon="message">tab2</r-tab>
    <r-tab label="user" icon="user">tab3</r-tab>
</r-tabs>

```html
<r-tabs>
  <r-tab label="home" icon="home">tab1</r-tab>
  <r-tab label="message" icon="message">tab2</r-tab>
  <r-tab label="user" icon="user">tab3</r-tab>
</r-tabs>
```

It is also possible to specify 'icon' alone, without using 'label'. However, in this case, the size of the icon must be set, otherwise the size of the icon cannot be judged

<r-tabs>
    <r-tab icon="home" iconSize='22'>tab1</r-tab>
    <r-tab icon="message" iconSize='22'>tab2</r-tab>
    <r-tab icon="user" iconSize='22'>tab3</r-tab>
</r-tabs>

```html
<r-tabs>
  <r-tab icon="home" iconSize="22">tab1</r-tab>
  <r-tab icon="message" iconSize="22">tab2</r-tab>
  <r-tab icon="user" iconSize="22">tab3</r-tab>
</r-tabs>
```

### 'type'

The style is text, clean,

## event '

### onchange

Triggered when the switch is complete.
