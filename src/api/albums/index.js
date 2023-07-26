const AlbumHandler = require("./handler");
const routes = require("./routes");

/**
 * @typedef {{
 *   storageService: import("@/services/storage/storage.service");
 *   albumService: import("@/services/album.service");
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
  register: (server, { albumService, storageService, validator }) => {
    const albumHandler = new AlbumHandler(
      albumService,
      storageService,
      validator
    );
    server.route(routes(albumHandler));
  }
};

module.exports = plugin;
