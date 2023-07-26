"use strict";
require("dotenv/config");
const { performance } = require("perf_hooks");
const Hapi = require("@hapi/hapi");
const { Pool } = require("pg");
const Yup = require("yup");
const Jwt = require("@hapi/jwt");

require("../bootstrap");
const config = require("./config");
const { ClientError } = require("./exceptions");
const albums = require("./api/albums");
const AlbumService = require("./services/album.service");
const AlbumValidator = require("./validators/album");
const songs = require("./api/songs");
const SongService = require("./services/song.service");
const SongValidator = require("./validators/song");
const users = require("./api/users");
const UserService = require("./services/user.service");
const UserValidator = require("./validators/user");
const auth = require("./api/auth");
const AuthService = require("./services/auth.service");
const AuthValidator = require("./validators/auth");
const playlist = require("./api/playlist");
const PlaylistService = require("./services/playlist.service");
const PlaylistValidator = require("./validators/playlist");
const collab = require("./api/collab");
const CollabService = require("./services/collab.service");
const CollabValidator = require("./validators/collab");
const ProducerService = require("./services/messaging/producer.service");
const exportsPlugin = require("./api/export");
const ExportValidator = require("./validators/export");
const StorageService = require("./services/storage/storage.service");
const CacheService = require("./services/cache/cache.service");

const DEV = config.env === "development";

const main = async () => {
  // init database pool
  const pool = new Pool({
    user: config.pg.user,
    password: config.pg.password,
    host: config.pg.host,
    port: config.pg.port,
    database: config.pg.database
  });

  const server = Hapi.server({
    port: config.app.port || 3000,
    host: config.app.host || DEV ? "localhost" : "0.0.0.0",
    routes: {
      cors: {
        origin: ["*"]
      }
    }
  });

  const producerService = new ProducerService();
  await producerService.initialize();

  const cacheService = new CacheService();
  const storageService = new StorageService();

  const albumService = new AlbumService(pool);
  const albumValidator = new AlbumValidator();

  const songService = new SongService(pool);
  const songValidator = new SongValidator();

  const userService = new UserService(pool);
  const userValidator = new UserValidator();

  const authService = new AuthService(pool);
  const authValidator = new AuthValidator();

  const playlistService = new PlaylistService(pool);
  const playlistValidator = new PlaylistValidator();

  const collabService = new CollabService(pool);
  const collabValidator = new CollabValidator();

  const exportValidator = new ExportValidator();

  await server.register([
    {
      plugin: Jwt
    }
  ]);

  // register jwt auth strategy
  server.auth.strategy("api_jwt", "jwt", {
    keys: config.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.accessTokenAge
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        userId: artifacts.decoded.payload.userId
      }
    })
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumService,
        storageService,
        cacheService,
        validator: albumValidator
      },
      routes: {
        prefix: "/albums"
      }
    },
    {
      plugin: songs,
      options: {
        service: songService,
        validator: songValidator
      },
      routes: {
        prefix: "/songs"
      }
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: userValidator
      },
      routes: {
        prefix: "/users"
      }
    },
    {
      plugin: auth,
      options: {
        authService,
        userService,
        validator: authValidator
      },
      routes: {
        prefix: "/authentications"
      }
    },
    {
      plugin: playlist,
      options: {
        playlistService,
        songService,
        collabService,
        validator: playlistValidator
      },
      routes: {
        prefix: "/playlists"
      }
    },
    {
      plugin: collab,
      options: {
        collabService,
        playlistService,
        userService,
        validator: collabValidator
      },
      routes: {
        prefix: "/collaborations"
      }
    },
    {
      plugin: exportsPlugin,
      options: {
        producerService,
        playlistService,
        validator: exportValidator
      }
    }
  ]);

  server.ext("onPreResponse", (request, h) => {
    /** @type {{ response: unknown }} */
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
          message: response.message
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      // is status code < 500
      if (!response.isServer) {
        return h.continue;
      }

      // unknown server error
      console.error(response);
      const newResponse = h.response({
        status: "error",
        message: "Terjadi kesalahan pada server kami"
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  server.ext("onRequest", (req, h) => {
    // add start milliseconds to app ctx for http log
    req.app._startMs = performance.now();

    return h.continue;
  });

  // http logging
  server.events.on("response", function (req) {
    let str = `${new Date().toISOString()} [${req.response.statusCode}] ${
      req.path
    } `;
    const now = performance.now();
    const time = `${(now - (req.app._startMs ?? now)).toFixed(2)}ms`;

    if (process.stdout.isTTY) {
      str +=
        ".".repeat(process.stdout.columns - str.length - time.length - 1 ?? 0) +
        " ";
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
