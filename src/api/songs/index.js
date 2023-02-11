/* eslint-disable no-unused-vars */
const SongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { service }) => {
    const songHandler = new SongHandler(service);
    server.route(routes(songHandler));
  },
};
