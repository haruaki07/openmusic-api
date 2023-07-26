const { AlbumDetailed } = require("@/models/album");
const { InvariantError, NotFoundError } = require("@/exceptions");
const { nanoid } = require("nanoid");
const { plainToClass } = require("@/utils");

class AlbumService {
  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this._pool = pool;
  }

  /**
   * @param {import("@/models/album").AlbumRequest} param0
   * @returns {Promise<string>}
   */
  async insert({ name, year }) {
    const id = "album-" + nanoid(16);
    const query = {
      text: "INSERT INTO albums(id, name, year) VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year]
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
    const result = await this._pool.query(
      `SELECT id, name, year, "coverUrl" FROM albums WHERE id=$1`,
      [id]
    );

    if (result.rowCount < 1) {
      throw new NotFoundError("Album tidak ditemukan!");
    }

    return plainToClass(result.rows[0], AlbumDetailed);
  }

  /**
   * @param {string} id
   * @param {import("@/models/album").AlbumRequest} param1
   */
  async updateById(id, { name, year }) {
    const query = {
      text: `UPDATE albums SET name=$1, year=$2, "updatedAt"=now() WHERE id=$3`,
      values: [name, year, id]
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
      values: [id]
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError("Gagal menghapus album! Album tidak ditemukan.");
    }
  }

  async updateAlbumCover({ albumId, coverUrl }) {
    await this._pool.query(`UPDATE albums SET "coverUrl"=$1 WHERE id=$2`, [
      coverUrl,
      albumId
    ]);
  }

  async verifyAlbumExist(id) {
    const res = await this._pool.query("SELECT id FROM albums WHERE id=$1", [
      id
    ]);

    if (res.rowCount < 1) throw new NotFoundError("Album tidak ditemukan!");
  }

  async addAlbumLike({ albumId, userId }) {
    const result = await this._pool.query(
      `SELECT "albumId" FROM album_likes WHERE "albumId"=$1 AND "userId"=$2`,
      [albumId, userId]
    );

    if (result.rowCount > 0)
      throw new InvariantError("Gagal menyukai album! Album sudah disukai.");

    await this._pool.query("INSERT INTO album_likes VALUES ($1, $2)", [
      albumId,
      userId
    ]);
  }

  async deleteAlbumLike({ albumId, userId }) {
    const result = await this._pool.query(
      `DELETE FROM album_likes WHERE "albumId"=$1 AND "userId"=$2 RETURNING *`,
      [albumId, userId]
    );

    if (result.rowCount < 1)
      throw new InvariantError(
        "Gagal batal menyukai album! data tidak ditemukan"
      );
  }

  async getAlbumLikes(albumId) {
    const result = await this._pool.query(
      `SELECT COUNT("userId") as likes FROM album_likes WHERE "albumId"=$1`,
      [albumId]
    );

    return +result.rows[0].likes;
  }
}

module.exports = AlbumService;
