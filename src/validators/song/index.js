const { ClientError } = require("@/exceptions");
const { songPayloadSchema, songFilterSchema } = require("./schema");

class SongValidator {
  /** @param {import("@/models/song").SongRequest} payload */
  validateSongPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = songPayloadSchema.validateSync(payload);
    return value;
  }

  validateSongFilter(query) {
    const value = songFilterSchema.validateSync(query, { stripUnknown: true });
    return value;
  }
}

module.exports = SongValidator;
