const { getLogger } = require('../core/logging');

let TRANSACTIONS = [{id: 1, user: 'Benjamin', amount: 100, place: 'Irish Pub', date: '2021-08-15' }];

const getAll = () => {
  return TRANSACTIONS;
}

const getById = (id) => {  throw new Error("not implemented yet"); }

const create = ({amount, date, place, user}) => {
  const maxId = Math.max(...TRANSACTIONS.map(i => i.id));
  const newTransaction = {id: maxId+1, amount, date, place, user};
  TRANSACTIONS = [...TRANSACTIONS, newTransaction];
  return newTransaction;
}

const updateById = (id, {amount, date, place, user}) => {
  throw new Error("not implemented yet");
}

const deleteById = (id) => {
  throw new Error("not implemented yet");
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
