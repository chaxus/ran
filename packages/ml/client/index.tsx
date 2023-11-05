import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis'
import type { Point2D } from '@tensorflow/tfjs-vis';
import type { Rank, Tensor, TensorContainerObject } from '@tensorflow/tfjs';

const csv = '../assets/dataset/kc_house_data.csv'

interface HouseSaleDataSet extends TensorContainerObject {
  price: number,
  sqft_living: number
}

const normalise = (tensor: Tensor) => {
  const min = tensor.min()
  const max = tensor.max()
  return {
    tensor: tensor.sub(min).div(max.sub(min)),
    max,
    min
  }
}

const denormalise = (tensor: Tensor, max: Tensor<Rank>, min: Tensor<Rank>) => {
  return tensor.mul(max.sub(min)).add(min)
}
/**
 * @description: 绘制图形
 * @param {Point2D} points
 * @param {string} name
 * @return {*}
 */
const plot = (points: Point2D[], name: string) => {
  tfvis.render.scatterplot(
    { name: `${name} vs House Price` },
    { values: [points], series: ["original"] },
    {
      xLabel: name,
      yLabel: "Price"
    }
  )
}

const createModal = () => {
  const model = tf.sequential()

  model.add(tf.layers.dense({
    units: 1,
    useBias: true,
    activation: 'linear',
    inputDim: 1
  }))
  return model
}
const tfTensor = async () => {
  // 导入数据
  const houseSaleDateSet = tf.data.csv(csv)
  // 从数据中提取x,y值并绘制图形
  const pointsDataSet = houseSaleDateSet.map((record: HouseSaleDataSet) => {
    return {
      x: record.sqft_living,
      y: record.price
    }
  })
  const points: Point2D[] = await pointsDataSet.toArray()

  if (points.length % 2 !== 0) {
    // 如果张量是奇数，会导致无法平均分割，需要变成偶数
    points.pop()
  }
  tf.util.shuffle(points)
  plot(points, 'Square feet')
  // Feature (inputs) 提取特征并存在张量中
  const featureValue = points.map(p => p.x)
  const featureTensor = tf.tensor2d(featureValue, [featureValue.length, 1])
  // Labels (outputs) 对标签做同样的操作
  const labelValue = points.map(p => p.y)
  const labelTensor = tf.tensor2d(labelValue, [labelValue.length, 1])

  // 标准化标签和特征
  const normaliseFeatureTensor = normalise(featureTensor)
  const normaliseLabelTensor = normalise(labelTensor)

  normaliseFeatureTensor.tensor.print()
  normaliseLabelTensor.tensor.print()
  // 分割测试集和训练集
  const [trainingFeatureTensor, testingFeatureTensor] = tf.split(normaliseFeatureTensor.tensor, 2)
  const [trainingLabelTensor, testingLabelTensor] = tf.split(normaliseLabelTensor.tensor, 2)
  // 创建模型
  const modal = createModal()
  modal.summary()
  tfvis.show.modelSummary({ name: "Modal summary" }, modal)
}

const App = () => {

  useEffect(() => {
    tfTensor()
  }, [])

  return (
    <div>
      <h2>tf version:</h2>
      <div>{JSON.stringify(tf.version)}</div>
      <h2>tf backend:</h2>
      <div>{JSON.stringify(tf.getBackend())}</div>
      <h2>tf memory</h2>
      <div>{JSON.stringify(tf.memory())}</div>
      <h3>张量的数量</h3>
      <div>Number of tensor in memory: {JSON.stringify(tf.memory().numTensors)}</div>
    </div>
  );
};

const container = document.getElementById('app')!;

const root = createRoot(container);

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
