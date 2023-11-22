import React, { useState } from 'react';
import { Input, message } from '@ranui/react';
import type { TensorContainerObject, TypedArray } from '@tensorflow/tfjs';
import type { Point2D } from '@tensorflow/tfjs-vis';
import * as tfvis from '@tensorflow/tfjs-vis';
import * as tf from '@tensorflow/tfjs';
import { word } from 'ranuts';
import {
  createModel,
  denormalise,
  normalise,
  plot,
  tfMemory,
  trainModel,
} from '../lib';
import type { Normalise } from '../lib';

const path = '../../assets/dataset/ChnSentiCorp_htl_all.csv';

// 1. 先进行单词的分类，那先单词是好单词，那些单词是不好的单词
// 2.

interface TextEmotionData extends TensorContainerObject {
  review: string;
  label: number;
}

class EmotionModel {
  normaliseFeature?: Normalise;
  normaliseLabel?: Normalise;
  testingFeatureTensor?: tf.Tensor<tf.Rank>;
  testingLabelTensor?: tf.Tensor<tf.Rank>;
  model?: tf.LayersModel;
  points: { label: number; x: number[] }[];
  words: string[];
  constructor() {
    this.words = [];
  }
  /**
   * @description: 加载数据
   * @param {string} path
   * @return {*}
   */
  loadData = async (path: string): Promise<void> => {
    // 导入数据
    const textEmotionDataSet = tf.data.csv(path);
    const { success, methods } = await word();
    if (!success) return;
    const { cut } = methods;
    // 从数据中提取x,y值并绘制图形
    const pointsDataSet = textEmotionDataSet.map((record: TextEmotionData) => {
      const { label, review = '' } = record;
      const list = cut(review);
      const x: number[] = [];
      list.forEach((item: string) => {
        !this.words.includes(item) && this.words.push(item);
        x.push(this.words.findIndex((i) => i === item));
      });
      return {
        x, // 当前句子有哪些单词和单词的位置
        label,
      };
    });
    this.points = await pointsDataSet.toArray();
    if (this.points.length % 2 !== 0) {
      // 如果张量是奇数，会导致无法平均分割，需要变成偶数
      this.points.pop();
    }
    tf.util.shuffle(this.points);
    // Feature (inputs) 提取特征并存在张量中
    const featureValue = this.points.map((p) => p.x);
    const featureTensor = tf.tensor2d(featureValue); // 这里不对
    // Labels (outputs) 对标签做同样的操作
    const labelValue = this.points.map((p) => p.label);
    const labelTensor = tf.tensor2d(labelValue, [labelValue.length, 1]);
    // 标准化标签和特征
    this.normaliseFeature = normalise(featureTensor);
    this.normaliseLabel = normalise(labelTensor);
    console.log(
      `load data success, normaliseFeature:${this.normaliseFeature}, normaliseLabel:${this.normaliseLabel}`,
    );
  };
}
const { loadData } = new EmotionModel();
export const Emotion = (): JSX.Element => {
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
    // predict(Number(state));
  };
  return (
    <div>
      <h1>Emotion Model</h1>
      <div>{`current memory:${memory}`}</div>
      <h2>加载数据</h2>
      <button onClick={() => loadData(path)}>加载数据</button>
      {/* <h2>训练模型</h2>
      <button onClick={train}>训练模型</button>
      <h2>测试模型</h2>
      <button onClick={test}>测试模型</button>
      <h2>保存模型</h2>
      <button onClick={() => save()}>保存模型</button>
      <h2>加载模型</h2>
      <button onClick={() => loadModel()}>加载模型</button> */}
      <h2>预测</h2>
      <Input onChange={input} />
      <button onClick={predictOut}>输入文本去预测结果</button>
      <h2>打开tfvis视图</h2>
      {/* <button onClick={openTfvis}>打开tfvis视图</button> */}
    </div>
  );
};
