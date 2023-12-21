# @ranui/react

[Ranui-based](https://www.npmjs.com/package/ranui) component library, encapsulated by `react` higher-order functions, for easy use in `react`.

[ranui](https://www.npmjs.com/package/ranui) can still be used in react, but [@ranui/react](https://www.npmjs.com/package/@ranui/react). is more convenient.

Not in the react framework, you can use [ranui](https://www.npmjs.com/package/ranui) directly.

---

<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/github/actions/workflow/status/chaxus/ran/ci.yml" alt="Build Status"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/v/@ranui/react.svg" alt="npm-v"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/npm/dt/@ranui/react.svg" alt="npm-d"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.badgesize.io/https:/unpkg.com/@ranui/react/dist/umd/index.umd.cjs?label=brotli&compression=brotli" alt="brotli"></a>
<a href="https://github.com/chaxus/ran"><img src="https://img.shields.io/badge/module%20formats-umd%2C%20esm-green.svg" alt="module formats: umd, esm"></a>

## Install

Using npm:

```console
npm install @ranui/react --save
```

## Document

[See components and use examples](https://chaxus.github.io/ran/src/ranui/)

## Example

<https://github.com/chaxus/ran/blob/main/packages/ranui-react/example/index.tsx>

## Import

Support for on-demand import, which can reduce the size of loaded js

```js
import { Button } '@ranui/react'
```

## Usage

some example:

```tsx
import React, { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Preview, Radar, Tab, TabPane, message } from '@ranui/react';

const App = () => {
  const previewRef = useRef<Element>();

  const clickButton = () => {
    console.log('button click');
  };

  const changeInput = (e) => {
    console.log('input--->', e);
  };

  const uploadFile = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    const preview: Element | undefined = previewRef.current;
    if (!preview) return message.warning('previewRef.current is undefined');
    const uploadFile = document.createElement('input');
    uploadFile.setAttribute('type', 'file');
    uploadFile.click();
    uploadFile.onchange = (e) => {
      const { files = [] } = uploadFile;
      if (files && files.length > 0) {
        preview.setAttribute('src', '');
        const file = files[0];
        const url = URL.createObjectURL(file);
        preview.setAttribute('src', url);
      }
    };
  };

  const abilitys = [
    {
      abilityName: '生命',
      scoreRate: '10',
      backgroundColor: 'red',
      fontSize: '30',
      fontColor: 'blue',
    },
    { abilityName: '攻击', scoreRate: '90' },
    { abilityName: '防御', scoreRate: '20' },
    { abilityName: '元素精通', scoreRate: '50' },
    { abilityName: '暴击率', scoreRate: '80' },
    { abilityName: '暴击伤害', scoreRate: '50' },
  ];

  return (
    <>
      <h1>Button</h1>
      <Button onClick={clickButton}>this is button</Button>
      <Button effect={false}>effect</Button>
      <Button icon="home">home icon</Button>
      <Button type="primary">this is button</Button>
      <h1>Tab</h1>
      <Tab type="text">
        <TabPane label="home" icon="home">
          home
        </TabPane>
        <TabPane label="user" icon="user">
          user
        </TabPane>
        <TabPane label="other">other</TabPane>
      </Tab>
      <h1>Preview</h1>
      <Button type="primary" onClick={uploadFile}>
        choose file to preview
      </Button>
      <Preview ref={previewRef}></Preview>
      <h1>Radar</h1>
      <Radar className="radar" abilitys={abilitys}></Radar>
      <h1>Input</h1>
      <Input onChange={changeInput} />
    </>
  );
};
```

## Contributors

<a href="https://github.com/chaxus/ran/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chaxus/ran" />
</a>

## Meta

[LICENSE (MIT)](/LICENSE)
