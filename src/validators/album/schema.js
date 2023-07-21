const Yup = require("yup");

const albumPayloadSchema = Yup.object({
  name: Yup.string().required().strict(),
  year: Yup.number().required()
});

module.exports = {
  albumPayloadSchema
};
