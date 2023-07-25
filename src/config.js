const config = {
  env: process.env.NODE_ENV,
  app: {
    host: process.env.HOST,
    port: process.env.PORT
  },
  pg: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  },
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY
  },
  rabbitmq: {
    url: process.env.RABBITMQ_SERVER
  },
  smtp: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_ADDRESS,
    password: process.env.MAIL_PASSWORD
  }
};

module.exports = config;
