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
    method: "GET",
    path: "/",
    handler: handler.index,
    options: { auth: "api_jwt" }
  },
  {
    method: "POST",
    path: "/{id}/songs",
    handler: handler.addSong,
    options: { auth: "api_jwt" }
  },
  {
    method: "GET",
    path: "/{id}/songs",
    handler: handler.songs,
    options: { auth: "api_jwt" }
  },
  {
    method: "DELETE",
    path: "/{id}/songs",
    handler: handler.deleteSong,
    options: { auth: "api_jwt" }
  }
];

module.exports = routes;
