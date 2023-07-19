/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

const { PlaylistRequest } = require("@/models/playlist");

class PlaylistHandler {
  /**
   * @param {import("@/services/playlist.service")} playlistService
   * @param {import("@/validators/playlist")} playlistValidator
   */
  constructor(playlistService, playlistValidator) {
    this._playlistService = playlistService;
    this._playlistValidator = playlistValidator;
  }

  /**
   * Menambahkan playlist.
   *
   * @type {Handler}
   */
  store = async (req, h) => {
    const payload = this._playlistValidator.validatePlaylistPayload(
      req.payload
    );

    const { userId } = req.auth.artifacts.decoded.payload;

    const playlistId = await this._playlistService.insert({
      name: payload.name,
      owner: userId
    });

    const res = h.response({
      status: "success",
      data: { playlistId }
    });

    res.code(201);

    return res;
  };

  /**
   * Melihat daftar playlist yang dimiliki.
   *
   * @type {Handler}
   */
  index = async (req, h) => {
    const { userId } = req.auth.artifacts.decoded.payload;

    const playlists = await this._playlistService.findAll(userId);
    const res = h.response({
      status: "success",
      data: { playlists }
    });
    res.code(200);

    return res;
  };
}

module.exports = PlaylistHandler;
