/* eslint-disable arrow-parens */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(16)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'NUMBER',
      notNull: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('albums');
};
