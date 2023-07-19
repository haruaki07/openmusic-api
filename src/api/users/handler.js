/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

class UserHandler {
  /**
   * @param {import("@/services/user.service")} userService
   * @param {import("@/validators/user")} userValidator
   */
  constructor(userService, userValidator) {
    this._userService = userService;
    this._userValidator = userValidator;
  }

  /**
   * Menambahkan pengguna.
   *
   * @type {Handler}
   */
  store = async (req, h) => {
    const payload = this._userValidator.validateUserPayload(req.payload);

    const userId = await this._userService.insert(payload);

    const res = h.response({
      status: "success",
      data: { userId }
    });

    res.code(201);

    return res;
  };
}

module.exports = UserHandler;
