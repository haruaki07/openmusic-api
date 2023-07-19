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

module.exports = {
  Playlist,
  PlaylistRequest,
  PlaylistResponse
};
