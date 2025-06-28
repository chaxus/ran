import React, { useState } from 'react';
import type { TensorContainerObject } from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import * as tf from '@tensorflow/tfjs';
import { word } from 'ranuts/wasm';
import { denormalise, normalise, tfMemory, trainModel } from '../lib';
import type { Normalise } from '../lib';
import 'ranui/input';
import 'ranui/message';
import 'ranui/typings';

declare global {
  interface Window {
    message: Partial<Ran.Message>;
  }
}
const message = window.message;

const path = '../../assets/dataset/min_label_review.csv';

// 1. 先进行单词的分类，那先单词是好单词，那些单词是不好的单词
// 2.

// const createModel = (inputDim: number, inputLength: number) => {
//   // 创建模型
//   const model = tf.sequential();

//   // 添加一个嵌入层
//   model.add(
//     tf.layers.embedding({
//       inputDim, // 词汇表的大小
//       outputDim: 100, // 嵌入向量的维度
//       inputLength, // 输入数据的序列长度
//     }),
//   );

//   // 添加一个 LSTM 层
//   // 以下是一个使用 RNN（具体来说是 LSTM）进行情感分析的示例。这个模型首先使用嵌入层将词语转换为向量，然后使用 LSTM 层处理序列，最后使用全连接层进行分类：
//   // 这个模型可以考虑词语的顺序，因为 LSTM 层会处理输入序列中的每一个词语，并记住序列中的上下文信息。因此，这个模型不仅可以根据词语本身的意义进行情感分析，还可以根据词语的位置和上下文进行情感分析。
//   model.add(
//     tf.layers.lstm({
//       units: 32,
//       returnSequences: false, // 因为后面没有其他的 RNN 层，所以这里为 false
//     }),
//   );

//   // 添加一个全连接层
//   model.add(tf.layers.dense({units: 24, activation: 'relu'}));

//   model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));

