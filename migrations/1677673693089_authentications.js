/* eslint-disable no-unused-vars */
/* eslint-disable arrow-parens */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('authentications');
};
