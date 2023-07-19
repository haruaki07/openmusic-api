const { InvariantError } = require("@/exceptions");
const AuthenticationError = require("@/exceptions/AuthenticationError");
const { User } = require("@/models/user");
const { createId, plainToClass } = require("@/utils");
const bcrypt = require("bcrypt");

class UserService {
  #pool;

  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this.#pool = pool;
  }

  /** @param {import("@/models/user").UserRequest} param0 */
  async insert({ username, password, fullname }) {
    const exist = await this.isUserExist(username);

    if (exist) {
      throw new InvariantError(
        "Gagal menambahkan user! username sudah digunakan."
      );
    }

    const id = createId("user");
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.#pool.query(
      `
INSERT INTO 
  users (id, username, password, fullname)
VALUES
  ($1, $2, $3, $4) RETURNING id`,
      [id, username, hashedPassword, fullname]
    );

    if (result.rowCount < 1) {
      throw new InvariantError("User gagal ditambahkan!");
    }

    return result.rows[0].id;
  }

  /** @param {string} username */
  async isUserExist(username) {
    const result = await this.#pool.query(
      "SELECT id FROM users WHERE username=$1",
      [username]
    );
    return result.rowCount > 0;
  }

  /**
   * @param {string} username
   * @param {string} password
   */
  async verifyUserCredentials(username, password) {
    const result = await this.#pool.query(
      "SELECT id, password FROM users WHERE username = $1",
      [username]
    );

    if (result.rowCount < 1)
      throw new AuthenticationError("Kredensial yang Anda berikan salah!");

    const match = await bcrypt.compare(password, result.rows[0].password);
    if (!match)
      throw new AuthenticationError("Kredensial yang Anda berikan salah!");

    return result.rows[0].id;
  }
}

module.exports = UserService;
