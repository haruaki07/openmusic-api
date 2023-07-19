const { ClientError } = require("@/exceptions");
const { playlistPayloadSchema } = require("./schema");

class PlaylistValidator {
  /** @param {import("@/models/playlist").PlaylistRequest} payload */
  validatePlaylistPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = playlistPayloadSchema.validateSync(payload);
    return value;
  }
}

module.exports = PlaylistValidator;
