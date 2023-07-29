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
  s3: {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    bucketName: process.env.AWS_BUCKET_NAME,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  redis: {
    url: process.env.REDIS_SERVER
  }
};

module.exports = config;
