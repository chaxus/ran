import * as tf from '@tensorflow/tfjs';

const path = '../../assets/dataset/ChnSentiCorp_htl_all.csv';

interface Normalise {
  tensor: tf.Tensor<tf.Rank>;
  max: tf.Tensor<tf.Rank>;
  min: tf.Tensor<tf.Rank>;
}

class EmotionModel {
  normaliseFeature?: Normalise;
  normaliseLabel?: Normalise;
  testingFeatureTensor?: tf.Tensor<tf.Rank>;
  testingLabelTensor?: tf.Tensor<tf.Rank>;
  model?: tf.LayersModel;
  /**
   * @description: 加载数据
   * @param {string} path
   * @return {*}
   */
  loadData = async (path: string): Promise<void> => {
    // 导入数据
    const houseSaleDateSet = tf.data.csv(path);

    console.log(
      `load data success, normaliseFeature:${this.normaliseFeature}, normaliseLabel:${this.normaliseLabel}`,
    );
  };
}

export const Emotion = (): JSX.Element => {
  return <div></div>;
};
