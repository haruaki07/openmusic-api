/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

class PlaylistHandler {
  /**
   * @param {import("@/services/playlist.service")} playlistService
   * @param {import("@/services/song.service")} songService
   * @param {import("@/validators/playlist")} playlistValidator
   */
  constructor(playlistService, songService, playlistValidator) {
    this._playlistService = playlistService;
    this._songService = songService;
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
    const { userId } = req.auth.credentials;

    const playlists = await this._playlistService.findAll(userId);
    const res = h.response({
      status: "success",
      data: { playlists }
    });
    res.code(200);

    return res;
  };

  /**
   * Menambahkan lagu ke playlist
   *
   * @type {Handler}
   */
  addSong = async (req, h) => {
    const { userId } = req.auth.credentials;
    const { songId } = this._playlistValidator.validateAddSongSchema(
      req.payload
    );
    const playlistId = req.params.id;

    await this._playlistService.verifyPlaylistOwner({ id: playlistId, userId });
    await this._songService.verifySongExist(songId);

    await this._playlistService.insertSong({
      playlistId,
      songId
    });

    const res = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan ke playlist!"
    });
    res.code(201);

    return res;
  };

  /**
   * Melihat daftar lagu di dalam playlist.
   *
   * @type {Handler}
   */
  songs = async (req, h) => {
    const { userId } = req.auth.credentials;
    const id = req.params.id;

    await this._playlistService.verifyPlaylistOwner({ id, userId });

    const playlistSongs = await this._playlistService.findPlaylistSongs(id);

    const res = h.response({
      status: "success",
      data: {
        playlist: playlistSongs
      }
    });
    res.code(200);

    return res;
  };
}

module.exports = PlaylistHandler;
