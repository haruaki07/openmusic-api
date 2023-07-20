const { ClientError } = require("@/exceptions");
const { playlistPayloadSchema, playlistAddSongSchema } = require("./schema");

class PlaylistValidator {
  /** @param {import("@/models/playlist").PlaylistRequest} payload */
  validatePlaylistPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = playlistPayloadSchema.validateSync(payload);
    return value;
  }

  validateAddSongSchema(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    return playlistAddSongSchema.validateSync(payload);
  }
}

module.exports = PlaylistValidator;
