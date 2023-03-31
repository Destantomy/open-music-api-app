/* eslint-disable max-len */
const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, {
    playlistSongsService, songsService, playlistService, validator,
  }) => {
    const playlistSongsHandler = new PlaylistSongsHandler(playlistSongsService, songsService, playlistService, validator);
    server.route(routes(playlistSongsHandler));
  },
};
