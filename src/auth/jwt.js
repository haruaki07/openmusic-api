const { InvariantError } = require("@/exceptions");
const jwt = require("@hapi/jwt");

const JWT = {
  createRefreshToken: (payload) =>
    jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  createAccessToken: (payload) =>
    jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  verifyRefreshToken: (token) => {
    try {
      const artifact = jwt.token.decode(token);
      jwt.token.verify(artifact, process.env.REFRESH_TOKEN_KEY);
      return artifact.decoded.payload;
    } catch {
      throw new InvariantError("Refresh token tidak valid!");
    }
  }
};

module.exports = JWT;
