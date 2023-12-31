const { SongRequest, SongFilterQuery } = require("../../models/song");

/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

class SongHandler {
  /**
   * @param {import("../../services/song.service")} songService
   * @param {import("../../validators/song")} songValidator
   */
  constructor(songService, songValidator) {
    this._songService = songService;
    this._songValidator = songValidator;
  }

  /**
   * Menambahkan lagu.
   *
   * @type {Handler}
   */
  store = async (req, h) => {
    const payload = this._songValidator.validateSongPayload(req.payload);

    const songId = await this._songService.insert(
      new SongRequest(
        payload.title,
        payload.year,
        payload.genre,
        payload.performer,
        payload.duration,
        payload.albumId
      )
    );

    const res = h.response({
      status: "success",
      data: { songId },
    });
    res.code(201);

    return res;
  };

  /**
   * Mendapatkan seluruh lagu.
   *
   * @type {Handler}
   */
  getAll = async (req, h) => {
    const filter = this._songValidator.validateSongFilter(req.query);
    const songs = await this._songService.findAll(filter);

    const res = h.response({
      status: "success",
      data: { songs },
    });
    res.code(200);

    return res;
  };

  /**
   * Mendapatkan lagu berdasarkan id.
   *
   * @type {Handler}
   */
  show = async (req, h) => {
    const id = req.params.id;

    const song = await this._songService.findById(id);

    const res = h.response({
      status: "success",
      data: { song },
    });
    res.code(200);

    return res;
  };

  /**
   * Mengubah lagu berdasarkan id lagu.
   *
   * @type {Handler}
   */
  update = async (req, h) => {
    const id = req.params.id;
    const payload = this._songValidator.validateSongPayload(req.payload);

    await this._songService.updateById(
      id,
      new SongRequest(
        payload.title,
        payload.year,
        payload.genre,
        payload.performer,
        payload.duration,
        payload.albumId
      )
    );

    const res = h.response({
      status: "success",
      message: "Lagu berhasil diperbarui!",
    });
    res.code(200);

    return res;
  };

  /**
   * Menghapus lagu berdasarkan id.
   *
   * @type {Handler}
   */
  destroy = async (req, h) => {
    const id = req.params.id;

    await this._songService.deleteById(id);

    const res = h.response({
      status: "success",
      message: "Lagu berhasil dihapus!",
    });
    res.code(200);

    return res;
  };
}

module.exports = SongHandler;
