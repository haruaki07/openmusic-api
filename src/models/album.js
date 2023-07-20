class Album {
  /** @type {string} */
  id;

  /** @type {string} */
  name;

  /** @type {number} */
  year;

  /** @type {Date} */
  createdAt;

  /** @type {Date} */
  updatedAt;
}

class AlbumRequest {
  /** @type {string} */
  name;

  /** @type {number} */
  year;
}

class AlbumDetailed extends Album {
  /** @type {import("./song").SongResponse[]} */
  songs;
}

module.exports = {
  Album,
  AlbumDetailed,
  AlbumRequest
};
