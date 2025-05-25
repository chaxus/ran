import React from 'react';
import { createRoot } from 'react-dom/client';
import * as tf from '@tensorflow/tfjs';
import { Emotion } from './components/Emotion';

export const App = (): React.JSX.Element => {
  return (
    <div>
      <h1>tf version:</h1>
      <div>{JSON.stringify(tf.version)}</div>
      <h2>tf backend:</h2>
      <div>{JSON.stringify(tf.getBackend())}</div>
      <h2>tf memory</h2>
      <div>{JSON.stringify(tf.memory())}</div>
      <h3>tensor number in memory</h3>
      <div>{JSON.stringify(tf.memory().numTensors)}</div>
      {/* <LineModelComponent />*/}
      {<Emotion />}
      {/* <Multi /> */}
    </div>
  );
};

const container = document.getElementById('app')!;

const root = createRoot(container);

root.render(
  <>
    <App />
  </>,
);
