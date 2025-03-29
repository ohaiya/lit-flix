import axios from 'axios';
import { MessagePlugin } from 'tdesign-react';

// 创建 axios 实例
const request = axios.create({
  baseURL: '/api',
  timeout: 5000
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    const { code, message, data } = response.data;
    
    // 请求成功
    if (code === 0) {
      return data;
    }
    
    // 请求失败
    MessagePlugin.error(message);
    return Promise.reject(new Error(message));
  },
  error => {
    if (error.response) {
      const { code, message } = error.response.data;
      
      switch (code) {
        case -1:
          MessagePlugin.error(message || '操作失败');
          break;
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/admin/login';
          break;
        case 403:
          MessagePlugin.error('没有权限访问');
          break;
        case 404:
          MessagePlugin.error('请求的资源不存在');
          break;
        case 400:
          MessagePlugin.error(message || '参数验证失败');
          break;
        default:
          MessagePlugin.error(message || '请求失败');
      }
    } else {
      MessagePlugin.error('网络错误，请稍后重试');
    }
    return Promise.reject(error);
  }
);

export default request; 