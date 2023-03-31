/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const mapPlaylistDBToModel = require('../../utils/indexPlaylist');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist VALUES ($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async getPlaylist(id) {
    const query = {
      text: `SELECT playlist.id, playlist.name, users.username
      FROM playlist
      LEFT JOIN users ON users.id = playlist.owner
      WHERE users.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapPlaylistDBToModel);
  }

  async getPlaylistById(owner, playlistId) {
    const query = {
      text: `SELECT playlist.id, playlist.name, users.username
        FROM playlist
        LEFT JOIN users ON playlist.owner = users.id
        WHERE owner = $1 AND playlist.id = $2`,
      values: [owner, playlistId],
    };
    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlist WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlist WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async getOwnerPlaylistById(playlistId) {
    const query = {
      text: 'SELECT playlist.owner FROM playlist WHERE id = $1',
      values: [playlistId],
    };
    const result = await this._pool.query(query);
    return result.rows[0].owner;
  }

  async verifyPlaylist(id, owner) {
    const query = {
      text: 'SELECT playlist.owner FROM playlist WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }
}

module.exports = PlaylistService;
