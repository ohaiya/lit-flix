import { createBrowserRouter, Navigate } from 'react-router-dom';
import FrontendLayout from '../components/frontend/Layout';
import AdminLayout from '../components/admin/AdminLayout';
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import FrontendBooks from '../pages/frontend/Books';
import FrontendMovies from '../pages/frontend/Movies';
import Books from '../pages/admin/Books';
import Movies from '../pages/admin/Movies';
import request from '../utils/request';

// 前台页面
const Home = () => <div>首页</div>;

// 后台路由的 loader
const adminLoader = async () => {
  try {
    await request.get('/auth/me');
    return null;
  } catch (error) {
    throw new Response('Unauthorized', { status: 401 });
  }
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'books',
        element: <FrontendBooks />,
      },
      {
        path: 'movies',
        element: <FrontendMovies />,
      },
    ],
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: '/admin',
    loader: adminLoader,
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'books',
        element: <Books />
      },
      {
        path: 'movies',
        element: <Movies />
      }
    ],
  },
]);

export default router; 