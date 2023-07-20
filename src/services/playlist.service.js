const { InvariantError, NotFoundError } = require("@/exceptions");
const AuthorizationError = require("@/exceptions/AuthorizationError");
const {
  PlaylistResponse,
  PlaylistSongsResponse
} = require("@/models/playlist");
const { SongResponse } = require("@/models/song");
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
      `
SELECT 
  p.id, p.name, u.username 
FROM 
  playlists p
JOIN users u
  ON u.id = p.owner
WHERE 
  p.owner = $1`,
      [userId]
    );

    return result.rows.map((r) => plainToClass(r, PlaylistResponse));
  }

  /** @param {{ id: string; userId: string }} param0 */
  async verifyPlaylistOwner({ id, userId }) {
    const result = await this.#pool.query(
      "SELECT owner FROM playlists WHERE id=$1",
      [id]
    );

    if (result.rowCount < 1)
      throw new NotFoundError("Playlist tidak ditemukan!");

    if (result.rows[0].owner !== userId)
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
  }

  /** @param {{ songId: string; playlistId: string }} param0 */
  async insertSong({ songId, playlistId }) {
    const result = await this.#pool.query(
      `INSERT INTO playlist_songs ("playlistId", "songId") VALUES ($1, $2)`,
      [playlistId, songId]
    );

    if (result.rowCount < 1)
      throw new InvariantError("Lagu gagal ditambahkan ke playlist!");
  }

  async findPlaylistSongs(playlistId) {
    const playlistResult = await this.#pool.query(
      `
SELECT 
  p.id, p.name, u.username 
FROM 
  playlists p
JOIN users u
  ON u.id = p.owner
WHERE
  p.id=$1`,
      [playlistId]
    );

    if (playlistResult.rowCount < 1)
      throw new NotFoundError("Playlist tidak ditemukan!");

    const playlist = playlistResult.rows[0];

    const songsResult = await this.#pool.query(
      `
SELECT 
  s.id, s.title, s.performer
FROM 
  playlist_songs ps
JOIN songs s
  ON s.id = ps."songId"
WHERE
  ps."playlistId" = $1`,
      [playlist.id]
    );

    const songs = songsResult.rows.map((s) => plainToClass(s, SongResponse));

    const playlistSongs = plainToClass(
      { ...playlist, songs },
      PlaylistSongsResponse
    );
    return playlistSongs;
  }

  /** @param {{ songId: string; playlistId: string }} param0 */
  async deletePlaylistSong({ songId, playlistId }) {
    const result = await this.#pool.query(
      `
DELETE FROM 
  playlist_songs 
WHERE 
  "songId" = $1 AND "playlistId" = $2`,
      [songId, playlistId]
    );

    if (result.rowCount < 1)
      throw new NotFoundError(
        "Gagal menghapus lagu! Lagu tidak ditemukan dalam playlist."
      );
  }
}

module.exports = PlaylistService;
