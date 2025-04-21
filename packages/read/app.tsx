import React, { useCallback, useEffect } from 'react';
import { Routes } from './router/index';
import { closeDB, initDB, resumeDB } from './store';
import 'ranui/button';
import './styles/view-transition.scss';
import '@khmyznikov/pwa-install';

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
      <pwa-install
        manifest-url="/manifest.json"
        name="weread"
        description="Progressive web application"
        icon="/read.svg"
      ></pwa-install>
      <Routes />
    </div>
  );
};
