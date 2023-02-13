/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');
// plugin-album
const albums = require('./api/albums');
const AlbumsService = require('./services/inMemory/AlbumsService');
const AlbumsValidator = require('./validator/albums');
// plugin-songs
const songs = require('./api/songs');
const SongsService = require('./services/inMemory/SongsService');
const SongValidator = require('./validator/songs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongValidator,
    },
  });

  await server.start();
  console.log(`server berjalan pada ${server.info.uri}`);
};

init();
