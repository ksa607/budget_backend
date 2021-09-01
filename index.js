const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log(ctx);
  next();
});
app.use(async (ctx, next) => {
  ctx.body = 'Hello world';
  next();
});

app.use(async (ctx, next) => {
  console.log(ctx);
  next();
});
app.listen(9000);
