/* eslint-disable camelcase */

exports.shorthands = undefined;

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.createTable("album_likes", {
    albumId: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "albums(id)",
      onDelete: "CASCADE"
    },
    userId: {
      type: "VARCHAR(50)",
      notNull: true,
      references: "users(id)",
      onDelete: "CASCADE"
    }
  });
};

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropTable("album_likes");
};
