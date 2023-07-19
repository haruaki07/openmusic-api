const { ClientError } = require("@/exceptions");
const { userPayloadSchema } = require("./schema");

class UserValidator {
  /** @param {import("@/models/user").UserRequest} payload */
  validateUserPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = userPayloadSchema.validateSync(payload);
    return value;
  }
}

module.exports = UserValidator;
