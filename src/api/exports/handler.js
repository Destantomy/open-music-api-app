/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class ExportsHandler {
  constructor(service, playlistService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistService = playlistService;

    this.postExportSongsPlaylistHandler = this.postExportSongsPlaylistHandler.bind(this);
  }

  async postExportSongsPlaylistHandler(request, h) {
    try {
      this._validator.validateExportSongsPlaylistPayload(request.payload);
      const { id: playlistId } = request.params;
      const { id } = request.auth.credentials;
      await this._playlistService.verifyPlaylist(playlistId, id);
      const message = {
        userId: request.auth.credentials.id,
        playlistId,
        targetEmail: request.payload.targetEmail,
      };
      await this._service.sendMessage('export:playlistSongs', JSON.stringify(message));
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }
      // Server ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = ExportsHandler;
