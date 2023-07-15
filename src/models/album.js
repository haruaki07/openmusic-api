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

module.exports = {
  Album,
  AlbumRequest,
};
