import React from 'react';
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import * as tf from '@tensorflow/tfjs'

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
  const result = model.predict(tf.tensor2d([5], [1, 1]))
  if (Array.isArray(result)) {
    result.forEach(item => item.print())
  } else {
    result.print()
  }
});

const App = () => {
  return (
    <div>
      <h2>tf version:</h2>
      <div>{JSON.stringify(tf.version)}</div>
    </div>
  );
};

const container = document.getElementById('app')!

const root = createRoot(container)

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
