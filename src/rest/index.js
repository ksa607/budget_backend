const Router = require('@koa/router');
const installTransactionRouter = require('./_transactions');
const installHealthRouter = require('./_health');
const installPlaceRouter = require('./_places');
const installUserRouter = require('./_user');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/api',
	});

	installTransactionRouter(router);
	installPlaceRouter(router);
	installHealthRouter(router);
	installUserRouter(router);

	app.use(router.routes()).use(router.allowedMethods());
};
