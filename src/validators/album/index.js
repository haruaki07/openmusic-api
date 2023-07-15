const { ClientError } = require("../../exceptions");
const { AlbumRequest } = require("../../models/album");
const { albumPayloadSchema } = require("./schema");

class AlbumValidator {
  /** @param {AlbumRequest} payload */
  validateAlbumPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = albumPayloadSchema.validateSync(payload);
    return value;
  }
}

module.exports = AlbumValidator;
