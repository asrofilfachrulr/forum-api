/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addColumn('thread_comments', {
    deleted_at: {
      type: 'datetime',
      notNull: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('thread_comments', 'deleted_at');
};
