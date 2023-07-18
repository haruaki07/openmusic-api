const { ClientError } = require("../../exceptions");
const { albumPayloadSchema } = require("./schema");

class AlbumValidator {
  /** @param {import("../../models/album").AlbumRequest} payload */
  validateAlbumPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = albumPayloadSchema.validateSync(payload);
    return value;
  }
}

module.exports = AlbumValidator;
