import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 导入路由
import authRoutes from './routes/auth';
import movieRoutes from './routes/movie';
import bookRoutes from './routes/book';

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app = express();

// 中间件
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lit-flix')
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch((err) => {
    console.error('数据库连接失败:', err);
  });

// 路由
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to LitFlix API' });
});

// 认证路由
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/books', bookRoutes);

// 错误处理中间件
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: '服务器内部错误' });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
}); 