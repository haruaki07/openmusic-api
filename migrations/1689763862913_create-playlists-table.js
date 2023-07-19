/* eslint-disable camelcase */

const { PgType } = require("node-pg-migrate");

exports.shorthands = undefined;

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.createTable(
    "playlists",
    {
      id: {
        type: "VARCHAR(50)",
        primaryKey: true
      },
      name: {
        type: PgType.VARCHAR,
        notNull: true
      },
      owner: {
        type: "VARCHAR(50)",
        notNull: true
      },
      createdAt: {
        type: PgType.TIMESTAMPTZ,
        notNull: true,
        default: pgm.func("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        type: PgType.TIMESTAMPTZ,
        default: null
      }
    },
    {
      constraints: {
        foreignKeys: {
          columns: "owner",
          references: "users(id)",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        }
      }
    }
  );
};

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropTable("playlists");
};
