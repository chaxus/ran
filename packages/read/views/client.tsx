import { StaticRouter } from 'react-router-dom';
import { hydrateRoot } from 'react-dom/client';
import { App } from '../app';

const container = document.getElementById('app')!;

hydrateRoot(
  container,
  <StaticRouter location="/">
    <App />
  </StaticRouter>,
);
