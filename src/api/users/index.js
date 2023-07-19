/**
 * @typedef {{
 *   service: import("@/services/user.service");
 *   validator: import("@/validators/user");
 * }} UserPluginOptions
 */

const UserHandler = require("./handler");
const routes = require("./routes");

/** @type {import("@hapi/hapi").Plugin<{}>} */
const plugin = {
  name: "users",
  /**
   * @param {import("@hapi/hapi").Server} server
   * @param {UserPluginOptions} param1
   */
  register: (server, { service, validator }) => {
    const handler = new UserHandler(service, validator);
    server.route(routes(handler));
  }
};

module.exports = plugin;
