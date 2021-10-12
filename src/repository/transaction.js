const { tables, getKnex } = require('../data/index');
const { getLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  `${tables.transaction}.id`, 'amount', 'date',
  `${tables.place}.id as place_id`, `${tables.place}.name as place_name`,
  `${tables.user}.id as user_id`, `${tables.user}.name as user_name`,
];

const formatTransaction = ({ place_id, place_name, user_id, user_name, ...rest }) => ({
	...rest,
	place: {
		id: place_id,
		name: place_name,
	},
	user: {
		id: user_id,
		name: user_name,
	},
});


/**
 * Get all transactions.
 */
const findAll = async () => {
  const transactions = await getKnex()(tables.transaction)
    .select(SELECT_COLUMNS)
    .join(tables.place, `${tables.transaction}.place_id`, '=', `${tables.place}.id`)
    .join(tables.user, `${tables.transaction}.user_id`, '=', `${tables.user}.id`)
    .orderBy('date', 'ASC');

  return transactions.map(formatTransaction);
};

/**
 * Calculate the total number of transactions.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.transaction)
    .count();

  return count['count(*)'];
};

/**
 * Find a transaction with the given `id`.
 *
 * @param {number} id - Id of the transaction to find.
 */
const findById = async (id) => {
  const transaction = await getKnex()(tables.transaction)
    .first(SELECT_COLUMNS)
    .where(`${tables.transaction}.id`, id)
    .join(tables.place, `${tables.transaction}.place_id`, '=', `${tables.place}.id`)
    .join(tables.user, `${tables.transaction}.user_id`, '=', `${tables.user}.id`);
  
  return transaction && formatTransaction(transaction);
};

/**
 * Create a new transaction.
 *
 * @param {object} transaction - The transaction to create.
 * @param {number} transaction.amount - Amount deposited/withdrawn.
 * @param {Date} transaction.date - Date of the transaction.
 * @param {string} transaction.placeId - Id of the place the transaction happened.
 * @param {string} transaction.userId - Id of the user who did the transaction.
 *
 * @returns {Promise<number>} Created transaction's id
 */
const create = async ({
  amount,
  date,
  placeId,
  userId,
}) => {
  try {
    const [id] = await getKnex()(tables.transaction)
      .insert({
        amount,
        date,
        place_id: placeId,
        user_id: userId,
      });
    return id;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};

/**
 * Update an existing transaction.
 *
 * @param {number} id - Id of the transaction to update.
 * @param {object} transaction - The transaction data to save.
 * @param {number} [transaction.amount] - Amount deposited/withdrawn.
 * @param {Date} [transaction.date] - Date of the transaction.
 * @param {string} [transaction.placeId] - Id of the place the transaction happened.
 * @param {string} [transaction.userId] - Id of the user who did the transaction.
 *
 * @returns {Promise<number>} Updated transaction's id
 */
const updateById = async (id, {
  amount,
  date,
  placeId,
  userId,
}) => {
  try {
    await getKnex()(tables.transaction)
      .update({
        amount,
        date,
        place_id: placeId,
        user_id: userId,
      })
      .where(`${tables.transaction}.id`, id);
    return id;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a transaction with the given `id`.
 *
 * @param {number} id - Id of the transaction to delete.
 *
 * @returns {Promise<boolean>} Whether the transaction was deleted.
 */
const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.transaction)
      .delete()
      .where(`${tables.transaction}.id`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getLogger();
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findCount,
  findById,
  create,
  updateById,
  deleteById,
};
