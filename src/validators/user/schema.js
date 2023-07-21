const Yup = require("yup");

const userPayloadSchema = Yup.object({
  username: Yup.string().required().strict(),
  password: Yup.string().required().strict(),
  fullname: Yup.string().required().strict()
});

module.exports = {
  userPayloadSchema
};
