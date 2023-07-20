const { ClientError } = require("@/exceptions");
const { collabPayloadSchema } = require("./schema");

class CollabValidator {
  /** @param {import("@/models/collab").CollabRequest} payload */
  validateCollabPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = collabPayloadSchema.validateSync(payload);
    return value;
  }
}

module.exports = CollabValidator;
