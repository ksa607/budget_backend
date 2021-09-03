const Koa = require('koa');
const config = require('config');
const { getLogger } = require('./core/logging')

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`)

const app = new Koa();
const logger = getLogger();


app.use(async (ctx, next) => {
  logger.info(JSON.stringify(ctx.request));
  if (ctx.request.method === 'GET' && ctx.request.url === "/api/transactions") {
    ctx.body = "[{'user': 'Benjamin', 'amount': 100, 'place': 'Irish Pub', date: '2021-08-15' }]";
  } else {
    ctx.body = 'Goodbye world';
  }
  next();
});

logger.info(`🚀 Server listening on http://localhost:9000`);
app.listen(9000);
