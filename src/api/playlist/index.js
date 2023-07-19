/**
 * @typedef {{
 *   service: import("@/services/playlist.service");
 *   validator: import("@/validators/playlist");
 * }} PlaylistPluginOptions
 */

const PlaylistHandler = require("./handler");
const routes = require("./routes");

/** @type {import("@hapi/hapi").Plugin<{}>} */
const playlistsPlugin = {
  name: "playlists",
  /**
   * @param {import("@hapi/hapi").Server} server
   * @param {PlaylistPluginOptions} param1
   */
  register: (server, { service, validator }) => {
    const handler = new PlaylistHandler(service, validator);
    server.route(routes(handler));
  }
};

module.exports = playlistsPlugin;
