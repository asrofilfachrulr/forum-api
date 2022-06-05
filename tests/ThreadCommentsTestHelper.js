const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsRepositoryTestHelper = {
  async addComment({
    id, content, threadId, userId,
  }) {
    const query = {
      text: 'INSERT INTO thread_comments VALUES($1, $2, $3, $4)',
      values: [id, threadId, userId, content],
    };

    await pool.query(query);
  },

  async cleanTable() {
    const query = {
      text: 'DELETE FROM thread_comments WHERE 1=1',
    };

    await pool.query(query);
  },
};

module.exports = ThreadCommentsRepositoryTestHelper;
