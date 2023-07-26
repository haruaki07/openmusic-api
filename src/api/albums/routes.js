/**
 * @type {(
 *   handler: import("./handler")
 * ) => import("@hapi/hapi").ServerRoute[]}
 */
const routes = (handler) => [
  {
    method: "POST",
    path: "/",
    handler: handler.store
  },
  {
    method: "GET",
    path: "/{id}",
    handler: handler.show
  },
  {
    method: "PUT",
    path: "/{id}",
    handler: handler.update
  },
  {
    method: "DELETE",
    path: "/{id}",
    handler: handler.destroy
  },
  {
    method: "POST",
    path: "/{id}/covers",
    handler: handler.uploadCover,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 512000,
        output: "stream"
      }
    }
  }
];

module.exports = routes;
