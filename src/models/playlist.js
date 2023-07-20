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
  /** @type {import("./song").SongResponse} */
  songs;
}

class PlaylistCollabs {
  /** @type {string} */
  id;

  /** @type {string} */
  playlistId;

  /** @type {string} */
  userId;
}

module.exports = {
  Playlist,
  PlaylistRequest,
  PlaylistResponse,
  PlaylistSongsResponse,
  PlaylistCollabs
};
