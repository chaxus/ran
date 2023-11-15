import React, { useState } from 'react';
import { Input, message } from '@ranui/react';
import { LineModel, tfMemory } from '../lib';

const path = '../../assets/dataset/kc_house_data.csv';

const { loadData, train, test, save, loadModel, predict, openTfvis } =
  new LineModel();

export const LineModelComponent = (): JSX.Element => {
  const [state, setState] = useState('');
  const memory = tfMemory();
  const input = (e: { target: { value: React.SetStateAction<string> } }) => {
    setState(e.target.value);
  };
  const predictOut = () => {
    const num = Number(state);
    if (Object.is(num, NaN)) {
      return message.warning('please input number');
    }
    predict(Number(state));
  };
  return (
    <div>
      <h1>Line Model</h1>
      <div>{`current memory:${memory}`}</div>
      <h2>加载数据</h2>
      <button onClick={() => loadData(path)}>loadData</button>
      <h2>训练模型</h2>
      <button onClick={train}>trainModel</button>
      <h2>测试模型</h2>
      <button onClick={test}>testModel</button>
      <h2>保存模型</h2>
      <button onClick={() => save()}>save</button>
      <h2>加载模型</h2>
      <button onClick={() => loadModel()}>loadModel</button>
      <h2>预测</h2>
      <Input onChange={input} />
      <button onClick={predictOut}>input number to predict result</button>
      <h2>打开tfvis视图</h2>
      <button onClick={openTfvis}>openTfvis</button>
    </div>
  );
};
