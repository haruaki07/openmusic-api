/** Auth entity */
class Auth {
  /** @type {string} */
  token;
}

class LoginRequest {
  /** @type {string} */
  username;

  /** @type {string} */
  password;
}

class AuthRequest {
  /** @type {string} */
  refreshToken;
}

module.exports = {
  Auth,
  LoginRequest,
  AuthRequest
};
