const { InvariantError } = require("@/exceptions");
const { createId } = require("@/utils");

class CollabService {
  #pool;

  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this.#pool = pool;
  }

  /** @param {{ playlistId: string; userId: string }} param0 */
  async insert({ playlistId, userId }) {
    const id = createId("collab");
    const result = await this.#pool.query(
      `
INSERT INTO 
  playlist_collabs (id, "playlistId", "userId") 
VALUES 
  ($1, $2, $3) 
RETURNING id`,
      [id, playlistId, userId]
    );

    if (result.rowCount < 1)
      throw new InvariantError("Kolaborator gagal ditambahkan!");

    return result.rows[0].id;
  }
}

module.exports = CollabService;
