/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.addColumn('threads', {
    date: {
      type: 'datetime',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('threads', 'date');
};
