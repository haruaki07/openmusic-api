/* eslint-disable camelcase */

const { PgType } = require("node-pg-migrate");

exports.shorthands = undefined;

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.createTable(
    "songs",
    {
      id: {
        type: "VARCHAR(50)",
        primaryKey: true,
      },
      title: {
        type: "VARCHAR(100)",
        notNull: true,
      },
      year: {
        type: PgType.INT,
      },
      performer: {
        type: "VARCHAR(100)",
        notNull: true,
      },
      genre: {
        type: "VARCHAR(50)",
        notNull: true,
      },
      duration: {
        type: PgType.INT,
        default: null,
        comment: "song duration in seconds",
      },
      albumId: {
        type: "VARCHAR(50)",
        default: null,
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
    },
    {
      constraints: {
        foreignKeys: {
          columns: "albumId",
          references: "songs(id)",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
    }
  );
};

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropTable("songs");
};
