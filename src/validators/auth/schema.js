const Yup = require("yup");

const loginPayloadSchema = Yup.object({
  username: Yup.string().required().strict(),
  password: Yup.string().required().strict()
});

const refreshTokenPayloadSchema = Yup.object({
  refreshToken: Yup.string().required()
});

const deleteTokenPayloadSchema = Yup.object({
  refreshToken: Yup.string().required()
});

module.exports = {
  loginPayloadSchema,
  refreshTokenPayloadSchema,
  deleteTokenPayloadSchema
};
