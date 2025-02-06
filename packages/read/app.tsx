import React, { useEffect } from 'react';
import { Routes } from './router/index';
import 'ranui/button'
import { closeDB, initDB } from '@/store';

export const App = (): React.JSX.Element => {
  useEffect(() => {
    initDB()
    return () => {
      closeDB()
    }
  }, [])
  return (
    <div className='w-full h-full'>
      <Routes />
    </div>
  );
}
