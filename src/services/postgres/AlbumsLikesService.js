/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class AlbumsLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async verifyAlbums(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }
  }

  async verifyLike(userId, albumId) {
    const query = {
      text: 'SELECT * FROM albums_likes WHERE user_id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      await this.addLike(userId, albumId);
    } else {
      throw new ClientError('Anda telah menyukai album ini sebelumnya');
      // await this.deleteLike(userId, albumId);
    }
  }

  async removeLike(userId, albumId) {
    const query = {
      text: 'SELECT * FROM albums_likes WHERE user_id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length) {
      await this.deleteLike(userId, albumId);
    }
  }

  async addLike(userId, albumId) {
    const id = `likes-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums_likes VALUES ($1, $2, $3)',
      values: [id, userId, albumId],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(`likes: ${albumId}`);
    return result.rows;
  }

  async deleteLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM albums_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };
    const result = await this._pool.query(query);
    await this._cacheService.delete(`likes: ${albumId}`);
    return result.rows;
  }

  async getLikes(albumId) {
    try {
      const result = await this._cacheService.get(`likes: ${albumId}`);
      return {
        likes: JSON.parse(result),
        isCache: 1,
      };
    } catch (error) {
      const query = {
        text: 'SELECT user_id FROM albums_likes WHERE album_id = $1',
        values: [albumId],
      };
      const result = await this._pool.query(query);
      // eslint-disable-next-line max-len
      await this._cacheService.set(`likes: ${albumId}`, JSON.stringify(result.rowCount));
      return { likes: result.rowCount };
    }
  }
}

module.exports = AlbumsLikesService;
