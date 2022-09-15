const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries in every table
    await knex(tables.transaction).delete();
    await knex(tables.place).delete();
    await knex(tables.user).delete();
  },
};
