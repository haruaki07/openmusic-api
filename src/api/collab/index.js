/**
 * @typedef {{
 *   userService: import("@/services/user.service");
 *   playlistService: import("@/services/playlist.service");
 *   collabService: import("@/services/collab.service");
 *   validator: import("@/validators/collab");
 * }} CollabPluginOptions
 */

const CollabHandler = require("./handler");
const routes = require("./routes");

/** @type {import("@hapi/hapi").Plugin<{}>} */
const collabsPlugin = {
  name: "collabs",
  /**
   * @param {import("@hapi/hapi").Server} server
   * @param {CollabPluginOptions} param1
   */
  register: (
    server,
    { collabService, playlistService, userService, validator }
  ) => {
    const handler = new CollabHandler(
      collabService,
      playlistService,
      userService,
      validator
    );
    server.route(routes(handler));
  }
};

module.exports = collabsPlugin;
