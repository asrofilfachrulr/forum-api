/* istanbul ignore file */
/* eslint-disable camelcase */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsRepositoryTestHelper = {
  async addComment({
    id, content, threadId, userId, date = new Date(), is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO thread_comments(id, thread_id, owner, content, date, is_delete) VALUES ($1, $2, $3, $4, $5, $6)',
      values: [id, threadId, userId, content, date, is_delete],
    };

    await pool.query(query);
  },

  async getComment(commentId) {
    const query = {
      text: 'SELECT * FROM thread_comments WHERE id = $1 AND (is_delete = false OR is_delete IS NULL)',
      values: [commentId],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    const query = {
      text: 'DELETE FROM thread_comments WHERE 1=1',
    };

    await pool.query(query);
  },
};

module.exports = ThreadCommentsRepositoryTestHelper;
