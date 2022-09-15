const { getLogger } = require('../core/logging');
let { TRANSACTIONS, PLACES } = require('../data/mock-data');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getLogger();
	this.logger.debug(message, meta);
};

const getAll = () => {
	debugLog('Fetching all transactions');
	return { items: TRANSACTIONS, count: TRANSACTIONS.length };
};

const getById = (id) => {
	debugLog(`Fetching transaction with id ${id}`);
	return TRANSACTIONS.filter((transaction) => transaction.id === id)[0];
};

const create = ({ amount, date, placeId, user }) => {
	if (placeId) {
		const existingPlace = PLACES.find((place) => place.id === placeId);

		if (!existingPlace) {
			throw Error(`There is no place with id ${placeId}.`);
		}
	}

	if (typeof user === 'string') {
		user = {
			id: Math.floor(Math.random() * 100000),
			name: user
		};
	}

	const maxId = Math.max(...TRANSACTIONS.map((transaction) => transaction.id));
	const newTransaction = {
		id: maxId + 1,
		amount,
		date: date.toISOString(),
		place: PLACES.find((place) => place.id === placeId),
		user,
	};
	debugLog('Creating new transaction', newTransaction);
	TRANSACTIONS = [...TRANSACTIONS, newTransaction];
	return newTransaction;
};

const updateById = (id, { amount, date, placeId, userId }) => {
	debugLog(`Updating transaction with id ${id}`, {
		amount,
		date,
		placeId,
		userId,
	});

	if (placeId) {
		const existingPlace = PLACES.find((place) => place.id === placeId);

		if (!existingPlace) {
			throw Error(`There is no place with id ${placeId}.`);
		}
	}
	const index = TRANSACTIONS.findIndex((transaction) => transaction.id === id);

	if (index < 0) return null;

	const transaction = TRANSACTIONS[index];
	transaction.amount = amount;
	transaction.date = date.toISOString();
	transaction.place = PLACES.find((place) => place.id === placeId);
	if (userId) {
		transaction.user = userId;
	}

	return transaction;
};

const deleteById = (id) => {
	debugLog(`Deleting transaction with id ${id}`);
	TRANSACTIONS = TRANSACTIONS.filter((transaction) => transaction.id !== id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
