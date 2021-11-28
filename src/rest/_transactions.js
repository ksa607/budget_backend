const Joi = require('joi');
const Router = require('@koa/router');
const transactionService = require('../service/transaction');
const validate = require('./_validation.js');

const getAllTransactions = async (ctx) => {
	ctx.body = await transactionService.getAll();
};
getAllTransactions.validationScheme = {
	query: Joi.object({
		limit: Joi.number().positive().max(1000).optional(),
		offset: Joi.number().min(0).optional(),
	}).and('limit', 'offset'),
 };

const createTransaction = async (ctx) => {
	const newTransaction = await transactionService.create({
		...ctx.request.body,
		placeId: new Date(ctx.request.body.placeId),
		date: new Date(ctx.request.body.date),
	});
	ctx.body = newTransaction;
	ctx.status=201;
};
createTransaction.validationScheme = {
	body: {
		amount: Joi.number().invalid(0),
		date: Joi.date().iso().less('now'),
		placeId: Joi.number().integer().positive(),
		user: Joi.string(),
  },
};

const getTransactionById = async (ctx) => {
	ctx.body = await transactionService.getById(ctx.params.id);
};
getTransactionById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateTransaction = async (ctx) => {
	ctx.body = await transactionService.updateById(ctx.params.id, {
		...ctx.request.body,
		placeId: new Date(ctx.request.body.placeId),
		date: new Date(ctx.request.body.date),
	});
};
updateTransaction.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    amount: Joi.number().invalid(0),
    date: Joi.date().iso().less('now'),
    placeId: Joi.number().integer().positive(),
    user: Joi.string(),
  },
};

const deleteTransaction = async (ctx) => {
	await transactionService.deleteById(ctx.params.id);
	ctx.status = 204;
};
deleteTransaction.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/transactions',
	});

	router.get('/', validate(getAllTransactions.validationScheme), getAllTransactions);
	router.post('/', validate(createTransaction.validationScheme), createTransaction);
	router.get('/:id', validate(getTransactionById.validationScheme), getTransactionById);
	router.put('/:id', validate(updateTransaction.validationScheme), updateTransaction);
	router.delete('/:id', validate(deleteTransaction.validationScheme), deleteTransaction);

	app.use(router.routes()).use(router.allowedMethods());
};
