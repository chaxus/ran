
import * as tf from '@tensorflow/tfjs';
import React, { useState } from 'react';
import { Input, message } from '@ranui/react';
import type {
    TensorContainerObject,
    TypedArray
} from '@tensorflow/tfjs';
import type { Point2D } from '@tensorflow/tfjs-vis';
import * as tfvis from '@tensorflow/tfjs-vis';
import { denormalise, normalise, tfMemory, trainModel } from '../lib';
import type { Normalise } from "../lib";

const path = '../../assets/dataset/kc_house_data.csv';

type TensorLike2D = TypedArray | number[] | number[][] | boolean[] | boolean[][] | string[] | string[][] | Uint8Array[] | Uint8Array[][];

interface HouseSaleDataSet extends TensorContainerObject {
    price: number;
    sqft_living: number;
    bedrooms: number | string
}

const getClassIndex = (className: string | number): number => {
    if (className === 1 || className === '1') {
        return 0
    } else if (className === 2 || className === '2') {
        return 1
    } else {
        return 2
    }
}

const getClassName = (index: number): string | number => {
    if (index === 2) {
        return '3+'
    } else {
        return index + 1
    }
}

const plotClass = async (points: { x: number; y: number; class: number | string; }[], classKey: string, size: number = 0, equalizeClassSizes = false) => {
    const allSeries: Record<string, Point2D[]> = {}
    // add each class as series
    points.forEach((p) => {
        // add each point to the series for the class it is in
        const seriesName = `${classKey}:${p.class}`;
        let series = allSeries[seriesName]
        if (!series) {
            series = []
            allSeries[seriesName] = series
        }
        series.push(p)
    });

    if (equalizeClassSizes) {
        // find smallest class
        let maxLength: undefined | number = undefined
        Object.keys(allSeries).forEach(series => {
            if (maxLength === undefined || series.length < maxLength && series.length >= 100) {
                maxLength = series.length
            }
        })
        // limit each class to number of elements of smallest class
        // Object.keys(allSeries).forEach(key => {
        //     allSeries[key] = allSeries[key].slice(0, maxLength)
        //     if (allSeries[key].length < 100) {
        //         delete allSeries[key]
        //     }
        // })
    }

    tfvis.render.scatterplot(
        {
            name: `Square feet vs House Price`,
            styles: { width: `${size * 1.5}px` }
        },
        {
            values: Object.values(allSeries),
            series: Object.keys(allSeries)
        },
        {
            xLabel: 'Square feet',
            yLabel: 'Price',
            height: size * 1.5
        }
    )
}

const createModel = (): tf.LayersModel => {
    const model = tf.sequential();
    // input
    model.add(
        tf.layers.dense({
            units: 10,
            useBias: true, // 偏见 
            activation: 'sigmoid',
            inputDim: 2,
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
            units: 3,
            useBias: true, // 偏见 
            activation: 'softmax',
        }),
    );

    const optimizer = tf.train.adam()
    model.compile({
        loss: "categoricalCrossentropy",
        optimizer,
    });
    return model;
};

