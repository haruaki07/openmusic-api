const { CreateAlbumRequest } = require("../../models/album");

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
      new CreateAlbumRequest(payload.name, payload.year)
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
      message: "success",
      data: album,
    });
    res.code(200);

    return res;
  };
}

module.exports = AlbumHandler;
