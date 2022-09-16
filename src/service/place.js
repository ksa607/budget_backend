const { getLogger } = require('../core/logging');
const placeRepository = require('../repository/place');

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

/**
 * Get all places.
 */
const getAll = async () => {
  debugLog('Fetching all places');
  const items = await placeRepository.findAll();
  const count = await placeRepository.findCount();
  return { items, count };
};

/**
 * Get the place with the given `id`.
 *
 * @param {string} id - Id of the place to get.
 */
const getById = (id) => {
  debugLog(`Fetching place with id ${id}`);
  return placeRepository.findById(id);
};

/**
 * Create a new place.
 *
 * @param {object} place - Place to create.
 * @param {string} place.name - Name of the place.
 * @param {number} [place.rating] - Rating of the place (between 1 and 5).
 */
const create = async ({ name, rating }) => {
  const newPlace = { name, rating };
  debugLog('Creating new place', newPlace);
  const id = await placeRepository.create(newPlace);
  return getById(id);
};

/**
 * Update an existing place.
 *
 * @param {string} id - Id of the place to update.
 * @param {object} place - Place to save.
 * @param {string} [place.name] - Name of the place.
 * @param {number} [place.rating] - Rating of the place (between 1 and 5).
 */
const updateById = async (id, { name, rating }) => {
  const updatedPlace = { name, rating };
  debugLog(`Updating place with id ${id}`, updatedPlace);
  await placeRepository.updateById(id, updatedPlace);
  return getById(id);
};

/**
 * Delete an existing place.
 *
 * @param {string} id - Id of the place to delete.
 */
const deleteById = async (id) => {
  debugLog(`Deleting place with id ${id}`);
  await placeRepository.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
