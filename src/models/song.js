class Song {
  /** @type {string} */
  id;

  /** @type {string} */
  title;

  /** @type {number} */
  year;

  /** @type {string} */
  genre;

  /** @type {string} */
  performer;

  /** @type {number | null} */
  duration;

  /** @type {string | null} */
  albumId;
}

class SongRequest {
  /** @type {string} */
  title;

  /** @type {number} */
  year;

  /** @type {string} */
  genre;

  /** @type {string} */
  performer;

  /** @type {number | null} */
  duration;

  /** @type {string | null} */
  albumId;
}

class SongResponse {
  /** @type {id} */
  id;

  /** @type {string} */
  title;

  /** @type {string} */
  performer;
}

module.exports = {
  Song,
  SongRequest,
  SongResponse
};
