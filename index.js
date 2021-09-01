const Koa = require('koa');
const winston = require('winston');

const app = new Koa();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console({silent: false})
  ]
});

app.use(async (ctx, next) => {
  ctx.body = 'Goodbye world';
  next();
});

logger.info(`🚀 Server listening on http://localhost:9000`);
app.listen(9000);
