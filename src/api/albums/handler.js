const { AlbumRequest } = require("../../models/album");

/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

class AlbumHandler {
  /**
   * @param {import("../../services/album.service")} albumService
   * @param {import("../../validators/album")} albumValidator
   */
  constructor(albumService, albumValidator) {
    this._albumService = albumService;
    this._albumValidator = albumValidator;
  }

  /**
   * Menambahkan album.
   *
   * @type {Handler}
   */
  store = async (req, h) => {
    const payload = this._albumValidator.validateAlbumPayload(req.payload);

    const albumId = await this._albumService.addAlbum(
      new AlbumRequest(payload.name, payload.year)
    );

    const res = h.response({
      status: "success",
      data: { albumId },
    });
    res.code(201);

    return res;
  };

  /**
   * Mendapatkan album berdasarkan id.
   *
   * @type {Handler}
   */
  show = async (req, h) => {
    const id = req.params.id;

    const album = await this._albumService.getAlbumById(id);

    const res = h.response({
      status: "success",
      data: album,
    });
    res.code(200);

    return res;
  };

  /**
   * Mengubah album berdasarkan id album.
   *
   * @type {Handler}
   */
  update = async (req, h) => {
    const id = req.params.id;
    const payload = this._albumValidator.validateAlbumPayload(req.payload);

    await this._albumService.updateAlbumById(id, payload);

    const res = h.response({
      status: "success",
      message: "Album berhasil diperbarui!",
    });
    res.code(200);

    return res;
  };

  /**
   * Menghapus album berdasarkan id.
   *
   * @type {Handler}
   */
  destroy = async (req, h) => {
    const id = req.params.id;

    await this._albumService.deleteAlbumById(id);

    const res = h.response({
      status: "success",
      message: "Album berhasil dihapus!",
    });
    res.code(200);

    return res;
  };
}

module.exports = AlbumHandler;