//   // 编译模型
//   model.compile({
//     optimizer: 'adam',
//     loss: 'binaryCrossentropy',
//     metrics: ['accuracy'],
//   });
//   return model;
// };
const createModel = (inputDim: number, inputLength: number) => {
  // 创建模型
  const model = tf.sequential();

  model.add(
    tf.layers.embedding({
      inputDim,
      outputDim: 100,
      inputLength,
      embeddingsInitializer: 'glorotNormal',
    }),
  );

  model.add(
    tf.layers.lstm({
      units: 32,
      returnSequences: false,
      kernelInitializer: 'glorotNormal',
      recurrentInitializer: 'glorotNormal',
    }),
  );

  model.add(tf.layers.dense({ units: 24, activation: 'relu', kernelInitializer: 'glorotNormal' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid', kernelInitializer: 'glorotNormal' }));

  model.compile({
    loss: 'binaryCrossentropy',
    optimizer: 'adam',
    metrics: ['accuracy'],
  });
  return model;
};

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
  words: Record<string, number>;
  maxLength: number;
  constructor() {
    this.words = {};
    this.maxLength = 0;
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
    // 从数据中提取 x,y 值并绘制图形
    const pointsDataSet = textEmotionDataSet.map((record: TextEmotionData) => {
      const { label, review = '' } = record;
      const list = cut(review);
      const x: number[] = [];
      let index = 1;
      // 0 是填充的数字
      list.forEach((item: string) => {
        if (!this.words[item]) {
          this.words[item] = index++;
        }
        x.push(this.words[item]);
      });
      this.maxLength = Math.max(x.length, this.maxLength);
      return {
        x,
        label,
      };
    });
    this.points = await pointsDataSet.toArray();
    this.points.forEach((item) => {
      const { x } = item;
      if (x.length < this.maxLength) {
        for (let i = x.length; i < this.maxLength; i++) {
          x.push(0);
        }
      }
    });
    if (this.points.length % 2 !== 0) {
      // 如果张量是奇数，会导致无法平均分割，需要变成偶数
      this.points.pop();
    }
    // 随机打乱输入的数据
    tf.util.shuffle(this.points);
    // Feature (inputs) 提取特征并存在张量中
    const featureValue = this.points.map((p) => p.x);
    const featureTensor = tf.tensor2d(featureValue, [this.points.length, this.maxLength]);
    // Labels (outputs) 对标签做同样的操作
    const labelValue = this.points.map((p) => p.label);
    const labelTensor = tf.tensor2d(labelValue, [labelValue.length, 1]);
    // 标准化标签和特征
    this.normaliseFeature = normalise(featureTensor);
    this.normaliseLabel = normalise(labelTensor);
    const successMessage = `load data success, normaliseFeature:${JSON.stringify(
      this.normaliseFeature,
    )}, normaliseLabel:${JSON.stringify(this.normaliseLabel)}`;
    message.success(successMessage);
    console.log(successMessage);
  };
  /**
   * @description: 训练模型
   * @param {*} Promise
   * @return {*}
   */
  train = async (): Promise<void> => {
    if (!this.normaliseFeature || !this.normaliseLabel) return;
    // 分割测试集和训练集
    const [trainingFeatureTensor, testingFeatureTensor] = tf.split(this.normaliseFeature.tensor, 2);
    this.testingFeatureTensor = testingFeatureTensor;
    const [trainingLabelTensor, testingLabelTensor] = tf.split(this.normaliseLabel.tensor, 2);
    this.testingLabelTensor = testingLabelTensor;
    // 创建模型
    const inputDim = Object.keys(this.words).length;
    this.model = createModel(inputDim, this.maxLength);
    this.model.summary();
    tfvis.show.modelSummary({ name: 'Modal summary' }, this.model);
    // 了解 layer
    const layer = this.model.getLayer('', 0);
    tfvis.show.layer({ name: 'Layer 1' }, layer);

    const onEpochBegin = async () => {
      // 更新 layer
      const layer = this.model.getLayer('', 0);
      tfvis.show.layer({ name: 'Layer 1' }, layer);
    };
    // 训练模型
    const result = await trainModel(this.model, trainingFeatureTensor, trainingLabelTensor, onEpochBegin);

    const trainLoss = result.history.loss.pop();
    const validationLoss = result.history.val_loss.pop();
    const successMessage = `train success trainLoss:${trainLoss}, validationLoss:${validationLoss}`;
    console.log(successMessage);
    message.success(successMessage);
  };
  test = async (): Promise<void> => {
    if (!this.testingFeatureTensor || !this.testingLabelTensor) return;
    // 判断损失函数
    const lossTensor = this.model?.evaluate(this.testingFeatureTensor, this.testingLabelTensor);
    const loss = Array.isArray(lossTensor)
      ? lossTensor.map(async (item) => await item.dataSync())
      : await lossTensor?.dataSync();
    const successMessage = `test success, loss:${JSON.stringify(loss)}`;
    console.log(successMessage);
    message.success(successMessage);
  };
  save = async (storageID: string = 'emotion'): Promise<void> => {
    const saveResults = await this.model?.save(`localstorage://${storageID}`);
    const successMessage = `save model success, current time is:, ${saveResults?.modelArtifactsInfo.dateSaved}`;
    console.log(successMessage);
    message.success(successMessage);
  };
  loadModel = async (storageID: string = 'emotion'): Promise<void> => {
    const storageKey = `localstorage://${storageID}`;
    const models = await tf.io.listModels();
    const modelInfo = models[storageKey];
    if (modelInfo) {
      this.model = await tf.loadLayersModel(storageKey);
      this.model.summary();
      tfvis.show.modelSummary({ name: 'Modal summary' }, this.model);
      // 更新 layer
      const layer = this.model.getLayer('', 0);
      tfvis.show.layer({ name: 'Layer 1' }, layer);
      console.log('load model success');
      message.success('load model success');
    } else {
      console.log('no model', storageID);
      message.success(`no model:${storageID}`);
    }
  };
  predict = async (input: string): Promise<void> => {
    const { success, methods } = await word();
    if (!success) return;
    tf.tidy(() => {
      if (!this.normaliseLabel || !this.normaliseFeature) return;
      const { cut } = methods;
      const list = cut(input);
      let index = Object.keys(this.words).length + 1;
      const text = [];
      list.forEach((item: string) => {
        if (!this.words[item]) {
          this.words[item] = index++;
        }
        text.push(this.words[item]);
      });
      if (text.length < this.maxLength) {
        for (let i = text.length; i < this.maxLength; i++) {
          text.push(0);
        }
      }
      const inputTensor = tf.tensor1d(text);
      const normaliseInput = normalise(inputTensor, this.normaliseFeature?.min, this.normaliseLabel?.max);
      const normaliseOutputTensor = this.model?.predict(normaliseInput.tensor);
      const outputTensor =
        normaliseOutputTensor &&
        !Array.isArray(normaliseOutputTensor) &&
        denormalise(normaliseOutputTensor, this.normaliseLabel.min, this.normaliseFeature.max);
      const outputValue = outputTensor && outputTensor.dataSync()[0];
      console.log('predict success, the result: ', outputValue);
      message.success(`predict success, the result: ${outputValue}`);
    });
  };
}
const { loadData, train, test, save, loadModel, predict } = new EmotionModel();

export const Emotion = (): React.JSX.Element => {
  const [state, setState] = useState('');
  const memory = tfMemory();
  const input = (e: { target: { value: React.SetStateAction<string> } }) => {
    setState(e.target.value);
  };
  const predictOut = () => {
    // if (Object.is(num, NaN)) {
    //   return message.warning('please input number');
    // }
    predict(state);
  };
  return (
    <div>
      <h1>Emotion Model</h1>
      <div>{`current memory:${memory}`}</div>
      <h2>加载数据</h2>
      <button onClick={() => loadData(path)}>加载数据</button>
      <h2>训练模型</h2>
      <button onClick={train}>训练模型</button>
      <h2>测试模型</h2>
      <button onClick={test}>测试模型</button>
      <h2>保存模型</h2>
      <button onClick={() => save()}>保存模型</button>
      <h2>加载模型</h2>
      <button onClick={() => loadModel()}>加载模型</button>
      <h2>预测</h2>
      <r-input onChange={input} />
      <button onClick={predictOut}>输入文本去预测结果</button>
      <h2>打开 tfvis 视图</h2>
      {/* <button onClick={openTfvis}>打开 tfvis 视图</button> */}
    </div>
  );
};
