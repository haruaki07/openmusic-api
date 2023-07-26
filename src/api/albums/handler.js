/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

const { InvariantError } = require("@/exceptions");

class AlbumHandler {
  /**
   * @param {import("@/services/album.service")} albumService
   * @param {import("@/services/storage/storage.service")} storageService
   * @param {import("@/validators/album")} albumValidator
   */
  constructor(albumService, storageService, albumValidator) {
    this._albumService = albumService;
    this._storageService = storageService;
    this._albumValidator = albumValidator;
  }

  /**
   * Menambahkan album.
   *
   * @type {Handler}
   */
  store = async (req, h) => {
    const payload = this._albumValidator.validateAlbumPayload(req.payload);

    const albumId = await this._albumService.insert(payload);

    const res = h.response({
      status: "success",
      data: { albumId }
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

    const album = await this._albumService.findById(id);

    const res = h.response({
      status: "success",
      data: { album }
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

    await this._albumService.updateById(id, payload);

    const res = h.response({
      status: "success",
      message: "Album berhasil diperbarui!"
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

    await this._albumService.deleteById(id);

    const res = h.response({
      status: "success",
      message: "Album berhasil dihapus!"
    });
    res.code(200);

    return res;
  };

  /**
   * Mengunggah sampul album.
   *
   * @type {Handler}
   */
  uploadCover = async (req, h) => {
    const albumId = req.params.id;

    const cover = req.payload.cover;
    if (!cover) return new InvariantError("cover is a required field");

    this._albumValidator.validateCoverContentType(
      cover.hapi?.headers["content-type"]
    );

    const coverUrl = await this._storageService.storeAlbumCover(
      cover.hapi.filename,
      cover
    );

    await this._albumService.updateAlbumCover({ albumId, coverUrl });

    const res = h.response({
      status: "success",
      message: "Sampul berhasil diunggah"
    });
    res.code(201);

    return res;
  };
}

module.exports = AlbumHandler;
