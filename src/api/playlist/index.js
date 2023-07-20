/**
 * @typedef {{
 *   songService: import("@/services/song.service");
 *   playlistService: import("@/services/playlist.service");
*   collabService: import("@/services/collab.service");
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
  register: (server, { playlistService, songService, collabService, validator }) => {
    const handler = new PlaylistHandler(
      playlistService,
      songService,
      collabService,
      validator
    );
    server.route(routes(handler));
  }
};

module.exports = playlistsPlugin;
