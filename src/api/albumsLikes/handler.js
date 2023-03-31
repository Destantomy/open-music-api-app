/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');

class AlbumsLikesHandler {
  constructor(service) {
    this._service = service;

    this.postAlbumsLikesHandler = this.postAlbumsLikesHandler.bind(this);
    this.getAlbumsLikesHandler = this.getAlbumsLikesHandler.bind(this);
    this.deleteAlbumsLikesHandler = this.deleteAlbumsLikesHandler.bind(this);
  }

  async postAlbumsLikesHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credential_id } = request.auth.credentials;
      await this._service.verifyAlbums(id);
      await this._service.verifyLike(credential_id, id);
      const response = h.response({
        status: 'success',
        message: 'Menyukai album berhasil disimpan.',
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

  async getAlbumsLikesHandler(request, h) {
    try {
      const { id } = request.params;
      const { likes, isCache } = await this._service.getLikes(id);
      const response = h.response({
        status: 'success',
        data: {
          likes,
        },
      });
      if (isCache) {
        response.header('X-Data-Source', 'cache');
      }
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

  async deleteAlbumsLikesHandler(request, h) {
    try {
      const { id } = request.params;
      const { id: credential_id } = request.auth.credentials;
      await this._service.verifyAlbums(id);
      await this._service.removeLike(credential_id, id);
      const response = h.response({
        status: 'success',
        message: 'Batal menyukai album berhasil disimpan.',
      });
      response.code(200);
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

module.exports = AlbumsLikesHandler;
