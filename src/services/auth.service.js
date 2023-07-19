const { InvariantError } = require("@/exceptions");

class AuthService {
  #pool;

  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this.#pool = pool;
  }

  async addRefreshToken(token) {
    await this.#pool.query({
      text: "INSERT INTO authentications VALUES($1)",
      values: [token]
    });
  }

  async verifyRefreshToken(token) {
    const result = await this.#pool.query({
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token]
    });

    if (result.rowCount < 1) {
      throw new InvariantError("Refresh token tidak valid");
    }
  }

  async deleteRefreshToken(token) {
    await this.#pool.query({
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token]
    });
  }
}

module.exports = AuthService;
