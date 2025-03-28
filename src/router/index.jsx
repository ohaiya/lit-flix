import { createBrowserRouter, Outlet } from 'react-router-dom';
import FrontendLayout from '../components/frontend/Layout';
import AdminLogin from '../pages/admin/Login';
import Books from '../pages/frontend/Books';
import Movies from '../pages/frontend/Movies';
// 前台页面
const Home = () => <div>首页</div>;


// 后台页面
const AdminLayout = () => (
  <div>
    <Outlet />
  </div>
);

const AdminDashboard = () => <div>后台仪表盘</div>;
const AdminBooks = () => <div>书籍管理</div>;
const AdminMovies = () => <div>影视管理</div>;

export const router = createBrowserRouter([
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
        element: <Books />,
      },
      {
        path: 'movies',
        element: <Movies />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'login',
        element: <AdminLogin />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'books',
        element: <AdminBooks />,
      },
      {
        path: 'movies',
        element: <AdminMovies />,
      },
    ],
  },
]); 