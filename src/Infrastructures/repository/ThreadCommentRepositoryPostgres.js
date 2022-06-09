const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailThreadComment = require('../../Domains/threadComments/enttities/DetailThreadComment');
const PostedThreadComment = require('../../Domains/threadComments/enttities/PostedThreadComment');
const ThreadCommentsRepository = require('../../Domains/threadComments/ThreadCommentRepository');

class ThreadCommentRepositoryPostgres extends ThreadCommentsRepository {
  constructor(pool, idGenerator) {
    super();

    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(postThreadComment) {
    const { threadId, userId, content } = postThreadComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO thread_comments(id, thread_id, owner, content, date) VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, userId, content, new Date()],
    };

    const result = await this._pool.query(query);

    return new PostedThreadComment({ ...result.rows[0] });
  }

  async getDetailCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT t.id, u.username, t.date, t.content, t.is_delete FROM thread_comments t JOIN users u ON t.owner = u.id WHERE thread_id = $1 ORDER BY date ASC',
      values: [threadId],
    };

    const result = await this._pool.query(query);

    // console.log(result);

    return DetailThreadComment.mapperForClientResp(result.rows);
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE thread_comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async verifyComment(commentId) {
    const query = {
      text: 'SELECT id FROM thread_comments WHERE id = $1 LIMIT 1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: 'SELECT id FROM thread_comments WHERE id = $1 AND owner = $2',
      values: [commentId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('komentar hanya dapat diubah/dihapus oleh pembuat komentar');
    }
  }
}

module.exports = ThreadCommentRepositoryPostgres;
