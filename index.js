const Koa = require('koa');
const { getLogger } = require('./src/core/logging')

const app = new Koa();
const logger = getLogger();


app.use(async (ctx, next) => {
  ctx.body = 'Goodbye world';
  next();
});

logger.info(`🚀 Server listening on http://localhost:9000`);
app.listen(9000);
