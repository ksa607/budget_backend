const { getLogger } = require('../core/logging');

let TRANSACTIONS = [{id: 1, user: 'Benjamin', amount: 100, place: 'Irish Pub', date: '2021-08-15' }];

const debugLog = (message, meta = {}) => {
  const logger = getLogger();
  logger.debug(message, meta);
}

const getAll = () => {
  debugLog('Fetching all transactions');
  return TRANSACTIONS;
};

const getById = (id) => {
  debugLog(`Fetching transaction with id ${id}`);
  return TRANSACTIONS.filter((transaction) => transaction.id === id)[0];
};

const create = ({ amount, date, place, user }) => {
  const maxId = Math.max(...TRANSACTIONS.map(i => i.id));
  const newTransaction = {id: maxId+1, amount, date, place, user};
  debugLog('Creating new transaction', newTransaction);
  TRANSACTIONS = [...TRANSACTIONS, newTransaction];
  return newTransaction;
};

const updateById = (id, { amount, date, place, user }) => {
  debugLog(`Updating transaction with id ${id}`, { amount, date, place, user });
  const index = TRANSACTIONS.findIndex((transaction) => transaction.id === id);

  if (index < 0) return null;

  const transaction = TRANSACTIONS[index];
  transaction.amount = amount;
  transaction.date = date;
  transaction.place = place;
  transaction.user = user;

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
}
