const Yup = require("yup");

const userPayloadSchema = Yup.object({
  username: Yup.string().required().strict(true),
  password: Yup.string().required().strict(true),
  fullname: Yup.string().required().strict(true)
});

module.exports = {
  userPayloadSchema
};
