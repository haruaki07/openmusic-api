class User {
  /** @type {string} */
  id;

  /** @type {string} */
  username;

  /** @type {string} */
  password;

  /** @type {string} */
  fullname;

  /** @type {Date} */
  createdAt;

  /** @type {Date} */
  updatedAt;
}

class UserRequest {
  /** @type {string} */
  username;

  /** @type {string} */
  password;

  /** @type {string} */
  fullname;
}

module.exports = {
  User,
  UserRequest
};
