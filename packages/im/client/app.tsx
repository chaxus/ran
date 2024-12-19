import type { JSX } from 'react';
import React, { createContext, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '@/client/router';
import '@/client/assets/base.css';

const Context = createContext({});

const { Provider } = Context;

const Noop = () => <></>;

function RoutesContent(): JSX.Element {
  return useRoutes(routes) || <Noop />;
}

const App = (): JSX.Element => {
  const [state, setState] = useState({});
  return (
    <Provider value={{ state, setState }}>
      <RoutesContent />
    </Provider>
  );
};

export default App;
