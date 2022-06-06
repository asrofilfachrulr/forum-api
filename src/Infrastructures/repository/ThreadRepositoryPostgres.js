const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const PostedThread = require('../../Domains/threads/entities/PostedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(postThread) {
    const { id: userId, title, body } = postThread;
    const threadId = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [threadId, title, body, userId, new Date()],
    };

    const result = await this._pool.query(query);

    return new PostedThread({ ...result.rows[0] });
  }

  async verifyThread(id) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1 LIMIT 1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }
  }
}

module.exports = ThreadRepositoryPostgres;
