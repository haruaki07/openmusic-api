/* eslint-disable camelcase */

const { PgType } = require("node-pg-migrate");

exports.shorthands = undefined;

/**
 *
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable("albums", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "VARCHAR(100)",
      notNull: true,
    },
    year: {
      type: PgType.INT,
      notNull: true,
    },
    createdAt: {
      type: PgType.TIMESTAMPTZ,
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: PgType.TIMESTAMPTZ,
      default: null,
    },
  });
};

/**
 *
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable("albums");
};
