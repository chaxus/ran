import { Suspense, lazy, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Loading } from '@/components/Loading/index';

export interface Redirect {
  (param: { to: string; replace?: boolean; state?: object }): null;
}

const page = (component: string) => {
  const Element = lazy(() => import(`../pages/${component}/index.tsx`));

  return (
    <Suspense fallback={<Loading />}>
      <Element />
    </Suspense>
  );
};

const Redirect: Redirect = ({ to, replace, state }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace, state });
  });

  return null;
};


export const Routes = (): ReactElement | null => {
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
      path: '/loading',
      element: <Loading />,
    },
  ];
  const routes = [...defaultRoute];
  return useRoutes(routes)
}


