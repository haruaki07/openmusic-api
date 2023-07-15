"use strict";
const { performance } = require("perf_hooks");
const Hapi = require("@hapi/hapi");
require("dotenv/config");
const { Pool } = require("pg");
const Yup = require("yup");
const albums = require("./api/albums");
const AlbumService = require("./services/album");
const AlbumValidator = require("./validators/album");
const { ClientError } = require("./exceptions");

const DEV = process.env.NODE_ENV === "development";

const main = async () => {
  // init database pool
  const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASS,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDB,
  });

  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || DEV ? "localhost" : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  const albumService = new AlbumService(pool);
  const albumValidator = new AlbumValidator();

  await server.register({
    plugin: albums,
    options: {
      service: albumService,
      validator: albumValidator,
    },
    routes: {
      prefix: "/albums",
    },
  });

  // handle response (error)
  server.ext("onPreResponse", (request, h) => {
    /** @type {{response: unknown}} */
    let { response } = request;

    if (response instanceof Error) {
      if (response instanceof Yup.ValidationError) {
        response = new ClientError(
          response.inner?.[0]?.message ?? response.message
        );
      }

      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // is status code < 500
      if (!response.isServer) {
        return h.continue;
      }

      // unknown server error
      const newResponse = h.response({
        status: "error",
        message: "Terjadi kesalahan pada server kami",
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  server.events.on("request", (req) => {
    // add start milliseconds to app ctx for http log
    req.app._startMs = performance.now();
  });

  // http logging
  server.events.on("response", function (req) {
    let str = `${new Date().toISOString()} [${req.response.statusCode}] ${
      req.path
    } `;
    const time = `${(performance.now() - req.app._startMs).toFixed(2)}ms`;

    if (process.stdout.isTTY) {
      str +=
        ".".repeat(process.stdout.columns - str.length - time.length) + " ";
    }

    str += time;

    console.log(str);
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.error("An error occurred: ", err);
  process.exit(1);
});

main();
