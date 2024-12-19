import React, { Suspense, lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackDrop from '@/client/components/backdrop';
import Loading from '@/client/components/loading';

const page = (component: string) => {
  const Element = lazy(() => import(`../pages/${component}/index.tsx`));
  return (
    <Suspense fallback={<Loading />}>
      <Element />
    </Suspense>
  );
};
interface Redirect {
  (param: { to: string; replace?: boolean; state?: object }): null;
}

const Redirect: Redirect = ({ to, replace, state }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace, state });
  });

  return null;
};

const defaultRoute = [
  {
    path: '/',
    element: <Redirect to="/home" />,
  },
  {
    path: '/home',
    element: page('home'),
  },
  {
    path: '/back',
    element: <BackDrop />,
  },
  {
    path: '/loading',
    element: <Loading />,
  },
];

const routes = [...defaultRoute];
export default routes;
