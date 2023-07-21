/**
 * @type {(
 *   handler: import("./handler")
 * ) => import("@hapi/hapi").ServerRoute[]}
 */
const routes = (handler) => [
  {
    method: "POST",
    path: "/",
    handler: handler.store,
    options: { auth: "api_jwt" }
  },
  {
    method: "DELETE",
    path: "/",
    handler: handler.destroy,
    options: { auth: "api_jwt" }
  }
];

module.exports = routes;
