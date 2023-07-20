const { ClientError } = require("@/exceptions");
const {
  playlistPayloadSchema,
  playlistSongPayloadSchema
} = require("./schema");

class PlaylistValidator {
  /** @param {import("@/models/playlist").PlaylistRequest} payload */
  validatePlaylistPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = playlistPayloadSchema.validateSync(payload);
    return value;
  }

  validatePlaylistSongPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    return playlistSongPayloadSchema.validateSync(payload);
  }
}

module.exports = PlaylistValidator;
