/* eslint-disable camelcase */

const { PgType } = require("node-pg-migrate");

exports.shorthands = undefined;

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.createTable("playlist_songs_activities", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true
    },
    action: {
      type: "varchar(50)",
      notNull: true
    },
    userId: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    songId: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "songs(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    playlistId: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "playlists(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    time: {
      type: PgType.TIMESTAMPTZ,
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP")
    }
  });
};

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropTable("playlist_songs_activities");
};
