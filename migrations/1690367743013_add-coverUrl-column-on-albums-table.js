/* eslint-disable camelcase */

const { PgType } = require("node-pg-migrate");

exports.shorthands = undefined;

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.addColumn("albums", {
    coverUrl: {
      type: "VARCHAR(255)",
      default: null
    }
  });
};

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropColumn("albums", "coverUrl");
};
