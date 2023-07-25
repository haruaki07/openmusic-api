const Yup = require("yup");

const ExportPlaylistPayloadSchema = Yup.object({
  targetEmail: Yup.string().strict().required().email()
});

module.exports = {
  ExportPlaylistPayloadSchema
};
