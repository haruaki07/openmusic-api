const config = require("@/config");
const { Redis } = require("ioredis");

class CacheService {
  #redis;

  constructor() {
    this.#redis = new Redis(config.redis.url);
  }

  /**
   * @param {import("ioredis").RedisKey[]} key
   * @returns
   */
  async isExist(...key) {
    return this.#redis.exists(key);
  }

  /**
   * @param {import("ioredis").RedisKey} key
   * @param {string | number} value
   * @param {number} exp - Expiration time in second
   * @returns
   */
  async set(key, value, exp) {
    const args = [key, value];
    if (exp != null) args.push("EX", exp);

    return this.#redis.set(...args);
  }

  /**
   * @param {import("ioredis").RedisKey} key
   * @returns
   */
  async delete(key) {
    return this.#redis.del(key);
  }

  /**
   * @param {import("ioredis").RedisKey} key
   * @returns
   */
  async get(key) {
    return this.#redis.get(key);
  }
}

module.exports = CacheService;
