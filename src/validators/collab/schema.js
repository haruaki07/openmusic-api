const Yup = require("yup");

const collabPayloadSchema = Yup.object({
  playlistId: Yup.string().required().strict(),
  userId: Yup.string().required().strict()
});

module.exports = {
  collabPayloadSchema
};
