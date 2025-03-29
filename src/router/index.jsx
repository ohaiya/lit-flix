import { createBrowserRouter } from 'react-router-dom';
import FrontendLayout from '../components/frontend/Layout';
import AdminLayout from '../components/admin/AdminLayout';
import Login from '../pages/admin/Login';
import Dashboard from '../pages/admin/Dashboard';
import FrontendBooks from '../pages/frontend/Books';
import Movies from '../pages/frontend/Movies';
import Books from '../pages/admin/Books';

// 前台页面
const Home = () => <div>首页</div>;


// 后台页面
const AdminMovies = () => <div>影视管理</div>;

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
        element: <Movies />,
      },
    ],
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [

      {
        path: '',
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
            element: <AdminMovies />
          }
        ]
      }
    ],
  },
]);

export default router; 