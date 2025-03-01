import React, { useCallback, useEffect } from 'react';
import { Routes } from './router/index';
import 'ranui/button';
import { closeDB, initDB, resumeDB } from '@/store';

export const App = (): React.JSX.Element => {
  const onVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      console.log('Page is visible');
      resumeDB();
    } else {
      console.log('Page is hidden');
    }
  }, []);
  useEffect(() => {
    initDB();
    document.addEventListener('visibilitychange', onVisibilityChange, false);
    return () => {
      closeDB();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);
  return (
    <div className="w-full h-full">
      <Routes />
    </div>
  );
};
