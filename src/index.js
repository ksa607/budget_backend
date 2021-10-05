const Koa = require('koa');
const Router = require('@koa/router');
const config = require('config');
const { getLogger } = require('./core/logging');
const transactionService = require('./service/transaction');
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
  ctx.body = transactionService.getAll();
});

router.post('/api/transactions', async (ctx) => {
  const newTransaction = transactionService.create({...ctx.request.body, date: new Date(ctx.request.body.date)});
  ctx.body = newTransaction;
});

router.get('/api/transactions/:id', async (ctx) => {
  ctx.body = transactionService.getById(Number(ctx.params.id));
});

router.put('/api/transactions/:id', async (ctx) => {
  ctx.body = transactionService.updateById(Number(ctx.params.id), {...ctx.request.body, date: new Date(ctx.request.body.date) });
});

router.delete('/api/transactions/:id', async (ctx) => {
  transactionService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
})

app
  .use(router.routes())
  .use(router.allowedMethods());

logger.info(`🚀 Server listening on http://localhost:9000`);
app.listen(9000);
