import React, { useRef, useState } from 'react';
// react 18
import { createRoot } from 'react-dom/client';
// react 17
// import { render } from 'react-dom';
import { Button, Input, Option, Preview, Radar, Select, Tab, TabPane, message } from '../index';
import './index.less';

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

const App = () => {
  const [state, setState] = useState<any>({
    abilitys,
  });
  const previewRef = useRef<Element>();

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
  const clickButton = () => {
    setState({ abilitys });
    console.log('fsdafdas');
  };
  const changeInput = (e) => {
    console.log('input--->', e);
  };
  // const abilitys =
  //   '[{"abilityName":"生命","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"攻击","scoreRate":"90"},{"abilityName":"防御","scoreRate":"20"},{"abilityName":"元素精通","scoreRate":"50"},{"abilityName":"暴击率","scoreRate":"80"},{"abilityName":"暴击伤害","scoreRate":"50"}]';

  return (
    <>
      <h1>Button</h1>
      <Button onClick={clickButton}>这是按钮</Button>
      <Button effect={false}>effect</Button>
      <Button icon="home">home icon</Button>
      <Button type="primary">这是按钮</Button>
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
      <Radar className="radar" abilitys={state.abilitys}></Radar>
      <h1>Input</h1>
      <Input className="input" label="home" onChange={changeInput} />
      <h1>Select</h1>
      <Select style={{ width: '120px', height: '40px' }}>
        <Option value="1">Mike</Option>
        <Option value="2">Tony</Option>
        <Option value="3">Job</Option>
      </Select>
      <Select style={{ width: '120px', height: '40px' }} showSearch>
        <Option value="1">Mike</Option>
        <Option value="2">Tony</Option>
        <Option value="3">Job</Option>
      </Select>
      <Select style={{ width: '120px', height: '40px' }} defaultValue="1">
        <Option value="1">Mike</Option>
        <Option value="2">Tony</Option>
        <Option value="3">Job</Option>
      </Select>
    </>
  );
};
// react 18
createRoot(document.getElementById('app')).render(<App />);
// react 17
// render(<App />, document.getElementById('app'));
