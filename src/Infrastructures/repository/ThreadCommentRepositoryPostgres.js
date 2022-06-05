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
}

module.exports = ThreadCommentRepositoryPostgres;
