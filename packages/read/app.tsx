import React from 'react';
import { Routes } from './router/index';
import 'ranui/button'

export const App = (): React.JSX.Element => {
  return (
    <div className='w-full h-full'>
      <Routes />
    </div>
  );
}
