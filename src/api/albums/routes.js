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
  },
  {
    method: "GET",
    path: "/{id}",
    handler: handler.show,
  },
];

module.exports = routes;
