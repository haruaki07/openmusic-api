const { nanoid } = require("nanoid");

/**
 * @template T
 * @param {object} obj
 * @param {new () => T} cls
 * @returns {T}
 */
function plainToClass(obj, cls) {
  const instance = new cls();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(instance, key)) {
      instance[key] = obj[key];
    }
  }

  return instance;
}

function createId(prefix) {
  const id = nanoid(16);
  return prefix ? `${prefix}-${id}` : id;
}

module.exports = {
  plainToClass,
  createId
};
