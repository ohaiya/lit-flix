import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LitFlix API Documentation',
      version: '1.0.0',
      description: 'LitFlix API 文档',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '开发服务器',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token 认证'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // 指定 API 路由文件的位置
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options); 