/* eslint-disable camelcase */

exports.shorthands = undefined;

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
    playlistId: {
      type: "VARCHAR(50)",
      notNull: true
    },
    songId: {
      type: "VARCHAR(50)",
      notNull: true
    }
  });
};

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropTable("playlist_songs");
};
