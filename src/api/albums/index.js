const AlbumHandler = require("./handler");
const routes = require("./routes");

/**
 * @typedef {{
 *   storageService: import("@/services/storage/storage.service");
 *   cacheService: import("@/services/cache/cache.service");
 *   albumService: import("@/services/album.service");
 *   songService: import("@/services/song.service");
 *   validator: import("@/validators/album");
 * }} AlbumPluginOptions
 */

/** @type {import("@hapi/hapi").Plugin<{}>} */
const plugin = {
  name: "albums",
  /**
   * @param {import("@hapi/hapi").Server} server
   * @param {AlbumPluginOptions} param1
   */
  register: (
    server,
    { albumService, songService, storageService, cacheService, validator }
  ) => {
    const albumHandler = new AlbumHandler(
      albumService,
      songService,
      storageService,
      cacheService,
      validator
    );
    server.route(routes(albumHandler));
  }
};

module.exports = plugin;
