import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Button } from 'tdesign-react';
import { 
  HomeIcon, 
  BookIcon, 
  VideoIcon, 
  SearchIcon, 
  UserIcon,
  MenuIcon,
  AppIcon,
  ViewModuleIcon
} from 'tdesign-icons-react';
import 'tdesign-react/es/style/index.css';
import './Layout.less';

const { HeadMenu, MenuItem } = Menu;

const FrontendLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const operations = () => (
    <div className="tdesign-demo-menu__operations--dark">
      <Button 
        variant="text" 
        shape="square" 
        icon={<SearchIcon className="operation-icon" />}
        className="operation-button"
      />
      <Button 
        variant="text" 
        shape="square" 
        icon={<UserIcon className="operation-icon" />}
        className="operation-button"
      />
    </div>
  );

  const Logo = () => (
    <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
      <span>LitFlix</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <HeadMenu
        theme="dark"
        value={location.pathname}
        onChange={(value) => navigate(value)}
        logo={<Logo />}
        operations={operations()}
      >
        <MenuItem value="/">
          <HomeIcon className="nav-icon" />
          <span>首页</span>
        </MenuItem>
        <MenuItem value="/books">
          <BookIcon className="nav-icon" />
          <span>书籍</span>
        </MenuItem>
        <MenuItem value="/movies">
          <VideoIcon className="nav-icon" />
          <span>影视</span>
        </MenuItem>
      </HeadMenu>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FrontendLayout; 