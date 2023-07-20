class Playlist {
  /** @type {string} */
  id;

  /** @type {string} */
  name;

  /** @type {string} */
  owner;

  /** @type {Date} */
  createdAt;

  /** @type {Date} */
  updatedAt;
}

class PlaylistRequest {
  /** @type {string} */
  name;

  /** @type {string} */
  owner;
}

class PlaylistResponse {
  /** @type {string} */
  id;

  /** @type {string} */
  name;

  /** @type {string} */
  username;
}

class PlaylistSongsResponse extends PlaylistResponse {
  /** @type {import("./song").SongSimple} */
  songs;
}

module.exports = {
  Playlist,
  PlaylistRequest,
  PlaylistResponse,
  PlaylistSongsResponse
};
