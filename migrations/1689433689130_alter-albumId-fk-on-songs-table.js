/* eslint-disable camelcase */

exports.shorthands = undefined;

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.dropConstraint("songs", "songs_fk_albumId");
  pgm.addConstraint("songs", "songs_fk_albumId", {
    foreignKeys: {
      columns: "albumId",
      references: "albums(id)",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  });
};

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropConstraint("songs", "songs_fk_albumId");
  pgm.addConstraint("songs", "songs_fk_albumId", {
    foreignKeys: {
      columns: "albumId",
      references: "songs(id)",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  });
};
