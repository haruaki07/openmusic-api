const { PlaylistResponse } = require("@/models/playlist");
const { createId, plainToClass } = require("@/utils");

class PlaylistService {
  #pool;

  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this.#pool = pool;
  }

  /** @param {import("@/models/playlist").PlaylistRequest} param0 */
  async insert({ name, owner }) {
    const id = createId("playlist");
    const result = await this.#pool.query(
      `INSERT INTO playlists (id, name, owner) VALUES ($1, $2, $3) RETURNING id`,
      [id, name, owner]
    );

    if (result.rowCount < 1)
      throw new InvariantError("Playlist gagal ditambahkan!");

    return result.rows[0].id;
  }

  /** @param {string} userId */
  async findAll(userId) {
    const result = await this.#pool.query(
      "SELECT id, name, owner as username FROM playlists WHERE owner = $1",
      [userId]
    );

    return result.rows.map((r) => plainToClass(r, PlaylistResponse));
  }
}

module.exports = PlaylistService;
