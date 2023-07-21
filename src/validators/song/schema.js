const Yup = require("yup");

const songPayloadSchema = Yup.object({
  title: Yup.string().strict().required(),
  year: Yup.number().required(),
  genre: Yup.string().strict().required(),
  performer: Yup.string().strict().required(),
  duration: Yup.number(),
  albumId: Yup.string().strict()
});

const songFilterSchema = Yup.object({
  title: Yup.string().notRequired(),
  performer: Yup.string().notRequired()
}).notRequired();

module.exports = {
  songPayloadSchema,
  songFilterSchema
};
