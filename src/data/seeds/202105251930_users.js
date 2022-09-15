const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    await knex(tables.user).insert([
      {
        id: 1,
        name: 'Thomas Aelbrecht',
      },
      {
        id: 2,
        name: 'Pieter Van Der Helst',
      },
      {
        id: 3,
        name: 'Karine Samyn',
      },
    ]);
  },
};
