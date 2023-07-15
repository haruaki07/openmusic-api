const { CreateAlbumRequest, Album } = require("../models/album");
const { InvariantError, NotFoundError } = require("../exceptions");
const { nanoid } = require("nanoid");

class AlbumService {
  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this._pool = pool;
  }

  /** @param {CreateAlbumRequest} param0 */
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
}

module.exports = AlbumService;
