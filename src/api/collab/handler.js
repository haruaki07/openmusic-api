/** @typedef {import("@hapi/hapi").Lifecycle.Method} Handler */

class CollabHandler {
  /**
   * @param {import("@/services/collab.service")} collabService
   * @param {import("@/services/playlist.service")} playlistService
   * @param {import("@/services/user.service")} userService
   * @param {import("@/validators/collab")} collabValidator
   */
  constructor(collabService, playlistService, userService, collabValidator) {
    this._collabService = collabService;
    this._playlistService = playlistService;
    this._userService = userService;
    this._collabValidator = collabValidator;
  }

  /**
   * Menambahkan kolaborator playlist.
   *
   * @type {Handler}
   */
  store = async (req, h) => {
    const { userId } = req.auth.credentials;
    const payload = this._collabValidator.validateCollabPayload(req.payload);

    await this._playlistService.verifyPlaylistOwner({
      id: payload.playlistId,
      userId
    });
    await this._userService.verifyUserExists(payload.userId);

    const collabId = await this._collabService.insert(payload);

    const res = h.response({
      status: "success",
      data: { collaborationId: collabId }
    });
    res.code(201);

    return res;
  };

  /**
   * Menghapus kolaborator playlist.
   *
   * @type {Handler}
   */
  destroy = async (req, h) => {
    const { userId } = req.auth.credentials;

    const payload = this._collabValidator.validateCollabPayload(req.payload);

    await this._playlistService.verifyPlaylistOwner({
      id: payload.playlistId,
      userId
    });
    await this._collabService.delete(payload);

    const res = h.response({
      status: "success",
      message: "Berhasil menghapus kolaborasi!"
    });

    return res;
  };
}

module.exports = CollabHandler;
