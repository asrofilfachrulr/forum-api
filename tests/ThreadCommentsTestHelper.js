/* eslint-disable camelcase */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsRepositoryTestHelper = {
  async addComment({
    id, content, threadId, userId, date = new Date(), deleted_at = null,
  }) {
    const query = {
      text: 'INSERT INTO thread_comments(id, thread_id, owner, content, date, deleted_at) VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, userId, content, date, deleted_at],
    };

    await pool.query(query);
  },

  async getComment(commentId) {
    const query = {
      text: 'SELECT id FROM thread_comments WHERE id = $1 AND deleted_at IS NULL LIMIT 1',
      values: [commentId],
    };

    const result = await pool.query(query);

    return result.rows[0];
  },

  async cleanTable() {
    const query = {
      text: 'DELETE FROM thread_comments WHERE 1=1',
    };

    await pool.query(query);
  },
};

module.exports = ThreadCommentsRepositoryTestHelper;