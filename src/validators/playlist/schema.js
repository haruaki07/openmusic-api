const Yup = require("yup");

const playlistPayloadSchema = Yup.object({
  name: Yup.string().required().strict()
});

const playlistAddSongSchema = Yup.object({
  songId: Yup.string().required().strict()
});

module.exports = {
  playlistPayloadSchema,
  playlistAddSongSchema
};