class BinaryModel {
    normaliseFeature?: Normalise
    normaliseLabel?: Normalise
    testingFeatureTensor?: tf.Tensor<tf.Rank>;
    testingLabelTensor?: tf.Tensor<tf.Rank>;
    model?: tf.LayersModel;
    points: { x: number; y: number; class: string; }[];
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
                class: Number(record.bedrooms) > 2 ? '3+' : `${record.bedrooms}`
            };
        }).filter(r => Number(r.class) !== 0);
        this.points = await pointsDataSet.toArray();

        if (this.points.length % 2 !== 0) {
            // 如果张量是奇数，会导致无法平均分割，需要变成偶数
            this.points.pop();
        }
        tf.util.shuffle(this.points);
        plotClass(this.points, 'Bedrooms', 800, true);
        // Feature (inputs) 提取特征并存在张量中
        const featureValue = this.points.map((p) => [p.x, p.y]);
        const featureTensor = tf.tensor2d(featureValue);
        // Labels (outputs) 对标签做同样的操作
        const labelValue = this.points.map((p) => getClassIndex(p.class));
        const labelTensor = tf.tidy(() => tf.oneHot(tf.tensor1d(labelValue, 'int32'), 3))
        // 标准化标签和特征
        this.normaliseFeature = normalise(featureTensor);
        this.normaliseLabel = normalise(labelTensor);
        featureTensor.dispose()
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
            await this.plotPredictionHotMap()
            // 更新 layer
            const layer = this.model.getLayer('', 0);
            tfvis.show.layer({ name: 'Layer 1' }, layer);
        }
        // 训练模型
        const result = await trainModel(
            this.model,
            trainingFeatureTensor,
            trainingLabelTensor,
            onEpochBegin
        );


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
        storageID: string = 'kc-house-price-multi',
    ): Promise<void> => {
        const saveResults = await this.model?.save(`localstorage://${storageID}`);
        console.log(
            'save model success, current time is:',
            saveResults?.modelArtifactsInfo.dateSaved,
        );
    };
    loadModel = async (
        storageID: string = 'kc-house-price-multi',
    ): Promise<void> => {
        const storageKey = `localstorage://${storageID}`;
        const models = await tf.io.listModels();
        const modelInfo = models[storageKey];
        if (modelInfo) {
            this.model = await tf.loadLayersModel(storageKey);
            this.model.summary();
            tfvis.show.modelSummary({ name: 'Modal summary' }, this.model);
            await this.plotPredictionHotMap()
            // 更新 layer
            const layer = this.model.getLayer('', 0);
            tfvis.show.layer({ name: 'Layer 1' }, layer);

            console.log('load model success');
        } else {
            console.log('no model', storageID);
        }
    };
    predict = async (square: number, price: number): Promise<void> => {
        tf.tidy(() => {
            if (!this.normaliseLabel || !this.normaliseFeature) return;
            const inputTensor = tf.tensor2d([[square, price]]);
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
                outputValue && outputValue * 100,
            );
        });
    };
    plotPredictionHotMap = async (name = 'Predict class', size = 400) => {
        const [valuesPromise, xTicksTensor, yTicksTensor] = tf.tidy(() => {
            const gridSize = 50;
            const predictionColumns: tf.Tensor<tf.Rank>[] = []
            for (let colIndex = 0; colIndex < gridSize; colIndex++) {
                const colInputs = []
                const x = colIndex / gridSize
                for (let rowIndex = 0; rowIndex < gridSize; rowIndex++) {
                    const y = (gridSize - rowIndex) / gridSize
                    colInputs.push([x, y])
                }
                const colPredictions = this.model.predict(tf.tensor2d(colInputs)) as tf.Tensor<tf.Rank>
                predictionColumns.push(colPredictions)
            }
            const valuesTensor = tf.stack(predictionColumns)
            const normalisedTickTensor = tf.linspace(0, 1, gridSize)
            const [xF, yF] = Array.isArray(this.normaliseFeature.max) ? this.normaliseFeature.max : []
            const [xM, yM] = Array.isArray(this.normaliseFeature.min) ? this.normaliseFeature.min : []
            const xTicksTensor = denormalise(normalisedTickTensor, xF, xM)
            const yTicksTensor = denormalise(normalisedTickTensor.reverse(), yF, yM)
            return [valuesTensor, xTicksTensor, yTicksTensor]
        })
        const values = await valuesPromise.arraySync()
        const xTicks = await xTicksTensor.arraySync() as number[]
        const yTicks = await yTicksTensor.arraySync() as number[]
        const xTicksLabel = Array.isArray(xTicks) ? xTicks.map((v: number) => (v / 1000).toFixed(1) + "k sqft") : []
        const yTicksLabel = Array.isArray(yTicks) ? yTicks.map((v: number) => `$${(v / 1000).toFixed(0)}k`) : []

        tf.unstack(values, 2).forEach((values:tf.Tensor2D, i) => {
            const data = {
                values: values,
                xTicksLabel,
                yTicksLabel
            }
            tfvis.render.heatmap({
                name: `Bedrooms:${getClassName(i)} local`,
                tab: 'Predictions'
            }, data, {
                height: size,
                domain: [0, 1]
            })
            tfvis.render.heatmap({
                name: `Bedrooms:${getClassName(i)} full domain`,
                tab: 'Predictions'
            }, data, {
                height: size,
                domain: [0, 1]
            })
        })

    }
    /**
     * @description: 设置权重和偏见
     * @param {TensorLike2D} weight
     * @param {TensorLike2D} bias
     * @return {*}
     */
    plotParams = async (weight: TensorLike2D, bias: TensorLike2D): Promise<void> => {
        this.model.getLayer(null, 0).setWeights([
            tf.tensor2d(weight),
            tf.tensor2d(bias)
        ])
        // 更新 layer
        const layer = this.model.getLayer('', 0);
        tfvis.show.layer({ name: 'Layer 1' }, layer);
    }
    openTfvis = (): void => {
        tfvis.visor().toggle();
    };
}

const { loadData, train, test, save, loadModel, predict, openTfvis } =
    new BinaryModel();

export const Binary = (): JSX.Element => {
    const [square, setSquare] = useState('');
    const [price, setPrice] = useState('');

    const memory = tfMemory();
    const changeSquare = (e: { target: { value: React.SetStateAction<string> } }) => {
        setSquare(e.target.value);
    };
    const changePrice = (e: { target: { value: React.SetStateAction<string> } }) => {
        setPrice(e.target.value);
    };
    const predictOut = () => {
        const num = Number(square);
        const priceNum = Number(price)
        if (Object.is(num, NaN)) {
            return message.warning('please input square');
        }
        if (Object.is(priceNum, NaN)) {
            return message.warning('please input price');
        }
        predict(num, priceNum);
    };
    return (
        <div>
            <h1>Binary Model</h1>
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
            <Input label="Square feet of living space" onChange={changeSquare} placeholder="2000" value="2000" />
            <Input label="House price" onChange={changePrice} placeholder="1000000" value="1000000" />
            <button onClick={predictOut}>input number to predict result</button>
            <h2>打开tfvis视图</h2>
            <button onClick={openTfvis}>openTfvis</button>
        </div>
    );
};
