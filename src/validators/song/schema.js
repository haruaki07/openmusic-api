const Yup = require("yup");

exports.songPayloadSchema = Yup.object({
  title: Yup.string().required(),
  year: Yup.number().required(),
  genre: Yup.string().required(),
  performer: Yup.string().required(),
  duration: Yup.number(),
  albumId: Yup.string(),
});
