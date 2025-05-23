import { Layout, Menu } from 'tdesign-react';
import { BookIcon, VideoIcon, HomeIcon, LogoutIcon } from 'tdesign-icons-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './AdminLayout.less';

const { Header, Content, Aside } = Layout;
const { MenuItem } = Menu;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState(() => {
    const path = location.pathname.split('/').pop();
    return path === 'admin' || !path ? 'dashboard' : path;
  });

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setActiveMenu(path === 'admin' || !path ? 'dashboard' : path);
  }, [location.pathname]);

  const handleMenuClick = (value) => {
    setActiveMenu(value);
    navigate(`/admin/${value}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout className="admin-layout">
      <Aside>
        <div className="logo">LitFlix Admin</div>
        <Menu theme="dark" value={activeMenu} onChange={handleMenuClick}>
          <MenuItem value="dashboard" icon={<HomeIcon />}>
            仪表盘
          </MenuItem>
          <MenuItem value="books" icon={<BookIcon />}>
            书籍管理
          </MenuItem>
          <MenuItem value="movies" icon={<VideoIcon />}>
            影视管理
          </MenuItem>
        </Menu>
      </Aside>
      <Layout>
        <Header>
          <div className="header-right">
            <div className="menu-item" onClick={() => navigate('/')}>
              <HomeIcon />
              <span>首页</span>
            </div>
            <div className="menu-item" onClick={handleLogout}>
              <LogoutIcon />
              <span>退出登录</span>
            </div>
          </div>
        </Header>
        <Content>
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 