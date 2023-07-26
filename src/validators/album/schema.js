const Yup = require("yup");

const albumPayloadSchema = Yup.object({
  name: Yup.string().required().strict(),
  year: Yup.number().required()
});

const albumCoverContentTypeSchema = Yup.string()
  .required()
  .oneOf(
    [
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/tiff"
    ],
    "File harus berupa gambar!"
  )
  .strict();

module.exports = {
  albumPayloadSchema,
  albumCoverContentTypeSchema
};
