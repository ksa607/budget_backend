const Joi = require('joi');
const Router = require('@koa/router');

const userService = require('../service/user');

const validate = require('./_validation');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Represents a user in the system
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *             - email
 *           properties:
 *             name:
 *               type: "string"
 *             email:
 *               type: "string"
 *               format: email
 *           example:
 *             $ref: "#/components/examples/User"
 *     UsersList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *   examples:
 *     User:
 *       id: 123
 *       name: "Thomas Aelbecht"
 *       email: "thomas.aelbrecht@hogent.be"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersList"
 */
const getAllUsers = async (ctx) => {
  const users = await userService.getAll();
  ctx.body = users;
};
getAllUsers.validationScheme = null;

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       403:
 *         description: You can only request your own information unless you're an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: No user with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const getUserById = async (ctx) => {
  const user = await userService.getById(ctx.params.id);
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       403:
 *         description: You can only update your own information unless you're an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: No user with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const updateUserById = async (ctx) => {
  const user = await userService.updateById(ctx.params.id, ctx.request.body);
  ctx.body = user;
};
updateUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    name: Joi.string().max(255),
  },
};

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *      - Users
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       204:
 *         description: No response, the delete was successful
 *       403:
 *         description: You can only update your own information unless you're an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/403Forbidden'
 *       404:
 *         description: No user with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const deleteUserById = async (ctx) => {
  await userService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install user routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });

  router.get('/', validate(getAllUsers.validationScheme), getAllUsers);
  router.get('/:id', validate(getUserById.validationScheme), getUserById);
  router.put('/:id', validate(updateUserById.validationScheme), updateUserById);
  router.delete('/:id', validate(deleteUserById.validationScheme), deleteUserById);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};