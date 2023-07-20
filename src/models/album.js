class Album {
  /**
   * @param {string} id
   * @param {string} name
   * @param {number} year
   */
  constructor(id, name, year) {
    this.id = id;
    this.name = name;
    this.year = year;
  }
}

class AlbumRequest {
  /**
   * @param {string} name
   * @param {number} year
   */
  constructor(name, year) {
    this.name = name;
    this.year = year;
  }
}

class AlbumDetailed extends Album {
  /**
   * @param {string} id
   * @param {string} name
   * @param {number} year
   * @param {import("./song").SongResponse[]} songs
   */
  constructor(id, name, year, songs) {
    super(id, name, year);
    this.songs = songs;
  }
}

module.exports = {
  Album,
  AlbumDetailed,
  AlbumRequest
};
