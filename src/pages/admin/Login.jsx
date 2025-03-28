import { Form, Input, Button, MessagePlugin, Link } from 'tdesign-react';
import { LogoGithubIcon, UserIcon, LockOnIcon } from 'tdesign-icons-react';
import { useNavigate } from 'react-router-dom';
import './Login.less';

const { FormItem } = Form;

const Login = () => {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    if (e.validateResult === true) {
      MessagePlugin.success('登录成功');
    }
  };

  const onGithubLogin = () => {
    try {
      // TODO: 实现 GitHub 登录逻辑
      console.log('GitHub登录');
    } catch (error) {
      console.error('GitHub登录失败:', error);
    }
  };

  const onBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="admin-login">
      {/* 左侧区域 */}
      <div className="admin-login__left">
        <div className="admin-login__logo">
          <span>LitFlix</span>
        </div>
        <div className="admin-login__slogan">
          <h1>欢迎回来</h1>
          <p>登录以管理您的影视库</p>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="admin-login__right">
        <div className="admin-login__form">
          <h2>登录</h2>
          <Form onSubmit={onSubmit}>
            <FormItem name="username" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input placeholder="用户名" prefixIcon={<UserIcon />} />
            </FormItem>
            <FormItem name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input type="password" placeholder="密码" prefixIcon={<LockOnIcon />} />
            </FormItem>
            <FormItem>
              <Button theme="primary" type="submit" block>
                登录
              </Button>
            </FormItem>
            <div className="admin-login__divider">
              <span>或</span>
            </div>
            <FormItem>
              <Button theme="light" type="button" block onClick={onGithubLogin} className="admin-login__github-btn">
                <div className="admin-login__github-btn-text">
                  <LogoGithubIcon size="20px" />
                  <span>使用 GitHub 登录</span>
                </div>
              </Button>
            </FormItem>
            <div className="admin-login__back">
              <Link theme="primary" hover="color" onClick={onBackToHome}>
                返回首页
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login; 