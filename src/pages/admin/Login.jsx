import { Form, Input, Button, MessagePlugin, Link } from 'tdesign-react';
import { LogoGithubIcon, UserIcon, LockOnIcon } from 'tdesign-icons-react';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';
import './Login.less';

const { FormItem } = Form;

const Login = () => {
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    if (e.validateResult === true) {
      try {
        const { username, password } = e.fields;
        const { token, username: adminUsername } = await request.post('/auth/login', {
          username,
          password
        });

        // 存储 token
        localStorage.setItem('token', token);
        MessagePlugin.success('登录成功');
        navigate('/admin');
      } catch (error) {
        // 错误已经在 request 拦截器中处理
        console.error('登录失败:', error);
      }
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
        <div className="admin-login__gradient-circle"></div>
        <div className="admin-login__logo">
          <span>LitFlix</span>
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