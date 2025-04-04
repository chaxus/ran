import { Suspense, lazy, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import type { ReactElement } from 'react';
import { Loading } from '@/components/Loading/index';
import { Home } from '@/pages/home/index';
import { BookDetail } from '@/pages/book-detail/index';

export enum ROUTE_PATH {
  HOME = '/home',
  BOOK_DETAIL = '/book-detail',
  BOOK_DETAIL_ID = '/book-detail/:id',
  LOADING = '/loading',
}

export interface Redirect {
  (param: { to: string; replace?: boolean; state?: object }): null;
}

export const Page = ({ component }: { component: string }): ReactElement => {
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
      exact: true,
      element: <Redirect to={ROUTE_PATH.HOME} />,
    },
    {
      path: ROUTE_PATH.HOME,
      exact: true,
      element: <Home />,
    },
    {
      path: ROUTE_PATH.BOOK_DETAIL_ID,
      exact: true,
      element: <BookDetail />,
    },
    {
      path: ROUTE_PATH.LOADING,
      exact: true,
      element: <Loading />,
    },
  ];
  const routes = [...defaultRoute];
  return useRoutes(routes);
};
