import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import type { Point2D } from "@tensorflow/tfjs-vis";
import type { Rank, Tensor, TensorContainerObject } from "@tensorflow/tfjs";

const csv = "../assets/dataset/kc_house_data.csv";

const normalise = (tensor: Tensor, mi?: tf.Tensor<tf.Rank>, mx?: tf.Tensor<tf.Rank>) => {
  const min = mi || tensor.min();
  const max = mx || tensor.max();
  return {
    tensor: tensor.sub(min).div(max.sub(min)),
    max,
    min,
  };
};

export class LineModel {
  normaliseFeature?: { tensor: tf.Tensor<tf.Rank>; max: tf.Tensor<tf.Rank>; min: tf.Tensor<tf.Rank>; };
  normaliseLabel?: { tensor: tf.Tensor<tf.Rank>; max: tf.Tensor<tf.Rank>; min: tf.Tensor<tf.Rank>; };
  // model: tf.Sequential;
  testingFeatureTensor?: tf.Tensor<tf.Rank>;
  testingLabelTensor?: tf.Tensor<tf.Rank>;
  model?: tf.LayersModel;
  constructor() {
  }
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
    const points: Point2D[] = await pointsDataSet.toArray();

    if (points.length % 2 !== 0) {
      // 如果张量是奇数，会导致无法平均分割，需要变成偶数
      points.pop();
    }
    tf.util.shuffle(points);
    plot(points, "Square feet");
    // Feature (inputs) 提取特征并存在张量中
    const featureValue = points.map((p) => p.x);
    const featureTensor = tf.tensor2d(featureValue, [featureValue.length, 1]);
    // Labels (outputs) 对标签做同样的操作
    const labelValue = points.map((p) => p.y);
    const labelTensor = tf.tensor2d(labelValue, [labelValue.length, 1]);
    // 标准化标签和特征
    this.normaliseFeature = normalise(featureTensor);
    this.normaliseLabel = normalise(labelTensor);
  }
  train = async (): Promise<void> => {
    if (!this.normaliseFeature || !this.normaliseLabel) return
    // 分割测试集和训练集
    const [trainingFeatureTensor, testingFeatureTensor] = tf.split(
      this.normaliseFeature.tensor,
      2
    );
    this.testingFeatureTensor = testingFeatureTensor
    const [trainingLabelTensor, testingLabelTensor] = tf.split(
      this.normaliseLabel.tensor,
      2
    );
    this.testingLabelTensor = testingLabelTensor
    // 创建模型
    this.model = createModal();
    this.model.summary();
    tfvis.show.modelSummary({ name: "Modal summary" }, this.model);
    // 了解 layer
    const layer = this.model.getLayer('', 0);
    tfvis.show.layer({ name: "Layer 1" }, layer);
    // 训练模型
    const result = await trainModel(
      this.model,
      trainingFeatureTensor,
      trainingLabelTensor
    );
    const trainLoss = result.history.loss.pop();
    const validationLoss = result.history.val_loss.pop();
    console.log('train success:', trainLoss, validationLoss);

  }
  test = async (): Promise<void> => {
    if (!this.testingFeatureTensor || !this.testingLabelTensor) return
    // 判断损失函数
    const lossTensor = this.model?.evaluate(this.testingFeatureTensor, this.testingLabelTensor);
    const loss = Array.isArray(lossTensor)
      ? lossTensor.map(async (item) => await item.dataSync())
      : await lossTensor?.dataSync();
    console.log("trainLoss, lossTensor", loss);
  }
  save = async (storageID: string = 'kc-house-price-regression'): Promise<void> => {
    const saveResults = await this.model?.save(`localstorage://${storageID}`)
    console.log('save model:', saveResults?.modelArtifactsInfo.dateSaved);
  }
  loadModel = async (storageID: string = 'kc-house-price-regression'): Promise<void> => {
    const storageKey = `localstorage://${storageID}`
    const models = await tf.io.listModels()
    const modelInfo = models[storageKey]
    if (modelInfo) {
      this.model = await tf.loadLayersModel(storageKey)
      this.model.summary();
      tfvis.show.modelSummary({ name: "Modal summary" }, this.model);
      // 了解 layer
      const layer = this.model.getLayer('', 0);
      tfvis.show.layer({ name: "Layer 1" }, layer);
    } else {
      console.log('no model', storageID);
    }
  }
  predict = async (input: number): Promise<void> => {
    tf.tidy(() => {
      if (!this.normaliseLabel || !this.normaliseFeature) return
      const inputTensor = tf.tensor1d([input])
      const normaliseInput = normalise(inputTensor, this.normaliseFeature?.min, this.normaliseLabel?.max)
      const normaliseOutputTensor = this.model?.predict(normaliseInput.tensor)
      const outputTensor = normaliseOutputTensor && !Array.isArray(normaliseOutputTensor) && denormalise(normaliseOutputTensor, this.normaliseLabel.min, this.normaliseFeature.max)
      const outputValue = outputTensor && outputTensor.dataSync()[0]
      console.log('outputValue', outputValue && (outputValue / 1000).toFixed(0));
    })
  }
}

