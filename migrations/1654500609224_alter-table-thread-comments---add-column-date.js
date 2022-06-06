/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addColumn('thread_comments', {
    date: {
      type: 'datetime',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('thread_comments', 'date');
};
