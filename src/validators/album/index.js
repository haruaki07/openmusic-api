const { ClientError } = require("@/exceptions");
const { albumPayloadSchema, albumCoverContentTypeSchema } = require("./schema");

class AlbumValidator {
  /** @param {import("@/models/album").AlbumRequest} payload */
  validateAlbumPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = albumPayloadSchema.validateSync(payload);
    return value;
  }

  /** @param {string} payload */
  validateCoverContentType(payload) {
    return albumCoverContentTypeSchema.validateSync(payload);
  }
}

module.exports = AlbumValidator;
