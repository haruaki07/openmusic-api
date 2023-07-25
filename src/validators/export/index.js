const { ClientError } = require("@/exceptions");
const { ExportPlaylistPayloadSchema } = require("./schema");

class ExportValidator {
  validateExportPlaylistPayload(payload) {
    if (!payload) throw new ClientError("Body tidak boleh kosong");

    const value = ExportPlaylistPayloadSchema.validateSync(payload);
    return value;
  }
}

module.exports = ExportValidator;
