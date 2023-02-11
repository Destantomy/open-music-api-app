/* eslint-disable no-underscore-dangle */
const { nanoid } = require('nanoid');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({
    title, year, genre, performer, duration,
  }) {
    const id = nanoid(16);
    const newSong = {
      title, year, genre, performer, duration, id,
    };
    this._songs.push(newSong);
    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;
    if (!isSuccess) {
      throw new Error('Gagal menambahkan data lagu.');
    }
    return id;
  }

  getSongs() {
    return this._songs;
  }

  getSongById(id) {
    const song = this._songs.filter((s) => s.id === id)[0];
    if (!song) {
      throw new Error('Song tidak ditemukan');
    }
    return song;
  }

  editSongById(id, {
    title, year, genre, performer, duration,
  }) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new Error('Gagal memperbarui lagu. Id lagu tidak ditemukan.');
    }
    this._songs[index] = {
      ...this._songs[index],
      title,
      year,
      genre,
      performer,
      duration,
    };
  }

  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);
    if (index === -1) {
      throw new Error('Lagu gagal dihapus. Id lagu tidak ditemukan');
    }
    this._songs.splice(index, 1);
  }
}

module.exports = SongsService;
