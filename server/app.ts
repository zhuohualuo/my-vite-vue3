import Koa, { DefaultContext, DefaultState, Context } from 'Koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';

import router from './routes';
import { logger } from './logger';

// 初始化 Koa 应用实例
const app: Koa<DefaultState, DefaultContext> = new Koa();

// 注册中间件
app.use(logger());
app.use(cors());
app.use(bodyParser());

// 响应用户请求
// app.use(async (ctx: Context) => {
//   ctx.body = '<h1>Hello Koa</h1>';
// });
app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx) => {
  ctx.body = 'Hello World';
});

app.listen(3000, () => {
  console.log('服务启动成功，running http://127.0.0.1:3000');
});
