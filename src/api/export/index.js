/**
 * @typedef {{
 *   producerService: import("@/services/messaging/producer.service");
 *   playlistService: import("@/services/playlist.service");
 *   validator: import("@/validators/export");
 * }} ExportPluginOptions
 */

const ExportHandler = require("./handler");
const routes = require("./routes");

/** @type {import("@hapi/hapi").Plugin<{}>} */
const exportsPlugin = {
  name: "exports",
  /**
   * @param {import("@hapi/hapi").Server} server
   * @param {ExportPluginOptions} param1
   */
  register: (server, { producerService, playlistService, validator }) => {
    const handler = new ExportHandler(
      producerService,
      playlistService,
      validator
    );
    server.route(routes(handler));
  }
};

module.exports = exportsPlugin;
