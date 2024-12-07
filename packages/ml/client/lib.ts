import * as tf from '@tensorflow/tfjs';
import type { History, Logs, MemoryInfo, Rank, Tensor } from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import type { Point2D } from '@tensorflow/tfjs-vis';

export interface TfVersion {
  'tfjs-core': string;
  'tfjs-backend-cpu': string;
  'tfjs-backend-webgl': string;
  'tfjs-data': string;
  'tfjs-layers': string;
  'tfjs-converter': string;
  tfjs: string;
}

export interface TfInfo {
  version: TfVersion;
  backend: string;
  memory: MemoryInfo;
  numTensors: number;
}

// type TensorRank = Tensor<Rank> | Tensor<Rank>[];

// type Normal<T> = T extends Tensor<Rank> ? TensorRank : T extends Tensor<Rank>[] ? Tensor<Rank>[] : never;

export interface Normalise {
  tensor: Tensor<Rank>;
  max: Tensor<Rank> | Tensor<Rank>[];
  min: Tensor<Rank> | Tensor<Rank>[];
}
/**
 * @description: 测试 tf 的内存管理
 * @return {*}
 */
export function createLotsOfTensors(): void {
  for (let i = 0; i < 1000; i++) {
    const a = tf.tensor1d([1, 2, 3]);
    const b = tf.scalar(i);
    a.mul(b).print();
  }
}
/**
 * @description: 测试tf的内存管理
 * @return {*}
 */
// export const cleanMemoryCreateLotsOfTensors = tf.tidy(createLotsOfTensors)
/**
 * @description: 测试tf运行成功
 * @param {*} void
 * @return {*}
 */
export const tfs = (): void => {
  // Define a model for linear regression.
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // Prepare the model for training: Specify the loss and the optimizer.
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // Generate some synthetic data for training.
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

  // Train the model using the data.
  model.fit(xs, ys).then(() => {
    // Use the model to do inference on a data point the model hasn't seen before:
    const result = model.predict(tf.tensor2d([5], [1, 1]));
    if (Array.isArray(result)) {
      result.forEach((item) => item.print());
    } else {
      result.print();
    }
  });
};

export const tfInfo = (): TfInfo => {
  const memory = tf.memory();
  const { numTensors } = memory;
  const info = {
    version: tf.version,
    backend: tf.getBackend(),
    memory,
    numTensors,
  };
  return info;
};

export const csv2DataSet = (path: string): tf.data.CSVDataset => {
  return tf.data.csv(path);
};

/**
 * @description: 绘制图形
 * @param {Point2D} points
 * @param {string} name
 * @return {*}
 */
export const plot = (points: Point2D[], name: string, predictPoints?: Point2D[]): void => {
  const values = [points];
  const series = ['original'];
  if (Array.isArray(predictPoints)) {
    values.push(predictPoints);
    series.push('predicted');
  }
  tfvis.render.scatterplot(
    { name: `${name} vs House Price` },
    { values, series },
    {
      xLabel: name,
      yLabel: 'Price',
    },
  );
};

export const createModel = (): tf.LayersModel => {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      units: 10,
      useBias: true, // 偏见
      activation: 'sigmoid',
      inputDim: 1,
    }),
  );
  model.add(
    tf.layers.dense({
      units: 10,
      useBias: true, // 偏见
      activation: 'sigmoid',
    }),
  );
  // output
  model.add(
    tf.layers.dense({
      units: 1,
      useBias: true, // 偏见
      activation: 'sigmoid',
    }),
  );

  const optimizer = tf.train.sgd(0.1);
  model.compile({
    loss: 'meanSquaredError',
    optimizer,
  });
  return model;
};

export const trainModel = async (
  model: tf.LayersModel,
  trainingFeatureTensor: tf.Tensor<tf.Rank>,
  trainingLabelTensor: tf.Tensor<tf.Rank>,
  onEpochBegin = (epoch: number, logs?: Logs): void | Promise<void> => {
    console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
  },
  epochs: number = 100,
): Promise<History> => {
  // const { onEpochEnd, onBatchEnd } = tfvis.show.fitCallbacks({ name: 'Training Performance' }, ['loss']);
  return model.fit(trainingFeatureTensor, trainingLabelTensor, {
    batchSize: 512,
    epochs,
    // 验证集
    validationSplit: 0.2,
    callbacks: {
      // onEpochEnd: (epoch, log) => {
      //   console.log(`Epoch ${epoch}: loss = ${log.loss}`);

      // }
      // onEpochEnd,
      // onBatchEnd,
      onEpochBegin,
    },
  });
};
export const denormalise = (
  tensor: Tensor,
  max: Tensor<Rank> | Tensor<Rank>[],
  min: Tensor<Rank> | Tensor<Rank>[],
): Tensor<Rank> => {
  const dimension = tensor.shape.length > 1 && tensor.shape[1];

  if (dimension && dimension > 1) {
    // more than one
    const features = tf.split(tensor, dimension, 1);
    // normalise and find min/max values  for each one
    const denormalised = features.map((featuresTensor, i) => {
      return denormalise(featuresTensor, arrayToItem(max, i), arrayToItem(min, i));
    });
    // prepare return values
    const returnTensor = tf.concat(denormalised, 1);
    return returnTensor;
  }
  if (!(Array.isArray(max) || Array.isArray(min))) {
    return tensor.mul(max.sub(min)).add(min);
  }
};

// type AItem<T> = T extends Array<infer R> ? R : T;

const arrayToItem = <T>(list: T[] | T, index?: number): T => {
  if (!list) return undefined;
  if (Array.isArray(list)) return list[index];
  return list;
};

export const normalise = (
  tensor: Tensor,
  mi?: Tensor<Rank> | Tensor<Rank>[],
  mx?: Tensor<Rank> | Tensor<Rank>[],
): Normalise => {
  const dimension = tensor.shape.length > 1 && tensor.shape[1];

  if (dimension && dimension > 1) {
    // more than one
    const features = tf.split(tensor, dimension, 1);
    // normalise and find min/max values  for each one
    const normalisedFeature = features.map((featuresTensor, i) => {
      return normalise(featuresTensor, arrayToItem<Tensor<Rank>>(mi, i), arrayToItem<Tensor<Rank>>(mx, i));
    });
    // prepare return values
    const returnTensor = tf.concat(
      normalisedFeature.map((f) => f.tensor),
      1,
    );
    const max = normalisedFeature.map((f) => f.max) as Tensor<Rank>[];
    const min = normalisedFeature.map((f) => f.min) as Tensor<Rank>[];
    return { max, min, tensor: returnTensor };
  }
  const min = mi || tensor.min();
  const max = mx || tensor.max();
  if (!(Array.isArray(max) || Array.isArray(min))) {
    return {
      tensor: tensor.sub(min).div(max.sub(min)),
      max,
      min,
    };
  }
};

export const tfMemory = (): number => {
  return tf.memory().numTensors;
};
