const SongHandler = require("./handler");
const routes = require("./routes");

/**
 * @typedef {{
 *   service: import("../../services/song.service");
 *   validator: import("../../validators/song");
 * }} SongPluginOptions
 */

/** @type {import("@hapi/hapi").Plugin<{}>} */
const plugin = {
  name: "songs",
  /**
   * @param {import("@hapi/hapi").Server} server
   * @param {SongPluginOptions} param1
   */
  register: (server, { service, validator }) => {
    const songHandler = new SongHandler(service, validator);
    server.route(routes(songHandler));
  }
};

module.exports = plugin;
