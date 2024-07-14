// Import necessary modules from React and ReactDOM
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'ranui/button';
import 'ranui/loading';
import 'ranui/checkbox';
import 'ranui/icon';
import 'ranui/image';
import 'ranui/preview';
import 'ranui/math';
import 'ranui/tab';
import 'ranui/progress';
import 'ranui/player';
import 'ranui/message';

// Define a simple React component
const App = () => {
  return (
    <div>
      <h1>Hello, ranui in react</h1>
      <div>
        <r-math latex="x = {-b \pm \sqrt{b^2-4ac} \over 2a}."></r-math>
        <r-loading name="circle-line"></r-loading>
      </div>
    </div>
  );
};

// Get the root element from the HTML
const container = document.getElementById('react');

// Create a root using React 18's new createRoot method
const root = createRoot(container);

// Render the App component inside the root
root.render(<App />);
