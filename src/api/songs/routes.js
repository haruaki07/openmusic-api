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
    path: "/",
    handler: handler.getAll,
  },
  {
    method: "GET",
    path: "/{id}",
    handler: handler.show,
  },
  {
    method: "PUT",
    path: "/{id}",
    handler: handler.update,
  },
  {
    method: "DELETE",
    path: "/{id}",
    handler: handler.destroy,
  },
];

module.exports = routes;
