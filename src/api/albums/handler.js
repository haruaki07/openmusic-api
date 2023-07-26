/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

const { InvariantError } = require("@/exceptions");

class AlbumHandler {
  /**
   * @param {import("@/services/album.service")} albumService
   * @param {import("@/services/storage/storage.service")} storageService
   * @param {import("@/services/cache/cache.service")} cacheService
   * @param {import("@/validators/album")} albumValidator
   */
  constructor(albumService, storageService, cacheService, albumValidator) {
    this._albumService = albumService;
    this._storageService = storageService;
    this._cacheService = cacheService;
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

  /**
   * Menyukai album.
   *
   * @type {Handler}
   */
  storeAlbumLike = async (req, h) => {
    const { userId } = req.auth.credentials;
    const albumId = req.params.id;

    await this._albumService.verifyAlbumExist(albumId);
    await this._albumService.addAlbumLike({ albumId, userId });

    const cacheKey = this.getAlbumLikeCacheKey(albumId);
    if (await this._cacheService.isExist(cacheKey)) {
      await this._cacheService.delete(cacheKey);
    }

    const res = h.response({
      status: "success",
      message: "Berhasil menyukai album"
    });
    res.code(201);

    return res;
  };

  /**
   * Melihat jumlah yang menyukai album.
   *
   * @type {Handler}
   */
  showAlbumLikes = async (req, h) => {
    const albumId = req.params.id;

    await this._albumService.verifyAlbumExist(albumId);

    const cacheKey = this.getAlbumLikeCacheKey(albumId);
    const cachedLikes = await this._cacheService.get(cacheKey);
    let likes = +(
      cachedLikes ?? (await this._albumService.getAlbumLikes(albumId))
    );
    console.log(cachedLikes);
    if (cachedLikes == null)
      await this._cacheService.set(cacheKey, likes, 60 * 30); // 30 minutes

    const res = h.response({
      status: "success",
      data: { likes }
    });

    if (cachedLikes != null) res.header("X-Data-Source", "cache");

    return res;
  };

  /**
   * Batal menyukai album.
   *
   * @type {Handler}
   */
  destroyAlbumLike = async (req, h) => {
    const { userId } = req.auth.credentials;
    const albumId = req.params.id;

    await this._albumService.verifyAlbumExist(albumId);
    await this._albumService.deleteAlbumLike({ albumId, userId });

    const cacheKey = this.getAlbumLikeCacheKey(albumId);
    if (await this._cacheService.isExist(cacheKey)) {
      await this._cacheService.delete(cacheKey);
    }

    const res = h.response({
      status: "success",
      message: "Berhasil batal menyukai album"
    });

    return res;
  };

  getAlbumLikeCacheKey(albumId) {
    return `album_likes:${albumId}`;
  }
}

module.exports = AlbumHandler;
