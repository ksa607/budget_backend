const Koa = require('koa');
const Router = require('@koa/router');
const config = require('config');
const { getLogger } = require('./core/logging');
const bodyParser = require('koa-bodyparser');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`)

const app = new Koa();
const logger = getLogger();


app.use(bodyParser());

const router = new Router();

router.get('/api/transactions', async (ctx) => {
  logger.info(JSON.stringify(ctx.request));
  ctx.body = "[{'user': 'Benjamin', 'amount': 100, 'place': 'Irish Pub', date: '2021-08-15' }]";
})

app
  .use(router.routes())
  .use(router.allowedMethods());

logger.info(`🚀 Server listening on http://localhost:9000`);
app.listen(9000);
