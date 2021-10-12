const { getLogger } = require('../core/logging');
const userRepository = require('../repository/user');

/**
 * Register a new user
 *
 * @param {object} user - The user's data.
 * @param {string} user.name - The user's name.
 */
const register = ({
  name,
}) => {
  getLogger().debug('Creating a new user', { name });
  return userRepository.create({
    name,
  });
};

module.exports = {
  register,
};
