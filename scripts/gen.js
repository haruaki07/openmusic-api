#!/usr/bin/env node

const fs = require("fs/promises");
const path = require("path");

const commands = {
  SERVICE: "service",
  VALIDATOR: "validator",
  MODEL: "model",
  API: "api"
};

async function main() {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case commands.SERVICE:
      {
        const filePath = await genService(args[1], args[2]);
        console.log(`Service generated: ${filePath}`);
      }
      break;
    case commands.VALIDATOR:
      {
        const dir = await genValidator(args[1]);
        console.log(`Validator generated: ${dir}`);
      }
      break;
    case commands.MODEL:
      {
        const filePath = await genModel(args[1]);
        console.log(`Model generated: ${filePath}`);
      }
      break;
    case commands.MODEL:
      {
        const filePath = await genModel(args[1]);
        console.log(`Validator generated: ${filePath}`);
      }
      break;
    case commands.API:
      {
        const dir = await genApi(args[1]);
        console.log(`API Plugin generated: ${dir}`);
      }
      break;
  }
}

async function genApi(name) {
  const nameCap = capitalizeFirst(name);
  const handlerClassName = `${nameCap}Handler`;
  const handlerContent = `

  /** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

class ${handlerClassName} {
  /**
   * @param {import("@/services/${name}.service")} ${name}Service
   * @param {import("@/validators/${name}")} ${name}Validator
   */
  constructor(${name}Service, ${name}Validator) {
    this._${name}Service = ${name}Service;
    this._${name}Validator = ${name}Validator;
  }

  /**
   * Menambahkan ${name}
   *
   * @type {Handler}
   */
  store = async (req, h) => {
    const payload = this._${name}Validator.validate${nameCap}Payload(req.payload);

    const ${name}Id = await this._${name}Service.insert(payload);

    const res = h.response({
      status: "success",
      data: { ${name}Id }
    });

    res.code(201);

    return res;
  };
}

module.exports = ${handlerClassName};
`;

  const routesContent = `/**
* @type {(
*   handler: import("./handler")
* ) => import("@hapi/hapi").ServerRoute[]}
*/
const routes = (handler) => [
 { method: "POST", path: "/", handler: handler.store },
];

module.exports = routes;
`;

  const indexContent = `/**
 * @typedef {{
 *   service: import("@/services/${name}.service");
 *   validator: import("@/validators/${name}");
 * }} ${nameCap}PluginOptions
 */

const ${nameCap}Handler = require("./handler");
const routes = require("./routes");

/** @type {import("@hapi/hapi").Plugin<{}>} */
const ${name}sPlugin = {
  name: "${name}s",
  /**
   * @param {import("@hapi/hapi").Server} server
   * @param {${nameCap}PluginOptions} param1
   */
  register: (server, { service, validator }) => {
    const handler = new ${nameCap}Handler(service, validator);
    server.route(routes(handler));
  }
};

module.exports = ${name}sPlugin;
`;

  const dirName = `./src/api/${name}`;
  await ensureDir(dirName);
  await Promise.all([
    fs.writeFile(`${dirName}/handler.js`, handlerContent, {
      encoding: "utf-8"
    }),
    fs.writeFile(`${dirName}/routes.js`, routesContent, {
      encoding: "utf-8"
    }),
    fs.writeFile(`${dirName}/index.js`, indexContent, {
      encoding: "utf-8"
    })
  ]);

  return dirName;
}

async function genModel(name) {
  const className = capitalizeFirst(name);
  const reqClassName = `${capitalizeFirst(name)}Request`;

  const content = `class ${className} {
  /** @type {string} */
  id;

  /** @type {Date} */
  createdAt;

  /** @type {Date} */
  updatedAt;
}

class ${reqClassName} {
}

module.exports = {
  ${className},
  ${reqClassName}
};
`;

  const filePath = `./src/models/${name}.js`;
  fs.writeFile(filePath, content, { encoding: "utf-8" });

  return filePath;
}

async function genValidator(name) {
  const className = `${capitalizeFirst(name)}Validator`;
  const schemaContent = `const Yup = require("yup");

const CHANGE_ME = Yup.object({
  
});

module.exports = {
  CHANGE_ME
};`;

  const nameCapitalized = capitalizeFirst(name);
  const indexContent = `const { ClientError } = require("@/exceptions");
const { CHANGE_ME } = require("./schema");

class ${className} {
  /** @param {import("@/models/${name}").${nameCapitalized}Request} payload */
  validate${nameCapitalized}Payload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = CHANGE_ME.validateSync(payload);
    return value;
  }
}

module.exports = ${className};
`;

  const dirName = `./src/validators/${name}`;
  await ensureDir(dirName);
  await fs.writeFile(`${dirName}/schema.js`, schemaContent, {
    encoding: "utf-8"
  });
  await fs.writeFile(`${dirName}/index.js`, indexContent, {
    encoding: "utf-8"
  });

  return dirName;
}

async function genService(name, subdir) {
  const className = `${capitalizeFirst(name)}Service`;
  const fileName = `${name}.service.js`;
  const content = `
class ${className} {
  #pool;

  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this.#pool = pool;
  }
}

module.exports = ${className}`;

  const filePath = `./src/services/${
    subdir ? path.join(subdir, fileName) : fileName
  }`;
  if (subdir) await ensureDir(`./src/services/${subdir}`);

  await fs.writeFile(filePath, content, {
    encoding: "utf-8"
  });

  return filePath;
}

async function ensureDir(dir) {
  try {
    await fs.access(dir, fs.constants.F_OK);
    console.log("Directory is already exist...");
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

function capitalizeFirst(str) {
  return str[0].toUpperCase() + str.slice(1);
}

main();
