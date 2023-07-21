const { InvariantError, NotFoundError } = require("@/exceptions");
const AuthorizationError = require("@/exceptions/AuthorizationError");
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

  /** @param {{ playlistId: string; userId: string }} param0 */
  async verifyPlaylistCollaborator({ playlistId, userId }) {
    const result = await this.#pool.query(
      `SELECT "userId" FROM playlist_collabs WHERE "playlistId" = $1`,
      [playlistId]
    );

    if (result.rowCount < 1)
      throw new NotFoundError("Playlist tidak ditemukan!");

    if (result.rows[0].userId !== userId)
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini!");
  }

  /** @param {{ playlistId: string; userId: string }} param0 */
  async delete({ playlistId, userId }) {
    const result = await this.#pool.query(
      `
DELETE FROM 
  playlist_collabs 
WHERE 
  "playlistId" = $1 AND "userId" = $2 
RETURNING id`,
      [playlistId, userId]
    );

    if (result.rowCount < 1)
      throw new NotFoundError(
        "Gagal menghapus kolaborator! kolaborasi tidak ditemukan!"
      );
  }
}

module.exports = CollabService;
