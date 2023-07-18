const Yup = require("yup");

const songPayloadSchema = Yup.object({
  title: Yup.string().required(),
  year: Yup.number().required(),
  genre: Yup.string().required(),
  performer: Yup.string().required(),
  duration: Yup.number(),
  albumId: Yup.string()
});

const songFilterSchema = Yup.object({
  title: Yup.string().notRequired(),
  performer: Yup.string().notRequired()
}).notRequired();

module.exports = {
  songPayloadSchema,
  songFilterSchema
};
