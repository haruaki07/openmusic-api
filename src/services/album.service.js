const { AlbumDetailed, AlbumRequest } = require("../models/album");
const { SongSimple } = require("../models/song");
const { InvariantError, NotFoundError } = require("../exceptions");
const { nanoid } = require("nanoid");

class AlbumService {
  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this._pool = pool;
  }

  /**
   * @param {AlbumRequest} param0
   * @returns {Promise<string>}
   */
  async insert({ name, year }) {
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
  async findById(id) {
    // should i use join here
    const resAlbum = await this._pool.query(
      "SELECT id, name, year FROM albums WHERE id=$1",
      [id]
    );

    if (resAlbum.rowCount < 1) {
      throw new NotFoundError("Album tidak ditemukan!");
    }

    const row = resAlbum.rows[0];

    const resSongs = await this._pool.query(
      `SELECT id, title, performer FROM songs WHERE "albumId"=$1`,
      [row.id]
    );
    const songs = resSongs.rows.map(
      (r) => new SongSimple(r.id, r.title, r.performer)
    );

    return new AlbumDetailed(row.id, row.name, row.year, songs);
  }

  /**
   * @param {string} id
   * @param {AlbumRequest} param1
   */
  async updateById(id, { name, year }) {
    const query = {
      text: `UPDATE albums SET name=$1, year=$2, "updatedAt"=now() WHERE id=$3`,
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError(
        "Gagal memperbarui album! Album tidak ditemukan."
      );
    }
  }

  /** @param {string} id */
  async deleteById(id) {
    const query = {
      text: `DELETE FROM albums WHERE id=$1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError("Gagal menghapus album! Album tidak ditemukan.");
    }
  }
}

module.exports = AlbumService;
