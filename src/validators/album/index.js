const { ClientError } = require("../../exceptions");
const { CreateAlbumRequest } = require("../../models/album");
const { albumPayloadSchema } = require("./schema");

class AlbumValidator {
  /** @param {CreateAlbumRequest} payload */
  validateAlbumPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = albumPayloadSchema.validateSync(payload);
    return value;
  }
}

module.exports = AlbumValidator;
