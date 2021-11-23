const { withServer } = require('../helpers');
const { tables } = require('../../src/data');

const data = {
  transactions: [{
      id: 1,
      user_id: 1,
      place_id: 10,
      amount: 3500,
      date: new Date(2021, 4, 25, 19, 40),
    },
    {
      id: 2,
      user_id: 1,
      place_id: 10,
      amount: -220,
      date: new Date(2021, 4, 8, 20, 0),
    },
    {
      id: 3,
      user_id: 1,
      place_id: 10,
      amount: -74,
      date: new Date(2021, 4, 21, 14, 30),
    },
  ],
  places: [{
    id: 10,
    name: 'Test place',
    rating: 3,
  }],
  users: [{
    id: 1,
    name: 'Test User'
  }]
};

const dataToDelete = {
  transactions: [
    1,
    2,
    3,
  ],
  places: [10],
  users: [1]
};

describe('Transactions', () => {
  let request;
  let knex;

  withServer(({ knex: k, request: r }) => {
    knex = k;
    request = r;
  });

  const url = '/api/transactions';

  describe('GET /api/transactions', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.place).insert(data.places);
      await knex(tables.transaction).insert(data.transactions);
    });

    afterAll(async () => {
      await knex(tables.transaction)
        .whereIn('id', dataToDelete.transactions)
        .delete();

      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();

      await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });

    test('it should 200 and return all transactions', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(3);
    });
  });

  describe('GET /api/transactions/:id', () => {

    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.place).insert(data.places);
      await knex(tables.transaction).insert(data.transactions[0]);
    });

    afterAll(async () => {
      await knex(tables.transaction)
        .where('id', dataToDelete.transactions[0])
        .delete();

      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();

      await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });

    test('it should 200 and return the requested transaction', async () => {
      const transactionId = data.transactions[0].id;
      const response = await request.get(`${url}/${transactionId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: transactionId,
        user: {
          id: 1,
          name: 'Test User',
        },
        place: {
          id: 10,
          name: 'Test place',
        },
        amount: 3500,
        date: new Date(2021, 4, 25, 19, 40).toJSON(),
      });
    });
  })

  describe('POST /api/transactions', () => {

    const transactionsToDelete = [];
    const usersToDelete = [];

    beforeAll(async () => {
      await knex(tables.place).insert(data.places);
    });

    afterAll(async () => {
      await knex(tables.transaction)
        .whereIn('id', transactionsToDelete)
        .delete();

      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();
      
      await knex(tables.user)
        .whereIn('id', usersToDelete)
        .delete();
    });

    test('it should 201 and return the created transaction', async () => {
      const response = await request.post(url)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 10,
          user: 'Test User'
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.amount).toBe(102);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: 10,
        name: 'Test place',
      });
      expect(response.body.user.id).toBeTruthy();
      expect(response.body.user.name).toBe('Test User');

      transactionsToDelete.push(response.body.id);
      usersToDelete.push(response.body.user.id);
    });
  });

  describe('PUT /api/transactions/:id', () => {
    const usersToDelete = [];

    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.place).insert(data.places);
      await knex(tables.transaction).insert([{
        id: 4,
        amount: 102,
        date: new Date(2021, 4, 25, 19, 40),
        place_id: 10,
        user_id: 1,
      }]);
    });

    afterAll(async () => {
      await knex(tables.transaction)
        .where('id', 4)
        .delete();

      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();

      await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });

    test('it should 200 and return the updated transaction', async () => {
      const response = await request.put(`${url}/4`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 10,
          user: 'Test User'
        });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.amount).toBe(-125);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: 10,
        name: 'Test place',
      });
      expect(response.body.user.name).toEqual('Test User');

      usersToDelete.push(response.body.user.id);
    });
  });


  describe('DELETE /api/transactions/:id', () => {

    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
      await knex(tables.place).insert(data.places);

      await knex(tables.transaction).insert([{
        id: 4,
        amount: 102,
        date: new Date(2021, 4, 25, 19, 40),
        place_id: 10,
        user_id: 1,
      }]);
    });

    afterAll(async () => {
      await knex(tables.place)
        .whereIn('id', dataToDelete.places)
        .delete();

      await knex(tables.user)
        .whereIn('id', dataToDelete.users)
        .delete();
    });

    test('it should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/4`);
      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});