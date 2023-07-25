/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

const ProducerService = require("@/services/messaging/producer.service");

class ExportHandler {
  /**
   * @param {ProducerService} producerService
   * @param {import("@/services/playlist.service")} playlistService
   * @param {import("@/validators/export")} exportValidator
   */
  constructor(producerService, playlistService, exportValidator) {
    this._producerService = producerService;
    this._playlistService = playlistService;
    this._exportValidator = exportValidator;
  }

  /**
   * Ekspor lagu pada playlist.
   *
   * @type {Handler}
   */
  exportPlaylist = async (req, h) => {
    const { userId } = req.auth.credentials;
    const { playlistId } = req.params;
    const payload = this._exportValidator.validateExportPlaylistPayload(
      req.payload
    );

    await this._playlistService.verifyPlaylistOwner({ id: playlistId, userId });

    await this._producerService.sendMessage(
      ProducerService.queues.EXPORT_PLAYLIST,
      {
        playlistId,
        targetEmail: payload.targetEmail
      }
    );

    const res = h.response({
      status: "success",
      message: "Permintaan Anda sedang kami proses"
    });
    res.code(201);

    return res;
  };
}

module.exports = ExportHandler;
