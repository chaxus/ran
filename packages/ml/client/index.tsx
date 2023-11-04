import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis'
import type { Point2D } from '@tensorflow/tfjs-vis';
import type { TensorContainerObject } from '@tensorflow/tfjs';
const csv = '../assets/dataset/kc_house_data.csv'

interface HouseSaleDataSet extends TensorContainerObject {
  price: number,
  sqft_living: number
}

const tfTensor = async () => {
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
  const houseSaleDateSet = tf.data.csv(csv)
  houseSaleDateSet.take(10).toArray().then(res => {
    console.log('a', res);
  })
  const points = houseSaleDateSet.map((record: HouseSaleDataSet) => {
    return {
      x: record.sqft_living,
      y: record.price
    }
  })
  points.toArray().then((res: Point2D[]) => {
    plot(res, 'Square feet')
    console.log('points', res);
  })
  // Feature (inputs)
  const featureValue = await points.map(p => p.x).toArray()
  const featureTensor = tf.tensor2d(featureValue, [featureValue.length, 1])
  // Labels (outputs)
  const labelValue = await points.map(p => p.y).toArray()
  const labelTensor = tf.tensor2d(labelValue, [labelValue.length, 1])

  featureTensor.print()
  labelTensor.print()
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
