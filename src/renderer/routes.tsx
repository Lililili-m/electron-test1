import { RouteObject } from 'react-router-dom';
import ErrorPage from './components/ErrorPage/ErrorPage';

/**
 * 应用路由配置
 * 使用 useRoutes Hook 的路由定义
 */
const routes: RouteObject[] = [
  {
    path: '/',
    element: <ErrorPage />,
  },
];

export default routes;
