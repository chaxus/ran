import React, { useState } from 'react';
import { Input, message } from '@ranui/react';
import type { TensorContainerObject, TypedArray } from '@tensorflow/tfjs';
import type { Point2D } from '@tensorflow/tfjs-vis';
import * as tfvis from '@tensorflow/tfjs-vis';
import * as tf from '@tensorflow/tfjs';
import {
  createModel,
  denormalise,
  normalise,
  plot,
  tfMemory,
  trainModel,
} from '../lib';
import type { Normalise } from '../lib';

const path = '../../assets/dataset/kc_house_data.csv';

type TensorLike2D =
  | TypedArray
  | number[]
  | number[][]
  | boolean[]
  | boolean[][]
  | string[]
  | string[][]
  | Uint8Array[]
  | Uint8Array[][];

interface HouseSaleDataSet extends TensorContainerObject {
  price: number;
  sqft_living: number;
}

class LineModel {
  normaliseFeature?: Normalise;
  normaliseLabel?: Normalise;
  testingFeatureTensor?: tf.Tensor<tf.Rank>;
  testingLabelTensor?: tf.Tensor<tf.Rank>;
  model?: tf.LayersModel;
  points?: Point2D[];
  /**
   * @description: 加载数据
   * @param {string} path
   * @return {*}
   */
  loadData = async (path: string): Promise<void> => {
    // 导入数据
    const houseSaleDateSet = tf.data.csv(path);
    // 从数据中提取x,y值并绘制图形
    const pointsDataSet = houseSaleDateSet.map((record: HouseSaleDataSet) => {
      return {
        x: record.sqft_living,
        y: record.price,
      };
    });
    this.points = await pointsDataSet.toArray();

    if (this.points.length % 2 !== 0) {
      // 如果张量是奇数，会导致无法平均分割，需要变成偶数
      this.points.pop();
    }
    tf.util.shuffle(this.points);
    plot(this.points, 'Square feet');
    // Feature (inputs) 提取特征并存在张量中
    const featureValue = this.points.map((p) => p.x);
    const featureTensor = tf.tensor2d(featureValue, [featureValue.length, 1]);
    // Labels (outputs) 对标签做同样的操作
    const labelValue = this.points.map((p) => p.y);
    const labelTensor = tf.tensor2d(labelValue, [labelValue.length, 1]);
    // 标准化标签和特征
    this.normaliseFeature = normalise(featureTensor);
    this.normaliseLabel = normalise(labelTensor);
    console.log(
      `load data success, normaliseFeature:${this.normaliseFeature}, normaliseLabel:${this.normaliseLabel}`,
    );
  };
  train = async (): Promise<void> => {
    if (!this.normaliseFeature || !this.normaliseLabel) return;
    // 分割测试集和训练集
    const [trainingFeatureTensor, testingFeatureTensor] = tf.split(
      this.normaliseFeature.tensor,
      2,
    );
    this.testingFeatureTensor = testingFeatureTensor;
    const [trainingLabelTensor, testingLabelTensor] = tf.split(
      this.normaliseLabel.tensor,
      2,
    );
    this.testingLabelTensor = testingLabelTensor;
    // 创建模型
    this.model = createModel();
    this.model.summary();
    tfvis.show.modelSummary({ name: 'Modal summary' }, this.model);
    // 了解 layer
    const layer = this.model.getLayer('', 0);
    tfvis.show.layer({ name: 'Layer 1' }, layer);

    const onEpochBegin = async () => {
      await this.predictionLine();
      // 更新 layer
      const layer = this.model.getLayer('', 0);
      tfvis.show.layer({ name: 'Layer 1' }, layer);
    };
    // 训练模型
    const result = await trainModel(
      this.model,
      trainingFeatureTensor,
      trainingLabelTensor,
      onEpochBegin,
    );

    await this.predictionLine();

    const trainLoss = result.history.loss.pop();
    const validationLoss = result.history.val_loss.pop();
    console.log(
      `train success trainLoss:${trainLoss}, validationLoss:${validationLoss}`,
    );
  };
  test = async (): Promise<void> => {
    if (!this.testingFeatureTensor || !this.testingLabelTensor) return;
    // 判断损失函数
    const lossTensor = this.model?.evaluate(
      this.testingFeatureTensor,
      this.testingLabelTensor,
    );
    const loss = Array.isArray(lossTensor)
      ? lossTensor.map(async (item) => await item.dataSync())
      : await lossTensor?.dataSync();
    console.log(`test success, loss:${loss}`);
  };
  save = async (
    storageID: string = 'kc-house-price-regression',
  ): Promise<void> => {
    const saveResults = await this.model?.save(`localstorage://${storageID}`);
    console.log(
      'save model success, current time is:',
      saveResults?.modelArtifactsInfo.dateSaved,
    );
  };
  loadModel = async (
    storageID: string = 'kc-house-price-regression',
  ): Promise<void> => {
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

      await this.predictionLine();
      console.log('load model success');
    } else {
      console.log('no model', storageID);
    }
  };
  predict = async (input: number): Promise<void> => {
    tf.tidy(() => {
      if (!this.normaliseLabel || !this.normaliseFeature) return;
      const inputTensor = tf.tensor1d([input]);
      const normaliseInput = normalise(
        inputTensor,
        this.normaliseFeature?.min,
        this.normaliseLabel?.max,
      );
      const normaliseOutputTensor = this.model?.predict(normaliseInput.tensor);
      const outputTensor =
        normaliseOutputTensor &&
        !Array.isArray(normaliseOutputTensor) &&
        denormalise(
          normaliseOutputTensor,
          this.normaliseLabel.min,
          this.normaliseFeature.max,
        );
      const outputValue = outputTensor && outputTensor.dataSync()[0];
      console.log(
        'predict success, the result: ',
        outputValue && outputValue / 1000,
      );
    });
  };
  predictionLine = async (): Promise<void> => {
    const [x, y] = tf.tidy(() => {
      const normaliseXs = tf.linspace(0, 1, 100);
      const normaliseYs = this.model.predict(normaliseXs.reshape([100, 1]));

      const xs = denormalise(
        normaliseXs,
        this.normaliseFeature.min,
        this.normaliseFeature.max,
      );
      const ys = denormalise(
        normaliseYs as tf.Tensor<tf.Rank>,
        this.normaliseLabel.min,
        this.normaliseLabel.max,
      );
      return [xs.dataSync(), ys.dataSync()];
    });
    const predictPoints = Array.from(x).map((val, index) => {
      return { x: val, y: y[index] };
    });
    await plot(this.points, 'Square feet', predictPoints);
  };
  /**
   * @description: 设置权重和偏见
   * @param {TensorLike2D} weight
   * @param {TensorLike2D} bias
   * @return {*}
   */
  plotParams = async (
    weight: TensorLike2D,
    bias: TensorLike2D,
  ): Promise<void> => {
    this.model
      .getLayer(null, 0)
      .setWeights([tf.tensor2d(weight), tf.tensor2d(bias)]);
    await this.predictionLine();
    // 更新 layer
    const layer = this.model.getLayer('', 0);
    tfvis.show.layer({ name: 'Layer 1' }, layer);
  };
  openTfvis = (): void => {
    tfvis.visor().toggle();
  };
}

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
