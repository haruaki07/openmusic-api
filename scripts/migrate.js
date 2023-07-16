#!/usr/bin/env node

const dotenv = require("dotenv");

const env = {};
dotenv.config({ processEnv: env });

const { spawn } = require("child_process");

const { PGUSER, PGPASSWORD, PGHOST, PGPORT, PGDATABASE } = env;

const args = ["node_modules/.bin/node-pg-migrate", ...process.argv.slice(2)];

const p = spawn("node", args, {
  env: {
    ...process.env,
    DATABASE_URL: `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}`,
  },
  stdio: "inherit",
});

p.on("close", (code) => {
  console.log(`\nChild process exited with code ${code}.`);
  process.exit(code);
});
