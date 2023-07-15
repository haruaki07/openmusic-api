/** @type {(handler: import('./handler')) => import("@hapi/hapi").ServerRoute[]} */
const routes = (handler) => [
  {
    method: "POST",
    path: "/",
    handler: handler.store,
  },
];

module.exports = routes;
