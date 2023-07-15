const Yup = require("yup");

exports.albumPayloadSchema = Yup.object({
  name: Yup.string().required(),
  year: Yup.number().required(),
});
