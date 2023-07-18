class UserService {
  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this.pool = pool;
  }
}

module.exports = UserService;
