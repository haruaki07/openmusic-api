/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

const JWT = require("@/auth/jwt");

class AuthHandler {
  /**
   * @param {import("@/services/user.service")} userService
   * @param {import("@/services/auth.service")} authService
   * @param {import("@/validators/auth")} authValidator
   */
  constructor(userService, authService, authValidator) {
    this._userService = userService;
    this._authService = authService;
    this._authValidator = authValidator;
  }

  /**
   * Autentikasi/login pengguna.
   *
   * @type {Handler}
   */
  store = async (req, h) => {
    const payload = this._authValidator.validateLoginPayload(req.payload);

    const userId = await this._userService.verifyUserCredentials(
      payload.username,
      payload.password
    );

    const accessToken = JWT.createAccessToken({ userId });
    const refreshToken = JWT.createRefreshToken({ userId });

    await this._authService.addRefreshToken(refreshToken);

    const res = h.response({
      status: "success",
      data: { accessToken, refreshToken }
    });

    res.code(201);

    return res;
  };

  /**
   * Memperbarui access token.
   *
   * @type {Handler}
   */
  update = async (req, h) => {
    const { refreshToken } = this._authValidator.validateRefreshPayload(
      req.payload
    );

    const tokenPayload = JWT.verifyRefreshToken(refreshToken);

    await this._authService.verifyRefreshToken(refreshToken);

    const accessToken = JWT.createAccessToken({ userId: tokenPayload.userId });

    const res = h.response({
      status: "success",
      data: { accessToken }
    });
    res.code(200);

    return res;
  };

  /**
   * Menghapus autentikasi.
   *
   * @type {Handler}
   */
  destroy = async (req, h) => {
    const { refreshToken } = this._authValidator.validateDeletePayload(
      req.payload
    );

    await this._authService.verifyRefreshToken(refreshToken);
    await this._authService.deleteRefreshToken(refreshToken);

    const res = h.response({
      status: "success",
      message: "Refresh token berhasil dihapus!"
    });
    res.code(200);

    return res;
  };
}

module.exports = AuthHandler;
