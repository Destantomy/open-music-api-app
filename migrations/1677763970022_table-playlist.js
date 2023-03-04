/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('playlist', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
    },
    username: {
      type: 'TEXT',
    },
    owner: {
      type: 'TEXT',
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('playlist');
};
