import * as tf from '@tensorflow/tfjs';
import type { MemoryInfo } from '@tensorflow/tfjs'

/**
 * @description: 测试tf的内存管理
 * @return {*}
 */
export function createLotsOfTensors(): void {
    for (let i = 0; i < 1000; i++) {
        const a = tf.tensor1d([1, 2, 3])
        const b = tf.scalar(i)
        a.mul(b).print()
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
}

interface TfVersion {
    'tfjs-core': string;
    'tfjs-backend-cpu': string;
    'tfjs-backend-webgl': string;
    'tfjs-data': string;
    'tfjs-layers': string;
    'tfjs-converter': string;
    tfjs: string;
}

interface TfInfo {
    version: TfVersion,
    backend: string,
    memory: MemoryInfo,
    numTensors: number
}

export const tfInfo = (): TfInfo => {
    const memory = tf.memory()
    const { numTensors } = memory
    const info = {
        version: tf.version,
        backend: tf.getBackend(),
        memory,
        numTensors
    }
    return info
}

export const csv2DataSet = (path: string): tf.data.CSVDataset => {
    return tf.data.csv(path)
}