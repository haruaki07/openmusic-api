/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

const { NotFoundError } = require("@/exceptions");

class PlaylistHandler {
  /**
   * @param {import("@/services/playlist.service")} playlistService
   * @param {import("@/services/song.service")} songService
   * @param {import("@/services/collab.service")} collabService
   * @param {import("@/validators/playlist")} playlistValidator
   */
  constructor(playlistService, songService, collabService, playlistValidator) {
    this._playlistService = playlistService;
    this._songService = songService;
    this._collabService = collabService;
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
    const { songId } = this._playlistValidator.validatePlaylistSongPayload(
      req.payload
    );
    const playlistId = req.params.id;

    await this.#verifyPlaylistAccess(playlistId, userId);
    await this._songService.verifySongExist(songId);

    await this._playlistService.insertSong({
      playlistId,
      songId
    });
    this._playlistService.logActivity({
      action: "add",
      userId,
      songId,
      playlistId
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

    await this.#verifyPlaylistAccess(id, userId);
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

  /**
   * Menghapus lagu dari playlist.
   *
   * @type {Handler}
   */
  deleteSong = async (req, h) => {
    const { userId } = req.auth.credentials;
    const id = req.params.id;

    const { songId } = this._playlistValidator.validatePlaylistSongPayload(
      req.payload
    );

    await this.#verifyPlaylistAccess(id, userId);
    await this._playlistService.deletePlaylistSong({ songId, playlistId: id });

    this._playlistService.logActivity({
      action: "delete",
      userId,
      songId,
      playlistId: id
    });

    const res = h.response({
      status: "success",
      message: "Lagu berhasil dihapus dari playlist!"
    });
    res.code(200);

    return res;
  };

  /**
   * Menghapus playlist.
   *
   * @type {Handler}
   */
  destroy = async (req, h) => {
    const { userId } = req.auth.credentials;
    const id = req.params.id;

    await this._playlistService.verifyPlaylistOwner({ id, userId });
    await this._playlistService.deleteById(id);

    const res = h.response({
      status: "success",
      message: "Playlist berhasil dihapus!"
    });
    res.code(200);

    return res;
  };

  async #verifyPlaylistAccess(playlistId, userId) {
    try {
      await this._playlistService.verifyPlaylistOwner({
        id: playlistId,
        userId
      });
    } catch (e) {
      if (!(e instanceof NotFoundError)) {
        await this._collabService.verifyPlaylistCollaborator({
          playlistId,
          userId
        });
      }
    }
  }

  /**
   * Melihat riwayat aktivitas playlist.
   *
   * @type {Handler}
   */
  songsActivities = async (req, h) => {
    const { userId } = req.auth.credentials;
    const playlistId = req.params.id;

    await this._playlistService.verifyPlaylistOwner({ id: playlistId, userId });
    const activities = await this._playlistService.findSongActivities(
      playlistId
    );

    const res = h.response({
      status: "success",
      data: {
        playlistId,
        activities
      }
    });
    res.code(200);

    return res;
  };
}

module.exports = PlaylistHandler;
