/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('thread_comments', {
    is_delete: {
      type: 'boolean',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('thread_comments', 'is_delete');
};
