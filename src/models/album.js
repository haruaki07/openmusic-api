class CreateAlbumRequest {
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
  CreateAlbumRequest,
};
