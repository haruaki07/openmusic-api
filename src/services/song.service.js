const { SongRequest, Song, SongSimple } = require("../models/song");
const { InvariantError, NotFoundError } = require("../exceptions");
const { nanoid } = require("nanoid");

class SongService {
  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this._pool = pool;
  }

  /**
   * @param {SongRequest} param0
   * @returns {Promise<string>}
   */
  async insert({ title, year, genre, performer, duration, albumId }) {
    console.log(arguments);
    const id = "song-" + nanoid(16);
    const query = {
      text: `
INSERT INTO 
  songs (id, title, year, genre, performer, duration, "albumId") 
VALUES
  ($1, $2, $3, $4, $5, $6, $7) 
RETURNING 
  id`,
      values: [id, title, year, genre, performer, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows?.[0]?.id) {
      throw new InvariantError("Lagu gagal ditambahkan!");
    }

    return result.rows[0].id;
  }

  async findAll() {
    const result = await this._pool.query(
      "SELECT id, title, performer FROM songs"
    );

    return result.rows.map((r) => new SongSimple(r.id, r.title, r.performer));
  }

  /** @param {string} id */
  async findById(id) {
    const result = await this._pool.query("SELECT * FROM songs WHERE id=$1", [
      id,
    ]);

    if (result.rowCount < 1) {
      throw new NotFoundError("Lagu tidak ditemukan!");
    }

    const row = result.rows[0];
    return new Song(
      row.id,
      row.title,
      row.year,
      row.genre,
      row.performer,
      row.duration,
      row.albumId
    );
  }

  /**
   * @param {string} id
   * @param {SongRequest} payload
   */
  async updateById(id, payload) {
    const query = {
      text: `
UPDATE 
  songs 
SET 
  title=$2, year=$3, genre=$4, performer=$5, duration=$6, "albumId"=$7, "updatedAt"=now() 
WHERE 
  id=$1`,
      values: [
        id,
        payload.title,
        payload.year,
        payload.genre,
        payload.performer,
        payload.duration,
        payload.albumId,
      ],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError("Gagal memperbarui lagu! Lagu tidak ditemukan.");
    }
  }

  /** @param {string} id */
  async deleteById(id) {
    const query = {
      text: `DELETE FROM songs WHERE id=$1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount < 1) {
      throw new NotFoundError("Gagal menghapus lagu! Lagu tidak ditemukan.");
    }
  }
}

module.exports = SongService;
