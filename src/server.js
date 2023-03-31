/* eslint-disable camelcase */
/* eslint-disable no-console */
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
// plugin-users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');
// plugin-authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
// plugin-album
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');
// plugin-songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongValidator = require('./validator/songs');
// plugin-playlist
const playlist = require('./api/playlist');
const PlaylistService = require('./services/postgres/PlaylistService');
const PlaylistValidator = require('./validator/playlist');
// plugin-playlistSongs
const playlistSongs = require('./api/playlistsongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistsongs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistService = new PlaylistService();
  const playlistSongsService = new PlaylistSongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlist,
      options: {
        service: playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        playlistSongsService,
        songsService,
        playlistService,
        validator: PlaylistSongsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`server berjalan pada ${server.info.uri}`);
};

init();
