/* eslint-disable camelcase */

const { PgType } = require("node-pg-migrate");

exports.shorthands = undefined;

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    username: {
      type: "VARCHAR(50)",
      unique: true,
      notNull: true,
    },
    password: {
      type: PgType.TEXT,
      notNull: true,
    },
    fullname: {
      type: PgType.VARCHAR,
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

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropTable("users");
};
