import { Suspense, lazy, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Loading } from '@/components/Loading/index';

export enum ROUTE_PATH {
  HOME = '/home',
  BOOK_DETAIL = '/book-detail',
  BOOK_DETAIL_ID = '/book-detail/:id',
  LOADING = '/loading',
}

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
      element: <Redirect to={ROUTE_PATH.HOME} />,
    },
    {
      path: ROUTE_PATH.HOME,
      element: page('home'),
    },
    {
      path: ROUTE_PATH.BOOK_DETAIL_ID,
      element: page('book-detail'),
    },
    {
      path: ROUTE_PATH.LOADING,
      element: <Loading />,
    },
  ];
  const routes = [...defaultRoute];
  return useRoutes(routes);
};
