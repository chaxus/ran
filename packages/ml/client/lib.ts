import * as tf from '@tensorflow/tfjs';

export function createLotsOfTensors(): void {
    for (let i = 0; i < 1000; i++) {
        const a = tf.tensor1d([1, 2, 3])
        const b = tf.scalar(i)
        a.mul(b).print()
    }
}

export const cleanMemoryCreateLotsOfTensors = tf.tidy(createLotsOfTensors)
