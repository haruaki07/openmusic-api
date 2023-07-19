/**
 * @type {(
 *   handler: import("./handler")
 * ) => import("@hapi/hapi").ServerRoute[]}
 */
const routes = (handler) => [
  { method: "POST", path: "/", handler: handler.store },
  { method: "PUT", path: "/", handler: handler.update },
  { method: "DELETE", path: "/", handler: handler.destroy }
];

module.exports = routes;
