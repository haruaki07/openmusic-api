const { AlbumRequest, Album } = require("../models/album");
const { InvariantError, NotFoundError } = require("../exceptions");
const { nanoid } = require("nanoid");

class AlbumService {
  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this._pool = pool;
  }

  /**
   * @param {AlbumRequest} param0
   * @returns {string}
   */
  async addAlbum({ name, year }) {
    const id = "album-" + nanoid(16);
    const query = {
      text: "INSERT INTO albums(id, name, year) VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows?.[0]?.id) {
      throw new InvariantError("Album gagal ditambahkan!");
    }

    return result.rows[0].id;
  }

  /** @param {string} id */
  async getAlbumById(id) {
    const result = await this._pool.query(
      "SELECT id, name, year FROM albums WHERE id=$1",
      [id]
    );

    if (result.rowCount < 1) {
      throw new NotFoundError("Album tidak ditemukan!");
    }

    const row = result.rows[0];
    return new Album(row.id, row.name, row.year);
  }

  /**
   * @param {string} id
   * @param {AlbumRequest} param1
   */
  async updateAlbumById(id, { name, year }) {
    const query = {
      text: `UPDATE albums SET name=$1, year=$2, "updatedAt"=now() WHERE id=$3`,
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError(
        "Gagal memperbarui album. Album tidak ditemukan!"
      );
    }
  }
}

module.exports = AlbumService;
