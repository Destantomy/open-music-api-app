/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class PlaylistHandler {
  constructor(playlistService, validator) {
    this._service = playlistService;
    this._validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { name, username } = request.payload;
      const playlistId = await this._service.addPlaylist({ name, username, owner: credentialId });
      const response = h.response({
        status: 'success',
        message: 'Playlist berhasil dibuat.',
        data: {
          playlistId,
        },
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
      // SERVER ERROR!
      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const playlist = await this._service.getPlaylistById(credentialId);
    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }
}

module.exports = PlaylistHandler;
