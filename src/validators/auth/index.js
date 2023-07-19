const { ClientError } = require("@/exceptions");
const {
  loginPayloadSchema,
  refreshTokenPayloadSchema,
  deleteTokenPayloadSchema
} = require("./schema");

class AuthValidator {
  /** @param {import("@/models/auth").LoginRequest} payload */
  validateLoginPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = loginPayloadSchema.validateSync(payload);
    return value;
  }

  /** @param {import("@/models/auth").LoginRequest} payload */
  validateRefreshPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = refreshTokenPayloadSchema.validateSync(payload);
    return value;
  }

  /** @param {import("@/models/auth").LoginRequest} payload */
  validateDeletePayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = deleteTokenPayloadSchema.validateSync(payload);
    return value;
  }
}

module.exports = AuthValidator;
