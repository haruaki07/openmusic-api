/* eslint-disable camelcase */

exports.shorthands = undefined;

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.createTable("playlist_collabs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true
    },
    playlistId: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "playlists(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    },
    userId: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
  });
};

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropTable("playlist_collabs");
};
