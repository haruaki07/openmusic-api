class Song {
  /**
   * @param {string} id
   * @param {string} title
   * @param {number} year
   * @param {string} genre
   * @param {string} performer
   * @param {number | null} duration
   * @param {string | null} albumId
   */
  constructor(id, title, year, genre, performer, duration, albumId) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.genre = genre;
    this.performer = performer;
    this.duration = duration;
    this.albumId = albumId;
  }
}

class SongRequest {
  /**
   * @param {string} title
   * @param {number} year
   * @param {string} genre
   * @param {string} performer
   * @param {number | null} duration
   * @param {string | null} albumId
   */
  constructor(title, year, genre, performer, duration, albumId) {
    this.title = title;
    this.year = year;
    this.genre = genre;
    this.performer = performer;
    this.duration = duration;
    this.albumId = albumId;
  }
}

class SongResponse {
  /**
   * @param {id} title
   * @param {string} title
   * @param {string} performer
   */
  constructor(id, title, performer) {
    this.id = id;
    this.title = title;
    this.performer = performer;
  }
}

class SongFilterQuery {
  /**
   * @param {string} title
   * @param {string} performer
   */
  constructor(title, performer) {
    this.title = title;
    this.performer = performer;
  }
}

module.exports = {
  Song,
  SongFilterQuery,
  SongRequest,
  SongResponse
};
