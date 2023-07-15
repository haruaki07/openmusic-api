const { CreateAlbumRequest } = require("../models/album");
const { InvariantError } = require("../exceptions");
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
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }
}

module.exports = AlbumService;
