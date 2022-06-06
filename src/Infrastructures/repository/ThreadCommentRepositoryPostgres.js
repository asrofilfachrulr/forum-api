const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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
      text: 'INSERT INTO thread_comments VALUES ($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, threadId, userId, content],
    };

    const result = await this._pool.query(query);

    return new PostedThreadComment({ ...result.rows[0] });
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE thread_comments SET deleted_at = $1 WHERE id = $2',
      values: [new Date(), commentId],
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
