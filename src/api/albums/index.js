const AlbumHandler = require("./handler");
const routes = require("./routes");

/**
 * @typedef {{
 *   service: import("../../services/album.service");
 *   validator: import("../../validators/album");
 * }} AlbumPluginOptions
 */

/** @type {import("@hapi/hapi").Plugin<{}>} */
const plugin = {
  name: "albums",
  /**
   * @param {import("@hapi/hapi").Server} server
   * @param {AlbumPluginOptions} param1
   */
  register: async (server, { service, validator }) => {
    const albumHandler = new AlbumHandler(service, validator);
    server.route(routes(albumHandler));
  },
};

module.exports = plugin;