interface HouseSaleDataSet extends TensorContainerObject {
  price: number;
  sqft_living: number;
}


const denormalise = (tensor: Tensor, max: Tensor<Rank>, min: Tensor<Rank>) => {
  return tensor.mul(max.sub(min)).add(min);
};
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
      yLabel: "Price",
    }
  );
};

const createModal = () => {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 1,
      useBias: true,
      activation: "linear",
      inputDim: 1,
    })
  );

  const optimizer = tf.train.sgd(0.1);
  model.compile({
    loss: "meanSquaredError",
    optimizer,
  });
  return model;
};

const trainModel = async (
  model: tf.LayersModel,
  trainingFeatureTensor: tf.Tensor<tf.Rank>,
  trainingLabelTensor: tf.Tensor<tf.Rank>
) => {
  const { onEpochEnd, onBatchEnd } = tfvis.show.fitCallbacks(
    { name: "Training Performance" },
    ["loss"]
  );
  return model.fit(trainingFeatureTensor, trainingLabelTensor, {
    batchSize: 512,
    epochs: 20,
    // 验证集
    validationSplit: 0.2,
    callbacks: {
      // onEpochEnd: (epoch, log) => {
      //   console.log(`Epoch ${epoch}: loss = ${log.loss}`);

      // }
      onEpochEnd,
      onBatchEnd,
    },
  });
};
const tfTensor = async () => {
  // 导入数据
  const houseSaleDateSet = tf.data.csv(csv);
  // 从数据中提取x,y值并绘制图形
  const pointsDataSet = houseSaleDateSet.map((record: HouseSaleDataSet) => {
    return {
      x: record.sqft_living,
      y: record.price,
    };
  });
  const points: Point2D[] = await pointsDataSet.toArray();

  if (points.length % 2 !== 0) {
    // 如果张量是奇数，会导致无法平均分割，需要变成偶数
    points.pop();
  }
  tf.util.shuffle(points);
  plot(points, "Square feet");
  // Feature (inputs) 提取特征并存在张量中
  const featureValue = points.map((p) => p.x);
  const featureTensor = tf.tensor2d(featureValue, [featureValue.length, 1]);
  // Labels (outputs) 对标签做同样的操作
  const labelValue = points.map((p) => p.y);
  const labelTensor = tf.tensor2d(labelValue, [labelValue.length, 1]);

  // 标准化标签和特征
  const normaliseFeatureTensor = normalise(featureTensor);
  const normaliseLabelTensor = normalise(labelTensor);

  normaliseFeatureTensor.tensor.print();
  normaliseLabelTensor.tensor.print();
  // 分割测试集和训练集
  const [trainingFeatureTensor, testingFeatureTensor] = tf.split(
    normaliseFeatureTensor.tensor,
    2
  );
  const [trainingLabelTensor, testingLabelTensor] = tf.split(
    normaliseLabelTensor.tensor,
    2
  );
  // 创建模型
  const model = createModal();
  model.summary();
  tfvis.show.modelSummary({ name: "Modal summary" }, model);
  // 了解 layer
  const layer = model.getLayer('', 0);
  tfvis.show.layer({ name: "Layer 1" }, layer);
  // 训练模型
  const result = await trainModel(
    model,
    trainingFeatureTensor,
    trainingLabelTensor
  );
  const trainLoss = result.history.loss.pop();
  const validationLoss = result.history.val_loss.pop();
  // 判断损失函数
  const lossTensor = model.evaluate(testingFeatureTensor, testingLabelTensor);
  const loss = Array.isArray(lossTensor)
    ? lossTensor.map(async (item) => await item.dataSync())
    : await lossTensor.dataSync();
  console.log("trainLoss, lossTensor", loss, trainLoss, validationLoss);
};

export const App = (): JSX.Element => {
  // const model = new LineModel()
  const openTfvis = () => {
    tfvis.visor().toggle()
  }
  useEffect(() => {
    tfTensor();
  }, []);

  return (
    <div>
      <h1>tf version:</h1>
      <div>{JSON.stringify(tf.version)}</div>
      <h2>tf backend:</h2>
      <div>{JSON.stringify(tf.getBackend())}</div>
      <h2>tf memory</h2>
      <div>{JSON.stringify(tf.memory())}</div>
      <h3>张量的数量</h3>
      <div>
        Number of tensor in memory: {JSON.stringify(tf.memory().numTensors)}
      </div>
      <button onClick={openTfvis}>打开tfvis视图</button>
    </div>
  );
};

const container = document.getElementById("app")!;

const root = createRoot(container);

root.render(
  <>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>
);
