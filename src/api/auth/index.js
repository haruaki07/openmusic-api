/**
 * @typedef {{
 *   userService: import("@/services/user.service");
 *   authService: import("@/services/auth.service");
 *   validator: import("@/validators/auth");
 * }} AuthPluginOptions
 */

const AuthHandler = require("./handler");
const routes = require("./routes");

/** @type {import("@hapi/hapi").Plugin<{}>} */
const authsPlugin = {
  name: "auth",
  /**
   * @param {import("@hapi/hapi").Server} server
   * @param {AuthPluginOptions} param1
   */
  register: (server, { userService, authService, validator }) => {
    const handler = new AuthHandler(userService, authService, validator);
    server.route(routes(handler));
  }
};

module.exports = authsPlugin;
