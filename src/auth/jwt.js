const config = require("@/config");
const { InvariantError } = require("@/exceptions");
const jwt = require("@hapi/jwt");

const JWT = {
  createRefreshToken: (payload) =>
    jwt.token.generate(payload, config.jwt.refreshTokenKey),
  createAccessToken: (payload) =>
    jwt.token.generate(payload, config.jwt.accessTokenKey),
  verifyRefreshToken: (token) => {
    try {
      const artifact = jwt.token.decode(token);
      jwt.token.verify(artifact, config.jwt.refreshTokenKey);
      return artifact.decoded.payload;
    } catch {
      throw new InvariantError("Refresh token tidak valid!");
    }
  }
};

module.exports = JWT;
