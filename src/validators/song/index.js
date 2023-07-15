const { ClientError } = require("../../exceptions");
const { songPayloadSchema } = require("./schema");

class SongValidator {
  /** @param {import("../../models/song").SongRequest} payload */
  validateSongPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = songPayloadSchema.validateSync(payload);
    return value;
  }
}

module.exports = SongValidator;
